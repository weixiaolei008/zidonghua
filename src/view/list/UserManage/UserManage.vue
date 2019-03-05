<!--用户管理-->
<template>
  <div class="user-manage">
    <el-row style="margin-top: 20px;height: 60px;line-height: 60px;margin-bottom: 20px;"">
      <el-col :span="15" style="margin-left: 2%;">
        <el-button style="background: #5bc0de; color: #fff;" type="primary" @click="newUser">新增用户</el-button>
      </el-col>
      <el-col :span ='8' class='search'>
        <el-input style="width: 80%;" v-model="userSearch" placeholder="请输入...">
          <el-button slot="append" style="background: #5bc0de; color: #fff;" icon="icon iconfont icon-sousuo" @click="choose(group,groupIndex)"></el-button>
        </el-input>
      </el-col>
    </el-row>

    <!--项目组nav-->
    <div style="width: 96%;margin-left: 2%;margin-bottom: 20px;">
      <label>项目组：</label>
      <span v-for="(item, index) in userNav"
            @click="choose(item.id, index)"
            :style="{color: index===navIndex? '#39a0ff':''}"
            style="cursor: pointer; margin-right: 20px;">
        {{item.projectName}}
      </span>
    </div>

    <!--表格-->
    <el-table :data="lists" border stripe style="width: 96%;margin-left: 2%;">
      <el-table-column prop="userName" label="用户姓名" align="center" min-width="130"/>
      <el-table-column prop="loginId" label="账号" min-width="130"/>
      <el-table-column prop="mobilenum" label="手机号" align="center" min-width="120"/>
      <el-table-column prop="email" label="邮箱" min-width="230"/>
      <el-table-column prop="createUser" label="创建人" align="center" min-width="120"/>
      <el-table-column prop="createTime" label="创建时间" align="center" :formatter="dateFormatter" min-width="160"/>
      <el-table-column label="操作"  align="center" min-width="120">
        <template slot-scope="scope">
          <div style="text-align: center;">
            <el-button
              size="mini"
              type="primary"
              icon="icon iconfont icon-bianji"
              @click="handleEdit(scope.$index, scope.row)"></el-button>
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
      <div class="el-pagination__editor" style="margin-top: 20px;margin-right: 50px;text-align: right;">
        <el-pagination @current-change="pagination" :current-page.sync="pageNum" :page-size="pageRows"
                       layout="total, prev, pager, next" :total="pageTotal" style="height: 40px;line-height: 40px;margin-top: 20px;">
        </el-pagination>
      </div>
    </template>
  </div>
</template>

<script>
  import api from './../../../common/js/index'
  export default {
    name: "UserManage",
    components: {
    },
    data() {
      return {
        group: '',
        groupIndex: '',
        navIndex: 0,
        pageNum: 1,
        pageRows: 10,
        pageTotal: 0,
        listLoading: false,
        userSearch: '',
        userNav: [],
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
      choose(val, index) {
        this.navIndex = index;
        this.groupIndex = index;
        this.group = val;
        var p = {
          "pageNo": this.pageNum,
          "pageSize": this.pageRows,
          "searchText": this.userSearch,
          "searchProId": val || ''
        }
        // console.log(p)
        this.$api.post('user/queryUserBySearch', p, r => {
          // console.log(r.data);
          this.pageTotal = r.data.total;
          this.lists = r.data.rows;
        })
      },
      loadData() {
        var self = this;
        var p = {
          "pageNo": this.pageNum,
          "pageSize": this.pageRows
        }
        self.$api.post('user/queryUserBySearch', p, r => {
          this.pageTotal = r.data.total;
          this.lists = r.data.rows;
          // console.log(this.lists)
        })
      },
      loadprojectGroup() {
        var self = this;
        var p = {}
        // console.log(p)
        self.$api.post('myproject/getProjectList', p, r => {
          // console.log(r.data);
          this.userNav = r.data;
          this.userNav.unshift({projectName: '全部'})
        })
      },
      newUser (){
        this.$router.push("/NewUser");
      },
      handleEdit(index, row) {
        this.$api.sSetObject('_projectCode', row.projectCode);
        // console.log(row)
        this.$router.push({path:"/NewUser?id="+ row.userId});
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
          userId:row.userId
        }
        this.$api.post('user/deleteUser', p, r => {
          this.loadData()
        })
      },
    },
    created() {
      this.loadData();
      this.loadprojectGroup();
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
