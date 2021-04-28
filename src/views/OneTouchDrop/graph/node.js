import './shapeInfo'

export default {
    getStartNode (options) {
        let node = {
            shape: 'flow-chart-start',
            label: '方案入口',
            attrs: {
                body: {
                    fill: '#fe3499',
                    stroke: '#fe3499',
                    rx: 5,
                    ry: 5
                }
            }
        };
        Object.assign(node, options);
        return node;
    },
    getRectNode (options) {
        let node = {
            shape: 'flow-chart-rect',
            width: 40,
            height: 40,
            label: '人群',
            attrs: {
                body: {
                    fill: '#1790ff',
                    stroke: '#1790ff',
                    rx: 35,
                    ry: 35
                },
                label: {
                    refX: 0.5,
                    refY: '20%',
                    refY2: 4,
                    textAnchor: 'middle',
                    textVerticalAnchor: 'top'
                },
                text: {
                    textWrap: {
                        width: '100%',
                        height: '120%',
                        text: options.text,
                        ellipsis: true
                    }
                }
            }
        };
        Object.assign(node, options);
        return node;
    },

    getGroupNode (options) {
        let node = {
            shape: 'flowGroupNode',
            label: '策略',
            attrs: {
                body: {
                    fill: 'orange',
                    stroke: 'orange',
                }
            },
            data: {
                parent: true
            }
        };
        Object.assign(node, options);
        return node;
    }
}
