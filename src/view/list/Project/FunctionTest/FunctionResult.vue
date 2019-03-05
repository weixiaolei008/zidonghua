<template>
  <div class="function-test-result">
    <div class="title">查看测试结果</div>
    <div class="result-num">
      <span class="item">
        测试报文统计：{{resultCount}}
      </span>
      <span class="item" v-if="errorRate==='100.0'">
        测试成功率：{{errorRate}}%
      </span>
      <span class="item" v-else-if="errorRate==='0.0'">
        测试成功率：{{errorRate}}%
      </span>
      <div class="result-rate-container rate-success" v-else="">
        <el-progress :text-inside="true" :stroke-width="30" :percentage="parseInt(errorRate)" :show-text="true"  color="#5cb85c"></el-progress>
        <div class="rate-label">测试成功率</div>
      </div>

      <span class="item" v-if="contextLikeRate==='100.0'">
        测试相符率：{{contextLikeRate}}%
      </span>
      <span class="item" v-else-if="contextLikeRate==='0.0'">
        测试相符率：{{contextLikeRate}}%
      </span>
      <div class="result-rate-container rate-like" v-else="">
        <el-progress :text-inside="true" :stroke-width="30" :percentage="parseInt(contextLikeRate)" status="success" color="#337ab7"></el-progress>
        <div class="rate-label">测试相符率</div>
      </div>
      <span class="item">
        测试用时：{{executionTimeFormated}}
      </span>
    </div>
    
    <div style="margin-top:20px;"></div>
    <el-row>
      <el-col :span="allTop5MatchIsZeroFlag?24:12">
        <div class="result-chart-error" id="result-chart-error" style="height: 280px;"></div>
      </el-col>
      <el-col :span="12" v-if="allTop5MatchIsZeroFlag==false">
        <div class="result-chart-match" id="result-chart-match" style="height: 280px;"></div>
      </el-col>
    </el-row>

    <!--chart-->
    <!--
    <div class="result-chart-error" id="result-chart-error" style="width: 500px;height: 360px;float:left;"></div>
    <div class="result-chart-match" id="result-chart-match" style="width: 500px;height: 360px;float:left;"></div>
    -->
    <el-table
      :data="lists"
      border stripe
      @sort-change = "sort"
      style="width: 96%; margin-left: 2%; border-bottom: 1px solid #ddd">
      <el-table-column label="接口名称" width="230px">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <span v-if="scope.row.contextLikeRate>60">{{scope.row.uri}}</span>
            <span v-else style="color: red">{{scope.row.uri}}</span>
            <div slot="reference" class="name-wrapper" >
              <span v-if="scope.row.contextLikeRate>60">{{scope.row.uri.substring(scope.row.uri.lastIndexOf('/')+1)}}</span>
              <span v-else style="color: red">{{scope.row.uri.substring(scope.row.uri.lastIndexOf('/')+1)}}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
       <el-table-column label="请求次数" align="center" sortable="custom">
        <template slot-scope="scope">
          <span v-if="scope.row.contextLikeRate>60">{{scope.row.allNum }}</span>
          <span v-else style="color: red">{{scope.row.allNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成功次数" align="center" sortable="custom">
        <template slot-scope="scope">
          <span v-if="scope.row.contextLikeRate>60">{{scope.row.successNum }}</span>
          <span v-else style="color: red">{{scope.row.successNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="失败次数" align="center" sortable="custom">
        <template slot-scope="scope">
          <span v-if="scope.row.contextLikeRate>60">{{scope.row.errorNum }}</span>
          <span v-else style="color: red">{{scope.row.errorNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="成功率" align="center" sortable="custom">
        <template slot-scope="scope">
          <span v-if="scope.row.contextLikeRate>60">{{Number(scope.row.trueRate).toFixed(2)}}%</span>
          <span v-else style="color: red">{{Number(scope.row.trueRate).toFixed(2)}}%</span>
        </template>
      </el-table-column>
      <el-table-column label="与预期相符" align="center" sortable="custom">
        <template slot-scope="scope">
          <span v-if="scope.row.contextLikeRate>60">{{scope.row.contextLike }}</span>
          <span v-else style="color: red">{{scope.row.contextLike}}</span>
        </template>
      </el-table-column>
      <el-table-column label="相符率" align="center" sortable="custom">
        <template slot-scope="scope">
          <span v-if="scope.row.contextLikeRate>60">{{Number(scope.row.contextLikeRate).toFixed(2) }}%</span>
          <span v-else style="color: red">{{Number(scope.row.contextLikeRate).toFixed(2)}}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作"  align="center">
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
        pagaNum: null,
        pagaVal: null,
        pageNum: 1,
        pageRows: 10,
        pageTotal: 0,
        chart1: null,
        option1: null,
        xData1: [],
        yData1: [],
        chart2: null,
        option2: null,
        xData2: [],
        yData2: [],
        resultCount: 0,
        errorRate: 0,
        contextLikeRate:0,
        executionTime:0,
        lists: [],
        allTop5MatchIsZeroFlag: false,//错误率top5是否全部为0
      }
    },
    computed: {
        executionTimeFormated(){
        return this.millisecondToDayHourMinuteSecond(this.executionTime);
      }
    },
    methods: {
      sort(column){
        // console.log(column)
        if(column.column){
          var val = column.column.label;
          var num = column.column.order;
          val = val === '请求次数' ? 'allNum' : val === '成功次数' ? 'successNum' : val === '失败次数' ? 'errorNum' : val === '成功率' ? 'trueRate' : val === '与预期相符' ? 'contextLike' : val === '相符率' ? 'contextLikeRate' : '';
          num = num === 'ascending' ? 'ASC' : num === 'descending' ? 'DESC' : '';
          this.pagaNum = num;
          this.pagaVal = val;
          var url = 'project/' + this.projectCode + '/testFunc/view/queryTFuncExecutionResultByRequestSort';
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
          this.loadList();
        }
      },
      loadAll() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testFunc/view/queryTFuncExecutionResultCount';
        var p = {
          "id": this.$route.query.id
        }
        self.$api.post(url, p, r => {
          // console.log(r);
          this.resultCount = r.data.resultCount;
          this.errorRate = Number(r.data.errorRate).toFixed(1);
          this.contextLikeRate = Number(r.data.contextLikeRate).toFixed(1);
          this.executionTime = Number(r.data.executionTime);
        })
      },
      loadSuccess() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testFunc/view/queryTFuncExecutionResultByTrueRate';
        var p = {
          "id": this.$route.query.id
        }
        self.$api.post(url, p, r => {
          // console.log(r)
          let num=0;
          r.data.forEach((item) => {
            num++;
            this.xData1.push(num+'_'+item.uri);
            this.yData1.push(item.trueRate);
          })
          this.chart1 = echarts.init(document.getElementById('result-chart-error'));
          this.option1 = this.returnOption('成功率(最低TOP5)', this.xData1, this.yData1);
          this.chart1.setOption(this.option1);
        })
      },
      loadMatch() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testFunc/view/queryTFuncExecutionResultByLikeRate';
        var p = {
          "id": this.$route.query.id
        }
        self.$api.post(url, p, r => {
          // console.log(r)
          let num=0;
          this.allTop5MatchIsZeroFlag=true;
          r.data.forEach((item) => {
            num++;
            this.xData2.push(num+'_'+item.uri);
            this.yData2.push(item.contextLikeRate);
            if( item.contextLikeRate != "0.0000" ){
              this.allTop5MatchIsZeroFlag=false;
            }
          })
          if(this.allTop5MatchIsZeroFlag==false){
            this.chart2 = echarts.init(document.getElementById('result-chart-match'));
            this.option2 = this.returnOption('相符率(最低TOP5)', this.xData2, this.yData2);
            this.chart2.setOption(this.option2);
          }
          this.loadSuccess();
        })
      },
      pagination(val) {
        this.pageNum = val,
        this.loadList();
      },
      loadList() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testFunc/view/queryTFuncExecutionResultByRequestSort';
        var p = {
          "data": {
            "id": this.$route.query.id,
            "sortType": this.pagaVal,
            "orderType": this.pagaNum
          },
          "pageNo": this.pageNum,
          "pageSize": this.pageRows
        }
        console.log(p)
        self.$api.post(url, p, r => {
          // console.log(r)
          this.lists = r.data.rows;
          this.pageTotal = r.data.total;
        })
      },
      back() {
        window.history.back();
      },
      lookDetail(row) {
        this.$api.sSetObject('_funResDetail', row);
        this.$router.push({path:"/FunctionResDetail"});
      },
      returnOption(title, xData, yData) {
        return {
                title: {
                    text: title,
                },
                color:['#39a0ff'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      type: 'shadow'
                    },
                    formatter: function(params){
                      let apiName=params[0].name;
                      apiName= apiName.substring(apiName.indexOf('_')+1);

                      let val= Number(params[0].value).toFixed(0);
                      return apiName + ' ' +val;
                    },
                },
                grid: {
                    left: '3%',
                    right: '8%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    splitLine:{
                      show:true,
                      lineStyle:{
                      color: ['#ededed'],
                      type: 'dashed'
                      }
                    },
                      axisTick:{show:false},
                      axisLine:{show:false},
                      axisLabel: {
                        formatter: '{value}%'
                      }
                  },
                yAxis: [
                    {
                      show: true,
                      position: 'center',
                      data: xData.reverse(),
                      boundaryGap: ['0%','0%'],
                      type: 'category',
                      axisLine: {
                        lineStyle: {
                        color: '#ededed',
                        width: 1
                        }
                      },
                      axisTick: {
                        show: false,
                      },
                      axisLabel: {                     
                        formatter: function(value) {
                          let i = value.indexOf('_')
                          return value.substring(0,i);
                        },
                        textStyle: {                       
                          fontSize: 12,
                          lineHeight: 16,
                          fontFamily: 'Microsoft YaHei',
                          color: '#666667'
                        }
                      }
                    }
                  ],
                series: [  
                     {                  
                        type: 'bar',                   
                        barCategoryGap:'14px',
                        itemStyle: {
                              normal: {               
                                 label : {
                                      show : true,
                                      position: 'right',
                                      formatter: function(a) {
                                            var result;       
                                            result = Number(a.data).toFixed(2);
                                            return result+"%";  
                                        }
                                    }
                                },
                            },
                        data: yData.reverse(),
                        label: {
                          normal: {
                              show: true,
                              position: 'insideLeft',
                              formatter: function(params){
                                let apiName=params.name;
                                apiName= apiName.substring(apiName.lastIndexOf('/')+1);

                                let val= Number(params.value).toFixed(2);
                                return apiName + ' ' +val+'%';
                              },
                              fontSize: 12,
                              lineHeight: 16,
                              fontFamily: 'Microsoft YaHei',
                              color: '#2F4F4F'
                          },
                        }
                      }
                  ]
              }
          }     
      },
    created() {
      this.projectCode = this.$api.sGetObject('_projectCode');
      this.$store.state.activeName2 = this.$route.name;
      this.loadAll();
      this.loadList();
    },
    mounted(){
      this.loadMatch();
    },
    beforeDestroy() {
      this.$store.state.activeName2 = null;
    }
  }
</script>

<style lang="scss" scoped>
  .function-test-result{
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
        height: 30px;
        background: #f0ad4e;
        color: #fff;
        line-height: 30px;
        border-radius: 3px;
        text-align: center;
        margin-right: 20px;
        width: 180px;
        font-size: 12px;
      }
      .item:nth-child(2){
        background: #5cb85c;
      }
      .item:nth-child(3){
        background: #337ab7;
      }
      .item:nth-child(4){
        background: #f56c6c;
      }
    }
    .result-chart-error,.result-chart-match{
      margin-left: 2%;
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
