<!--混合压测-->
<template>
  <div class="new-pressure-test">
    <div class="title">{{pageTitle}}混合压测 <span style="margin-left: 20px;font-size: 12px;">(*为必填项)</span></div>
    <el-form :inline="true" :model="formData" :rules="rules" ref="formData" label-width="180px" class="new-form">
      <el-form-item label="压测场景名称：" prop="sceneName"  required>
        <el-col :span="12" style="position: relative">
          <el-input type="text" style="width:280px;" v-model="formData.sceneName" placeholder="请输入场景名称"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="环境选择："  prop="envId"   required>
        <el-col :span="12">
          <el-select style="width:280px;" placeholder="请选择环境" v-model="formData.envId">
            <el-option v-for="item in optionEnv" :key="item.id" :label="item.envName" :value="item.id"/>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="还原点选择：" prop="dbId" required>
        <el-col :span="12">
          <el-select style="width:280px;" placeholder="请选择还原点" v-model="formData.dbId" @change="setTime">
            <el-option v-for="item in optionDb" :key="item.id" :label="item.dbName" :value="item.id"/>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="每秒最大请求数：" prop="period" required>
        <el-col :span="12" style="position: relative">
          <el-input type="number" :min="1"  v-model="formData.period " placeholder="请输入每秒最大请求数" style="width:280px;"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="重复执行次数：" prop="repeatNumber">
        <el-col :span="12">
          <el-input type="number" :min="1" v-model.number="formData.repeatNumber" placeholder="" style="width:280px;" ></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="重复执行截止时间：" prop="repeatEndTime">
        <el-col :span="12">
          <el-date-picker style="width:280px;" type="datetime" v-model="formData.repeatEndTime" placeholder="请选择回放结束时间"/>
        </el-col>
      </el-form-item>
      <el-row style="padding-right:70px;margin-bottom:5px;">
        <el-col :span="24">
          <el-col :span="15" style="margin-top:20px;">
             <el-button  style="background: #5bc0de; color: #fff;" type="primary" @click="addThreadTask('formData')">创建并发任务</el-button>
          </el-col>
          <el-table :data="testStressSceneThreadList" border style="width: 100%;margin-top:80px;">
            <el-table-column fixed="left" prop="testName" label="并发任务名称" align="center" min-width="200"/>
            <el-table-column prop="period" label="每秒最大请求数" align="center" min-width="130"/>
            <el-table-column prop="threads" label="并发线程数" align="center" min-width="120" />
            <el-table-column prop="logPath" label="日志文件名" min-width="380"/>
            <el-table-column fixed="right" label="启用" align="center" width="80">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.enableFlag" active-text="" inactive-text="" @change="changeEnableFlag(scope.row.id,scope.row.sceneId,scope.row.enableFlag)"></el-switch>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" min-width="80">
              <template slot-scope="scope">
                <div style="text-align: center;">
                  <el-button size="mini" type="primary" icon="icon iconfont icon-bianji" @click="threadTaskEditHandler(scope.$index, scope.row)"/>
                  <el-button size="mini" type="danger" icon="icon iconfont icon-iconfontshanchu1" style="margin-left: 0px;" @click="delPop(scope.row)"/>
                </div>
              </template>
            </el-table-column>       
          </el-table>
          <template>
            <div class="el-pagination__editor" style="margin-top: 20px;margin-right: 50px;text-align: right;">
              <el-pagination @current-change="pagination" :current-page.sync="pageNum" :page-size="pageRows"
                            layout="total, prev, pager, next" :total="pageTotal">
              </el-pagination>
            </div>
         </template>
        </el-col>
      </el-row>

      <el-row style="padding-right:70px;margin-bottom:40px;">
        <el-col :span="12" style="text-align: right;padding-right:150px;">
          <el-button type="primary" @click="submitForm('formData')" style="width: 100px;">提交</el-button>
        </el-col>
        <el-col :span="12">
          <el-button @click="back()" style="width: 100px;">返回</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-dialog title="并发任务" :visible.sync="visibleOfDialogForAddThreadTask">
      <el-form :model="threadTask" :rules="threadTaskRules" ref="threadForm">
        <el-form-item label="并发任务名称" label-width="160px" prop="testName">
          <el-input type="text" v-model="threadTask.testName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="每秒最大请求数：" label-width="160px" prop="period">
          <el-input type="number"  :min="1"  v-model="threadTask.period"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="并发线程数" label-width="160px" prop="threads">
          <el-input type="number" v-model="threadTask.threads" :min="1" auto-complete="off"></el-input>
        </el-form-item>
       
        <el-form-item label="重复执行策略" label-width="160px" prop="enlargedType">
          <el-select style="width:280px;" placeholder="请选择重复执行策略" v-model="threadTask.enlargedType">
              <el-option v-for="item in optionEnlargedType" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>

        <el-form-item label="重复等待时间" label-width="160px" prop="repeatWaitTime" v-if="threadTask.enlargedType=='byself'">
          <el-input type="number" v-model="threadTask.repeatWaitTime" :min="0" auto-complete="off"></el-input>
        </el-form-item>
  
        <el-form-item label="日志路径" label-width="160px" prop="logPath">
          <el-input type="text" :disabled="true" v-model="threadTask.logPath"></el-input>
        </el-form-item>
        <el-form-item label="日志文件" label-width="160px">
          <el-upload class="upload-demo" :multiple="false" :limit="1" drag 
            :action="uploadFileUrl"
            :on-success="uploadSuccess"
            :file-list="filelist"
            :before-upload="checkFile"
            :before-remove="delFile">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将日志文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>

        <el-form-item label="循环前置脚本" label-width="160px" prop="resetSql"  v-if="threadTask.enlargedType=='byself'">
            <el-input type="textarea" v-model="threadTask.resetSql" placeholder="请输入循环前置脚本"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="visibleOfDialogForAddThreadTask = false">取 消</el-button>
        <el-button type="primary" @click="addSceneThreadTask('threadForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    components: {
    },
    data() {
      var repeatNumberValidate = (rule, value, callback) => {
        if (value==null || value==='') {
          this.$refs.formData.validateField('repeatEndTime');
          callback();
        }else{
          this.$refs.formData.clearValidate('repeatEndTime');
          if(typeof value != 'number'){
            callback(new Error("重复执行次数只能是整数"));
            return;
          }
          if(value==0){
            callback(new Error("重复执行次数必须大于等于1"));
            return;
          }
          if(value%1 != 0){
            callback(new Error("重复执行次数只能是整数"));
            return;
          }
          callback();
        }
      };
      var repeatEndTimeValidate = (rule, value, callback) => {
        if (value==null || value=='') {
          if(this.formData.repeatNumber!=null && this.formData.repeatNumber!=''){
            this.$refs.formData.validateField('repeatNumber');
            callback();
          }else{
            this.$refs.formData.clearValidate('repeatNumber');
            callback(new Error("重复执行次数、截止时间不能同时为空"));
          }
        }else{
          callback();
        }
      };
      return {
        pageNum: 1,
        pageRows: 10,
        pageTotal: 0,
        projectCode: null,
        optionDb: [],
        filelist:[],
        optionEnv: [],
        optionEnlargedType:[
          {
              value: 'bygroup',
              label: '等待其它文件执行完一起重复执行'
          }, 
          {
              value: 'byself',
              label: '自己执行完就重复执行'
          }
        ],
        formData: {
          id: '',     
          sceneId:'',   
          sceneName: '',
          dbId: '',
          envId: '',
          repeatNumber: '',
          repeatEndTime: '',
          period: 50,
          threads: 0
        },
        testStressSceneThreadList: [
        ],
        visibleOfDialogForAddThreadTask:false,
        threadTask:{
          id:'',
          sceneId: '',
          testName: '',
          period: 50,
          enlargedType: '',
          repeatWaitTime:0,
          logPath: '',
          threads: 0,
          resetSql: ''
        },
        threadTaskRules:{
          testName: [
            {required: true, message: '请输入并发任务名称', trigger: 'blur'}
          ],
          period: [
            {required: true, message: '请输入每秒最大请求数', trigger: 'blur'}
          ],
          threads: [
            {required: true, message: '请输入并发线程数', trigger: 'blur'}
          ],
          enlargedType: [
            {required: true, message: '请选择重复执行策略', trigger: 'blur'}
          ],
          logPath: [
            {required: true, message: '请选择上传文件', trigger: 'blur'}
          ],
          repeatWaitTime: [
            {required: true, message: '请输入重复等待时间', trigger: 'blur'}
          ]
        },
        rules: {
          sceneName: [
            {required: true, message: '请压测场景名称', trigger: 'blur'}
          ],
          dbId: [
            {required: true, message: '请选择数据还原点', trigger: 'blur'}
          ],
          envId: [
            {required: true, message: '请选择待测应用环境', trigger: 'blur'}
          ],
          repeatNumber: [
            {validator: repeatNumberValidate, trigger: 'blur'}
          ],
          repeatEndTime: [
            {validator: repeatEndTimeValidate, trigger: 'change'}
          ],
          threads: [
            {required: true, message: '请创建并发任务', trigger: 'blur'}
          ],
          period: [
            {required: true, message: '请输入每秒最大请求数', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      pageTitle(){
        return this.$route.query.sceneId==null?'新增':'编辑';
      },
      uploadFileUrl(){
        //http://10.188.47.29:8080/project/kouan/testStressSceneThread/admin/uploadFile
        let url=process.env.API_ROOT;
        url=url + 'project/' + this.projectCode;
        url=url + '/testStress/admin/uploadFile';
        return url;
      }
    },
    created() {
      // 获取项目code
      this.projectCode = this.$api.sGetObject('_projectCode');
      this.$store.state.activeName2 = this.pageTitle+this.$route.name;
      this.loadDb();
      this.loadEnv();
      if(this.$route.query.sceneId){
        this.initForm();
      }
    },
    beforeDestroy() {
      this.$store.state.activeName2 = null;
    },
    methods: {
      // 根据数据源设置时间
      setTime(val) {
        this.optionDb.forEach((item) => {
          // console.log(item)
          if(item.id == val) {
            //this.formData.startTime = this.datetimeFormat(item.startTime);
          }
        })
      },
      pagination(val) {
        this.pageNum = val,
        this.querySceneThreadListBySceneId(this.formData.sceneId);
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
      changeEnableFlag(id,sceneId,flag) {
           let url = 'project/' + this.projectCode + '/testStress/admin/updateEnableFlag'; 
           let params={
              id: id,
              sceneId : sceneId,
              enableFlag: flag
            }; 
           this.$api.post(url, params, result => {
               
           });              
      },
      // 提交按钮
      saveForm() {
        this.formData.repeatEndTime=this.parseToDate(this.formData.repeatEndTime);   
        var url = 'project/' + this.projectCode + '/testStressScene/admin/updateTestStressScene';
        this.$api.post(url, this.formData, r => {
          // console.log(r);
          //this.$router.push("/PressureTest");
          if(r.status=='200'){
             window.history.back();
          }
        })
      },
      // 编辑初始化form
      initForm() {
        var url = 'project/' + this.projectCode + '/testStressScene/view/queryTestStressSceneBySceneId';
        this.$api.post(url, { sceneId: this.$route.query.sceneId }, result => {
          // console.log(r);
          this.formData.sceneId = result.data.sceneId;
          this.formData.sceneName = result.data.sceneName;
          this.formData.dbId = result.data.dbId;
          this.formData.envId = result.data.envId;
          this.formData.repeatEndTime = this.datetimeFormat(result.data.repeatEndTime);
          if(result.data.repeatNumber==0){
             this.formData.repeatNumber = '';
          }else{
            this.formData.repeatNumber = result.data.repeatNumber;
          }
          this.formData.period = result.data.period;

          this.querySceneThreadListBySceneId(this.formData.sceneId);
        });
      },
      querySceneThreadListBySceneId(sceneId){
        let url = 'project/' + this.projectCode + '/testStress/view/queryTestStressList';
        var params = {     
            "sceneId": sceneId,
            "pageNo": this.pageNum,
            "pageSize": this.pageRows
          };
        this.$api.post(url, params, result => {
          this.testStressSceneThreadList = result.data.rows;
          this.pageTotal = result.data.total;          
        });
      },
      addThreadTask(formName){
        this.formData.repeatEndTime=this.parseToDate(this.formData.repeatEndTime);
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = 'project/' + this.projectCode + '/testStressScene/admin/updateTestStressScene';
            this.$api.post(url, this.formData, result => {
                if(result.status==200){
                  this.formData.sceneId = result.data.sceneId;
                  //this.formData.threads=this.testStressSceneThreadList.length;
                  this.visibleOfDialogForAddThreadTask=true;   
                  this.filelist = [];               
                  this.threadTask.id = '';           
                  this.threadTask.sceneId= '',
                  this.threadTask.testName= '',
                  this.threadTask.period= this.formData.period ,
                  this.threadTask.logPath= '',
                  this.threadTask.resetSql= '',
                  this.threadTask.repeatWaitTime= '',
                  this.threadTask.threads= 1 ,
                  this.threadTask.enlargedType = 'bygroup'              
                }                 
            })
                     
          }else{
             console.log('error submit!!');
             return false;
          }
        });
      },
      threadTaskEditHandler(index, row) {  
          this.visibleOfDialogForAddThreadTask=true;
          this.threadTask.id = row.id;
          this.threadTask.sceneId = row.sceneId;
          this.threadTask.period = row.period;
          this.threadTask.enlargedType = row.enlargedType;
          this.threadTask.testName = row.testName;
          this.threadTask.threads = row.threads;
          this.threadTask.logPath = row.logPath;
          this.threadTask.repeatWaitTime = row.repeatWaitTime;
          this.threadTask.resetSql = row.resetSql;
      },
      delPop(row) {
        this.$confirm('', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this.threadTaskDeleteHandler(row)
        }).catch(() => {

        });
      },
      alertPop(sceneId) {        
          this.$alert('操作成功，点击确定返回', '提示', {
            confirmButtonText: '确定',
            callback: action => {
                this.visibleOfDialogForAddThreadTask=false;   
                this.querySceneThreadListBySceneId(sceneId);
            }
        }); 
      },
      //自定义弹出框
      alertMsg(msg,title) {
         this.$alert(msg, title, {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true
        }); 
      },
      threadTaskDeleteHandler(row) {
          let url = 'project/' + this.projectCode + '/testStress/admin/delTestStress';
           var p = {
              id:row.id,
              sceneId:row.sceneId,
              threads:row.threads,
              logPath: row.logPath,
              stressType:row.stressType          
          }
          this.$api.post(url, p, r => {
             this.initForm();
          })
      },
      addSceneThreadTask(formName){
         this.$refs[formName].validate((valid) => {
            if (valid) {
              let url = 'project/' + this.projectCode + '/testStress/admin/updateTestStressSceneThread';
              let params = null;
              if(this.threadTask.enlargedType=='byself'){
                params={
                  id:this.threadTask.id,
                  sceneId:this.formData.sceneId,
                  testName:this.threadTask.testName,
                  period: this.threadTask.period,
                  threads: this.threadTask.threads, 
                  enlargedType: this.threadTask.enlargedType,
                  logPath: this.threadTask.logPath,
                  repeatWaitTime: this.threadTask.repeatWaitTime,
                  resetSql: this.threadTask.resetSql               
                };
              }else{
                params={
                  id:this.threadTask.id,
                  sceneId:this.formData.sceneId,
                  testName:this.threadTask.testName,
                  period: this.threadTask.period,
                  threads: this.threadTask.threads, 
                  enlargedType: this.threadTask.enlargedType,
                  logPath: this.threadTask.logPath          
                };
              }
               this.$api.post(url, params, result => {
                  if(result.status==200){
                     this.alertPop(this.formData.sceneId);
                  }                 
              })
            }else{
               console.log('error submit!!');
               return false;
            }
         })
      },
      //文件上传成功
      uploadSuccess(response, file, fileList){
        let r=response;
        var p = {
              'name':r.data.fileName     
            };
        this.filelist.push(p);
        this.threadTask.logPath = r.data.url;
      },
      checkFile(file){
         let filename = file.name.substring(file.name.lastIndexOf(".")+1);
         if(filename!='log'){
            this.alertMsg('只允许上传log类型文件','提示');
            return false;
         }
      },
      delFile(file){
        var fileName = file.name;
        var p = {
           'fileName':fileName     
        };
        let url = 'project/' + this.projectCode + '/testStress/admin/delFile';
        this.$api.post(url, p, result => {
            if(result.status==200){
               this.alertMsg(result.message,"操作成功");
              }else{
               this.alertMsg(result.message,"操作失败");
              }                 
          })
      },
      // 提交
      submitForm(formName) {    
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveForm();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      back() {
        window.history.back();
      },
    },
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
