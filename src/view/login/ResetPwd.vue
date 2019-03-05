<template>
  <div class="login-bg">
    <div class="reset-box">
      <div class="login-logo">修改密码</div>
      <div class="input-box" style="margin-top:60px;">
        <span class="user-name"><i class="icon iconfont icon-mima"></i></span>
        <input placeholder="请输入旧密码" type="password" v-model="loginPassword" />
      </div>
      <div class="input-box">
        <span class="user-name"><i class="icon iconfont icon-mima"></i></span>
        <input placeholder="请输入新密码" type="password" v-model="newPassword" @blur="showTipLike"/>
        <span v-if="tipLike" class="tip-like">新旧密码不能相同</span>
      </div>
      <div class="input-box">
        <span class="user-name"><i class="icon iconfont icon-mima"></i></span>
        <input placeholder="请确认新密码" type="password" v-model="newPassword2" @blur="showTip"/>
        <span v-if="tip" class="tip-like">两次输入密码不一致</span>
      </div>
      <div class="loginbutton">
        <button type="primary" class="btn"  @click="lookPwd" style="width:96%;margin-left:5px;background: #5bc0de;">提交</button>
      </div>
    </div>
    <div class="mask" v-if="tipShow"></div>
    <div class="tip" v-if="tipShow">
      <div v-if="message=='修改成功'" style="text-align: center;font-size: 30px;color: #5bc0de;">{{message}}</div>
      <div v-if="message=='修改失败'" style="text-align: center;font-size: 30px;color: red;">{{message}}</div>
    </div>
  </div>
</template>

<script>
  import api from './../../common/js/index'
  import { Message } from 'element-ui'

  export default {
    data() {
      return {
        tip:false, // 密码不一致提示框
        tipLike: false, //新旧密码判断
        message: '',
        tipShow:false, // 修改成功提示框
        loginPassword: '',
        newPassword: '',
        newPassword2: ''
      }
    },
    computed: {
      // like: {
      //   // getter
      //   get: function () {
      //     if(this.newPassword === this.newPassword2){
      //       return false
      //     }else{
      //       return true
      //     }
      //   },
      //   // setter
      //   set: function () {
      //   }
      // }
    },
    methods: {
      showTip(){
        if(this.newPassword === this.newPassword2){
          this.tip = false;
        }else{
          this.tip = true;
        }
      },
      showTipLike(){
        if(this.newPassword === this.loginPassword){
          this.tipLike = true;
        }else{
          this.tipLike = false;
        }
      },
      lookPwd() {
        let self = this;
        if(!self.loginPassword) {
          Message.error({
            message: '请填写旧密码'
          })
          return
        }
        if(!self.newPassword) {
          Message.error({
            message: '请填写新密码'
          })
          return
        }
        if(!self.newPassword2) {
          Message.error({
            message: '请确认新密码'
          })
          return
        }
        var p = {
          oldPwd: self.loginPassword,
          newPwd: self.newPassword
        }
        self.$api.post('/user/changePwd', p, r => {
          // console.log(r);
          if(r.data == 1){
            self.message = '修改成功';
            self.tipShow = true;
            setTimeout(function () {
              self.tipShow = false;
              self.$router.push("/");
              sessionStorage.clear();
            },2000)
          }else{
            self.message = '修改失败';
            self.tipShow = true;
            setTimeout(function () {
              self.tipShow = false;
            },2000)
          }
        })
      }
    },
    mounted() {
      var self = this;
      document.onkeydown = function(e) {
        var ev = document.all ? window.event : e;
        if(ev.keyCode == 13) {
          self.login();
          return false;
        }
      }
    },
    created: function () {
      // let user = api.sGetObject("_user");
      // this.loginName = user.userId
    }
  }
</script>

<style lang="scss" scoped>
  .tip-like{
    color: red;
    margin-left: 30px;
    position: relative;
    top: 8px;
    z-index: 10;
    background: #fff;
    border: 1px solid #eee;
    padding: 6px 10px;
    border-radius: 5px;
  }
  .tip-like:after{
    content: '';
    width: 8px;
    height: 8px;
    left: 20px;
    top: -5px;
    border-top: 1px solid #ddd;
    border-left: 1px solid #ddd;
    position: absolute;
    z-index: 11;
    background: #fff;
    transform: rotate(45deg);
  }
  .mask{
    width: 100%;
    height: 100%;
    position: fixed;
    background-color:rgba(0,0,0,0.5);
    z-index: 9;
    left: 0;
    top: 0;
  }
  .tip{
    background: #fff;
    width: 300px;
    height: 100px;
    padding: 20px;
    position: fixed;
    z-index: 10;
    border-radius: 5px;
    background-color:#fff;
    margin: -100px 0 0 -150px;
    line-height: 100px;
    left: 50%;
    top: 50%;
  }
  .login-bg {
    width: 100%;
    height: 100%;
    background: url(../../common/img/login-bg.jpg);
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .login-logo {
    text-align: center;
    font-size: 26px;
  }

  .reset-box {
    width: 400px;
    height: 320px;
    padding: 20px;
    position: fixed;
    border-radius: 5px;
    background-color:#fff;
    margin: -165px 0 0 -200px;
    left: 50%;
    top: 50%;
    .input-box {
      width: 350px;
      height: 30px;
      line-height: 30px;
      margin-bottom: 20px;
      background: white;
      padding: 2px 10px;
      border-radius: 5px;
      position: relative;
    }
    .input-box .user-name {
      position: absolute;
      color: #cccccc;
      width: 30px;
      top: 9px;
      left: 19px;
      font-size: 16px;
    }

    .input-box .user-name i {
      font-size: 18px;
    }

    .input-box>input {
      border:1px solid #ccc;
      padding: 5px 0;
      border-radius: 5px;
      width: 100%;
      height: 100%;
      background: #fff;
      color: #666;
      font-size: 14px;
      line-height: inherit;
      padding-left: 35px;
    }

    .loginbutton {
      width: 100%;
      margin-top: 40px;
      text-align: center;
      .btn{
        width:96%;
        margin-left:5px;
        background: #5bc0de;
        border: none;
        line-height: 40px;
        border-radius: 5px;
        &:hover{
          cursor: pointer;
          background: #5cb85c;
          opacity: 0.9;
        }
      }
    }

  }


</style>
