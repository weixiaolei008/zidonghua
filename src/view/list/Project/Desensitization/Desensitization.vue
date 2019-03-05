<!--脱敏配置-->
<template>
  <div class="desensitization">
    <div class="title">
      数据脱敏
      <span style="margin-left: 20px;font-size: 12px;">(执行测试前，将在待测应用的数据库上，运行以下SQL，清除敏感数据。)</span>
    </div>
    <el-row style="line-height: 50px;margin-bottom: 20px;">
      <el-col :span="4" style="text-align: right;margin-right: 30px;">
        脱敏方式
      </el-col>
      <el-col :span="12">
        <el-radio-group v-model="maskType ">
          <el-radio :label="2">指定字段</el-radio>
          <el-radio :label="1">SQL脚本</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <div v-if="maskType == 2">
      <el-row v-show="list2.length" v-for="(item, index) in list2" :key="index" style="margin-bottom: 20px;">
        <el-col :span="5" style="margin-left: 18%;margin-right: 20px;">
          <el-input v-model="item.dbName" placeholder="请输入数据库"></el-input>
        </el-col>
        <el-col :span="4" style="margin-right: 20px;">
          <el-input v-model="item.tableName" placeholder="请输入表"></el-input>
        </el-col>
        <el-col :span="5">
          <el-input v-model="item.fieldName" placeholder="请输入字段"></el-input>
        </el-col>
        <el-col :span="1">
          <div @click="del(index)" style="cursor:pointer;margin-left: 10px;margin-top: 5px;width: 30px;height: 30px;border-radius: 20px;background: #d9534f;color: #fff;font-size: 36px;line-height: 24px;text-align: center;">-</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16" style="margin-left: 18%;margin-bottom: 30px;">
          <el-button @click="add()" style="width: 100%;background: #5bc0de; color: #fff;">添加</el-button>
        </el-col>
      </el-row>
    </div>
    <div v-if="maskType == 1">
      <el-row style="margin-bottom: 20px;line-height: 40px;" >
        <el-col :span="2" style="margin-left: 18%;margin-right: 20px;">脱敏脚本</el-col>
        <el-col :span="10" style="margin-right: 20px;">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 8}" v-model="list1[0].sqlScript" placeholder="请输入脱敏脚本"></el-input>
        </el-col>
        <el-col :span="4">
        </el-col>
      </el-row>
    </div>
    <el-row style="border-top: 1px solid #eee;margin-right: 3%;margin-left: 3%;">
      <el-col :span="20" style="text-align: center;padding-top: 30px;margin-bottom: 30px;">
        <el-button type="primary" @click="submitForm()" style="width: 100px;background: #5bc0de;">提交</el-button>
        <el-button @click="back()" style="width: 100px;">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Message } from 'element-ui'
  export default {
    components: {
    },
    data() {
      return {
        maskType : 0,
        maskId: '',
        projectCode: null,
        list2: [],
        list1: [{}]
      }
    },
    computed: {
    },
    watch: {
      // maskType(val){
      //   if(val == 1){
      //     this.list1 = [{}]
      //   }
      // }
    },
    methods: {
      add() {
        this.list2.push({});
      },
      del(index){
        this.list2.splice(index,1);
      },
      // 提交按钮
      loadData() {
        var url = 'project/' + this.projectCode + '/ruleMasking/admin/addOrUpdateRuleMasking';
        var p = null;
        if(this.maskType == 2){
          p = {
            "maskType": this.maskType,
            "detailList": this.list2,
            "id": this.maskId
          }
        }else if(this.maskType == 1){
          p = {
            "maskType": this.maskType,
            "detailList": this.list1,
            "id": this.maskId
          }
        }
        console.log(p)
        this.$api.post(url, p, r => {
          // console.log(r);
          this.maskType = r.data.maskType;
          if(this.maskType == 2){
            this.list2 = [];
            this.list1 = [{}];
            this.list2 = r.data.detailList;
          }else if(this.maskType == 1){
            this.list1 = [{}];
            this.list2 = [];
            this.list1[0].sqlScript = r.data.detailList[0].sqlScript;
          }
        })
      },
      baseData() {
        var url = 'project/' + this.projectCode + '/ruleMasking/view/findRuleMaskingByProjectId';
        var p = {}
        this.$api.post(url, p, r => {
          // console.log(r)
          if(r.data){
            this.maskType = r.data.maskType;
            if(this.maskType == 2){
              this.list2 = [];
              r.data.detailList.forEach((item)=>{
                if(item.dbName && item.tableName && item.fieldName){
                  this.list2.push(item)
                }
              })
            }else if(this.maskType == 1){
              this.list1 = [{}];
              this.list1[0].sqlScript = r.data.detailList[0].sqlScript;
            }
            this.maskId = r.data.id;
          }else{
            Message.error({
              message: '暂无配置，请新增，'
            })
          }
        })
      },
      // 提交{
      submitForm() {
        var a = true;
        if(this.maskType == 2){
          this.list2.forEach((item)=>{
            if(!item.dbName || !item.tableName || !item.fieldName){
              a = false;
              this.$message.error('数据库|表|字段全部必填');
            }else{
            }
          })
        } else if(this.maskType == 1){
          if(!this.list1[0].sqlScript){
            a = false;
            this.$message.error('脱敏脚本不能为空');
          }
        }
        if(a){
          this.loadData();
          this.$message({message: '保存成功',type: 'success'});
        }
      },
      back() {
        window.history.back();
      }
    },
    created() {
      // 获取项目code
      this.projectCode = this.$api.sGetObject('_projectCode');
      this.baseData();
      this.$store.state.activeMenu = this.$route.path;
      this.$store.state.activeName = this.$route.name;
    }
  }

</script>

<style lang="scss" scoped>
.desensitization{
  .title{
    margin-top: 30px;
    margin-left: 2%;
    font-size: 24px;
    color: #999999;
  }
}
</style>
