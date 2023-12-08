<template>
  <div class='p-t-10'>
    <TreeForm :treeData='treeData' class='tree_left'></TreeForm>
  </div>
</template>
<script>
import TreeForm from './coms/TreeForm.vue'
export default {
  name: 'TreeEditTable',
  data () {
    // 测试数据
    const data = [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1',
          children: [{
            id: 11,
            label: '四级 1-1-1'
          }, {
            id: 12,
            label: '四级 1-1-2'
          }, {
            id: 11,
            label: '四级 1-1-1'
          }, {
            id: 12,
            label: '四级 1-1-2'
          }, {
            id: 11,
            label: '四级 1-1-1'
          }, {
            id: 12,
            label: '四级 1-1-2'
          }, {
            id: 11,
            label: '四级 1-1-1'
          }, {
            id: 12,
            label: '四级 1-1-2'
          }]
        }, {
          id: 10,
          label: '三级 1-1-2',
          children: [{
            id: 13,
            label: '四级 1-1-1'
          }, {
            id: 14,
            label: '四级 1-1-2'
          }]
        }]
      }]
    }, {
      id: 2,
      label: '一级 2',
      children: [{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        label: '二级 2-2'
      }]
    }, {
      id: 3,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }]
    return {
      treeData: [
        {
          id: '1',
          label: '部门',
          code: '100001',
          children: [
            {
              id: '11',
              label: '管事会',
              code: '1000011',
              children: [
                {
                  id: '1',
                  label: '部门',
                  code: '100001',
                  children: [
                    {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }, {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }, {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }
                  ]
                }, {
                  id: '1',
                  label: '部门',
                  code: '100001',
                  children: [
                    {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }, {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }, {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }
                  ]
                }, {
                  id: '1',
                  label: '部门',
                  code: '100001',
                  children: [
                    {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }, {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }, {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }, {
          id: '1',
          label: '部门',
          code: '100001',
          children: [
            {
              id: '11',
              label: '管事会',
              code: '1000011',
              children: [

              ]
            }
          ]
        }, {
          id: '1',
          label: '部门',
          code: '100001',
          children: [
            {
              id: '11',
              label: '管事会',
              code: '1000011',
              children: [
                {
                  id: '1',
                  label: '部门',
                  code: '100001',
                  children: [
                    {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }, {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }, {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }
                  ]
                }, {
                  id: '1',
                  label: '部门',
                  code: '100001',
                  children: [
                    {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }, {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }, {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }
                  ]
                }, {
                  id: '1',
                  label: '部门',
                  code: '100001',
                  children: [
                    {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }, {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }, {
                      id: '11',
                      label: '管事会',
                      code: '1000011',
                      children: [

                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  },
  components: {
    TreeForm
  }
}
</script>
