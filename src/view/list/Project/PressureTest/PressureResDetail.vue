<template>

  <div class="function-test-result-detail">
    <el-row>
        <el-col :span="6">
        <div style="margin-left:30px;">
          <div class="title">查看详情</div>
            <div class="result-num">
              <span class="item">
                测试报文统计：{{requestCnt}}
              </span>
              <br>
              <span class="item" v-if="trueRate==='100.0'" style="background: #5cb85c;">
                测试成功率：{{trueRate}}%
              </span>
              <span class="item" v-else-if="trueRate==='0.0'" style="background: #5cb85c;">
                测试成功率：{{trueRate}}%
              </span>
              <div class="result-rate-container rate-success"  v-else="">
                <el-progress :text-inside="true" :stroke-width="30" :percentage="trueRate" :show-text="true"  color="#5cb85c"></el-progress>
                <div class="rate-label">测试成功率</div>
              </div>
              <br>
              <span class="item" style="margin-top:20px;">
                并发线程：{{threads}}
              </span>
              <br>
              <span class="item">
                重复执行：{{enlarged}}
              </span>
              <br>
              <span class="item">
                每秒最大请求数：{{period }}
              </span>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div style="width: 100%;height: 360px;position: relative">
            <div class="result-chart-error" id="presult-chart-error" style="width: 700px;height: 360px;"></div>
            <div style="position:absolute;top: 0;left: 700px;width: 100px;height: 360px;display: flex;flex-direction:column ;justify-content:center;">
              <div class="legend-num" v-for="item in lengends" style="line-height: 30px;color: #ddd">{{Number(item).toFixed(1)}}%</div>
            </div>
          </div>
        </el-col>
    </el-row>      

    <el-row>
      <el-col :span="12">
      <div class="result-chart-rt" id="presult-chart-rt" style="height: 280px;"></div>
      </el-col>
      <el-col :span="12">
       <div class="result-chart-tps" id="presult-chart-tps" style="height: 280px;"></div>
      </el-col>
    </el-row>
    <div style="margin-top:40px;"></div>
    <!--chart-->
    <!--
    <div class="result-chart-rt" id="presult-chart-rt" style="width: 600px;height: 360px;"></div>
    <div class="result-chart-tps" id="presult-chart-tps" style="width: 600px;height: 360px;"></div>
    -->
 

    <!--tale-->
    <el-table
      :data="lists"
      border stripe
      @sort-change = "sort"
      style="width: 96%;margin-left: 2%; border-bottom: 1px solid #eee">
      <el-table-column label="接口名称" width="240px" min-width="100">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
          <span v-if="scope.row.trueRate>60">{{scope.row.uri}}</span>
          <span v-else style="color: red">{{scope.row.uri}}</span>
          <div slot="reference" class="name-wrapper" >
              <span v-if="scope.row.trueRate>60">{{scope.row.uri.substring(scope.row.uri.lastIndexOf('/')+1)}}</span>
              <span v-else style="color: red">{{scope.row.uri.substring(scope.row.uri.lastIndexOf('/')+1)}}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="请求数" align="center" sortable="custom" min-width="75">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.requestCnt}}</span>
          <span v-else style="color: red">{{scope.row.requestCnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="成功数" align="center" sortable="custom" min-width="75">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.sucessCnt}}</span>
          <span v-else style="color: red">{{scope.row.sucessCnt}}</span>
        </template>
      </el-table-column>
      <el-table-column label="成功率" align="center" sortable="custom" min-width="75">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{Number(scope.row.trueRate).toFixed(2)}}%</span>
          <span v-else style="color: red">{{Number(scope.row.trueRate).toFixed(2)}}%</span>
        </template>
      </el-table-column>
      <el-table-column label="RT Avg" align="center" sortable="custom" min-width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.rtAvg}}</span>
          <span v-else style="color: red">{{scope.row.rtAvg}}</span>
        </template>
      </el-table-column>
      <el-table-column label="RT Min" align="center" sortable="custom" min-width="90"> 
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.rtMin}}</span>
          <span v-else style="color: red">{{scope.row.rtMin}}</span>
        </template>
      </el-table-column>
      <el-table-column label="RT Max" align="center" sortable="custom" min-width="92">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.rtMax}}</span>
          <span v-else style="color: red">{{scope.row.rtMax}}</span>
        </template>
      </el-table-column>
      <el-table-column label="95%Line(ms)" align="center" sortable="custom"  min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.rtMost}}</span>
          <span v-else style="color: red">{{scope.row.rtMost}}</span>
        </template>
      </el-table-column>
      <el-table-column label="吞吐率" align="center" sortable="custom" min-width="75">
        <template slot-scope="scope">
          <span v-if="scope.row.trueRate>60">{{scope.row.tps.toFixed(2) }}</span>
          <span v-else style="color: red">{{scope.row.tps.toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作"  align="center">
        <template slot-scope="scope">
          <el-button @click.native="lookResDetail(scope.row)"
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
  import 'echarts/lib/chart/pie';
  import 'echarts/lib/component/tooltip';
  import 'echarts//lib/component/legend';
  import 'echarts//lib/component/title';
  export default {
    data() {
      return {
        PreResDetail: null,
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
        chart3: null,
        option3: null,
        xData3: [],
        yData3: [],
        legendData3: [],
        lengends: [],
        requestCnt: null,
        trueRate: null,
        threads : 0,
        enlarged : 0,
        period : 0,
        outThreads :0,
        lists: []
      }
    },
    computed: {
    },
    methods: {
        sort(column){
        // console.log(column)
        if(column.column){
          var val = column.column.label;
          var num = column.column.order;
          val = val === '请求数' ? 'requestCnt' : val === '成功数' ? 'sucessCnt' : val === '成功率' ? 'trueRate' : val === 'RT Avg' ? 'rtAvg' : val === 'RT Min' ? 'rtMin' : val === 'RT Max' ? 'rtMax' : val === '95%Line(ms)' ? 'rtMost' : val === '吞吐率' ? 'tps' : '';
          num = num === 'ascending' ? 'ASC' : num === 'descending' ? 'DESC' : '';
          this.pagaNum = num;
          this.pagaVal = val;
          var url = 'project/' + this.projectCode + '/testStress/view/queryRptStressGroupList';
          var p = {
          "data": {
            "testId":this.PreResDetail.testId,
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
      pagination(val) {
        this.pageNum = val;
        this.loadList();
      },
      loadAll() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testStress/view/queryTestStressByUUID';
        var p = {
          "id": this.$route.query.id
        }
        self.$api.post(url, p, r => {
          // console.log(r);
          this.threads  = r.data.threads ;
          this.enlarged  = r.data.enlarged ;
          this.period  = r.data.period ;
        })
      },
      loadRT() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testStress/view/queryTop';
        var p = {
          "testId": this.$route.query.id,
          "topType": 'rt_avg'
        }
        // console.log(p)
        self.$api.post(url, p, r => {
          // console.log(r)
          let num=0;
          r.data.forEach((item) => {
            num++;
            this.xData1.push(num+'_'+item.uri);
            //this.xData1.push(item.uri);
            this.yData1.push(item.rtAvg);
          })
            this.option1 = this.returnBarOption('RT(平均响应时间MS最长TOP5)', this.xData1, this.yData1, '');
          this.chart1.setOption(this.option1);
        })
      },
      loadTPS() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testStress/view/queryTop';
        var p = {
          "testId": this.$route.query.id,
          "topType": 'tps'
        }
        self.$api.post(url, p, r => {
          // console.log(r)
          let num=0;
          r.data.forEach((item) => {
            num++;
            this.xData2.push(num+'_'+item.uri);
            //this.xData2.push(item.uri);
            this.yData2.push(item.tps);
          })
          this.option2 = this.returnBarOption('TPS(吞吐率最大TOP5)', this.xData2, this.yData2, '');
          this.chart2.setOption(this.option2);
        })
      },
      loadError() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testStress/view/queryTopByError';
        var p = {
          "testId": this.$route.query.id
        }
        self.$api.post(url, p, r => {
          r.data.forEach((item) => {
            if(item.trueRate<=100){
              item.trueRate = 100 - item.trueRate;
              this.xData3.push(item.uri);
              this.legendData3.push(item.uri);
              this.lengends.push(item.trueRate)
              this.yData3.push({value:item.trueRate,name:item.uri});
            }
          })
          this.option3 = this.returnPieOption('错误率', this.xData3, this.yData3, this.legendData3);
          this.chart3.setOption(this.option3);
        })
      },
      lookResDetail(row) {
        console.log(row);
        this.$api.sSetObject('_pressureResDetail', row);
        this.$router.push({path:"/PressureResDetailView"});
      },
      loadList() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testStress/view/queryRptStressGroupList';
        var p = {
          "data": {
            "testId":this.PreResDetail.testId,
            "sortType": this.pagaVal,
            "orderType": this.pagaNum
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
      },
      back() {
        window.history.back();
      },
      lookDetail(row) {
        this.$api.sSetObject('_funResDetail', row);
        this.$router.push({path:"/ResDetail"});
      },
      returnBarOption(title, xData, yData, str) {
        return {
          /**
          color:['#39a0ff'],
          title:{
            text: title,
            top: 0
          },
          grid: {
            top: 60,
            left: 40,
            bottom: '18%',
            right: '4%'
          },
          tooltip: {
            show: true,
            trigger: 'item'
          },
          legend: {
            show: false
          },
          xAxis: [
            {
              show: true,
              data: xData,
              boundaryGap: ['0%','0%'],
              axisLine: {
                lineStyle: {
                  color: '#ededed',
                  width: 1
                }
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: true,
                align: 'center',
                margin: 10,
                rich: {
                  lineHeight: 14
                },
                formatter: function(value) {
                  let i = value.lastIndexOf('/')
                  return value.substring(i+1);
                },
                textStyle: {
                  fontSize: 18,
                  lineHeight: 16,
                  fontFamily: 'Microsoft YaHei',
                  color: '#666667'
                }
              }
            }
          ],
          yAxis: {
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
              formatter: '{value}'+ str
            }
          },
          series: [
            {
              type: 'bar',
              barWidth: '20px',
              itemStyle: {
                normal: {   
                    label : {
                        show : true,
                        position: 'top',
                        formatter: function(a) {
                                var num = a.data;      
                                return num;
                            },
                    }
                },
              },
              data: yData
            }
          ]
          **/

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
                    right: '4%',
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
                         formatter: '{value}'+ str
                    }
                  },
                yAxis: [
                    {
                      show: true,
                      position: 'center',
                      data: xData.reverse(),
                      boundaryGap: ['0%','0%'],
                      type: 'category',
                      interval : 1,
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
                          //let i = value.lastIndexOf('/')
                          //return value.substring(i+1);
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
                                            result = Number(a.data).toFixed(0);
                                            return result;  
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

                                let val= Number(params.value).toFixed(0);
                                return apiName + ' ' +val;
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
      },
      returnPieOption(title, xData, yData, legendData1) {
        return {
          color:['#3aa0fd', '#36cbcb', '#4dcb74', '#fbd337', '#f2637b', '#9760e4'],
          title:{
            text: '   错误率\n最高TOP5',
            left: 152,
            top: 'middle'
          },
          tooltip: {
            show: true,
            trigger: 'item'
          },
          legend: [{
             orient: 'vertical',
             left: 350,
             top: 'center',
             itemGap: 20,
             itemWidth: 12,
             itemHeight: 10,
             data: legendData1
          }],
          series: [
            {
              type: 'pie',
              name: '错误率',
              radius: ['70px', '100px'],
              center: ['200px', 'center'],
              label: {
                normal: {
                  show: false
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: yData
            }
          ]
        }
      }
    },
    created() {
      this.projectCode = this.$api.sGetObject('_projectCode');
      this.$store.state.activeName2 = this.$route.name;
      this.loadAll();
      this.loadRT();
      this.loadTPS();
      this.loadError();
      this.PreResDetail = this.$api.sGetObject('_PreResDetail');
      // console.log(this.PreResDetail)
      this.trueRate = Number(this.PreResDetail.trueRate).toFixed(1);
      this.requestCnt = this.PreResDetail.requestCnt;
      this.errorRate = Number(this.PreResDetail.errorRate).toFixed(1);
      this.contextLikeRate = Number(this.PreResDetail.contextLikeRate).toFixed(1);
      this.outThreads =  Number(this.PreResDetail.outThreads); 
      this.loadList();
    },
    mounted(){
      this.chart1 = echarts.init(document.getElementById('presult-chart-rt'));
      this.chart2 = echarts.init(document.getElementById('presult-chart-tps'));
      this.chart3 = echarts.init(document.getElementById('presult-chart-error'));
    },
    beforeDestroy() {
      this.$store.state.activeName2 = null;
    }
  }
</script>

<style lang="scss" scoped>
  .function-test-result-detail{
    .title{
      margin-top: 30px;
      margin-left: 2%;
      font-size: 24px;
      color: #999999;
      margin-bottom: 20px;
    }
    .result-num{
      margin-left: 2%;
      margin-right: 2%;
      .item{
        margin-bottom: 20px;
        display: inline-block;
        padding: 0 10px;
        height: 30px;
        background: #5bc0de;
        color: #fff;
        line-height: 30px;
        border-radius: 3px;
        text-align: center;
        margin-right: 2%;
        width: 150px;
        font-size: 12px;
      }
      .item:nth-child(1){
         background: #f0ad4e;
      }
      .item:nth-child(2){
        background: #5cb85c;
      }
    }
    .result-chart-rt,.result-chart-tps,.result-chart-error{
      margin-left: 3%;
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
