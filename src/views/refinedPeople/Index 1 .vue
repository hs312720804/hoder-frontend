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
