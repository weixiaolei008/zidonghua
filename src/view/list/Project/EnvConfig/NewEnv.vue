<template>
  <div class="new-test">
    <div class="title">{{pageTitle}}环境 <span style="margin-left: 20px;font-size: 12px;">(*为必填项)</span></div>
    <el-form :model="formData" :rules="rules" ref="ruleForm" inline-message label-width="180px" class="new-project-form">
      <div style="color: #bbb;line-height: 30px;">待测应用的网关</div>
      <el-form-item label="环境名称：" prop="envName">
        <el-col :span="12">
          <el-input v-model="formData.envName"  @blur="repeat(formData.envName)" placeholder="请输入环境名称"></el-input>
        </el-col>
        <el-col v-if="tipName != 1" :span="2" style="color: #f66f65; margin-left: 10px;">名字已存在</el-col>
      </el-form-item>
      <el-form-item label="待测网关：" prop="prefixUrl">
        <el-col :span="12">
          <el-input v-model="formData.prefixUrl" @blur="urlCheck(formData.prefixUrl)" placeholder="http://zuulip:port"></el-input>
        </el-col>
        <el-col v-if="urlVisible" :span="4" style="color: #f66f65; margin-left: 10px;">请输入正确url</el-col>
      </el-form-item>
      <!--<el-form-item label="待测网关用户名：" prop="gwUsername">
        <el-col :span="12">
          <el-input v-model="formData.gwUsername" placeholder="请输入待测网关用户名"></el-input>
        </el-col>
      </el-form-item>-->
      <!-- <el-form-item label="测试密码：" prop="gwPwd">
        <el-col :span="12">
          <el-input v-model="formData.gwPwd" placeholder="测试密码"></el-input>
        </el-col>
      </el-form-item> -->

      <!-- <div style="color: #bbb;line-height: 30px;">待测应用的数据库</div>
      <el-form-item label="IP：" prop="dbIp">
        <el-col :span="12">
          <el-input v-model="formData.dbIp" placeholder="请输入IP"></el-input>
        </el-col>
        &nbsp;&nbsp;<el-button  style="background: #5bc0de; color: #fff;" type="primary" @click="backUpList('ruleForm')">立即备份mysql</el-button>
      </el-form-item>
      <el-form-item label="PORT：" prop="dbPort">
        <el-col :span="12">
          <el-input v-model="formData.dbPort" placeholder="请输入PORT"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="用户名：" prop="dbUsername">
        <el-col :span="12">
          <el-input v-model="formData.dbUsername" placeholder="请输入用户名"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="密码：" prop="dbPwd">
        <el-col :span="12">
          <el-input v-model="formData.dbPwd" placeholder="请输入密码"></el-input>
        </el-col>
      </el-form-item> -->

      <div style="color: #bbb;line-height: 30px;">待测应用的redis备份</div>
      <el-form-item label="待测redis库：" prop="redisSrc">
        <el-col :span="4">
          <el-input v-model="formData.redisSrc.redisIp" placeholder="IP"></el-input>
        </el-col>
        <el-col :span="1" style="text-align: center;">-</el-col>
        <el-col :span="2">
          <el-input v-model="formData.redisSrc.redisHost" placeholder="Host"></el-input>
        </el-col>
        <el-col :span="1" style="text-align: center;">-</el-col>
        <el-col :span="2">
          <el-input v-model="formData.redisSrc.redisIndex" placeholder="Index"></el-input>
        </el-col>
        <el-col :span="1" style="text-align: center;">-</el-col>
        <el-col :span="3">
          <el-input v-model="formData.redisSrc.redisPass" placeholder="密码(选填)"></el-input>
        </el-col>
        &nbsp;<el-button  style="background: #5bc0de; color: #fff;" type="primary" :disabled="redisDisabled" @click="backUpRedis()">立即备份redis</el-button>
      </el-form-item>
      <el-form-item label="待测codis库：" prop="codisSrc">
        <el-col :span="7">
          <el-input v-model="formData.codisSrc.zkAddress" placeholder="ZkAddress"></el-input>
        </el-col>
        <el-col :span="1" style="text-align: center;">-</el-col>
        <el-col :span="2">
          <el-input v-model="formData.codisSrc.envName" placeholder="环境"></el-input>
        </el-col>
        <el-col :span="1" style="text-align: center;">-</el-col>
        <el-col :span="3">
          <el-input v-model="formData.codisSrc.namespace" placeholder="namespace"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="存储库：" prop="redisTarget">
        <!--<el-col :span="12">
          <el-input v-model="formData.redisTarget" placeholder="请输入本地备份复制库：ip-host-index-password"></el-input>
        </el-col>-->
        <el-col :span="4">
          <el-input v-model="formData.redisTarget.redisIp" placeholder="IP"></el-input>
        </el-col>
        <el-col :span="1" style="text-align: center;">-</el-col>
        <el-col :span="2">
          <el-input v-model="formData.redisTarget.redisHost" placeholder="Host"></el-input>
        </el-col>
        <el-col :span="1" style="text-align: center;">-</el-col>
        <el-col :span="2">
          <el-tooltip class="item" effect="dark" content="请确保和其他环境配置保持不一致" placement="top">
            <el-input v-model="formData.redisTarget.redisIndex" placeholder="Index"></el-input>
          </el-tooltip>
        </el-col>
        <el-col :span="1" style="text-align: center;">-</el-col>
        <el-col :span="3">
          <el-input v-model="formData.redisTarget.redisPass" placeholder="密码(选填)"></el-input>
        </el-col>
      </el-form-item>

    <div style="color: #bbb;line-height: 30px;">待测应用数据库</div>
      <el-form-item>
        <el-col :span="16">
          <el-tag>总磁盘空间:{{total}}</el-tag>
          <el-tag type="success">已使用:{{used}}</el-tag>
          <el-tag type="info">使用率达:{{useRate}}</el-tag>
       </el-col>
      </el-form-item>
      <el-form-item prop="" v-for="(base, index) in databaseList" :key="index">
        <el-col :span="3">
          <el-input v-model="base.dbIp" placeholder="ip"></el-input>
        </el-col>
        <el-col :span="1" style="text-align: center;">-</el-col>
        <el-col :span="2">
          <el-input v-model="base.dbPort" placeholder="端口"></el-input>
        </el-col>
        <el-col :span="1" style="text-align: center;">-</el-col>
        <el-col :span="3">
          <el-input v-model="base.dbUsername" placeholder="用户"></el-input>
        </el-col>
        <el-col :span="1" style="text-align: center;">-</el-col>
        <el-col :span="3">
          <el-input v-model="base.dbPwd" placeholder="密码"></el-input>
        </el-col>
        <el-col :span="1" style="text-align: center;">-</el-col>
         <el-col :span="2">
          <el-input v-model="base.dbBasename" placeholder="数据库名"></el-input>
        </el-col>
        <el-col :span="1">
          <div @click="delDatabase(index)" style="cursor:pointer;margin-left: 10px;margin-top: 5px;width: 30px;height: 30px;border-radius: 20px;background: #d9534f;color: #fff;font-size: 36px;line-height: 24px;text-align: center;">-</div>
        </el-col>
        <el-col :span="1">
          <div @click="copyDatabase(index)" style="cursor:pointer;margin-left: 10px;margin-top: 5px;width: 30px;height: 30px;border-radius: 20px;background: #d9534f;color: #fff;font-size: 20px;line-height: 24px;text-align: center;">检</div>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="6">
          <el-button type="primary" @click="addDatabase()" style="width: 100%;">添加</el-button>
        </el-col>
          <el-col :span="4">
            &nbsp;</el-col>
        <el-col :span="6">
          <el-button type="success" @click="copyAllDatabase()"  :disabled="dbDisabled" style="width: 100%;">备份全部</el-button>
        </el-col>
      </el-form-item>

      <div style="color: #bbb;line-height: 30px;">请求Header</div>
      <el-form-item prop="" v-for="(item, index) in headerlList" :key="index">
        <el-col :span="6">
          <el-input v-model="item.headerName" placeholder="请输入..."></el-input>
        </el-col>
        <el-col :span="1" style="text-align: center;">:</el-col>
        <el-col :span="8">
          <el-input v-model="item.headerValue" placeholder="请输入..."></el-input>
        </el-col>
        <el-col :span="1">
          <div @click="delHeader(index)" style="cursor:pointer;margin-left: 10px;margin-top: 5px;width: 30px;height: 30px;border-radius: 20px;background: #d9534f;color: #fff;font-size: 36px;line-height: 24px;text-align: center;">-</div>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="16">
          <el-button type="primary" @click="addHeader()" style="width: 100%;">添加</el-button>
        </el-col>
      </el-form-item>
      <el-form-item style="border-top: 1px solid #eee;margin-right: 3%;">
        <el-col :span="12" style="text-align: center;padding-top: 20px;margin-bottom: 30px;">
          <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100px;">提交</el-button>
          <el-button @click="back()" style="width: 100px;">返回</el-button>
        </el-col>
      </el-form-item>
    </el-form>

    <el-dialog title="检查数据库连接" :visible.sync="backUpMenu" >
        
        <el-checkbox-group v-model="checkedBase" :checked="false" v-if="baseList[0]!=null">
          <el-checkbox style="margin-top:10px;margin-left:10px;" v-for="base in baseList[0].listData" :label="base" :key="base"  border>{{base}}</el-checkbox>
        </el-checkbox-group>

      <div slot="footer" class="dialog-footer">
        <el-button @click="backUpMenu = false">取 消</el-button>
        <!-- <el-button type="primary" @click="backUpCommit()">确 定</el-button> -->
      </div>
    </el-dialog>

     <!-- <el-dialog title="备份过程中" :visible.sync="backUpRun" >
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="backUpRun = false">确 定</el-button>
      </div>
    </el-dialog> -->

  </div>
</template>

<script>

  export default {
    components: {
    },
    data() {
      return {
        backUpMenu:false,
        urlVisible: false,
        tipName: 1,
        projectCode: null,
        total:'',
        used:'',
        useRate:'',
        redisDisabled: false,
        dbDisabled: false,
        formData: {
          envName: '',
          prefixUrl: '',
          gwUsername: '',
          gwPwd: 'admin',
          dbIp: '',
          dbPort: '',
          dbUsername: '',
          dbPwd: '',
          id: '',
          projectId:'',
          redisSrc:{
            redisIp: '',
            redisHost: '',
            redisIndex: '',
            redisPass: ''
          },
          codisSrc:{
            zkAddress:'',
            envName:'',
            namespace:''
          },
          redisTarget:{
            redisIp: '',
            redisHost: '',
            redisIndex: '',
            redisPass: ''
          }
        },
        baseList:[],
        checkedBase:[],
        headerlList: [],
        databaseList: [],
        rules: {
          envName: [
            {required: true, message: '请输入环境名称', trigger: 'blur'}
          ],
          prefixUrl: [
            {required: true, message: '请输入前置URL', trigger: 'blur'}
          ],
          gwUsername: [
            {required: false, message: '请输入待测网关用户名', trigger: 'blur'}
          ],
          // gwPwd: [
          //   {required: true, message: '请输入待测网关密码', trigger: 'blur'}
          // ],
          // dbIp: [
          //   {required: true, message: '请输入IP', trigger: 'blur'}
          // ],
          // dbPort: [
          //   {required: true, message: '请输入PORT', trigger: 'blur'}
          // ],
          // dbUsername: [
          //   {required: true, message: '请输入用户名', trigger: 'blur'}
          // ],
          // dbPwd: [
          //   {required: true, message: '请输入密码', trigger: 'blur'}
          // ],
          redisSrc: [
            {required: true, message: '请输入待测redis库', trigger: 'blur'}
          ],
          redisTarget: [
            {required: true, message: '请输入本地备份redis复制库', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      projectRow(){
        return this.$store.state.projectRow;
      },
      pageTitle(){
        return this.$route.query.id==null?'新增':'编辑';
      }
    },
    methods: {
      // url格式
      urlCheck(val) {
        if(val){
          var reg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/; //验证规则
          if(reg.test(val)){
            this.urlVisible = false;
          }else{
            this.urlVisible = true;
          }
        }else{
          this.urlVisible = false;
        }
      },
      backUpList(formName){
          this.baseList = '';
          this.$refs[formName].validate((valid) => {
          if (valid) {
              this.backUpMenu=true;
              var url = 'project/' + this.projectCode + '/environment/view/queryDataBaseList';
              var p = {
                  "dbIp": String.trim(this.formData.dbIp),
                  "dbPort": String.trim(this.formData.dbPort),
                  "dbUsername": String.trim(this.formData.dbUsername),
                  "dbPwd": String.trim(this.formData.dbPwd)
              }
              this.$api.post(url, p, r => {
              this.baseList = r.data;
              })
            }else{
            console.log('error submit!!');
            return false;
           }
         });        
       },
      backUpRedis() {
        if (this.formData.redisTarget.redisIndex == 0) {
          this.$message({
            message: '存储库Index禁止为：0',
            type: 'warning'
          });
          return;
        }
        this.$confirm('是否备份redis/codis数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.redisDisabled = true;
          var url = 'project/' + this.projectCode + '/environment/admin/backUpRedis';
          var p = {
            "redisSrc": JSON.stringify(this.formData.redisSrc),
            "redisTarget": JSON.stringify(this.formData.redisTarget),
            "codisSrc": JSON.stringify(this.formData.codisSrc)
          };
          this.$message({
            type: 'info',
            message: '过程较长，请耐心等待！'
          });
          this.$api.post(url, p, r => {
            if (r.data == "1") {
              this.$message({
                message: '备份redis/codis成功',
                type: 'success',
                duration: 0,
                showClose:true
              });
            } else {
              this.$message({
                type: 'error',
                message: '备份redis/codis失败!'
              });
            }

          })


        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消备份'
          });
        });
      },
      alertPop(msg,title) {        
          this.$alert(msg, title, {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
        }); 
      },
      backUpCommit(){
        var url = 'project/' + this.projectCode + '/environment/admin/backUpDatabase';
        if(this.checkedBase.length==0){
          this.alertPop('请至少选择一个数据库','提示');
          return false;
        }
        
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        var p = {
            "dbIp": String.trim(this.dbIp),
            "dbPort": String.trim(this.dbPort),
            "dbUsername": String.trim(this.dbUsername),
            "dbPwd": String.trim(this.dbPwd),
            "databases":this.checkedBase,
            "projectId":String.trim(this.formData.projectId)
        }
        this.$api.post(url, p, r => {
            this.backUpMenu=false;
            loading.close();       
            this.alertPop('<p>备份路径:</p>'+r.data,'备份成功');
        })
      },
      addHeader() {
        this.headerlList.push({});
      },
      delHeader(index){
        this.headerlList.splice(index,1);
      },
      addDatabase() {
        this.databaseList.push({});
      },
      delDatabase(index){
        this.databaseList.splice(index,1);
      },
      copyDatabase(index){
        console.log( this.databaseList[index]);
            this.baseList = '';
            this.backUpMenu=true;
            var url = 'project/' + this.projectCode + '/environment/view/queryDataBaseList';
            var p = {
                  "dbIp": String.trim(this.databaseList[index].dbIp),
                  "dbPort": String.trim(this.databaseList[index].dbPort),
                  "dbUsername": String.trim(this.databaseList[index].dbUsername),
                  "dbPwd": String.trim(this.databaseList[index].dbPwd),
                  "dbBasename": String.trim(this.databaseList[index].dbBasename)
                }
              this.$api.post(url, p, r => {
              this.baseList = r.data;
              })   
            this.dbIp =  this.databaseList[index].dbIp;   
            this.dbPort =  this.databaseList[index].dbPort; 
            this.dbUsername =  this.databaseList[index].dbUsername; 
            this.dbPwd =  this.databaseList[index].dbPwd;  
            this.dbBasename =  this.databaseList[index].dbBasename;  
      },
      queryLinuxData(){
            var p = {}
            var url = 'project/' + this.projectCode + '/environment/view/queryLinuxSpace';
            this.$api.post(url,p, r => {
              console.log(r);
              this.total = r.data.total;
              this.used = r.data.used;
              this.useRate = r.data.useRate;
            })
      },
      copyAllDatabase(){
        this.$prompt('请输入自定义备注', '备份sql说明', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
           this.dbDisabled = true;
           var url = 'project/' + this.projectCode + '/environment/view/backupAllDataBase';
            var p = {
                  "databaseList": this.databaseList,
                  "projectId":String.trim(this.formData.projectId),
                  "gwPwd":value
                }
          this.$message({
            type: 'info',
            message: '过程较长，请耐心等待！'
          });
          this.$api.post(url, p, r => {
            if (r.data.length>0) {
              this.$message({
                message: '备份数据库成功，文件位置-->'+r.data,
                type: 'success',
                duration: 0,
                showClose:true
              });
            } else {
              this.$message({
                type: 'error',
                message: '备份数据库失败!'
              });
            }

          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消备份'
          });
        });     
      },
      // 提交按钮
      loadData() {
        var url = 'project/' + this.projectCode + '/environment/admin/insertOrUpdateEnvAndEnvHeader';
        var p = {
          "envName": String.trim(this.formData.envName),
          "prefixUrl": String.trim(this.formData.prefixUrl),
          "gwUsername": String.trim(this.formData.gwUsername),
          "gwPwd": String.trim(this.formData.gwPwd),
          // "dbIp": String.trim(this.formData.dbIp),
          // "dbPort": String.trim(this.formData.dbPort),
          // "dbUsername": String.trim(this.formData.dbUsername),
          // "dbPwd": String.trim(this.formData.dbPwd),
          "redisSrc": JSON.stringify(this.formData.redisSrc),
          "redisTarget": JSON.stringify(this.formData.redisTarget),
          "codisSrc": JSON.stringify(this.formData.codisSrc),
          "headerlList": this.headerlList,
          "databaseList": this.databaseList,
          "id": this.formData.id || '',
        }
        console.log(p)
        this.$api.post(url, p, r => {
          // console.log(r);
          this.$router.push("/EnvConfig");
        })
      },
      // 编辑初始化form
      baseForm() {
        var self = this;
        var url = 'project/' + this.projectCode + '/environment/admin/getEnvById';
        var p = {
          id: this.$route.query.id
        };
        // console.log(p);
        self.$api.post(url, p, r => {
          this.formData.envName = r.data.envName;
          this.formData.prefixUrl = r.data.prefixUrl;
           this.formData.gwUsername = r.data.gwUsername;
          this.formData.gwPwd = r.data.gwPwd;
          this.formData.dbIp = r.data.dbIp;
          this.formData.dbPort = r.data.dbPort;
          this.formData.dbUsername = r.data.dbUsername;
          this.formData.dbPwd = r.data.dbPwd;
          this.formData.projectId = r.data.projectId;
          this.formData.redisSrc = JSON.parse(r.data.redisSrc);
          this.formData.redisTarget = JSON.parse(r.data.redisTarget);
          this.formData.codisSrc = JSON.parse(r.data.codisSrc);
          r.data.headerlList.forEach((item) => {
            if(item.headerName && item.headerValue){
              this.headerlList.push(item)
            }
          })
          r.data.databaseList.forEach((item) => {
            if(item.dbIp && item.dbPort&& item.dbUsername&& item.dbPwd&& item.dbBasename){
              this.databaseList.push(item)
            }
          })
          // this.headerlList = r.data.headerlList;
          this.formData.id = r.data.id;
        })
      },
      repeat(val){
        if(val){
          var p = {
            "envName": val,
            "id": this.formData.id || ''
          }
          // console.log(p)
          var url = 'project/' + this.projectCode + '/environment/admin/ifNotExistByEnvName';
          this.$api.post(url, p, r => {
            // console.log(r);
            this.tipName = r.data;
          })
        }else{
          this.tipName = 1;
        }
      },
      // 提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && !this.urlVisible) {
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
      this.queryLinuxData();
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
