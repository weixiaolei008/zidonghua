<template>
  <div style=" height: 100%;">
    <el-menu :collapse="isCollapse" default-active="1" :router="true" class="home el-menu-vertical-demo" text-color="#fff" background-color='#8bc34a' unique-opened>
      <el-menu-item index="/ProjectManage" @click="backHome">
        <div v-show='!isCollapse'><span class='text'> 影武者 </span> <span style='color: #000;'>测试</span></div>
        <div v-show='isCollapse'><i class="icon iconfont icon-fangzihouse128" style="color: #eee"></i></div>
      </el-menu-item>
    </el-menu>
    <el-menu v-if="menuChange" :collapse="isCollapse" :default-active="activeMenu" :router="true" class="el-menu-vertical-demo" text-color="#ccc" active-text-color="#75c34a" background-color='#545c64' unique-opened>
      <el-menu-item :index="viewMenu[0].target" ><i class="icon iconfont icon-caidan"></i> <span style='display: inline-block;width: 140px;' slot="title">{{viewMenu[0].name}}</span></el-menu-item>
      <el-menu-item v-if="admin===1" :index="viewMenu[1].target" ><i class="icon iconfont icon-guanliyuan"></i> <span style='display: inline-block;width: 140px;' slot="title">{{viewMenu[1].name}}</span></el-menu-item>
      <!--<el-menu-item v-if="user.userId==='admin'" :index="viewMenu[2].target" ><i class="icon iconfont icon-guanliyuan"></i> <span style='display: inline-block;width: 140px;' slot="title">{{viewMenu[2].name}}</span></el-menu-item>-->
    </el-menu>
    <el-menu v-else :collapse="isCollapse" :default-active="activeMenu" :default-openeds="['/Project']" :router="true" class="el-menu-vertical-demo" text-color="#fff" active-text-color="#75c34a" background-color='#545c64' unique-opened>
      <el-submenu :index="items.target" :key="index" v-for="(items,index) in projectMenu" >
        <template slot="title">
          <i class="icon iconfont icon-caidan" style="color: #75c34a"></i>
          <span style='display: inline-block;width: 140px;color: #75c34a;' slot="title">{{porjectName}}</span>
        </template>
        <el-menu-item-group style="border: none;" v-if="items.child != null">
          <div v-for="item in items.child">
            <el-submenu v-if="item.child!=null" :index="item.target" :key="item.target">
              <template slot="title">{{item.name}}</template>
              <div v-for="its in item.child">
                <el-menu-item index="/versionManager" :key="its.target">{{its.name}}</el-menu-item>
              </div>
            </el-submenu>
            <el-menu-item v-if="item.child==null" :index="item.target" :key="item.target">{{item.name}}</el-menu-item>
          </div>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
  import api from './../../common/js/index'
  export default {
    data() {
      return {
        admin: false,
        user: null,
        viewMenu: [
          {
            name: '项目管理',
            target: '/ProjectManage'
          },
          {
            name: '用户管理',
            target: '/UserManage'
          },
          {
            name: '数据字典',
            target: '/DataDictionary'
          }
        ],
        projectMenu: [
          {
            name: '口岸',
            target: '/Project',
            child: [
              {
                name: '环境配置',
                target: '/EnvConfig'
              }, {
                name: '数据还原',
                target: '/DataConfig'
              }, {
                name: '数据脱敏',
                target: '/Desensitization'
              },{
                name: '比对规则',
                target: '/RuleConfig'
              }, {
                name: '功能测试',
                target: '/FunctionTest'
              }, {
                name: '普通压测',
                target: '/PressureTest'
              }, {
                name: '混合压测',
                target: '/ScenePressureTest'
              }
            ]
          }
        ]
      }
    },
    computed: {
      isCollapse(){
        return this.$store.state.isCollapse;
      },
      porjectName(){
        return this.$store.state.porjectName;
      },
      activeMenu:{
        get(){
          // console.log(this.$store.state.activeMenu)
          return this.$store.state.activeMenu;
        },
        set(){
        }
      },
      menuChange:{
        get(){
          return this.$store.state.menuChange;
        },
        set(){
        }
      }
    },
    methods: {
      backHome() {
        this.$store.state.menuChange = true;
        this.$api.sSetObject('_menuChange', true);
        this.$router.push("/ProjectManage");
      },
      loadData(){
        var self = this;
        self.$api.post('auth/queryAuthEntityByUserId', {}, r => {
          console.log(r);
          self.viewMenu = r.repData[0].child;
        })
      },
      isAdmin(){
        this.admin = Number(this.$api.sGetObject('_user').isAdmin);
      }
    },
    created: function () {
      // this.activeMenu = this.$route.path;
      this.$store.state.activeMenu = this.$route.path;
      // console.log(this.$route.path)
      this.isAdmin();
      this.user = api.sGetObject("_user");
      this.$store.state.isCollapse = this.$api.sGetObject('_isCollapse');
      this.$store.state.menuChange = this.$api.sGetObject('_menuChange');
      this.menuChange = this.$api.sGetObject('_menuChange');
      this.$store.state.porjectName = this.$api.sGetObject('_porjectName');
    }
  }
</script>

<style lang='scss' scoped>
.el-menu{
	border:0;
}
.home{
  /*font-size: 24px;*/
  span{
    font-size: 24px;
  }
  .text{
    color: #ffffff;
    margin: 0 5px;
  }
}
</style>
