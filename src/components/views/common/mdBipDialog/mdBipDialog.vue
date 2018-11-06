<template>
<md-dialog ref="dialog" :md-click-outside-to-close="false" :md-esc-to-close="false">
  <div :class="[showTable?classA:classB]">
    <md-dialog-title>{{title}}</md-dialog-title>

    <md-dialog-content v-if="contentHtml" v-html="contentHtml"></md-dialog-content>
    <md-dialog-content v-if="content">{{ content }}</md-dialog-content>
    <md-dialog-content v-if="showTable">
      <md-table class="classAA">
        <md-table-header>
            <md-table-row>
              <md-table-head v-for="(header,index) in headerData" :key="index">{{header}}</md-table-head>
            </md-table-row>
        </md-table-header>
        <md-table-body>
            <md-table-row v-for="(bodyer, index) in bodyData" :key="index">
              <md-table-cell v-for="(col, index) in bodyer" :key="index">{{col}}</md-table-cell>
            </md-table-row>
        </md-table-body>
    </md-table>
    </md-dialog-content>

    <md-dialog-actions class="actionC">
        <md-button class="md-primary md-raised" @click="closeDialogY('dialog')" v-if="showYes">确定</md-button>
        <md-button class="md-raised" @click="closeDialogC('dialog')" v-if="showCancel">取消</md-button>
        <md-button class="md-primary md-raised" @click="closeDialogM('dialog')" v-if="showMyBtn" v-for="(b,index) in btns" :key="index">{{b}}</md-button>
    </md-dialog-actions>
  </div>
</md-dialog>
</template>

<script>
export default {
   data(){
     return{
       classA:'classA',
       classB:'classB'
     }
   },
   methods: {
    closeDialogY(ref) {
      this.yes()
      this.$refs[ref].close();
    },
    closeDialogC(ref) {
      this.$refs[ref].close();
    },
    closeDialogM(ref){
      this.$refs[ref].close();
    }
   },
   props:{
     show:true,
     isA:true,
     content: String,
     contentHtml: String,
     yes:{
       type:Function,
       default () {
         return true;
       }
     },
     getTitle:{
       type:Function,
       default () {}
     },
    title:{
      type:String
    },
    showCancel:{
      type:Boolean,
      default:true
    },
    showYes:{
      type:Boolean,
      default:true
    },
    showMyBtn:{
      type:Boolean,
      default:false
    },
    showTable:{
      type:Boolean,
      default:false
    },
    headerData:{
      type:Array,
      default: function () {
        return []
      }
    },
    bodyData:{
      type:Array,
      default: function () {
        return []
      }
    },
    btns:{
      type:Array,
      default: function () {
        return []
      }
    }
   },
   create(){
     },
   mounted(){
     this.$refs.dialog.open()
     if(this.showTable){
       this.getTitle()
     }

   }
}
</script>

<style lang="scss">
.classA{min-height:5rem;min-width:6rem;max-width:8rem;max-height: 5rem;}
.classAA{overflow:auto;max-height: 3.5rem}
.classB{min-height:1.8rem;min-width:4rem;}
.actionC{position: absolute;bottom:.1rem;right: .1rem}
</style>


