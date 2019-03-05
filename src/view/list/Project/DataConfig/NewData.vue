<template>
  <div class="new-test">
    <div class="title">
      {{pageTitle}}数据库还原点
      <span style="margin-left: 20px;font-size: 12px;">(执行测试前，将还原待测应用数据库，备份文件名格式yyyyMMdd<可选HHmmss>.sql。*为必填项)</span>
    </div>
    <el-form :model="formData" :rules="rules" ref="ruleForm" inline-message label-width="180px" class="new-project-form">
      <el-form-item label="还原点名称：" prop="dbName">
        <el-col :span="12">
          <el-input v-model="formData.dbName" @blur="repeat(formData.dbName)" placeholder="请输入还原点名称"></el-input>
        </el-col>
        <el-col v-if="tipName != 1" :span="2" style="color: #f66f65; margin-left: 10px;">名字已存在</el-col>
      </el-form-item>
      <el-form-item label="还原备份文件：" required>
        <el-col :span="12">
          <el-select placeholder="请选择还原备份文件" v-model="formData.dbBakPath" @change="setTime" style="width: 100%;">
            <el-option 
              v-for="item in optionDb"
              :key="item.dbBakPath"
              :label="item.dbBakPath+'-'+item.sqlDesc"
              :value="item.dbBakPath"
              :disabled="item.dbBakPath.length!=18">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label="回放开始时间：" required>
        <el-col :span="12">
          <el-input :disabled="true" v-model="formData.startTime" placeholder=""></el-input>
        </el-col>
      </el-form-item>


      <el-form-item label="数据库是否升级：" prop="dbIsUpdate">
        <el-col :span="12">
          <el-select  placeholder="请录入升级脚本" v-model="formData.isUpdate">
              <el-option v-for="item in optionUpdate" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item v-for="(base, index) in formData.updateDbList" :key="index" label="请录入版本信息" prop="updateSql"  v-if="formData.isUpdate=='1'">
            <!-- <el-row>
               <el-col :span="10">
                  <el-input v-model="base.dbName" style="width:50%;" placeholder="请录入数据库名称"></el-input>
              </el-col>
               <el-col :span="2">
            <div @click="delUpdateDbList(index)" style="cursor:pointer;margin-left: 10px;margin-top: 5px;width: 30px;height: 30px;border-radius: 20px;background: #d9534f;color: #fff;font-size: 36px;line-height: 24px;text-align: center;">-</div>
          </el-col>
          </el-row> -->
          <div style="margin-top:5px;"></div>
          <el-row>
           <el-col :span="12">
              <el-select v-model="base.dbName" placeholder="请选择">
                <el-option
                  v-for="item in selectDbList"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="2">
            <div @click="delUpdateDbList(index)" style="cursor:pointer;margin-left: 10px;margin-top: 5px;width: 30px;height: 30px;border-radius: 20px;background: #d9534f;color: #fff;font-size: 36px;line-height: 24px;text-align: center;">-</div>
          </el-col>
          </el-row>
          <div style="margin-top:5px;"></div>
          <el-row>
            <el-col :span="12">
              <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 8}" v-model="base.dbSql" placeholder="请录入升级脚本"></el-input>
            </el-col>
           </el-row>
      </el-form-item>
       <el-form-item >
        <el-col :span="12">
            <el-button v-if="formData.isUpdate=='0'" type="primary" @click="addUpdateDbList()"  disabled style="width: 100%;">添加</el-button>
            <el-button v-else type="primary" @click="addUpdateDbList()" style="width: 100%;">添加</el-button>
        </el-col>
      </el-form-item>
      <el-form-item style="border-top: 1px solid #eee;margin-right: 3%;">
        <el-col :span="12" style="text-align: center;padding-top: 20px;">
          <el-button type="primary" @click="submitForm('ruleForm')" style="width: 100px;" id="submitData" :disabled="this.lists.length==0">提交</el-button>
          <el-button @click="back()" style="width: 100px;">返回</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <div>
      <div class="title" style="margin-bottom:30px">回放日志文件列表</div>
      <el-table :data="lists" v-loading="listLoading" border stripe style="width: 95%;margin-left: 2%;margin-bottom: 20px;">
        <el-table-column label="日志文件名称" prop="fileUrl" align="left"  min-width="710"/>
        <el-table-column label="最后修改时间" prop="lastModified" align="center"  min-width="160"/>
        <el-table-column label="文件大小" prop="fileSize" align="center"  min-width="120"/>       </el-table>
    </div>
  </div>
</template>


<script>

  export default {
    components: {
    },
    data() {
      return {
        tipName: 1,
        optionDb: [],
        selectDbList:[],
        projectCode: null,
        formData: {
          dbName: '',
          dbBakPath: '',
          startTime: null,
          isUpdate:'0',
          updateSql:'',
          updateDbList: [],
          id: ''
        },
        rules: {
          dbName: [
            {required: true, message: '请输入数据源名称', trigger: 'blur'}
          ],
        },
        pageTitle:'新增',
        listLoading: false,
        lists:[],
        optionUpdate:[
          {
              value: '0',
              label: '数据库无变动'
          }, 
          {
              value: '1',
              label: '数据库升级'
          }
        ],
      }
    },
    computed: {
      projectRow(){
        return this.$store.state.projectRow;
      },
    },
    methods: {
      // 根据数据库备份设置时间
      setTime(val) {
        this.optionDb.forEach((item) => {
          if(item.dbBakPath === val) {
            this.formData.startTime = this.datetimeFormat(item.startTime);
            this.loadLog(item.startTime);
            var url = 'project/' + this.projectCode + '/dataSource/view/queryDbListBySqlfile';
            let params={
                  "dbBakPath":this.formData.dbBakPath
                }; 
            this.$api.post(url, params, r => {
              this.selectDbList = r.data;
            })
          }
        })
      },
      addUpdateDbList(){
        this.formData.updateDbList.push({});
      },
      delUpdateDbList(index){
        this.formData.updateDbList.splice(index,1);
      },
      // 获取数据源下拉框
      loadDb() {
        var self = this;
        var url = 'project/' + this.projectCode + '/dataSource/admin/getDbPathList';
        var p = {};
        self.$api.post(url, p, r => {
          // console.log(r);
          this.optionDb = r.data;
        })
      },
      // 获取日志回退列表
      loadLog(date) {
        var self = this;
        var url = 'project/' + this.projectCode + '/dataSource/admin/getLogList';
        var p = date;
        //console.log(date)
        self.$api.post(url, p, r => {
        this.lists = r.data;
        if(this.lists.length === 0){
        this.$message.error('当前日期不存在日志');
        }
        })
      },
      // 提交按钮
      loadData() {
        var url = 'project/' + this.projectCode + '/dataSource/admin/insertOrUpdateDataSource';
        console.log(this.formData.isUpdate);
        var p = null;
        if(this.formData.isUpdate==0){
           p = {
          "dbName": String.trim(this.formData.dbName),
          "dbBakPath": this.formData.dbBakPath,
          "isUpdate": this.formData.isUpdate,
          "startTime": this.datePrase(this.formData.startTime),
          "id": this.formData.id || ''
          } 
        }else{
           p = {
          "dbName": String.trim(this.formData.dbName),
          "dbBakPath": this.formData.dbBakPath,
          "isUpdate": this.formData.isUpdate,
          "updateDbList": this.formData.updateDbList,
          "startTime": this.datePrase(this.formData.startTime),
          "id": this.formData.id || ''
          } 
        }    
        // console.log(p)
        this.$api.post(url, p, r => {
          // console.log(r);
          this.$router.push("/DataConfig");
        })
      },
      repeat(val){
        if(val){
          var p = {
            "dbName": val,
            "id": this.formData.id || ''
          }
          // console.log(p)
          var url = 'project/' + this.projectCode + '/dataSource/admin/ifNotExistByDbName';
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
      this.loadDb();
      let dataEdit = this.$api.sGetObject('_dataEdit');
      if(dataEdit){
        this.formData.dbName = dataEdit.dbName;
        this.formData.dbBakPath = dataEdit.dbBakPath;
        this.formData.isUpdate = dataEdit.isUpdate;
        this.formData.startTime = this.datetimeFormat(dataEdit.startTime);
        this.formData.id = dataEdit.id;
        this.pageTitle = '编辑';
        dataEdit.updateDbList.forEach((item) => {
            if(item.dbName && item.dbSql){
              this.formData.updateDbList.push(item)
            }
        })
        this.loadLog(dataEdit.startTime);
      }
      this.$store.state.activeName2 = this.pageTitle+this.$route.name;
    },
    beforeDestroy() {
      sessionStorage.removeItem('_dataEdit');
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
