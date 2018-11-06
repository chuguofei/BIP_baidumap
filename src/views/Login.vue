<template>
  <div class="container cbody">
    <div class="panel panel-default login-box opa bgcolor" @keyup.enter="loginRemote">
      <div class="panel-heading bgcolor">
        <h2 class="panel-title">BIP管理应用平台登录</h2>
      </div>
      <div class="input-group">
        <span class="input-group-addon">
          <span class="glyphicon glyphicon-user"></span>
        </span>
        <input type="text" class="form-control" placeholder="请输入用户名" v-model="usercode">
      </div>
      <div class="input-group">
        <span class="input-group-addon">
          <span class="glyphicon glyphicon-lock"></span>
        </span>
        <input :type="type" class="form-control" placeholder="请输入密码" id="pwd">
        <span class="input-group-btn">
          <button class="btn btn-default" type="button" @click="showOrNot">
            <span class="glyphicon glyphicon-eye-open" v-if="showPwd"></span>
            <span class="glyphicon glyphicon-eye-close" v-if="notShow"></span>
          </button>
        </span>
      </div>
      <div class="checkbox forPwd">
        <label>
          <input type="checkbox">记住密码
        </label>
        <div class="forgetPwd">
          <a href="#">忘记密码</a>
        </div>
      </div>
      <button type="button" class="btn btn-success btn-block btn-my" @click="loginRemote">登录</button>
    </div>
    <md-loading :loading="loading"></md-loading>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usercode: '',
      pwd: '',
      showPwd: true,
      notShow: false,
      type: 'password',
      loading:0
    }
  },
  mounted() {
  },
  methods: {
    async loginRemote() {
      if(this.loading>0){
        return;
      }
      this.loading++
      var psss = document.getElementById('pwd').value;
      var logindata = {
        apiId: global.APIID_LOGIN,
        dbid: global.DBID,
        usercode: this.usercode,
        pwd: this.base64Encode(psss)
      }
      try{
        var res = await this.getDataByAPINew(logindata);
        this.loginSuccess(res);
      }catch(e){
        this.$notify.danger({content: '系统连接错误！'});
      }
      this.loading--;
    },
    loginSuccess(res) {
      if (res.data.id === 0) {
        var userI = res.data.data.user;
        var mlist = res.data.data.menulist;
        var snkey = res.data.data.snkey;
        window.sessionStorage.setItem('user', JSON.stringify(userI));
        window.sessionStorage.setItem('menulist', JSON.stringify(mlist));
        window.sessionStorage.setItem('snkey', JSON.stringify(snkey));
        this.$emit('emitLogin');
         this.$notify.success({content: '成功登陆'})
      } else {
        // console.log(res.data.message);
        this.$notify.danger({content: res.data.message})
      }
    },
    showOrNot() {
      this.showPwd = !this.showPwd
      this.notShow = !this.notShow
      var value = document.getElementById('pwd').value;
      if (this.notShow) {
        this.type = 'text'
        this.pwd = value
      } else {
        this.type = 'password'
        this.pwd = value
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$bkclor:#726370;

/* 透明 #8e8986 #5c5052*/

.opa {
  filter: alpha(Opacity=90);
  -moz-opacity: 0.9;
  opacity: 0.9;
}


/* 背景色 */

.bgcolor {
  background-color: $bkclor;
  color: #fff
}

.panel-heading {
  border-bottom: 1px solid #8e8986;
  font-family: "Microsoft YaHei"
}

.panel-title {
  margin-left: 15px;
}

.cbody {
  min-height: 100%;
  width: 100%;
  height: 100%;
  min-width: 100%;
  background-image: url(../img/bipbackgroud.jpg);
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 100%;
}

.login-box {
  min-width: 5rem;
  width: 5rem;
  margin: 0 auto;
  margin-top: 15%;
  border: 1px solid #8e8986;
}

.input-group {
  margin: 20px 30px;
}

.forPwd {
  margin: 10px 30px;
}

.forgetPwd {
  float: right;
}

.forgetPwd a {
  color: #fff;
  text-decoration: none !important
}

.forgetPwd a:hover {
  color: #dfa553
}

.btn-block {
  margin: 20px 30px;
  width: calc(5rem - 60px)
}

.btn-my {
  border: 0px;
}

@media (max-width:500px) {
  .login-box {
    min-width: 3rem;
    width: 3rem;
    margin: 0 auto;
    margin-top: 15%;
    border: 1px solid #8e8986;
  }
  .btn-block {
    margin: 20px 30px;
    width: calc(3rem - 60px)
  }
}
</style>


