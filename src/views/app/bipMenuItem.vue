<template>
  <div>
    <md-list-item v-if="menuItem.haveChild == false" class="md-dense md-list-item-expand">
      <router-link exact :to="commond">
        <md-icon v-colors="iconcc">{{menuIcon}}</md-icon>
        <span>{{menuName}}</span>
      </router-link>
    </md-list-item>
    <md-list-item v-else>
        <md-icon v-colors="iconcc">{{menuIcon}}</md-icon>
        <span>{{menuName}}</span>
         <md-list-expand v-if="menuItem.haveChild">
          <md-list>
            <bip-menu v-for="(mm) in menuItem.childMenu" :key="mm.menuId" :menuItem="mm" class="bip-child-inset"></bip-menu>
          </md-list>
         </md-list-expand>
    </md-list-item>
  </div>
</template>
<script>
const ICONS = ['menu', 'dashboard', 'verified_user', 'videogame_asset','assessment','invert_colors', 'cloud_download']
const ICONCOLOR=[{color:'red-700-0.8'},{color:'green'},{color:'indigo'},{color:'blue-700-0.8'},{color:'lime'},{color:'teal'},,{color:'green-600-0.5'}]
export default {
  name: 'bip-menu',
  data() {
    return {
      menuIcon: 'menu',
      menuName: '',
      commond: '',
      iconcc: {}
    }
  },
  props: ['menuItem','clazz'],
  methods: {
    randomIcon() {
      console.log(ICONS.length)
    }
  },
  mounted() {
    this.menuName = this.menuItem.menuName;
    if(this.menuItem.command){
      this.commond = '/layoutui?' + this.menuItem.command + '&title=' + this.menuItem.menuName;
    }else{
      this.commond="";
    }
    // console.log(this.commond)
    var bb = Math.ceil(Math.random() * (ICONS.length-1));
    this.menuIcon = ICONS[bb]
    this.iconcc = ICONCOLOR[bb]
  }
}
</script>

<style lang="scss" scoped>
.bip-child-inset{
  padding-left: 0.3rem;
}
</style>


