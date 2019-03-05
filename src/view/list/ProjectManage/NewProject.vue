<template>
  <div class="new-project">
    <div class="title">{{pageTitle}}项目 <span style="margin-left: 20px;font-size: 12px;">(*为必填项)</span></div>
    <el-form :model="formData" :rules="rules" ref="ruleForm" inline-message label-width="180px" class="new-project-form">
      <el-form-item v-if="this.$route.query.id" label="项目编码：" prop="projectCode">
        <el-col :span="14">
          <el-input v-model="formData.projectCode" :disabled="true" placeholder="请输入..."></el-input>
        </el-col>
      </el-form-item>
      <el-form-item v-else label="项目编码：" prop="projectCode" required>
        <el-col :span="14">
          <el-input v-model="formData.projectCode" placeholder="请输入项目编码"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="项目名称：" prop="projectName">
        <el-col :span="14">
          <el-input v-model="formData.projectName"  @blur="repeat(formData.projectName)" placeholder="请输入项目名称"></el-input>
        </el-col>
        <el-col v-if="tipName != 1" :span="2" style="color: #f66f65; margin-left: 10px;">名字已存在</el-col>
      </el-form-item>
      <el-form-item label="日志读取方式：" required prop="logType">
        <el-radio-group v-model="formData.logType">
          <el-radio class="radio" :label="1">本地文件系统</el-radio>
          <el-radio class="radio" :label="2">HDFS</el-radio>
        </el-radio-group>
        <el-switch v-model="enableLogCollect" active-text="采集开关" v-if="formData.logType==2" @change="enableLogCollectChangeHandler"/>
      </el-form-item>
      <el-form-item label="日志路径：" prop="logPath">
        <el-col :span="14">
          <el-input v-model="formData.logPath" placeholder="请输入日志路径" :disabled="formData.logType!=1"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="数据库备份文件路径：" prop="dbPath">
        <el-col :span="14">
          <el-input v-model="formData.dbPath" placeholder="请输入数据库备份文件路径"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="项目描述：" prop="rmk">
        <el-col :span="14">
          <el-input type="textarea" v-model="formData.rmk" placeholder="请输入0-100个字符"></el-input>
        </el-col>
      </el-form-item>
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
        projectRow: null,
        formData: {
          projectCode: '',
          projectName: '',
          logType: '',
          logPath: '',
          logCollectFlag: null,
          dbPath: '',
          rmk: '',
          id: ''
        },
        rules: {
          projectCode: [
            {validator:(rule,value,callback)=>{
                if(value==null || value.trim()==''){
                    callback(new Error("请输入项目编码"));
                }else if(/[a-zA-Z_]/.test(value)==false){
                    callback(new Error("项目编码只能由英文字母组成"));
                }else{
                    callback();
                }
            }, trigger: 'blur'}
          ],
          projectName: [
            {required: true, message: '请输入项目名称', trigger: 'blur'}
          ],
          logType: [
            {required: true, message: '请选择日志读取方式', trigger: 'change'}
          ],
          logPath: [
            //{required: true, message: '请输入日志路径', trigger: 'blur'}
            {validator:(rule,value,callback)=>{
                if(this.formData.logType==1 && (value==null || value.trim()=='')){
                    callback(new Error("请输入日志路径"));
                }else{
                    callback();
                }
            }, trigger:'blur'}
          ],
          dbPath: [
            {required: true, message: '请输入数据库备份文件路径', trigger: 'blur'}
          ],
          rmk: [
            {required: true, message: '请输入项目描述', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      pageTitle(){
        return this.$route.query.id==null?'新增':'编辑';
      },
      enableLogCollect(){
        return this.formData.logCollectFlag==1?true:false;
      }
    },
    methods: {
      enableLogCollectChangeHandler(flag){
        var params = {
          "projectCode": this.formData.projectCode,
          "logCollectFlag" : flag?1:0
        }
        this.$api.post('myproject/switchLogCollect', params, r => {
          var messageType="success";
          if(r.status != 200){
            messageType="error";
          }else{
            this.formData.logCollectFlag=flag?1:0;
          }
          this.$message({
            showClose: true,
            message: r.message,
            type: messageType
          });
        })
      },
      loadData() {
        var p = {
          "projectCode": this.formData.projectCode,
          "projectName": this.formData.projectName,
          "logType": this.formData.logType,
          "logPath": this.formData.logPath,
          "logCollectFlag": this.formData.logCollectFlag,
          "dbPath": this.formData.dbPath,
          "rmk": this.formData.rmk,
          "id": this.formData.id
        }
        console.log(p)
        this.$api.post('myproject/insertOrUpdateProject', p, r => {
          console.log(r);
          this.$router.push("/ProjectManage");
        })
      },
      baseForm() {
        this.formData.projectCode = this.projectRow.projectCode;
        this.formData.projectName = this.projectRow.projectName;
        this.formData.logType = this.projectRow.logType;
        this.formData.logPath = this.projectRow.logPath;
        this.formData.logCollectFlag = this.projectRow.logCollectFlag;
        this.formData.dbPath = this.projectRow.dbPath;
        this.formData.rmk = this.projectRow.rmk;
        this.formData.id = this.projectRow.id;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
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
      repeat(val){
        if(val){
          var p = {
            "projectName": val,
            "id": this.formData.id || ''
          }
          // console.log(p)
          this.$api.post('/myproject/ifNotExistByProjectName', p, r => {
            console.log(r);
            this.tipName = r.data;
          })
        }else{
          this.tipName = 1;
        }
      }
    },
    created() {
      this.projectRow = this.$api.sGetObject('_projectRow');
      // console.log(this.projectRow)
      this.$store.state.activeName2 = this.pageTitle+this.$route.name;
      if(this.projectRow){
        this.baseForm()
      }
    },
    beforeDestroy() {
      if(this.projectRow){
        sessionStorage.removeItem('_projectRow');
      };
      this.$store.state.activeName2 = null;
    }
  }

</script>

<style lang="scss" scoped>
  .new-project{
    .title{
      font-size: 20px;
      color: #aaa;
      margin-left: 40px;
      margin-top: 40px;
    }
    .new-project-form{
      margin-top: 30px;
      margin-left: 50px;
    }
  }
</style>
