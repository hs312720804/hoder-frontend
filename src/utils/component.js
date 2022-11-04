export function createOperationRender (component, actions, elName) {
  return function render (h, params) {
    return Object.keys(actions).map(key => {
      return h(
        elName || 'el-button',
        {
          props: {
            type: 'text'
          },
          on: {
            click: () => {
              component[key](params)
            }
          }
        },
        actions[key]
      )
    })
  }
}

export default { createOperationRender }
