<template>
  <md-layout md-flex>
    <section class="content-container">
      <div class="grid-content bg-purple-light">
        <div class="breadcrumb-container">
          <strong class="title">我的消息</strong>
        </div>
        <div class="content-wrapper">
          <section>
            <div class="toolbar">
              <div class="tool">
                <!-- search -->
                <div class="form-item">
                  <div class="item-content">
                    <div class="inp">
                      <input type="text" placeholder="关键词" class="input-inner" v-model="words" @keyup.enter="search">
                    </div>
                  </div>
                </div>
                <!-- btn -->
                <div class="form-item">
                  <div class="item-content">
                    <button type="button" class="btn" @click="search" >
                      <span>查询</span>
                    </button>
                  </div>
                </div>
                <!-- btn -->
                <div class="form-item">
                  <div class="item-content">
                    <button type="button" class="btn" @click="getMsg">
                      <span>未读消息</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="mytable">
              <md-table-card>
                <md-table @select="onSelect">
                  <md-table-header>
                    <md-table-row>
                      <md-table-head>编号</md-table-head>
                      <md-table-head>消息</md-table-head>
                      <md-table-head>创建时间/更新时间</md-table-head>
                      <md-table-head>消息状态</md-table-head>
                      <md-table-head>操作</md-table-head>
                    </md-table-row>
                  </md-table-header>
                  <md-table-body>
                    <md-table-row v-for="(row,index) in msgs" :key="index" :md-item="row" md-selection>
                      <md-table-cell>{{index+1}}</md-table-cell>
                      <md-table-cell v-for="(col,colIndex) in row" :key="col.id" v-if="colIndex!='content'">{{col}}</md-table-cell>
                      <md-table-cell class="cell">
                        <button type="button" class="small-btn" @click="view(index)">查看</button>
                        <button type="button" class="small-btn md-btn" @click="del(index)">删除</button>
                      </md-table-cell>
                    </md-table-row>
                  </md-table-body>
                </md-table>
                <md-table-pagination md-size="5" md-total="10" md-page="1" md-label="Rows" md-separator="of" :md-page-options="[5, 10, 25, 50]" @pagination="onPagination"></md-table-pagination>
              </md-table-card>
            </div>
          </section>
        </div>
      </div>
    </section>
  </md-layout>
</template>

<script>
export default {
  data() {
    return {
      words:'',
      items: [
        { title: 'height',time:'2017-01-01', status: '未读',content:'dfsffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffadfffs多福多寿雷锋精神就放了缩放水电费进大数据斐林试剂地方加上垃圾分类缩放老大说缴费时间看了废旧塑料大姐夫是翻了圣诞节发多少发了是季付 史蒂芬金的算了福建省打飞机水力发电司法局老师姐夫啥打法是否了司法鉴定酸辣粉是法律手段缴费说服力酸辣粉金士顿防守打法近段时间发老看的是否鲁大师菲利克斯打两份 ' },
        { title: 'sldfldf',time:'2017-01-01', status: '未读',content:'dfsf' },
        { title: 'apple',time:'2017-01-01', status: '未读',content:'dfsf' },
        { title: 'dfsf',time:'2017-01-01', status: '未读',content:'dfsf' },
        { title: 'sfdf',time:'2017-01-01', status: '未读',content:'dfsf' },
        { title: 'height',time:'2017-01-01', status: '未读',content:'dfsf' },
        { title: 'height',time:'2017-01-01', status: '未读',content:'dfsf' },
        { title: 'height',time:'2017-01-01', status: '未读',content:'dfsf' },
        { title: 'height',time:'2017-01-01', status: '未读',content:'dfsf' },
      ],
      msgs:[]
    }
  },
  mounted(){
    this.msgs = this.items
  },
  methods: {
    search() {
      this.msgs = this.items.filter(o=>o.title.indexOf(this.words)>-1)
      console.log(this.msgs)
    },
    getMsg(){
      this.msgs = this.items.filter(o=>o.status=='未读')
    },
    view(index) {
      var that =this
      this.$msgDialog.open({ msgTitle: this.msgs[index].title, msgStatus: this.msgs[index].status,msgContent:this.msgs[index].content,upStatus(){that.upStat(index)} })
    },
    //修改状态
    upStat(index){
      this.msgs[index].status = '已读'
      //更新数据状态
    },
    del(index) {
      //删除
      this.msgs.splice(index,1)
    },
    onPagination() {

    },
    onSelect() {

    }
  },
}
</script>

<style lang="scss" scoped>
.grid-content bg-purple-light {
  display: block;
}

.content-container {
  flex: 1;
  overflow-y: scroll;
  padding: 20px;
  background-color: #fff;
}

.breadcrumb-container {
  width: 100%;
  float: left;
  box-sizing: border-box;
}

.content-wrapper {
  background-color: #fff;
  box-sizing: border-box;
  width: 100%;
  float: left;
  display: block;
}

strong {
  font-weight: bold;
}

.title {
  width: 200px;
  float: left;
  color: #475669;
}

.toolbar {
  width: 100%;
  float: left;
  box-sizing: border-box;
  background: #f2f2f2;
  padding: 10px;
  margin: 10px 0;
  padding-bottom: 0px;
}

.tool {
  display: block;
  margin-top: 0em;
}

.form-item {
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
  margin-bottom: 10px;
}

.item-content {
  display: inline-block;
  vertical-align: top;
  line-height: 36px;
  position: relative;
  font-size: 14px;
}

.inp {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 100%;
}

.input-inner {
  -webkit-appearance: none;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #bfcbd9;
  box-sizing: border-box;
  color: #1f2d3d;
  display: block;
  font-size: inherit;
  height: 36px;
  line-height: 1;
  outline: 0;
  padding: 3px 10px;
  transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
  width: 100%;
}

input {
  -webkit-rtl-ordering: logical;
  text-rendering: auto;
  letter-spacing: normal;
  word-spacing: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  text-align: start;
  margin: 0;
  font: 400 13.3333px Arial;
}

.btn {
  color: #fff;
  background-color: #20a0ff;
  border-color: #20a0ff;
  display: inline-block;
  line-height: 1;
  white-space: normal;
  cursor: pointer;
  border: 1px solid #bfcbd9;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  padding: 10px 15px;
  font-size: 14px;
  border-radius: 4px;
}

.mytable {
  width: 100%;
  position: relative;
  float: left;
}

.md-table {
  border-bottom: 1px solid #bfcbd9;
}

.cell {
  white-space: nowrap;
  word-break: break-all;
  line-height: 24px;
  overflow: hidden;
  padding-right: 18px;
  box-sizing: border-box;
  text-overflow: ellipsis;
  transition: background-color .25s ease;
  height: 40px;
  min-width: 0;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
}

.small-btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #bfcbd9;
  color: #1f2d3d;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  padding: 7px 9px;
  font-size: 12px;
  border-radius: 4px;
}

.md-btn {
  color: #fff;
  background-color: #ff4949;
  border-color: #ff4949;
  margin-left: 10px;
}
@media screen and (min-width:300px) and (max-width:321px) {
  .item-content{max-width: 1rem;}
}

@media screen and (min-width:321px) and (max-width:361px) {
  .item-content{max-width: 1rem;}
}

@media screen and (min-width:362px) and (max-width:380px) {
  .item-content{max-width: 1rem;}
}

@media screen and (min-width:381px) and (max-width:420px) {
  .item-content{max-width: 1rem;}
}

</style>

