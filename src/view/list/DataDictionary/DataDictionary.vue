<!--用户管理-->
<template>
  <div class="user-manage">
    <el-row style="margin-top: 20px;height: 60px;line-height: 60px;margin-bottom: 20px;">
      <el-input style="width: 30%;margin-left:65%;" v-model="dataSearch" placeholder="请输入字典描述">
        <el-button slot="append" style="background: #5bc0de; color: #fff;" icon="icon iconfont icon-sousuo" @click="search()"></el-button>
      </el-input>
    </el-row>

    <!--表格-->
    <el-table :data="lists" border stripe style="width: 96%;margin-left: 2%;">
      <el-table-column prop="dictCode" label="字典代码" align="center" min-width="200"/>
      <el-table-column prop="dictName" label="字典名称" align="center" min-width="200"/>
      <el-table-column prop="dictDesc" label="字典描述" min-width="400"/>
      <!--<el-table-column prop="orderId" label="排序" align="center" />-->
      <el-table-column prop="status" label="状态" align="center" :formatter="statusFormat" min-width="100"/>
      <el-table-column label="操作"  align="center" min-width="100">
        <template slot-scope="scope">
          <div style="text-align: center;">
            <el-button
              size="mini"
              type="primary"
              icon="icon iconfont icon-bianji"
              @click="handleEdit(scope.$index, scope.row)"></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <template>
      <div class="el-pagination__editor" style="margin-top: 20px;margin-right: 50px;text-align: right;">
        <el-pagination @current-change="pagination" :current-page.sync="pageNum" :page-size="pageRows"
                       layout="total, prev, pager, next" :total="pageTotal" style="height: 40px;line-height: 40px;margin-top: 20px;">
        </el-pagination>
      </div>
    </template>
    <el-button @click="back()" style="width: 100px;margin-left: 40%;">返回</el-button>
  </div>
</template>

<script>
  // import api from './../../../common/js/index'
  export default {
    name: "DataDictionary",
    components: {
    },
    data() {
      return {
        pageNum: 1,
        pageRows: 10,
        pageTotal: 0,
        projectCode:'',
        listLoading: false,
        dataSearch: '',
        lists: []
      }
    },
    computed: {
    },
    methods: {
      pagination(val) {
        this.pageNum = val;
        this.loadData();
      },
      search() {
        var p = {
          "pageNo": this.pageNum,
          "pageSize": this.pageRows,
          "searchText": this.dataSearch,
        }
        console.log(p)
        this.$api.post('dict/'+this.projectCode+'/queryDictListBySearch', p, r => {
          console.log(r.data);
          this.pageTotal = r.data.total;
          this.lists = r.data.rows;
        })
      },
      back() {
        // window.history.back();
        this.$router.push({path:"/ProjectManage"});
      },
      loadData() {
        var self = this;
        this.projectCode=this.$route.query.id;
        console.log(this.projectCode);
        var p = {
          "pageNo": this.pageNum,
          "pageSize": this.pageRows
        }
        self.$api.post('dict/'+this.projectCode+'/queryDictListBySearch', p, r => {
          console.log(r)
          this.pageTotal = r.data.total;
          this.lists = r.data.rows;
        })
      },
      handleEdit(index, row) {
        this.$api.sSetObject('_projectCode', row.projectCode);
        // console.log(row)
        this.$router.push({path:"/NewDataDictionary?id="+ row.dictCode + "&projectCode="+ this.projectCode});
      },
      statusFormat(row, column) {
        var val = row[column.property];
        return val == 0 ? '无效' : val == 1 ? '有效' : '';
      }
    },
    created() {
      this.loadData();
      this.$store.state.activeMenu = this.$route.path;
      this.$store.state.activeName = this.$route.name;
    },
    mounted() {
    }
  }

</script>

<style lang="scss" scoped>
  .user-manage{
    .search{
      color: #ababab;
      font-size: 16px;
      line-height: 60px;
    }
  }
</style>
