<template>
  <div id="mountNode" :style="{ width: width }" ref="mountNode">
    <div class="editor" >

      <toolbar />
      <div style="height: 42px;"></div>
      <div class="bottom-container">
        <minimap />
        <!-- <detail-panel /> -->

        <page :height="height" :width="width" :data="data" />
      </div>
    </div>
    <Flow />
  </div>
</template>

<script>
import Toolbar from '../Toolbar'
// import ItemPanel from "../ItemPanel";
import DetailPanel from '../DetailPanel'
import Minimap from '../Minimap'
import Page from '../Page'
import Flow from '../Flow'
// import ContextMenu from "../ContextMenu";
import Editor from '@antvGraph/components/Base/Editor'
import Command from '@antvGraph/command'
export default {
  name: 'G6Editor',
  components: {
    Toolbar,
    // ItemPanel,
    Minimap,
    Page,
    // ContextMenu,
    Flow,
    DetailPanel
  },
  props: {
    height: {
      type: Number,
      default: document.documentElement.clientHeight
    },
    width: {
      type: Number,
      default: document.documentElement.clientWidth
    },
    data: {
      type: Object,
      default: () => {}
    }
  },

  data () {
    return {
      editor: {},
      command: null
    }
  },

  created () {
    this.init()
  },
  methods: {

    init () {
      this.editor = new Editor()
      // 一些指令方法
      this.command = new Command(this.editor)
    }

  }
}
</script>

<style scoped>
.editor {
  position: relative;
  width: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.bottom-container {
  position: relative;
}
</style>
