<template>
  <div>
    <!-- <menu-list v-show="isShowMenuList"></menu-list> -->
    <!-- <icon v-show="!isShowMenuList"> </icon> -->
    <Icon v-show="!isShowMenuList" @getIcon="getIcon" @show="showPage"></Icon>
    <MenuList v-show="isShowMenuList" :iconName="iconName" @show="showPage"></MenuList>
  </div>
</template>
<script>
import MenuList from "./menuSetting"
import Icon from "./icon"
export default {
  data() {
    return {
      isShowMenuList: true,
      iconName: null
    };
  },
  components: {
    MenuList,
    Icon
  },
  methods: {
      getIcon(className){
         this.iconName=className;
         this.isShowMenuList=true;
         document.querySelector(".v-modal").style.display="block"
      },
      showPage(isShowMenuList){
        this.isShowMenuList=isShowMenuList;
      }
  }
};
</script>

