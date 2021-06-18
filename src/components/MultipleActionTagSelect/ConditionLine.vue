<template>
  <div
    v-show="isShow"
    class="label-or-space"
  >
    <!-- <el-button
      type="success"
      round
      :key="'button2' + '_' + i"
    >
    </el-button> -->
    <span class="condition-text">
      或
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  // props: ['tags', 'crowd', 'specialTags', 'i'],
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
    
  },
  methods: {},
  created() {
    
  }
}
</script>
<style scoped  lang="stylus">
.label-or-space {
  position: absolute;
  top: 0;
  right: 10%;
  bottom: 0;
  left: -15px;
  width: 3px;
  height: auto;
  margin: auto 0;
  border: 1px dashed #00bdd6;
  border-right: 0;
  z-index: 999;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.condition-text {
  color: #fff;
  padding: 0px 6px;
  border-radius: 9px;
  background-color: #00bdd6
  font-size: 12px;
}

</style>