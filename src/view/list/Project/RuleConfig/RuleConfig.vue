<!--功能测试-->
<template>
  <div class="function-test">
    <el-row style="margin-top: 30px;height: 60px;line-height: 60px;margin-bottom: 20px;">
      <el-col :span="15" style="margin-left: 2%;">
        <el-button style="background: #5bc0de; color: #fff;" @click="handleAdd">新增规则</el-button>
      </el-col>
      <el-col :span ='8' class='search' style="">
        <el-input style="width: 80%;" v-model="searchVal" placeholder="请输入...">
          <el-button slot="append" icon="icon iconfont icon-sousuo" style="background: #5bc0de; color: #fff;" @click="loadSearch"></el-button>
        </el-input>

      </el-col>
    </el-row>
    <el-table :data="lists" v-loading="listLoading" border stripe style="width: 96%;margin-left: 2%;">
      <el-table-column label="接口名称" min-width="220" fixed="left">
        <template slot-scope="scope">
          <div v-if="scope.row.uri">{{scope.row.uri.substring(scope.row.uri.lastIndexOf('/')+1)}}</div>
        </template>
      </el-table-column>
      <el-table-column label="忽略字段" min-width="360">
        <template slot-scope="scope">
          <div v-if="scope.row.ignoreField && scope.row.ignoreField.length>43" :title="scope.row.ignoreField">{{scope.row.ignoreField.substring(0,43)+'...'}}</div>
          <div v-else>{{scope.row.ignoreField}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="创建人" align="center" min-width="140"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" :formatter="dateFormatter" min-width="160"></el-table-column>
      <el-table-column label="操作"  align="center" width="120" fixed="right">
        <template slot-scope="scope">
          <div style="text-align: center;">
            <el-button
              size="mini"
              type="primary"
              icon="icon iconfont icon-bianji"
              @click="handleEdit(scope.row)"></el-button>
            <el-button
            size="mini"
            type="danger"
            icon="icon iconfont icon-iconfontshanchu1"
            @click="delPop(scope.row)"></el-button>
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
  import api from './../../../../common/js/index'
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
        var url = 'project/' + this.projectCode + '/rule/view/queryRuleList'
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
        var url = 'project/' + this.projectCode + '/rule/view/queryRuleListBySearch'
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
        this.$router.push("/NewRule");
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
        var url = 'project/' + this.projectCode + '/rule/admin/delRuleComparator'
        var p = {
          id:row.id
        }
        // console.log(p)
        this.$api.post(url, p, r => {
          this.loadData()
        })
      },
      // 编辑
      handleEdit(row) {
        this.$router.push({path:"/NewRule?id="+ row.id});
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
