<template>
  <el-row class="header-style">
    <el-col :span ='2'>
      <div class=circle @click='changeCollapse'>
        <i class="icon iconfont icon-caidan"></i>
      </div>
    </el-col>
    <!--<el-col :span ='1' class="message">-->
      <!--<i class='icon iconfont icon-tongzhi1'></i>-->
      <!--<span>{{3}}</span>-->
    <!--</el-col>-->
    <!--<el-col :span ='16' class='search'>-->
      <!--<el-input v-if="searchVisible" style="width: 20%;" v-model="searchVal" placeholder="请输入查询内容"></el-input>-->
      <!--<i class='icon iconfont icon-sousuo' @click="searchVisible = !searchVisible"></i>-->
    <!--</el-col>-->
    <el-col :span='4' style="margin-left: 75%;">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" src="../../common/img/user.png" v-if="this.userImgSrc==''">
          <img class="user-avatar" :src="this.userImgSrc" v-else>
          <span class="user-name">{{user.userId}}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <el-dropdown-menu slot="dropdown" style="width: 160px;" >
          <router-link to="/ResetPwd">
            <el-dropdown-item>
              <div>修改密码</div>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <div @click="userDiv">个人中心</div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div @click="clearPop">退出</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>

<el-dialog title="个人中心" :visible.sync="dialogTableVisible">
   <el-form :model="user"  ref="userForm">
        <el-form-item label="账号" label-width="160px" prop="userId" >
          <el-input type="text" v-model="userDesc.userId" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" label-width="160px" prop="userName">
          <el-input type="text" v-model="userDesc.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="160px" prop="mobilenum">
          <el-input type="text" v-model="userDesc.mobilenum" auto-complete="off"></el-input>
        </el-form-item>
          <el-form-item label="邮箱" label-width="160px" prop="email">
          <el-input type="text" v-model="userDesc.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像路径" label-width="160px" prop="userImg">
          <el-input type="text" disabled v-model="userDesc.userImg"></el-input>
        </el-form-item>
        <el-form-item label="上传头像" label-width="160px">
          <el-upload class="upload-demo" :multiple="false" :limit="1" drag 
            :action="uploadFileUrl"
            :on-success="uploadSuccess"
            :before-upload="checkFile"
            :file-list="filelist">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将头像图片拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
    </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUserDesc()">提 交</el-button>
       </div>
</el-dialog>

  </el-row>
</template>


<script>
  import api from './../../common/js/index'
  export default {
    data() {
      return {
        searchVisible: false,
        user: null,
        searchVal: '',
        dialogTableVisible:false,
        filelist:[],
        userImgSrc:'',
        userDesc:{
          userId:'',
          userName:'',
          mobilenum:'',
          email:'',
          userImg:''
        }
      }
    },
    computed: {
        uploadFileUrl(){
          //http://10.188.47.29:8080/project/kouan/testStressSceneThread/admin/uploadFile
          let url=process.env.API_ROOT;
          url=url + 'user/admin/uploadFile';
          return url;
          }
      },
    methods: {
      changeCollapse() {
        this.$store.state.isCollapse = !this.$store.state.isCollapse;
        this.$api.sSetObject('_isCollapse', this.$store.state.isCollapse);
      },
      updateUserDesc(){
           let url = 'user/updateUserDescByUserId'; 
           let params={
              "loginId":this.user.userId,
              "userName": this.userDesc.userName,
              "email": this.userDesc.email,
              "mobilenum": this.userDesc.mobilenum,
              "userImg": this.userDesc.userImg
            }; 
          this.$api.post(url, params, r => {
             if(r.data==1){
                this.$message({
                  message: '用户信息更新成功',
                  type: 'success'
                });
                 this.dialogTableVisible = false;
                 this.userImgSrc = this.userDesc.userImg;
                 //window.location.reload();
             }else{
                this.$message.error('用户信息更新异常');
             }
          })
      },
      userDiv() {
        this.userDesc.userName ='';
        this.userDesc.mobilenum ='';
        this.userDesc.email ='';
        this.userDesc.userImg ='';
        this.filelist = [];   
        this.dialogTableVisible = true;
        this.userDesc.userId = this.user.userId;
        let url = 'user/queryUserDescByLoginId'; 
        let params={
              "loginId":this.user.userId
            }; 
        this.$api.post(url, params, r => {
          this.userDesc.userName = r.data.userName;
          this.userDesc.mobilenum = r.data.mobilenum;
          this.userDesc.email = r.data.email;
          this.userDesc.userImg = r.data.userImg;
        })
      },
      checkFile(file){
         let filename = file.name.substring(file.name.lastIndexOf(".")+1);
         const isLt2M = file.size / 1024 / 1024 < 2;
         if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          return false;
         }
         if(filename=='png'||filename=='jpg'){
            return true;
         }else{
           this.alertMsg('只允许上传图片类型文件','提示');
          return false;
         }
      },
      uploadSuccess(response, file, fileList){
        let r=response;
        var p = {
              'name':r.data.fileName     
            };
        this.filelist.push(p);
        this.userDesc.userImg = 'data:image/png;base64,'+r.data.url;
      },
      delFile(file){
        let last = file.name.substring(file.name.lastIndexOf(".")+1);
         if(last!='png'||last!='jpg'){
            return true;
         }
        var fileName = file.name;
        var p = {
           'fileName':fileName     
        };
        let url = 'user/admin/delFile';
        this.$api.post(url, p, result => {
            if(result.status==200){
               this.alertMsg(result.message,"操作成功");
              }else{
               this.alertMsg(result.message,"操作失败");
              }                 
          })
      },
       //自定义弹出框
      alertMsg(msg,title) {
         this.$alert(msg, title, {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true
        }); 
      },
      clearPop() {
        this.$confirm('', '退出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this.userClear()
        }).catch(() => {

        });
      },
      userClear(){
        sessionStorage.clear();
        this.$router.push("/");
        // window.location.reload();
      }
    },
    created: function () {
      this.user = api.sGetObject("_user");
      let url = 'user/queryUserDescByLoginId'; 
        let params={
              "loginId":this.user.userId
            }; 
        this.$api.post(url, params, r => {
          if(r.data.userImg!=""&&r.data.userImg!=null){
            this.userImgSrc = r.data.userImg;
          }
        })
    }
  }
</script>
<style lang='scss' scoped>
  .header-style{
    width: 100%;
    height: 60px;
    background: #ffffff;
    position: relative;
    .circle{
      width: 40px;
      height: 40px;
      border-radius: 20px;
      background: #f44336;
      text-align: center;
      line-height: 40px;
      margin-top: 10px;
      margin-left: 15px;
      color: #fff;
    }
    .search{
      color: #ababab;
      font-size: 16px;
      line-height: 60px;
    }
    .message{
      position: relative;
      color: #ababab;
      font-size: 22px;
      line-height: 60px;
      span{
        position: absolute;
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background: #00aced;
        line-height: 20px;
        color: #fff;
        text-align: center;
        top: 10px;
        left: 15px;
        font-size: 12px;
      }
    }
    .avatar-container {
      height: 60px;
      position: relative;
      .avatar-wrapper {
        cursor: pointer;
        color: #fff;
        .user-name{
          display: inline-block;
          color: #f88c84;
          font-size: 18px;
          line-height: 60px;
          color: #6a7584;
          height: 60px;
          color: #f66f65;
        }
        .user-avatar {
          margin-top: 10px;
          vertical-align: top;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-arrow-down {
          position: relative;
          top: -5px;
          display: inline-block;
          margin-left: 10px;
          color: #52d1e2;
          font-size: 12px;
        }
      }
    }
  }

</style>
