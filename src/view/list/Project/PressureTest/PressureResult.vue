<template>
  <div class="pressure-test-result">
    <div class="title">查看测试结果</div>
    <div class="result-num">
      <span class="item">
        并发线程：{{threads}}
      </span>
      <span class="item">
        重复执行：{{enlarged}}
      </span>
      <span class="item">
        每秒最大请求数：{{period }}
      </span>
      <span class="item">
        请求时长：{{requestTimeFormated}}
      </span>
       <span class="item" v-if="this.$route.query.sceneId!=null">
        成功率：{{(successRate*100).toFixed(2)}}%
      </span>
      <el-tooltip class="item" effect="dark" content="请求总次数 / (Max(start_timestamp)-Min(start_timestamp)->切割)" placement="top">
        <span class="item" v-if="this.$route.query.sceneId!=null">
        压入率：{{inPerSceond}}
      </span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="请求总次数 / (Max(end_timestamp)-Min(end_timestamp)->切割)" placement="top">
        <span class="item" v-if="this.$route.query.sceneId!=null">
        吞吐率：{{avgTps}}
        </span>
      </el-tooltip>

    </div>

    <!--tale-->
    <el-table
      :data="lists"
      border stripe
      @sort-change = "sort"
      style="width: 96%;margin-left: 2%; border-bottom: 1px solid #eee">
      <el-table-column v-if="this.$route.query.sceneId!=null" label="测试名称" align="center"  min-width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.testName}}</span>
          <span v-else style="color: red">{{scope.row.testName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求数" align="center" sortable="custom" min-width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.requestCnt}}</span>
          <span v-else style="color: red">{{scope.row.requestCnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="成功数" align="center" sortable="custom" min-width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.sucessCnt}}</span>
          <span v-else style="color: red">{{scope.row.sucessCnt}}</span> 
        </template>
      </el-table-column>
      <el-table-column label="成功率" align="center" sortable="custom" min-width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{Number(scope.row.trueRate).toFixed(2)}}%</span>
          <span v-else style="color: red">{{Number(scope.row.trueRate).toFixed(2)}}%</span>
        </template>
      </el-table-column>
      <el-table-column label="RT Avg(ms)" align="center" sortable="custom" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.rtAvg}}</span>
          <span v-else style="color: red">{{scope.row.rtAvg}}</span>
        </template>
      </el-table-column>
      <el-table-column label="RT Min(ms)" align="center" sortable="custom" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.rtMin}}</span>
          <span v-else style="color: red">{{scope.row.rtMin}}</span>
        </template>
      </el-table-column>
      <el-table-column label="RT Max(ms)" align="center" sortable="custom" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.rtMax}}</span>
          <span v-else style="color: red">{{scope.row.rtMax}}</span>
        </template>
      </el-table-column>
      <el-table-column label="95%Line(ms)" align="center" sortable="custom" min-width="115">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.rtMost}}</span>
          <span v-else style="color: red">{{scope.row.rtMost}}</span>
        </template>
      </el-table-column>
      <el-table-column label="压入率" align="center" sortable="custom" min-width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.inPerSecond.toFixed(2)}}</span>
          <span v-else style="color: red">{{scope.row.inPerSecond.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="吞吐率" align="center" sortable="custom" min-width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.tps.toFixed(2)}}</span>
          <span v-else style="color: red">{{scope.row.tps.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作"  align="center" min-width="50">
        <template slot-scope="scope">
          <el-button @click.native="lookDetail(scope.row)"
                    type="info"
                    icon="icon iconfont icon-caidan"
                    style="background: #327AB7;"
                    size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <template>
      <div class="el-pagination__editor" style="margin-top: 20px;margin-right: 50px;text-align: right;">
        <el-pagination @current-change="pagination" :current-page.sync="pageNum" :page-size="pageRows"
                       layout="total, prev, pager, next" :total="pageTotal">
        </el-pagination>
      </div>
    </template>
    <div class="back">
      <el-button type="" @click="back" style="width: 100px;">返回</el-button>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts/lib/echarts';
  import 'echarts/lib/chart/bar';
  import 'echarts/lib/component/tooltip';
  import 'echarts//lib/component/legend';
  import 'echarts//lib/component/title';
  export default {
    data() {
      return {
        pageNum: 1,
        pageRows: 10,
        pageTotal: 0,
        threads : 0,
        enlarged : 0,
        requestTime : 0,
        period : 0,
        lists: [],
        avgTps : 0,
        inPerSceond : 0,
        successRate :0
      }
    },
    computed: {
      requestTimeFormated(){
        return this.millisecondToDayHourMinuteSecond(this.requestTime);
      }
    },
    methods: {
      sort(column){
        // console.log(column)
        if(column.column){
          var val = column.column.label;
          var num = column.column.order;
          val = val === '请求数' ? 'requestCnt' : val === '成功数' ? 'sucessCnt' : val === '成功率' ? 'trueRate' : val === 'RT Avg(ms)' ? 'rtAvg' : val === 'RT Min(ms)' ? 'rtMin' : val === 'RT Max(ms)' ? 'rtMax' : val === '95%Line(ms)' ? 'rtMost' : val === '吞吐率' ? 'tps' : val === '压入率' ? 'inPerSecond' : '';
          num = num === 'ascending' ? 'ASC' : num === 'descending' ? 'DESC' : '';
          this.pagaNum = num;
          this.pagaVal = val;
          if(this.$route.query.sceneId==null){
            var url = 'project/' + this.projectCode + '/testStress/view/queryRptStressSummaryList';
            var p = {
            "data": {
              "id": this.$route.query.id,
              "sortType": val,
              "orderType": num
            },
            "pageNo": this.pageNum,
            "pageSize": this.pageRows
            }
            // console.log(p)
            this.$api.post(url, p, r => {
              // console.log(r);
              this.lists = r.data.rows;
              this.pageTotal = r.data.total;
            })
          }else{
            var url = 'project/' + this.projectCode + '/testStressScene/view/queryRptStressSceneSummaryList';
            var p = {
            "data": {
              "sceneId": this.$route.query.sceneId,
              "sortType": val,
              "orderType": num
            },
            "pageNo": this.pageNum,
            "pageSize": this.pageRows
            }
            // console.log(p)
            this.$api.post(url, p, r => {
              // console.log(r);
              this.lists = r.data.rows;
              this.pageTotal = r.data.total;
            })
          }
        }else{
          this.loadList();
        }
      },
      loadAll() {
        var self = this;
        if(this.$route.query.sceneId==null){
            var url = 'project/' + this.projectCode + '/testStress/view/queryTestStressByUUID'; 
            var p = {
              "id": this.$route.query.id
              }
          self.$api.post(url, p, r => {
            // console.log(r);
            this.threads  = r.data.threads ;
            this.enlarged  = r.data.enlarged ;
            this.period  = r.data.period ;
            this.requestTime = r.data.requestTime;
            this.successRate = r.data.successRate;
          })
        }else{
           var url = 'project/' + this.projectCode + '/testStressScene/view/queryTestStressSceneBySceneIdForView'; 
           var p = {
              "sceneId": this.$route.query.sceneId
              }
               self.$api.post(url, p, r => {
            // console.log(r);
            this.threads  = r.data.threads ;
            this.enlarged  = r.data.repeatNumber ;
            this.period  = r.data.period ;
            this.requestTime = r.data.requestTime;
            this.avgTps = r.data.avgTps;
            this.inPerSceond = r.data.inPerSceond;
            this.successRate = r.data.successRate;
          })
        }       
      },
      pagination(val) {
        this.pageNum = val,
        this.loadList();
      },
      loadList() {
        var self = this;
        if(this.$route.query.sceneId==null){
          var url = 'project/' + this.projectCode + '/testStress/view/queryRptStressSummaryList';
          var p = {
            "data": {
              "id": this.$route.query.id
            },
            "pageNo": this.pageNum,
            "pageSize": this.pageRows
          }
          // console.log(p)
          self.$api.post(url, p, r => {
            // console.log(r)
            this.lists = r.data.rows;
            this.pageTotal = r.data.total;
          })
        }else{
          var url = 'project/' + this.projectCode + '/testStressScene/view/queryRptStressSceneSummaryList';
           var p = {
            "data": {
              "sceneId": this.$route.query.sceneId
            },
            "pageNo": this.pageNum,
            "pageSize": this.pageRows
          }
          // console.log(p)
          self.$api.post(url, p, r => {
            // console.log(r)
            this.lists = r.data.rows;
            this.pageTotal = r.data.total;
          })
        }
      },
      back() {
        window.history.back();
      },
      lookDetail(row) {
        //console.log(row.testId);
        row.outThreads = this.threads;
        console.log(row);
        this.$api.sSetObject('_PreResDetail', row);
        //this.$router.push({path:"/PressureResDetail?id="+ this.$route.query.id});
        this.$router.push({path:"/PressureResDetail?id="+ row.testId});
      }
    },
    created() {
      this.projectCode = this.$api.sGetObject('_projectCode');
      this.$store.state.activeName2 = this.$route.name;
      this.loadAll();
      this.loadList();
    },
    beforeDestroy() {
      this.$store.state.activeName2 = null;
    }
  }
</script>

<style lang="scss" scoped>
  .pressure-test-result{
    .title{
      margin-top: 30px;
      margin-left: 2%;
      font-size: 24px;
      color: #999999;
    }
    .result-num{
      margin-top: 30px;
      margin-left: 2%;
      margin-right: 2%;
      padding-bottom: 30px;
      .item{
        display: inline-block;
        padding: 0 12px;
        height: 30px;
        background: #5bc0de;
        color: #fff;
        line-height: 30px;
        border-radius: 3px;
        text-align: center;
        margin-right: 2%;
      }
    }
    .back{
      text-align: center;
      margin-top: 30px;
      margin-bottom: 40px;
    }

    .result-rate-container{
      width:180px;
      display: inline-block;
      position: relative;
      margin-right: 20px;
      .rate-label{
        width:180px;
        height:30px;
        line-height: 30px;
        position: absolute;
        top: 0;
        color: #fff;
        display: inline-block;
        font-size: 12px;
        text-align: center;
      }
    }
  }
</style>
