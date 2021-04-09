<!--策略配置-流程图功能配置方案-->
<template>
    <div class="configScheme-wrap">
        <div class="content">
            <!--左侧工具栏-->
            <div id="flowStencil" class="sider" />
            <div class="panel">
                <!--流程图画板-->
                <div id="flowContainer" class="x6-graph" />
            </div>
        </div>
        <people-dialog :show="peopleDialogStatus" @savePeople="savePeople"></people-dialog>
    </div>
</template>

<script>
import { Graph, Shape } from '@antv/x6'
import FlowGraph from './graph/index'
import peopleDialog from './graph/peopleDialog';
export default {
    name: "CreateConfigScheme",
    data () {
        return {
            graph: null,
            schemeData: [], // 存储数据集合
            currentNode: null,
            peopleDialogStatus: {
                is: false
            },
            peopleId: null, // 每次点击人群时找到对应的id
            groupId: null, // 点击人群时所在组id
            schemeStart: {
                is: false
            }
        }
    },
    components: {
        peopleDialog
    },
    mounted () {
        this.initGraph()
    },
    methods: {
        initGraph () {
            const graph = new Graph({
                container: document.getElementById('flowContainer'),
                width: window.innerWidth - 530,
                height: window.innerHeight - 205,
                grid: true,
                mousewheel: {  // 背景缩放
                    enabled: true,
                    global: true,
                    modifiers: ['ctrl', 'meta'],
                },
                snapline: {
                    enabled: true,
                    sharp: true,
                },
                scroller: {
                    enabled: true,
                    pageVisible: false,
                    pageBreak: false,
                    pannable: true,
                },
                connecting: {
                    anchor: 'center',
                    connectionPoint: 'anchor',
                    allowBlank: false,
                    highlight: true,
                    snap: true,
                    allowMulti: false,
                    allowLoop: false,
                    createEdge () {
                        return new Shape.Edge({
                            attrs: {
                                line: {
                                    stroke: '#5F95FF',
                                    strokeWidth: 1,
                                    targetMarker: {
                                        name: 'classic',
                                        size: 8
                                    }
                                }
                            },
                            router: {
                                name: 'manhattan'
                            },
                            zIndex: 0
                        })
                    },
                    validateConnection ({sourceView, targetView, sourceMagnet, targetMagnet}) {
                        if (sourceView === targetView) {
                            return false
                        }
                        if (!sourceMagnet) {
                            return false
                        }
                        if (!targetMagnet) {
                            return false
                        }
                        return true
                    }
                },
                highlighting: {
                    magnetAvailable: {
                        name: 'stroke',
                        args: {
                            padding: 4,
                            attrs: {
                                strokeWidth: 4,
                                stroke: 'rgba(223,234,255)'
                            }
                        }
                    }
                },
                history: true,
                clipboard: {
                    enabled: true
                },
                keyboard: {
                    enabled: true
                },
                embedding: {
                    enabled: true,
                    findParent ({ node }) {
                        const bbox = node.getBBox()
                        return this.getNodes().filter((node) => {
                            // 只有 data.parent 为 true 的节点才是父节点
                            const data = node.getData()
                            if (data && data.parent) {
                                const targetBBox = node.getBBox()
                                return bbox.isIntersectWithRect(targetBBox)
                            }
                            return false
                        })
                    }
                }
            });
            FlowGraph.init(graph);
            this.graph = graph;

            /**
             * 以下是业务逻辑处理
             1. 添加节点
             2. 删除节点
             3. 编辑节点
             4. 移动节点
             5. 边连接
             6. 组限制
             */
            // 添加一个节点时
            this.graph.on('node:added', (cell) => {
                let { node } = cell;
                let name = node.store.data.name;
                switch (name) {
                    case 'start':
                        this.addStartNode(node);
                        break;
                    case 'group':
                        this.addGroupNode(node);
                        break;
                    case 'people':
                        this.addPeopleNode(node);
                        break;
                }
            });
            // 边的连接事件
            this.graph.on('edge:connected', ({ isNew, edge }) => {
                if (isNew) {
                    const source = edge.getSourceCell();
                    const target = edge.getTargetCell();
                    this.schemeData.forEach(item => {
                        if (item.id === source.id) {
                            item.mapGrid.moduleSource = source.id;
                            item.mapGrid.moduleTarget = target.id;
                        }
                        if (item.id === target.id) {
                            item.mapGrid.moduleSource = source.id;
                            item.mapGrid.moduleTarget = target.id;
                        }
                    });
                }
            });
            // 移动节点时更新x,y
            this.graph.on('node:moved', ({e, x, y, node, view}) => {
                console.log(node);
                this.schemeData.forEach(item => {
                    if (item.id === node.id) {
                        item.mapGrid.x = x;
                        item.mapGrid.y = y;
                    }
                })
            });
            this.graph.on('node:click', ({e, x, y, node, view}) => {
                let name = node.store.data.name;
                if (name === 'people') {
                    this.peopleId = node.id; // 记录当前点击人群的id
                    this.groupId = node.parent.id;
                    this.peopleDialogStatus.is = true;
                } else if (name === 'start') {
                
                }
            })
        },
        // 添加开始节点
        addStartNode (node) {
            this.currentNode = {
                id: node.id,
                moduleType: '1', // 开始
                strategyNodeName: '方案开始',
                mapGrid: {
                    x: node.store.data.position.x, // 节点x坐标
                    y: node.store.data.position.y, // 节点y坐标
                    moduleSource: '', // 节点边原对象
                    moduleTarget: '', // 节点边目标对象
                }
            };
            this.schemeData.push(this.currentNode);
        },
        addGroupNode (node) {
            let idx = 1;
            this.currentNode = {
                id: node.id,
                moduleType: '2', // 策略组
                strategyNodeName: `策略${idx}`,
                mapGrid: {
                    x: node.store.data.position.x, // 节点x坐标
                    y: node.store.data.position.y, // 节点y坐标
                    moduleSource: '', // 节点边原对象
                    moduleTarget: '', // 节点边目标对象
                },
                children: []
            };
            node.attr({
                text: {
                    text: `策略${idx}`
                }
            });
            this.schemeData.push(this.currentNode);
            idx++;
        },
        addPeopleNode (node) {
            this.$nextTick(() => {
                let parent = node.parent;
                if (!parent) {
                    this.$message({
                        message: '人群只能放置在策略组中...',
                        type: 'warning'
                    });
                    node.remove();
                    return false;
                }
                let idx = 1;
                this.currentNode = {
                    id: node.id,
                    moduleType: '3', // 人群
                    strategyNodeName: `人群${idx}`,
                    mapGrid: {
                        x: node.store.data.position.x, // 节点x坐标
                        y: node.store.data.position.y, // 节点y坐标
                        moduleSource: '', // 节点边原对象
                        moduleTarget: '', // 节点边目标对象
                    },
                    _content: {} // 存储人群用户信息
                };
                node.attr({
                    text: {
                        text: `人群${idx}`
                    }
                });
                this.schemeData.forEach(item => {
                    if (item.id === parent.id) {
                        item.children.push(this.currentNode)
                    }
                });
                idx ++;
            });
        },
        savePeople (data) {
            this.schemeData.forEach(item => {
                if (item.id === this.groupId) {
                    item.children.forEach(v => {
                        if (v.id === this.peopleId) {
                            v._content = data;
                        }
                        this.peopleDialogStatus.is = false;
                    })
                }
            })
        }
    }
}
</script>

<style lang="stylus" scoped>
    .configScheme-wrap
        width: 100%;
        height: 100%;
        .header
            display: flex;
            justify-content: space-between;
            height: 48px;
            line-height: 48px;
            padding-left: 16px;
            padding-right: 32px;
            background: #fff;
            box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
            position: relative;
            color: rgba(0, 0, 0, 0.45);
        .content
            display: flex;
            .sider
                position: relative;
                width: 290px;
                border-right: 1px solid rgba(0, 0, 0, 0.08);
            .panel
                height: 100%;
    // 调整边界
    .ant-drawer-body
        padding: 0;
    //解决左侧遮罩的问题
    .x6-widget-dnd
        z-index: 1000;
    
    // 左侧动画
    @keyframes stroke
        100%
            stroke-dashoffset: -400;
    .animate-text1,
    .animate-text2,
    .animate-text3,
    .animate-text4
        font-weight: bold;
        fill: none;
        stroke-width: 2px;
        stroke-dasharray: 90 310;
        animation: stroke 3s infinite linear;
    .animate-text1
        stroke: #873bf4;
        text-shadow: 0 0 2px #873bf4;
        animation-delay: -1.5s;
    .animate-text2
        stroke: #ff6e06;
        text-shadow: 0 0 2px #ff6e06;
        animation-delay: -3s;
</style>
