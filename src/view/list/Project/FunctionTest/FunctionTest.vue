<!--功能测试-->
<template>
  <div class="function-test">
    <el-row style="margin-top: 30px;height: 60px;line-height: 60px;margin-bottom: 20px;">
      <el-col :span="15" style="margin-left: 2%;">
        <el-button style="background: #5bc0de; color: #fff;" type="primary" @click="handleAdd">新增功能测试</el-button>
        <el-button style="background: #67c23a; color: #fff;" type="success" @click="handleQuickAdd">一键功能测试</el-button>
      </el-col>
 
      <el-col :span ='8' class='search'>
        <el-input style="width: 80%;" v-model="searchVal" placeholder="请输入...">
          <el-button slot="append" style="background: #5bc0de; color: #fff;" icon="icon iconfont icon-sousuo" @click="loadSearch"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="lists" v-loading="listLoading" border stripe style="width: 96%;margin-left: 2%;">
      <el-table-column prop="testDesc" label="测试任务名称" min-width="180" fixed="left">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.testDesc" placement="top" effect="dark">
                <div style="overflow:hidden;white-space: nowrap;text-overflow: ellipsis;">{{scope.row.testDesc}}</div>
              </el-tooltip>
            </template>
          </el-table-column>
      <el-table-column prop="envName" label="环境名称" min-width="170"/>
      <el-table-column prop="dbName" label="还原点名称" min-width="170"/>
      <el-table-column prop="startTime" label="回放开始时间" align="center" :formatter="dateFormatter" min-width="160"/>
      <el-table-column prop="endTime" align="center" label="回放结束时间" :formatter="dateFormatter" min-width="160"/>
      <el-table-column prop="lastedExecTime" label="最后执行时间" align="center" :formatter="dateFormatter" min-width="160"/>
      <el-table-column label="操作" align="center" width="160" fixed="right">
        <template slot-scope="scope">
          <div style="text-align: center;">
            <el-tooltip effect="dark" content="配置测试" placement="top">
              <el-button size="mini" type="primary" icon="icon iconfont icon-bianji" @click="handleEdit(scope.$index, scope.row)" style="margin-left: 0px;"></el-button>
            </el-tooltip>
            <el-button size="mini" type="danger" icon="icon iconfont icon-iconfontshanchu1" @click="delPop(scope.row)" style="margin-left: 0px;"></el-button>
            <el-tooltip effect="dark" content="执行测试" placement="top">
              <el-button size="mini" type="success" icon="icon iconfont icon-xiangyou2" @click="handlePlay(scope.$index, scope.row)" style="margin-left: 0px;"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="查看测试报告" placement="top">
              <el-button size="mini" type="info" icon="icon iconfont icon-yanjing" el-icon-zoom-in style="margin-left: 0px;background: #327AB7" @click="lookResult(scope.$index, scope.row)"></el-button>
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
    components: {
    },
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
    methods: {
      // 列表数据
      loadData() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testFunc/view/queryTestFuncList'
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
        var url = 'project/' + this.projectCode + '/testFunc/view/queryTestFuncListBySearch'
        var p = {
          "pageNo": this.pageNum,
          "pageSize": this.pageRows,
          "searchText": this.searchVal
        }
        console.log(p)
        self.$api.post(url, p, r => {
          // console.log(r);
          this.pageTotal = r.data.total;
          this.lists = r.data.rows;
        })
      },
      handleAdd (){
        this.$router.push("/NewFunctionTest");
      },
      handleQuickAdd (){
        this.$router.push("/NewFunctionQuickTest");
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
        // console.log(row)
        var url = 'project/' + this.projectCode + '/testFunc/admin/delTestFunc'
        var p = {
          id:row.id
        }
        console.log(p)
        this.$api.post(url, p, r => {
          this.loadData()
        })
      },
      // 编辑
      handleEdit(index, row) {
        console.log(row.logSwitch);
        if(row.logSwitch!=null){
          this.$router.push({path:"/NewFunctionQuickTest?id="+ row.id});
        }else{
          this.$router.push({path:"/NewFunctionTest?id="+ row.id});
        }
      },
      // 进入paly
      handlePlay(index, row) {
        if(row.endTime==null){
            this.$message.error("此功能测试任务没有设置回放结束时间");
            return false;
        }
        this.$router.push({path:"/FunctionPlay?id="+ row.id});
      },
      // 进入结果
      lookResult(indejx, row) {
        this.$router.push({path:"/FunctionResult?id="+ row.id});
      },
      pagination(val) {
        this.pageNum = val;
        this.loadData();
      },
    },
    created() {
      this.projectCode = this.$api.sGetObject('_projectCode');
      this.loadData();
      this.$store.state.activeMenu = this.$route.path;
      this.$store.state.activeName = this.$route.name;
      // console.log(this.projectCode)
    }
  }

</script>

<style lang="scss" scoped>
  .function-test{
    .search{
      color: #ababab;
      font-size: 16px;
      line-height: 60px;
    }
  }
</style>
