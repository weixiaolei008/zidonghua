<template>
  <div class="new-pressure-test">
    <div class="title">{{pageTitle}}普通压测 <span style="margin-left: 20px;font-size: 12px;">(*为必填项)</span></div>
    <el-form :model="formData" :rules="rules" ref="ruleForm" inline-message label-width="180px" class="new-form">
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
      <el-form-item label="回放开始时间：" required>
        <el-col :span="12">
          <el-input :disabled="true" v-model="formData.startTime" placeholder=""></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="回放结束时间：" required prop="endTime">
        <el-col :span="12">
          <el-date-picker
            style="width: 100%;"
            type="datetime"
            placeholder="请选择回放结束时间"
            v-model="formData.endTime">
          </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="并发线程：" prop="threads">
        <el-col :span="12" style="position: relative">
          <el-input type="number" v-model="formData.threads" placeholder="请输入并发线程"></el-input>
          <div style="position: absolute; width: 30px;height: 37px;background: #fff;z-index: 10;top: 2px;right: 10px;"></div>
        </el-col>
      </el-form-item>
      <el-form-item label="每秒最大请求数：" prop="period">
        <el-col :span="12" style="position: relative">
          <el-input type="number" v-model="formData.period" placeholder="请输入每秒最大请求数"></el-input>
          <div style="position: absolute; width: 30px;height: 37px;background: #fff;z-index: 10;top: 2px;right: 10px;"></div>
        </el-col>
      </el-form-item>
      <el-form-item label="重复执行：" required>
        <el-col :span="12">
          <el-input :disabled="true" v-model="formData.enlarged" placeholder="请输入..."></el-input>
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
        formData: {
          dbId: '',
          envId: '',
          startTime: '',
          endTime: '',
          id: '',
          threads: '',
          period: '',
          enlarged: 10
        },
        rules: {
          endTime: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          threads: [
            {required: true, message: '请输入并发线程', trigger: 'blur'}
          ],
          period: [
            {required: true, message: '请输入每秒最大请求数', trigger: 'blur'}
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
          // console.log(item)
          if(item.id == val) {
            this.formData.startTime = this.datetimeFormat(item.startTime);
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
        var url = 'project/' + this.projectCode + '/testStress/admin/updateTestStress';
        var p = {
          "dbId": this.formData.dbId,
          "envId": this.formData.envId,
          "startTime": this.parseToMillisecond(this.formData.startTime),
          "endTime": this.formData.endTime,
          "threads": this.formData.threads,
          "period": this.formData.period,
          "enlarged": this.formData.enlarged,
          "id": this.formData.id || ''
        }
        // console.log(p)
        this.$api.post(url, p, r => {
          // console.log(r);
          this.$router.push("/PressureTest");
        })
      },
      // 编辑初始化form
      baseForm() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testStress/view/queryTestStressByUUID';
        var p = {
          id: this.$route.query.id
        };
        self.$api.post(url, p, r => {
          // console.log(r);
          this.formData.dbId = r.data.dbId;
          this.formData.envId = r.data.envId;
          this.formData.startTime = this.datetimeFormat(r.data.startTime);
          this.formData.endTime = r.data.endTime;
          this.formData.id = r.data.id;
          this.formData.threads = r.data.threads;
          this.formData.period = r.data.period;
          this.formData.enlarged = r.data.enlarged;
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
      this.loadDb();
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
  .new-pressure-test{
    .title{
      font-size: 20px;
      color: #aaa;
      margin-left: 40px;
      margin-top: 40px;
    }
    .new-form{
      margin-top: 30px;
      margin-left: 50px;
    }
  }
</style>
