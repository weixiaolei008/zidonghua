<template>
  <div class="new-test">
    <div class="title">
      {{pageTitle}}比对规则
      <span style="margin-left: 20px;font-size: 12px;">(以下接口忽略字段，执行测试时，不会检查报文是否符合。*为必填项)</span>
    </div>
    <el-form :model="formData" :rules="rules" ref="ruleForm" inline-message label-width="180px" class="new-project-form">
      <el-form-item label="接口名称：" prop="uri">
        <el-col :span="12">
          <el-input v-model="formData.uri" @blur="repeat(formData.uri)" placeholder="请输入接口名称"></el-input>
        </el-col>
        <el-col v-if="tipName != 1" :span="2" style="color: #f66f65; margin-left: 10px;">名字已存在</el-col>
      </el-form-item>
      <el-form-item label="忽略字段：" prop="ignoreField">
        <el-col :span="12">
          <el-input v-model="formData.ignoreField" placeholder="忽略的字段名称，以半角 ' , ' 分隔"></el-input>
        </el-col>
        <!--<el-col :span="8" style="color: #5bc0de;margin-left: 5px;">忽略的字段名称，以半角","分隔</el-col>-->
      </el-form-item>
      <el-form-item style="border-top: 1px solid #eee;margin-right: 3%;">
        <el-col :span="12" style="text-align: center;padding-top: 20px;">
          <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100px;">提交</el-button>
          <el-button @click="back()" style="width: 100px;">返回</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

  export default {
    components: {
    },
    data() {
      return {
        tipName: 1,
        projectCode: null,
        formData: {
          uri: '',
          ignoreField: '',
          id: ''
        },
        rules: {
          uri: [
            {required: true, message: '请输入接口名称', trigger: 'blur'}
          ],
          ignoreField: [
            {required: true, message: '请输入忽略字段', trigger: 'blur'}
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
      // 提交按钮
      loadData() {
        var url = 'project/' + this.projectCode + '/rule/admin/updateRuleComparator';
        var p = {
          "uri": String.trim(this.formData.uri),
          "ignoreField": String.trim(this.formData.ignoreField),
          "id": this.formData.id || ''
        }
        // console.log(p)
        this.$api.post(url, p, r => {
          // console.log(r);
          this.$router.push("/RuleConfig");
        })
      },
      // 判重
      repeat(val){
        if(val){
          var p = {
            "uri": val,
            "id": this.formData.id || ''
          }
          console.log(p)
          var url = 'project/' + this.projectCode + '/rule/view/checkUriIsRepeat';
          this.$api.post(url, p, r => {
            console.log(r);
            this.tipName = r.data;
          })
        }else{
          this.tipName = 1;
        }
      },
      // 编辑初始化form
      baseForm() {
        var self = this;
        var url = 'project/' + this.projectCode + '/rule/view/queryRuleByUUID';
        var p = {
          id: this.$route.query.id || '',
        };
        // console.log(p)
        self.$api.post(url, p, r => {
          // console.log(r);
          this.formData.uri = r.data.uri;
          this.formData.ignoreField = r.data.ignoreField;
          this.formData.id = r.data.id;
        })
      },
      baseFormTest() {
        var self = this;
        var url = 'project/' + this.projectCode + '/rule/view/queryUriIsRepeat';
        var p = {
          uri: this.$route.query.uri || ''
        };
        console.log(p)
        self.$api.post(url, p, r => {
          console.log(r);
          if(r.data){
            this.formData.uri = r.data.uri;
            this.formData.ignoreField = r.data.ignoreField;
            this.formData.id = r.data.id;
          }else{
            this.formData.uri = this.$route.query.uri;
          }
        })
      },
      // 提交
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
      }
    },
    created() {
      // 获取项目code
      this.projectCode = this.$api.sGetObject('_projectCode');
      this.$store.state.activeName2 = this.pageTitle+this.$route.name;
      if(this.$route.query.id){
        this.baseForm();
      }
      if(this.$route.query.uri){
        this.baseFormTest();
      }
    },
    beforeDestroy() {
      this.$store.state.activeName2 = null;
    }
  }

</script>

<style lang="scss" scoped>
  .new-test{
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
