<template>
  <div class="new-project">
    <el-form :model="formData" :rules="rules" ref="ruleForm" inline-message label-width="180px" class="new-project-form">
      <div class="title">{{pageTitle}}用户 <span style="margin-left: 20px;font-size: 12px;">(*为必填项)</span></div>
      <el-form-item label="姓名：" prop="userName">
        <el-col :span="14">
          <el-input v-model="formData.userName" placeholder="请输入姓名"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item v-if="this.$route.query.id" label="账号：" prop="loginId" required>
        <el-col :span="14">
          <el-input v-model="formData.loginId" :disabled="true"  placeholder="请输入账号"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item v-else label="账号：" prop="loginId" required>
        <el-col :span="14">
          <el-input v-model="formData.loginId"  @blur="repeat(formData.loginId)" placeholder="请输入账号"></el-input>
        </el-col>
        <el-col v-if="tipName != 1" :span="2" style="color: #f66f65; margin-left: 10px;">账号已存在</el-col>
      </el-form-item>
      <el-form-item label="手机号：" prop="mobilenum">
        <el-col :span="14">
          <el-input v-model="formData.mobilenum" @blur="phoneCheck(formData.mobilenum)" placeholder="请输入手机号"></el-input>
        </el-col>
        <el-col v-if="phoneVisible" :span="4" style="color: #f66f65; margin-left: 10px;">请输入正确手机号</el-col>
      </el-form-item>
      <el-form-item label="邮箱：" prop="email">
        <el-col :span="14">
          <el-input v-model="formData.email" @blur="emailCheck(formData.email)" placeholder="请输入邮箱"></el-input>
        </el-col>
        <el-col v-if="emailVisible" :span="4" style="color: #f66f65; margin-left: 10px;">请输入正确邮箱</el-col>
      </el-form-item>
      <el-form-item label="管理员：">
        <el-radio-group v-model="formData.isAdmin">
          <el-radio style="margin-left: 30px;width: 60px;" class="radio" :label="1">是</el-radio>
          <el-radio class="radio" :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--权限-->
      <div class="title">项目权限</div>

      <el-form-item :label="item.projectName + '：'" v-for="(item, index) in upList" :key="index">
        <el-radio-group v-model="upList[index].authType">

          <el-radio style="margin-left: 30px;" class="radio" :label="1">管理</el-radio>
          <el-radio class="radio" :label="2">查看</el-radio>
          <el-radio class="radio" :label="3">无权限</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--提交-->
      <el-form-item>
        <el-col :span="14" style="text-align: center;">
          <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100px;">提交</el-button>
          <el-button @click="back()" style="width: 100px;">返回</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {Message} from 'element-ui'
  export default {
    components: {
    },
    data() {
      return {
        tipName: 1,
        phoneVisible: false,
        emailVisible:false,
        formData: {
          userName: '',
          loginId: '',
          mobilenum: '',
          email: '',
          userId: '',
          isAdmin: -1
        },
        upList: [],
        rules: {
          userName: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          loginId: [
            {validator:(rule,value,callback)=>{
                if(value==null || value.trim()==''){
                    callback(new Error("请输入账户名"));
                }else if(/[a-zA-Z0-9_]/.test(value)==false){
                    callback(new Error("登录账户只能由英文字母或数字组成"));
                }else{
                    callback();
                }
            }, trigger: 'blur'}
          ],
          mobilenum: [
            {required: true, message: '请输入手机号', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      pageTitle(){
        return this.$route.query.id==null?'新增':'编辑';
      }
    },
    methods: {
      loadData() {
        var p = {
          "userName": String.trim(this.formData.userName),
          "loginId": String.trim(this.formData.loginId),
          "mobilenum": this.formData.mobilenum,
          "email": this.formData.email,
          "isAdmin": this.formData.isAdmin,
          "upList": this.upList,
          "userId": this.formData.userId || ''
        }
        // console.log(p)
        this.$api.post('user/addOrupdateUser', p, r => {
          // console.log(r);
          this.$router.push("/UserManage");
        })
      },
      loadprojectGroup() {
        this.upList = [];
        var p = {}
        // console.log(p)
        this.$api.post('myproject/getProjectList', p, r => {
          // console.log(r.data);
          r.data.forEach((item) => {
            this.upList.push({
              projectName: item.projectName,
              projectId: item.id,
              authType: 3
            })
          })
          if(this.$route.query.id){
            this.baseForm();
          }
        })
      },
      // 名字判重
      repeat(val){
        var p = val;
        if(val){
          this.$api.post('/user/ifNotExistByLoginId', p, r => {
            // console.log(r);
            this.tipName = r.data;
          })
        }else{
          this.tipName = 1;
        }
      },
      // 手机号格式
      phoneCheck(val) {
        if(val){
          var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
          if(reg.test(val)){
            this.phoneVisible = false;
          }else{
            this.phoneVisible = true;
          }
        }else{
          this.phoneVisible = false;
        }
      },
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
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && !this.phoneVisible && !this.emailVisible) {
            this.loadData();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      back() {
        window.history.back();
      },
      baseForm() {
        var p = {
          userId:this.$route.query.id
        }
        // console.log(p)
        this.$api.post('user/getUserByUserId', p, r => {
          // console.log(r.data);
          this.formData.userName = r.data.userName;
          this.formData.loginId = r.data.loginId;
          this.formData.mobilenum = r.data.mobilenum;
          this.formData.email = r.data.email;
          this.formData.userId = r.data.userId;
          this.formData.isAdmin = Number(r.data.isAdmin);
          r.data.upList.forEach((item) => {
            for (var i = 0;i < this.upList.length;i++){
              if(item.projectId == this.upList[i].projectId){
                this.upList[i].authType = Number(item.authType);
              }
            }
          })
        })

      }
      // 数字文字转换
      // exchangeGet(val){
      //   return val === 1 ? '管理' : val === 2 ? '查看' : '';
      // },
      // exchangeSet(val){
      //   return val === '管理' ? 1 : val === '查看' ? 2 : null;
      // },
    },
    created() {
      this.loadprojectGroup();
      this.$store.state.activeName2 = this.pageTitle+this.$route.name;
      if(this.$route.query.id){
        this.baseForm();
      }
    },
    mounted() {
    },
    beforeDestroy() {
      this.$store.state.activeName2 = null;
    }
  }

</script>

<style lang="scss" scoped>
  .new-project{
    .title{
      font-size: 20px;
      color: #aaa;
      margin-left: 0px;
      margin-top: 40px;
      margin-bottom: 20px;
    }
    .new-project-form{
      margin-top: 30px;
      margin-left: 50px;
    }
  }
</style>
