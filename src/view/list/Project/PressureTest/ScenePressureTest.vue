<!--混合压测-->
<template>
<div class="pressure-test">
    <el-row style="margin-top: 30px;height: 60px;line-height: 60px;margin-bottom: 20px;">
      <el-col :span="15" style="margin-left: 2%;">
        <el-button style="background: #5bc0de; color: #fff;" type="primary" @click="handleAdd">新增混合压测</el-button>
      </el-col>
      <el-col :span ='8' class='search'>
        <el-input style="width: 80%;" v-model="searchVal" placeholder="请输入...">
            <el-button slot="append" style="background: #5bc0de; color: #fff;" icon="icon iconfont icon-sousuo" @click="loadSearch"/>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="lists" v-loading="listLoading" border stripe style="width: 96%;margin-left: 2%;">
      <el-table-column prop="sceneName" label="场景名称" min-width="160" fixed/>
      <el-table-column prop="envName" label="环境名称" min-width="160"/>
      <el-table-column prop="dbName" label="还原点名称" min-width="160"/>
      <el-table-column prop="threads" label="并发数" min-width="80" align="center" />
      <el-table-column prop="period" label="每秒最大请求数" min-width="130" align="center" />
      <el-table-column label="重复执行策略" min-width="220" :formatter="repeatFormatter" align="center" />
      <el-table-column prop="lastedExecTime" label="最后执行时间" :formatter="dateFormatter" min-width="150" align="center" />
      <el-table-column label="操作" min-width="150" align="center" fixed="right">
        <template slot-scope="scope">
          <div style="text-align: center;">
            <el-button size="mini" type="primary" icon="icon iconfont icon-bianji" @click="handleEdit(scope.$index, scope.row)"></el-button>
            <el-button size="mini" type="danger" icon="icon iconfont icon-iconfontshanchu1" style="margin-left: 0px;" @click="delPop(scope.row)"/>
            <el-tooltip effect="dark" content="执行测试" placement="top">
                <el-button size="mini" type="success" icon="icon iconfont icon-xiangyou2" style="margin-left: 0px;" 
                @click="handlePlay(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="查看测试报告" placement="top">
                <el-button size="mini" type="info" icon="icon iconfont icon-yanjing" el-icon-zoom-in style="margin-left: 0px;background: #327AB7"
                @click="lookResult(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <template>
      <div class="el-pagination__editor" style="height: 40px; line-height: 40px;text-align: right;margin-right: 50px;">
        <el-pagination @current-change="pagination" :current-page.sync="pageNum" :page-size="pageRows"
                       layout="total, prev, pager, next" :total="pageTotal" style="height: 40px;line-height: 40px;margin-top: 20px;">
        </el-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        projectCode: null,
        pageNum: 1,
        pageRows: 10,
        pageTotal: 0,
        listLoading: false,
        searchVal: '',
        lists: []
      }
    },
    computed: {
    },
    created() {
      this.projectCode = this.$api.sGetObject('_projectCode');
      this.loadData();
      this.$store.state.activeMenu = this.$route.path;
      this.$store.state.activeName = this.$route.name;
    },
    methods: {
      // 列表数据
      loadData() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testStressScene/view/queryTestStressSceneList'
        var p = {
          "pageNo": this.pageNum,
          "pageSize": this.pageRows
        }
        self.$api.post(url, p, r => {
          // console.log(r);
          this.pageTotal = r.data.total;
          this.lists = r.data.rows;
        })
      },
      // 搜索查询
      loadSearch() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testStressScene/view/queryTestSessSceneListBySearch'
        var p = {
          "pageNo": this.pageNum,
          "pageSize": this.pageRows,
          "searchText": this.searchVal
        }
        // console.log(p)
        self.$api.post(url, p, r => {
          // console.log(r);
          this.pageTotal = r.data.total;
          this.lists = r.data.rows;
        })
      },
      handleAdd (){
        this.$router.push("/SceneNewPressureTest");
      },
      delPop(row) {
        this.$confirm('', '确认删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          this.handleDelete(row)
        }).catch(() => {

        });
      },
      // 删除
      handleDelete(row) {
        var url = 'project/' + this.projectCode + '/testStressScene/admin/delTestStressScene'
        var p = {
          sceneId:row.sceneId
        }
        // console.log(p)
        this.$api.post(url, p, r => {
          this.loadData()
        })
      },
      // 编辑
      handleEdit(index, row) {
        this.$router.push({path:"/SceneNewPressureTest?sceneId="+ row.sceneId});
      },
      // 进入paly
      handlePlay(index, row) {
        if(row.hasOwnProperty('id')){
          this.$router.push({path:"/PressurePlay?id="+ row.id});
        }
        if(row.hasOwnProperty('sceneId')){
          this.$router.push({path:"/PressurePlay?sceneId="+ row.sceneId});
        }
      },
      // 进入结果
      lookResult(indejx, row) {
        if(row.hasOwnProperty('id')){
          this.$router.push({path:"/PressureResult?id="+ row.id});
        }
        if(row.hasOwnProperty('sceneId')){
          this.$router.push({path:"/PressureResult?sceneId="+ row.sceneId});
        }
      },
      pagination(val) {
        this.pageNum = val;
        this.loadData();
      },
      repeatFormatter(row, column) {
        let txt='';
        if(row.repeatEndTime!=null && row.repeatEndTime!=''){
            txt=this.datetimeFormat(row.repeatEndTime) + "停止";
        }
        if(row.repeatNumber!=null){
          if(txt!=''){
            txt +='|';
          }
          txt += ( row.repeatNumber + "次");
        }
        return txt;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pressure{
    .search{
      color: #ababab;
      font-size: 16px;
      line-height: 60px;
    }
  }
</style>
