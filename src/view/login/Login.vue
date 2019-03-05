<template>
  <div class="login-bg">
    <div class="login-box" v-if="!forget">
      <div class="login-logo">自动化测试系统</div>
      <div class="input-box" style="margin-top:60px;">
        <span class="user-name"><i class="icon iconfont icon-user"></i></span>
        <input placeholder="请输入用户名" type="text" v-model="loginName" />
      </div>
      <div class="input-box">
        <span class="user-name"><i class="icon iconfont icon-mima"></i></span>
        <input placeholder="请输入密码" type="password" v-model="loginPassword" />
      </div>
      <div class="loginbutton">
        <button type="primary" class="login" @click="login" >登录系统</button>
        <span @click="forget=!forget">忘记密码</span>
      </div>
    </div>
    <div class="forget-box" v-if="forget">
      <div class="login-logo">找回密码</div>
      <div class="input-box" style="margin-top:60px;">
        <span class="user-name"><i class="icon iconfont icon-user"></i></span>
        <input placeholder="请输入用户名" type="text" v-model="loginName" />
      </div>
      <div class="input-box">
        <span class="user-name"><i class="el-icon-message"></i></span>
        <input placeholder="请输入邮箱" @blur="emailCheck(email)" type="email" v-model="email" />
      </div>
      <span v-show="emailVisible" style="color: #f66f65;margin-left:40px;line-height:16px;">请输入正确邮箱</span>
      <div class="loginbutton">
        <button type="primary" class="login"  @click="lookPwd">提交</button>
        <span @click="forget=!forget" >返回</span>
      </div>
    </div>
    <div class="mask" v-if="maskShow"></div>
    <div class="tip" v-if="tipShow">
      <div style="font-size: 24px;margin-bottom: 20px;margin-top: 20px;text-align: center;">重置密码成功</div>
      <div>我们已发送新的密码到您的注册邮箱<span>{{email}}</span>,请注意查收。</div>
    </div>
    <div class="tip" v-if="tipFirst">
      <div style="font-size: 24px;margin-bottom: 20px;margin-top: 20px;text-align: center;">首次登录</div>
      <div style="text-align: center;font-size: 18px;">为了您的账号安全，请修改密码。</div>
    </div>
  </div>
</template>

<script>
	import { Message } from 'element-ui'
  import api from './../../common/js/index'
	export default {
		data() {
			return {
        emailVisible: false, 
        maskShow: false, // 遮罩层
        tipFirst: false, // 首次登陆提示
        tipShow: false, // 邮件提示框
			  forget: false, // 忘记密码切换
				loginName: '',
				loginPassword: '',
        email: ''
			}
		},
		methods: {
       // 邮箱格式
      emailCheck(val) {
        if(val){
          var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/; //验证规则
          if(reg.test(val)){
            this.emailVisible = false;
          }else{
            this.emailVisible = true;
          }
        }else{
          this.emailVisible = false;
        }
      },
			login() {
				let self = this;
				if(!self.loginName) {
					Message.error({
						message: '请填写用户名'
					})
					return
				}
				if(!self.loginPassword) {
					Message.error({
						message: '请填写密码'
					})
					return
				}
				var p = {
          username: self.loginName,
          password: self.loginPassword
				}
				self.$api.post('login', p, r => {
          console.log(r);
          var user = {
						"userId": r.data.userId,
            "token": r.data.access_token,
            "isAdmin": r.data.isAdmin
					}
					self.$api.sSetObject('_user', user);
          this.$api.sSetObject('_isCollapse', false);
          this.$api.sSetObject('_menuChange', true);
          if(r.data.isFirst == 1){
            self.$confirm('为了你的账号安全，请修改密码', '修改密码', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              center: true
            }).then(() => {
              self.$router.push("/ResetPwd");
            }).catch(() => {
              self.$router.push("/ProjectManage");
            });
            // self.tipFirst = true;
            // self.maskShow = true;
            // setTimeout(function () {
            //   self.tipFirst = false;
            //   self.maskShow = false;
            //   self.$router.push("/ResetPwd");
            // },3000)
          }else{
            self.$router.push("/ProjectManage");
          }
				}, e => {
					console.log(e);
				})
			},
      lookPwd() {
        let self = this;
          if(!self.loginName) {
            Message.error({
              message: '请填写用户名'
            })
            return
          }
          if(!self.email) {
            Message.error({
              message: '请填写邮箱'
            })
            return
          }
        if(!self.emailVisible){
          var p = {
            loginId: self.loginName,
            email: self.email
          }
          self.$api.post('/user/forgetPwd', p, r => {
            // console.log(r);
            if(r.data == 1){
              self.tipShow = true;
              self.maskShow = true;
              setTimeout(function () {
                self.tipShow = false;
                self.maskShow = false;
                self.forget = false;
              },2000)
            }else{
              Message.error({
                message: '发送失败'
              })
            }
          })
        }
      }
		},
		mounted() {
			var self = this
			document.onkeydown = function(e) {
				var ev = document.all ? window.event : e;
				if(ev.keyCode == 13) {
					self.login();
					return false;
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
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
    width: 400px;
    height: 200px;
    padding: 20px;
    position: fixed;
    z-index: 10;
    border-radius: 5px;
    background-color:#fff;
    margin: -120px 0 0 -200px;
    text-indent:25px;
    line-height: 40px;
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
    color: #ccc;
  }

  .login-box,.forget-box {
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
      .login{
        width:96%;
        margin-left:5px;
        background: #5bc0de;
        border: none;
        line-height: 40px;
        border-radius: 5px;
        &:hover{
          background: #5cb85c;
          opacity: 0.9;
          cursor: pointer;
        }
      }
      span{
        float: right;
        cursor: pointer;
        margin-top: 20px;
        color: #bbb;
        margin-right: 10px;
        &:hover{
          color: #5bc0de;
        }
      }
    }

  }


</style>
