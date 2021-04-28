import { Graph, Shape } from '@antv/x6'
import FlowGraph from './index'
import nodeConfig from './node'
import { cloneDeep } from 'lodash'
export default {
    methods: {
        initGraph () {
            let _this = this;
            const graph = new Graph({
                container: document.getElementById('flowContainer'),
                width: window.innerWidth - 440,
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
                                    stroke: '#ff5518',
                                    strokeWidth: 2,
                                    targetMarker: {
                                        name: 'classic',
                                        size: 8
                                    }
                                }
                            },
                            router: {
                                name: 'manhattan'
                            },
                            zIndex: 10
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
                        // todo 预留 可能后期对人群节点需要四个方位连接桩
                        // 只能是上一个节点的出口连接下一个节点的入口
                        if (!sourceMagnet || sourceMagnet.getAttribute('port-group') !== 'bottom') {
                            return false
                        }
                        if (!targetMagnet || targetMagnet.getAttribute('port-group') !== 'top') {
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
            // 编辑流程
            if (this.policyId) {
                this.$service.smartProgrammeDetail(this.policyId).then(res => {
                    let data = res.data;
                    this.$set(this.schemeConfig, 'programmeId', data.programmeId);
                    // 将JSON.stringify数据parse
                    this.handleParseData(data);
                    if (data.inputCondition) {
                        this.entryData = data.inputCondition[0] ? data.inputCondition[0] : []
                        this.splitRadio = data.inputCondition[1] ? data.inputCondition[1] : ''
                    }
                    let groupNameColl = this.findGroupName(data.smartStrategies);
                    let crowdNameColl = this.findGroupCrowdName(data.smartStrategies);
                    // 设置策略索引当前最大值
                    this.groupIdx = this.getMaxNum(groupNameColl.toString());
                    this.peopleIdx = this.getMaxNum(crowdNameColl.toString(), 'crowd');
                    // 设置入口数据
                    let nodes = [], edges = [];
                    data.smartStrategies && data.smartStrategies.forEach(item => {
                        switch (item.mapGrid && item.mapGrid.identify) {
                            case 'start':
                                nodes.push(nodeConfig.getStartNode({
                                    id: item.mapGrid.id,
                                    x: item.mapGrid.x,
                                    y: item.mapGrid.y
                                }));
                                break;
                            case 'schemeGroup':
                                nodes.push(nodeConfig.getGroupNode({
                                    id: item.mapGrid.id,
                                    x: item.mapGrid.x,
                                    y: item.mapGrid.y,
                                    width: item.mapGrid.w,
                                    height: item.mapGrid.h,
                                    label: item.strategyName,
                                    children: this.findChildId(item.smartStrategyNodes),
                                    tools: _this.setTools()
                                }));
                                if (item.smartStrategyNodes && item.smartStrategyNodes.length > 0) {
                                    item.smartStrategyNodes.forEach(v => {
                                        nodes.push(nodeConfig.getRectNode({
                                            id: v.mapGrid.id,
                                            x: v.mapGrid.x,
                                            y: v.mapGrid.y,
                                            parent: item.mapGrid.id,
                                            text: `${v.strategyNodeName} `
                                        }));
                                        if (v.mapGrid.target) {
                                            edges.push({
                                                source: {
                                                    cell: v.mapGrid.id,
                                                    port: 'bottom'
                                                },
                                                target: {
                                                    cell: v.mapGrid.target,
                                                    port: 'top'
                                                },
                                                attrs: {
                                                    line: {
                                                        stroke: '#ff5518',
                                                        strokeWidth: 2,
                                                        targetMarker: {
                                                            name: 'classic',
                                                            size: 8
                                                        }
                                                    }
                                                },
                                                router: {
                                                    name: 'er',
                                                    args: {
                                                        offset: 40
                                                    },
                                                },
                                                zIndex: 10
                                            })
                                        }
                                    })
                                }
                                break;
                        }
                        if (item.mapGrid.target) {
                            edges.push({
                                source: {
                                    cell: item.mapGrid.id,
                                    port: 'bottom'
                                },
                                target: {
                                    cell: item.mapGrid.target || '',
                                    port: 'top'
                                },
                                attrs: {
                                    line: {
                                        stroke: '#ff5518',
                                        strokeWidth: 2,
                                        targetMarker: {
                                            name: 'classic',
                                            size: 8
                                        }
                                    }
                                },
                                router: {
                                    name: 'manhattan'
                                },
                                zIndex: 10
                            })
                        }
                    });
                    this.schemeData = data.smartStrategies || [];
                    graph.fromJSON({nodes, edges});
                })
            } else {
                graph.addNode(nodeConfig.getStartNode({
                    id: 'startNode',
                    x: 300,
                    y: 20
                }));
                // 初始化开始节点
                this.addStartNode();
            }

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
                    // 连线规则
                    // 1. 只能是出口连接入口（只能一次连接 已连接port不能继续连接）全局已校验
                    // 2. 只能同级别连接 人群只能连接人群 组-组
                    // 3. 人群不能跨组连接人群
                    // 4. 出口-入口 入口-出口不能是同一个

                    const isSourceCrowd = source.getParentId(); // 源节点是否是人群
                    const isTargetCrowd = target.getParentId(); // 目标节点是否是人群
                    if (
                            (isSourceCrowd && !isTargetCrowd) ||
                            (!isSourceCrowd && isTargetCrowd) ||
                            (isSourceCrowd !== isTargetCrowd)
                    ) {
                        edge.remove();
                        return false;
                    }
                    let sourceEdge, targetEdge;
                    sourceEdge = this.findNodesById(source.getParentId(), source.id);
                    targetEdge = this.findNodesById(target.getParentId(), target.id);

                    // 1. 不能重复连接  2. 已连接点不能再次连接
                    if ((targetEdge.mapGrid.prevSourceId || sourceEdge.mapGrid.prevSourceId === target.id)) {
                        edge.remove();
                        return false;
                    }
                    let name = sourceEdge.mapGrid.identify;
                    sourceEdge.mapGrid.source = source.id;
                    sourceEdge.mapGrid.target = target.id;
                    targetEdge.mapGrid.prevSourceId = source.id;
                    if (name !== 'start') {
                        if (!source.getParent()) {
                            if (sourceEdge.mapGrid.prevSourceId === 'startNode' || !sourceEdge.mapGrid.prevSourceId) {
                                sourceEdge.strategyIndex ++;
                            }
                            if (sourceEdge.strategyIndex >= 1) {
                                targetEdge.strategyIndex = sourceEdge.strategyIndex + 1;
                            }
                        } else {
                            if (!sourceEdge.mapGrid.prevSourceId) {
                                sourceEdge.strategyNodeIndex ++;
                            }
                            if (sourceEdge.strategyNodeIndex >= 1) {
                                targetEdge.strategyNodeIndex = sourceEdge.strategyNodeIndex + 1;
                            }
                        }
                    }
                }
            });
            // 移动节点时更新x,y
            this.graph.on('node:moved', ({e, x, y, node, view}) => {
                let pos = node.position();
                let result = this.findNodesById(node.getParentId(), node.id);
                result.mapGrid.x = pos.x;
                result.mapGrid.y = pos.y;
            });
            // 点击节点
            this.graph.on('node:click', ({e, x, y, node, view}) => {
                let newNode = this.findNodesById(node.getParentId(), node.id);
                let identify = newNode.mapGrid.identify;
                if (identify === 'start') {
                    this.schemeStart.is = true;
                } else if (identify === 'crowd') {
                    this.currentNode = node;
                    this.peopleId = node.id; // 记录当前点击人群的id
                    this.groupId = node.getParentId();
                    const peopleObj = this.findNodesById(node.getParentId(), node.id);
                    if (peopleObj.nodeCondition.time) {
                        this.editPeopleInfo = {
                            strategyNodeName: peopleObj.strategyNodeName,
                            frequency: peopleObj.nodeCondition.times.val,
                            time: peopleObj.nodeCondition.time
                        }
                        if (this.policyId) {
                            this.editPeopleInfo.id = peopleObj.strategyNodeId
                        }
                    } else {
                        this.editPeopleInfo = {};
                        this.editPeopleInfo.id = null;
                    }
                    this.peopleDialogStatus.is = true;
                }
            });
            // 鼠标移入展示删除按钮
            this.graph.on('node:mouseenter', ({node}) => {
                let newNode = this.findNodesById(node.getParentId(), node.id);
                if (newNode.mapGrid.identify !== 'start') {
                    node.addTools({
                        name: 'button-remove',
                        args: {
                            x: '100%',
                            y: 0,
                            offset: { x: -10, y: 10 },
                            onClick({view}) {
                                // let id = view.cell.id;
                                newNode.delFlag = 2; // 将删除的节点设置为2
                                // 删除时处理下连线索引规则
                                _this.setNodeIdx(newNode.mapGrid.identify, newNode, true);
                                if (newNode.mapGrid.identify === 'schemeGroup') {
                                    // 删除了其中一个 需要将连接边的目标都清空
                                    _this.schemeData.forEach(item => {
                                        if (item.mapGrid.id === newNode.mapGrid.prevSourceId) {
                                            item.mapGrid.target = '';
                                        }
                                    });
                                    // _this.schemeData = _this.schemeData.filter(item => {
                                    //     return item.mapGrid.id !== id;
                                    // });
                                    view.cell.remove();
                                } else if (newNode.mapGrid.identify === 'crowd') {
                                    let parentId = node.getParentId();
                                    _this.schemeData.forEach(item => {
                                        if (item.mapGrid.id === parentId) {
                                            item.smartStrategyNodes.forEach(v => {
                                                if (v.mapGrid.id === newNode.mapGrid.prevSourceId) {
                                                    v.mapGrid.target = '';
                                                }
                                            })
                                        }
                                    });
                                    view.cell.remove();
                                }
                            }
                        }
                    })
                }
            });
            this.graph.on('node:mouseleave', ({ node }) => {
                node.removeTool('button-remove')
            });
            this.graph.on('node:change:size', ({ cell, node }) => {
                let result = this.findNodesById(node.getParent(), node.id);
                let nodeSize = node.size();
                let pos = node.position();
                result.mapGrid.w = nodeSize.width;
                result.mapGrid.h = nodeSize.height;
                result.mapGrid.x = pos.x;
                result.mapGrid.y = pos.y;
            })
        },
        // 编辑数据保存
        handleEditSave () {
            let schemeConfig = this.handleSaveData(cloneDeep(this.schemeConfig));
            return new Promise(resolve => {
                this.$service.smartProframPolicyUpdate({
                    data: schemeConfig,
                    params: { programmeId: schemeConfig.programmeId }
                }, '编辑成功').then(rs => {
                    resolve(rs)
                })
            })
        },
        // 放大缩小画布
        scaleGraph (data) {
            this.graph.zoom(data)
        }
    }
}
