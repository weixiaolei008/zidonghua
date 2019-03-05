<template>
  <div class="new-test">
    <div class="title">{{pageTitle}}功能测试<span style="margin-left: 20px;font-size: 12px;">(*为必填项)</span></div>
    <el-form :model="formData" :rules="rules" ref="ruleForm" inline-message label-width="180px" class="new-project-form">
      <el-form-item label="测试任务名称：" required prop="testDesc">
          <el-col :span="10" style="margin-right: 20px;">
            <el-input v-model="formData.testDesc" placeholder="测试任务名称"></el-input>
          </el-col>
      </el-form-item>
      <el-form-item label="环境选择：" required>
        <el-col :span="12">
          <el-select placeholder="请选择环境" v-model="formData.envId" style="width: 100%;">
            <el-option
              v-for="item in optionEnv"
              :key="item.id"
              :label="item.envName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="还原点选择：" required>
        <el-col :span="12"> 
          <el-select placeholder="请选择还原点" v-model="formData.dbId" @change="setTime" style="width: 100%;">
            <el-option
              v-for="item in optionDb"
              :key="item.id"
              :label="item.dbName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
         <!-- <el-form-item label="数据库还原到执行开始前：" required>
        <el-col :span="12">
          <el-select placeholder="请选择结束测试时，数据库还原到执行开始状态前的sql" v-model="formData.dbBakPath" @change="setPath" style="width: 100%;">
            <el-option
              v-for="item in optionSqlDb"
              :key="item.dbBakPath"
              :label="item.dbBakPath+'-'+item.sqlDesc"
              :value="item.dbBakPath"
              :disabled="item.dbBakPath.length!=18"
              >
            </el-option>
          </el-select>
        </el-col>
      </el-form-item> -->
      <el-form-item label="日志抓取开始时间：" required>
        <el-col :span="12">
          <el-input :disabled="true" v-model="formData.startTime" placeholder="请输入..."></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="日志抓取结束时间：" required prop="endTime">
        <el-col :span="12">
          <el-date-picker
            style="width: 100%;"
            type="datetime"
            placeholder="请选择回放结束时间"
            v-model="formData.endTime">
          </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="12" style="text-align: center;">
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
        projectCode: null,
        optionDb: [],
        optionEnv: [],
        optionSqlDb:[],
        formData: {
          dbId: '',
          envId: '',
          startTime: '',
          endTime: '',
          testDesc:'',
          dbBakPath:'',
          id: ''
        },
        rules: {
          endTime: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
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
      // 根据数据源设置时间
      setTime(val) {
        this.optionDb.forEach((item) => {
          if(item.id == val) {
            this.formData.startTime = this.datetimeFormat(item.startTime);
          }
        })
      },
       setPath(val) {
        this.optionSqlDb.forEach((item) => {
          if(item.dbBakPath == val) {
            this.formData.dbBakPath = item.dbBakPath;
          }
        })
      },
      // 获取数据源下拉框
      loadDb() {
        var self = this;
        var url = 'project/' + this.projectCode + '/dataSource/admin/getDataSourceListByProjectId';
        var p = {};
        self.$api.post(url, p, r => {
          // console.log(r);
          this.optionDb = r.data;
        })
      },
      // 获取数据源下拉框
      // loadSqlDb() {
      //   var self = this;
      //   var url = 'project/' + this.projectCode + '/dataSource/admin/getDbPathList';
      //   var p = {};
      //   self.$api.post(url, p, r => {
      //     // console.log(r);
      //     this.optionSqlDb = r.data;
      //   })
      // },
      // 获取环境下拉框
      loadEnv() {
        var self = this;
        var url = 'project/' + this.projectCode + '/environment/admin/getEnvListByProjectId';
        var p = {};
        self.$api.post(url, p, r => {
          // console.log(r);
          this.optionEnv = r.data;
        })
      },
      // 提交按钮
      loadData() {
        var url = 'project/' + this.projectCode + '/testFunc/admin/updateTestFunc';
        var p = {
          "dbId": this.formData.dbId,
          "envId": this.formData.envId,
          "startTime": this.datePrase(this.formData.startTime),
          "endTime": this.formData.endTime,
          "testDesc": this.formData.testDesc,
          "dbBakPath": this.formData.dbBakPath,
          "id": this.formData.id || ''
        }
        // console.log(p)
        this.$api.post(url, p, r => {
          // console.log(r);
          this.$router.push("/FunctionTest");
        })
      },
      // 编辑初始化form
      baseForm() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testFunc/view/queryTestFuncByUUID';
        var p = {
          id: this.$route.query.id
        };
        self.$api.post(url, p, r => {
          // console.log(r);
          this.formData.dbId = r.data.dbId;
          this.formData.envId = r.data.envId;
          this.formData.startTime = this.datetimeFormat(r.data.startTime);
          this.formData.endTime = r.data.endTime;
          this.formData.testDesc = r.data.testDesc;
          this.formData.dbBakPath = r.data.dbBakPath;
          this.formData.id = r.data.id;
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
      },
      datePrase(val){
        var date = new Date(val);
        return date.getTime();
      }
    },
    created() {
      // 获取项目code
      this.projectCode = this.$api.sGetObject('_projectCode');
      this.$store.state.activeName2 = this.pageTitle+this.$route.name;
      this.loadDb();
      // this.loadSqlDb();
      this.loadEnv();
      if(this.$route.query.id){
        this.baseForm();
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
