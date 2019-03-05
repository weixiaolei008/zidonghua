<template>
  <div class="function-test-result-detail">
    <div class="title">查看明细</div>
    <div class="result-num">
      <span class="item">
        接口：{{uri}}
      </span>
      <span class="item">
        测试报文统计：{{requestCnt}}
      </span>
      <span class="item" v-if="trueRate==='100.0'">
        测试成功率：{{trueRate}}%
      </span>
      <span class="item" v-else-if="trueRate==='0.0'">
        测试成功率：{{trueRate}}%
      </span>
      <div class="result-rate-container rate-success" v-else="">
        <el-progress :text-inside="true" :stroke-width="30" :percentage="trueRate" :show-text="true"  color="#5cb85c"></el-progress>
        <div class="rate-label">测试成功率</div>
      </div>
    </div>
    <el-table
      :data="lists"
      border stripe
      style="width: 96%;margin-left: 2%;">
      <el-table-column label="序号" type="index" width="80" align="center">
      </el-table-column>
      <el-table-column label="测试结果"  width="160" align="center">
        <template slot-scope="scope">
          {{scope.row.rFlag == 0 ? '无结果' : scope.row.rFlag == 2 ? '失败' :''}}
        </template>
      </el-table-column>
      <el-table-column label="测试时间"  width="160" prop="startTime" :formatter="dateFormatter" align="center">
      </el-table-column>
      <el-table-column  label="响应结果"  prop="response">
        <template slot-scope="scope">
          <span v-if="scope.row.response!=null">{{scope.row.response.length > 60 ? scope.row.response.substring(0,59)+'...' :scope.row.response}}</span>
          <span v-else>null</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作"   align="center" width="80">
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
        pressureResDetail: null,
        pageNum: 1,
        pageRows: 10,
        pageTotal: 0,
        uri: '',
        response: '',
        requestCnt: null,
        errorRate: null,
        lists: []
      }
    },
    computed: {
    },
    methods: {
      pagination(val) {
        this.pageNum = val;
        this.loadList();
      },
      loadList() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testStress/view/queryErrorStressExecutionResult';
        var p = {
          "data": {
            "testId":this.pressureResDetail.testId,
            "uri": this.pressureResDetail.uri
          },
          "pageNo": this.pageNum,
          "pageSize": this.pageRows
        }
        // console.log(p)
        self.$api.post(url, p, r => {
          console.log(r)
          this.lists = r.data.rows;
          this.pageTotal = r.data.total; 
        })
      },
      back() {
        window.history.back();
      },
      lookDetail(row) {
        console.log(row);
        this.$api.sSetObject('_pressureResDetailItem', row);
        this.$router.push({path:"/PressureResDetailViewItem"});
      },
    },
    created() {
      this.projectCode = this.$api.sGetObject('_projectCode');
      this.pressureResDetail = this.$api.sGetObject('_pressureResDetail');
      this.$store.state.activeName2 = this.$route.name;
      console.log(this.pressureResDetail);
      this.uri = this.pressureResDetail.uri;
      this.requestCnt = Number(this.pressureResDetail.requestCnt);
      this.trueRate = Number(this.pressureResDetail.trueRate).toFixed(1);
      
     // this.loadCnt();
      this.loadList();
    },
    beforeDestroy() {
      this.$store.state.activeName2 = null;
    },
  }
</script>

<style lang="scss" scoped>
  .function-test-result-detail{
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
        padding: 0 10px;
        height: 30px;
        background: #f0ad4e;
        color: #fff;
        line-height: 30px;
        border-radius: 3px;
        text-align: center;
        margin-right: 2%;
      }
      .item:nth-child(1){
         background: #39a0ff;
      }
      .item:nth-child(3){
        background: #5cb85c;
      }
      .item:nth-child(4){
        background: #337ab7;
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
