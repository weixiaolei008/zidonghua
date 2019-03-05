<template>
  <div class="project-manage">
    <el-row style="margin-top: 20px;height: 60px;line-height: 60px;margin-bottom: 20px;">
      <el-col :span="15" style="margin-left: 2%;">
        <el-button style="background: #5bc0de; color: #fff;" type="primary" @click="newProject">新增项目</el-button>
      </el-col>
      <el-col :span ='8' class='search'>
        <el-input style="width: 80%;" v-model="projectSearch" placeholder="请输入...">
          <el-button slot="append" style="background: #5bc0de; color: #fff;" icon="icon iconfont icon-sousuo" @click="search()"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="lists"
              v-loading="listLoading"
              border
              stripe
              style="width: 96%;margin-left: 2%;">
      <el-table-column prop="projectName" label="项目名称" min-width="150"/>
      <el-table-column prop="projectCode" label="项目编码" min-width="120"/>
      <el-table-column prop="rmk" label="项目描述" min-width="300"/>
      <el-table-column prop="createUser" label="创建人" align="center" min-width="120"/>
      <el-table-column prop="createTime" label="创建时间" align="center" :formatter="dateFormatter" min-width="160"/>
      <el-table-column label="操作" align="center" min-width="160">
        <template slot-scope="scope">
          <div style="text-align: center;">
            <el-tooltip effect="dark" content="项目日志和SQL备份文件设置" placement="top">
              <el-button
                size="mini"
                type="primary"
                icon="icon iconfont icon-bianji"
                @click="handleEdit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="数据字典" placement="top">
              <el-button
                size="mini"
                type="primary"
                icon="icon iconfont icon-iconset0118"
                @click="dictEdit(scope.$index, scope.row)"></el-button>
            </el-tooltip>
            <el-button
              size="mini"
              type="danger"
              icon="icon iconfont icon-iconfontshanchu1"
              @click="delPop(scope.row)"></el-button>
            <el-tooltip effect="dark" content="项目测试控制面板" placement="top">
              <el-button
                size="mini"
                type="info"
                icon="icon iconfont icon-jinru"
                el-icon-zoom-in
                style="background: #327AB7"
                @click="lookProject(scope.$index, scope.row)"></el-button>
            </el-tooltip>
          </div>
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
  </div>
</template>

<script>

  export default {
    components: {
    },
    data() {
      return {
        pageNum: 1,
        pageRows: 10,
        pageTotal: 0,
        listLoading: false,
        projectSearch: '',
        lists: []
      }
    },
    computed: {
    },
    methods: {
      loadData() {
        var self = this;
        var p = {
          "pageNo": this.pageNum,
          "pageSize": this.pageRows
        }
        self.$api.post('myproject/queryProject', p, r => {
          // console.log(r);
          this.pageTotal = r.data.total;
          this.lists = r.data.rows;
        })
      },
      search(val) {
        var p = {
          "pageNo": this.pageNum,
          "pageSize": this.pageRows,
          "searchText": this.projectSearch
        }
        // console.log(p)
        this.$api.post('myproject/queryProject', p, r => {
          // console.log(r);
          this.pageTotal = r.data.total;
          this.lists = r.data.rows;
        })
      },
      newProject (){
        this.$router.push("/NewProject");
      },
      handleEdit(index, row) {
        // console.log(row)
        this.$api.sSetObject('_projectRow', row);
        this.$router.push({path:"/NewProject?id="+row.id});
      },
      dictEdit(index, row) {
        // console.log(row)
        // this.$api.sSetObject('_projectRow', row);
        this.$router.push({path:"/DataDictionary?id="+row.projectCode});
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
      handleDelete(row) {
        var p = {
          id:row.id
        }
        // console.log(p)
        this.$api.post('myproject/deleteProject', p, r => {
          // console.log(r);
          this.loadData();
        })
      },
      lookProject(indejx, row) {
        this.$store.state.menuChange = !this.$store.state.menuChange;
        // this.$store.state.porjectCode = row.projectCode;
        // console.log(this.$store.state.porjectCode)
        // console.log(row)
        this.$api.sSetObject('_projectCode', row.projectCode);
        this.$api.sSetObject('_menuChange', false);
        this.$store.state.porjectName = row.projectName;
        this.$api.sSetObject('_porjectName', row.projectName);
        this.$router.push("/Project");
      },
      pagination(val) {
        this.pageNum = val,
        this.loadData();
      },
    },
    created() {
      // sessionStorage.removeItem('_porjectName');
      // sessionStorage.removeItem('_projectCode');
      this.$store.state.menuChange = true;
      this.$api.sSetObject('_menuChange', true);
      // this.$store.state.porjectName = null;
      this.$store.state.activeName = this.$route.name;
      // this.$store.state.projectCode = null;
      this.loadData();
      this.$store.state.activeMenu = this.$route.path;
    }
  }

</script>

<style lang="scss" scoped>
  .project-manage{
    .search{
      color: #ababab;
      font-size: 16px;
      line-height: 60px;
    }
  }
</style>
