<template>
  <div class="function-test-play">
    <el-row style="margin-top: 30px; margin-left: 2%;margin-right: 2%;padding-bottom: 30px;border-bottom: 1px solid #eee;">
      <el-col :span="2">
        <el-button type="primary" @click="play" :disabled="startDisabled">开始执行</el-button>
      </el-col>
      <el-col :span="2" style="margin-left: 2%;">
        <el-button type="" @click="back">返回</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 30px;margin-left: 2%; line-height: 20px;" v-for="(item, index) in lists" :key="index">
      <el-col :span="3" style="text-align: right;">
        {{item.name}}
      </el-col>
      <el-col :span="12" style="margin-left: 30px;position: relative;height: 20px;">
        <div class="bc-bar"></div>
        <!--<div class="bar" :style="`width: ${item.num}%;`"></div>-->
        <div class="play" v-if="item.status==1" :style="{background:item.status==2 ? '#8bc34a' : item.status==1 ? '#ffca28' : item.num==0 ?'#f66c36' :''}"></div>
        <div class="bar" v-else :style="{background:item.status==2 ? '#8bc34a' : item.status==1 ? '#ffca28' : item.num==0 ?'#f66c36' :''}"></div>
      </el-col>
      <el-col :span="2" style="margin-left: 30px;" :style="{color:item.status==2 ? '#8bc34a' : item.status==1 ? '#ffca28' : item.status==0 ?'#f66c36' :''}">
        {{item.status == 2 ? '完成' : item.status== 1 ? '进行中' : item.status==0 ? '未开始' : ''}}
      </el-col>
    </el-row>
    <div id="log" class="log">
    </div>
  </div>
</template>

<script> 
    export default {
      components: {
      },
      data() {
        return {
          message: '',
          stompClient:null,
          projectCode: null,
          lists: [
            {
              name: '恢复数据库：',
              status:''
            },
            {
              name: '载入测试数据：',
              status:''
            },
            {
              name: '载入数据接口：',
              status:''
            },
            {
              name: '测试执行：',
              status:''
            },
            {
              name: '输出测试结果：',
              status:''
            }
          ],
          startDisabled: false,
          startPrepareLoading: null,
        }
      },
      computed: {
      },
      methods: {
        loadData(){
          var _this = this;
          var url = 'project/' + this.projectCode + '/testFunc/execute'
          var p = {
            "id": this.$route.query.id
          }
          _this.$api.post(url, p, r => {
            if(r.data==null){
              // this.openSocket();
              return;
            }
            
            if(r.data.projectCode!=null && r.data.status!=null){
              let alertMsg="";
              if(r.data.status=='405001'){
                alertMsg = r.data.projectCode+'项目'+'正在功能测试中，已运行'+r.data.exeTime+'秒，请稍后重试。';
              }
              if(r.data.status=='405002'){
                alertMsg = r.data.projectCode+'项目'+'正在普通压测中，已运行'+r.data.exeTime+'秒，不可同时进行，请稍后重试。';
              }
              this.$alert(alertMsg, '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  window.history.back();
                  if(_this.startPrepareLoading !=null){
                    _this.startPrepareLoading.close();
                  }
                }
              }); 
            }
          })
        },
        play(){
          this.openSocket();
          this.startPrepareLoading = this.$loading({
            lock: true,
            text: '准备测试...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          setTimeout(() => {
            this.startPrepareLoading.close();
          }, 2000);
          this.startDisabled=true;
          document.getElementById('log').innerHTML = '';
          this.loadData();
         
        },
        openSocket() {
          var socket = new SockJS(process.env.WEBSOCKET_ROOT);
          this.stompClient = Stomp.over(socket);
          var userid = this.$route.query.id;// document.getElementById('testId').value;
          var url = '/user/'+userid+'/result';
          console.log(url);
          var _this = this;
          // 向服务器发起websocket连接并发送CONNECT帧
          _this.stompClient.connect(
            {},
            function connectCallback(frame) {
              
              // 连接成功时（服务器响应 CONNECTED 帧）的回调方法
              _this.stompClient.subscribe(url, function (response) {

              // if(_this.startPrepareLoading !=null){
              //   _this.startPrepareLoading.close();
              // }
                var data = JSON.parse(response.body);
                // _this.message += data.message;
                document.getElementById('log').innerHTML += data.message + '<br/>';
                // var el_height = $('#log').scrollHeight
                //
                // $('#log').scollTop(el_height)
                // console.log(data)
                for (var i = 0;i < 5;i++) {
                  _this.lists[i].status = data.stepList[i]["status"];
                }
                // console.log(_this.lists)
              });
            },
            function errorCallBack(error) {
              console.log(error);
              // if(_this.startPrepareLoading !=null){
              //   _this.startPrepareLoading.close();
              // }
              // 连接失败时（服务器响应 ERROR 帧）的回调方法
              // setMessageInnerHTML("连接失败");
            }
          )
        },
        back() {
          window.history.back();
        }
      },
      created() {
        this.projectCode = this.$api.sGetObject('_projectCode');
        this.$store.state.activeName2 = this.$route.name;
      },
      beforeDestroy() {
        this.$store.state.activeName2 = null;
        if(this.stompClient){
          this.stompClient.disconnect(function () {
            console.log('关闭socket')
          })
        }
        // this.closeSocket();
      }
    }
</script>

<style lang="scss" scoped>
  .function-test-play{
    .bc-bar{
      width: 100%;
      height: 20px;
      background-color: #eee;
      position: absolute;
      left: 0;
    }
    .bar{
      position: absolute;
      left: 0;
      z-index: 99;
      height: 20px;
      width: 100%;
      /*transition: width 2s;*/
    }
    .play{
      position: absolute;
      left: 0;
      z-index: 99;
      height: 20px;
      /*width: 100%;*/
      animation: progress 2s linear infinite;
    }
    @-webkit-keyframes progress{
      0%{
        width: 0;
        height: 20px;
        opacity: 0.1;
      }
      50%{
        width: 50%;
        height: 20px;
        opacity: 0.5;
      }
      100%{
        width: 100%;
        height: 20px;
        opacity: 1;
      }
    }
    .log{
      width: 92%;
      padding-left: 4%;
      margin-left: 2%;
      margin-top: 40px;
      padding-top: 10px;
      margin-bottom: 40px;
      padding-bottom: 40px;
      background: #000;
      border-radius: 5px;
      height: 200px;
      line-height: 30px;
      overflow: auto;
      color: #fff;
    }
  }
</style>
