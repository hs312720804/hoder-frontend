import { Graph, Dom, Node } from '@antv/x6'
const groupImg = require('@/assets/img/scheme_group.png')

// 定制的开始节点
Graph.registerNode('flow-chart-start', {
  inherit: 'rect',
  width: 80,
  height: 42,
  attrs: {
    body: {
      stroke: '#5F95FF',
      strokeWidth: 1,
      fill: 'rgba(95,149,255,0.05)'
    },
    fo: {
      refWidth: '100%',
      refHeight: '100%'
    },
    foBody: {
      xmlns: Dom.ns.xhtml,
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }
    },
    'edit-text': {
      contenteditable: 'false',
      class: 'x6-edit-text',
      style: {
        width: '100%',
        textAlign: 'center',
        fontSize: 12,
        color: 'rgba(0,0,0,0.85)'
      }
    },
    text: {
      fontSize: 12,
      fill: '#FFFFFF'
    }
  },
  markup: [
    {
      tagName: 'rect',
      selector: 'body'
    },
    {
      tagName: 'text',
      selector: 'text'
    },
    {
      tagName: 'foreignObject',
      selector: 'fo',
      children: [
        {
          ns: Dom.ns.xhtml,
          tagName: 'body',
          selector: 'foBody',
          children: [
            {
              tagName: 'div',
              selector: 'edit-text'
            }
          ]
        }
      ]
    }
  ],
  ports: {
    groups: {
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden'
            }
          }
        }
      }
    },
    items: [{ group: 'bottom', id: 'bottom' }]
  }
})

Graph.registerNode('flow-chart-rect', {
  inherit: 'rect',
  width: 80,
  height: 42,
  attrs: {
    body: {
      stroke: '#5F95FF',
      strokeWidth: 1,
      fill: 'rgba(95,149,255,0.05)'
    },
    // fo: {
    //     refWidth: '100%',
    //     refHeight: '100%'
    // },
    // foBody: {
    //     xmlns: Dom.ns.xhtml,
    //     style: {
    //         width: '100%',
    //         height: '100%',
    //         display: 'flex',
    //         justifyContent: 'center',
    //         alignItems: 'center'
    //     }
    // },
    // 'edit-text': {
    //     contenteditable: 'false',
    //     class: 'x6-edit-text',
    //     style: {
    //         width: '100%',
    //         textAlign: 'center',
    //         fontSize: 12,
    //         color: 'rgba(0,0,0,0.85)'
    //     }
    // },
    text: {
      fontSize: 12,
      fill: '#FFFFFF'
    }
  },
  // markup: [
  //     {
  //         tagName: 'rect',
  //         selector: 'body'
  //     },
  //     {
  //         tagName: 'text',
  //         selector: 'text'
  //     },
  //     {
  //         tagName: 'foreignObject',
  //         selector: 'fo',
  //         children: [
  //             {
  //                 ns: Dom.ns.xhtml,
  //                 tagName: 'body',
  //                 selector: 'foBody',
  //                 children: [
  //                     {
  //                         tagName: 'div',
  //                         selector: 'edit-text'
  //                     }
  //                 ]
  //             }
  //         ]
  //     }
  // ],
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden'
            }
          }
        }
      },
      // right: {
      //     position: 'right',
      //     attrs: {
      //         circle: {
      //             r: 3,
      //             magnet: true,
      //             stroke: '#5F95FF',
      //             strokeWidth: 1,
      //             fill: '#fff',
      //             style: {
      //                 visibility: 'hidden'
      //             }
      //         }
      //     }
      // },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden'
            }
          }
        }
      }
      // left: {
      //     position: 'left',
      //     attrs: {
      //         circle: {
      //             r: 3,
      //             magnet: true,
      //             stroke: '#5F95FF',
      //             strokeWidth: 1,
      //             fill: '#fff',
      //             style: {
      //                 visibility: 'hidden'
      //             }
      //         }
      //     }
      // }
    },
    items: [
      {
        id: 'top',
        group: 'top'
      },
      // {
      //     group: 'right'
      // },
      {
        id: 'bottom',
        group: 'bottom'
      }
      // {
      //     group: 'left'
      // }
    ]
  }
})

Graph.registerNode('flowGroupNode', {
  inherit: 'rect',
  width: 160,
  height: 40,
  markup: [
    {
      tagName: 'rect',
      selector: 'body'
    },
    {
      tagName: 'image',
      selector: 'image'
    },
    {
      tagName: 'text',
      selector: 'text'
    },
    {
      tagName: 'g',
      selector: 'buttonGroup',
      children: [
        {
          tagName: 'rect',
          selector: 'button',
          attrs: {
            'pointer-events': 'visiblePainted'
          }
        },
        {
          tagName: 'path',
          selector: 'buttonSign',
          attrs: {
            fill: 'none',
            'pointer-events': 'none'
          }
        }
      ]
    }
  ],
  attrs: {
    body: {
      refWidth: '100%',
      refHeight: '100%',
      strokeWidth: 1,
      fill: 'rgba(95,149,255,0.05)',
      stroke: '#5F95FF'
    },
    image: {
      'xlink:href': groupImg,
      width: 16,
      height: 16,
      x: 8,
      y: 12
    },
    text: {
      fontSize: 12,
      fill: '#FFFFFF',
      refX: 50,
      refY: 20
    }
  },
  ports: {
    groups: {
      top: {
        position: 'top',
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden'
            }
          }
        }
      },
      // right: {
      //     position: 'right',
      //     attrs: {
      //         circle: {
      //             r: 3,
      //             magnet: true,
      //             stroke: '#5F95FF',
      //             strokeWidth: 1,
      //             fill: '#fff',
      //             style: {
      //                 visibility: 'hidden'
      //             }
      //         }
      //     }
      // },
      bottom: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: '#5F95FF',
            strokeWidth: 1,
            fill: '#fff',
            style: {
              visibility: 'hidden'
            }
          }
        }
      }
      // left: {
      //     position: 'left',
      //     attrs: {
      //         circle: {
      //             r: 3,
      //             magnet: true,
      //             stroke: '#5F95FF',
      //             strokeWidth: 1,
      //             fill: '#fff',
      //             style: {
      //                 visibility: 'hidden'
      //             }
      //         }
      //     }
      // }
    },
    items: [
      {
        id: 'top',
        group: 'top'
      },
      // {
      //     group: 'right'
      // },
      {
        id: 'bottom',
        group: 'bottom'
      }
      // {
      //     group: 'left'
      // }
    ]
  }
})
