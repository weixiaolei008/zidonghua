<template>
  <div class="new-project">
    <el-form :model="formData" :rules="rules" ref="ruleForm" inline-message label-width="180px" class="new-project-form">
      <div class="title">编辑数据字典 <span style="margin-left: 20px;font-size: 12px;">(*为必填项)</span></div>
      <el-form-item label="类型代码：" prop="dictType">
        <el-col :span="14">
          <el-input :disabled="true" v-model="formData.dictType" placeholder="请输入类型代码"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="字典代码：" prop="dictCode">
        <el-col :span="14">
          <el-input v-model="formData.dictCode" :disabled="true"  placeholder="请输入字典代码"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="字典名称：" prop="dictName">
        <el-col :span="14">
          <el-input v-model="formData.dictName"  placeholder="请输入字典名称"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="字典描述：" prop="dictDesc">
        <el-col :span="14">
          <el-input :disabled="true" v-model="formData.dictDesc"  placeholder="请输入字典描述"></el-input>
        </el-col>
      </el-form-item>
      <!--<el-form-item label="排序：" prop="orderId">-->
        <!--<el-col :span="14">-->
          <!--<el-input v-model="formData.orderId"  placeholder="请输入排序"></el-input>-->
        <!--</el-col>-->
      <!--</el-form-item>-->
      <el-form-item label="状态：" prop="status">
        <el-col :span="14">
          <el-input :disabled="true" v-model="formData.status"  placeholder="请输入状态"></el-input>
        </el-col>
      </el-form-item>
      <!--<el-form-item label="状态：">-->
        <!--<el-radio-group v-model="formData.status">-->
          <!--<el-radio style="margin-left: 30px;width: 60px;" class="radio" :label="1">有效</el-radio>-->
          <!--<el-radio class="radio" :label="0">无效</el-radio>-->
        <!--</el-radio-group>-->
      <!--</el-form-item>-->

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
        projectCode:'',
        phoneVisible: false,
        emailVisible:false,
        formData: {
          dictType: '',
          dictCode: '',
          dictName: '',
          dictDesc: '',
          orderId: '',
          status: null
        },
        upList: [],
        rules: {
          dictType: [
            {required: true, message: '请输入类型代码', trigger: 'blur'}
          ],
          dictCode: [
            {required: true, message: '请输入字典代码', trigger: 'blur'}
          ],
          dictName: [
            {required: true, message: '请输入地点名称', trigger: 'blur'}
          ],
          dictDesc: [
            {required: true, message: '请输入字典描述', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
    },
    methods: {
      loadData() {
        this.formData.status = this.exchangeSet(this.formData.status);
        var p = {
          "dictType": this.formData.dictType,
          "dictCode": this.formData.dictCode,
          "dictName": this.formData.dictName,
          "dictDesc": this.formData.dictDesc,
          "orderId": this.formData.orderId,
          "status": this.formData.status
        }
        // console.log(p)
        this.$api.post('dict/'+this.projectCode+'/updateDictByCode', p, r => {
          // console.log(r);
          Message.success({
            message: '修改成功'
          })
          this.$router.push("/DataDictionary?id="+this.projectCode);
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loadData();
          } else {
            Message.error({
              message: 'error submit!!'
            })
            return false;
          }
        });
      },
      back() {
        window.history.back();
      },
      baseForm() {
        this.projectCode=this.$route.query.projectCode;
        var p = {
          dictCode:this.$route.query.id
        }
        // console.log(p)
        this.$api.post('dict/'+this.projectCode+'/queryDictByCode', p, r => {
          // console.log(r.data);
          this.formData.dictType = r.data.dictType;
          this.formData.dictCode = r.data.dictCode;
          this.formData.dictName = r.data.dictName;
          this.formData.dictDesc = r.data.dictDesc;
          this.formData.orderId = r.data.orderId;
          this.formData.status = this.exchangeGet(r.data.status);
        })
      },
      // 数字文字转换
      exchangeGet(val){
        return val === 0 ? '无效' : val === 1 ? '有效' : '';
      },
      exchangeSet(val){
        return val === '有效' ? 1 : val === '无效' ? 0 : null;
      }
    },
    created() {
      this.$store.state.activeName2 = this.$route.name;
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
