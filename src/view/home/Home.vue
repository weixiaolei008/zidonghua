<template>
	<div style="width: 100%;height: 100%;min-width: 1200px;">
		<el-container style="width: 100%;height:100%;">
    <el-aside style="width: auto; background: #545c64; border-right: 1px solid #ccc;">
      <Menu></Menu>
    </el-aside>
    <el-container style="padding: 10px;background: #f9f9f9;">
      <el-header style="padding: 0;">
        <Header></Header>
      </el-header>
      <el-container>
        <el-header style="margin: 0;padding: 0;line-height: 60px;">
          <el-breadcrumb separator="/" class="crumbs">
            <el-breadcrumb-item><span @click="backHome" class="nav">
              <i class="icon iconfont icon-fangzihouse128" style="color: #000;margin-right: 3px;font-size: 12px;"></i>
              首页</span></el-breadcrumb-item>
            <el-breadcrumb-item :to="'/Project'" v-if="porjectName" class="nav">{{porjectName}}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="activeName"><span @click="toHistory" class="nav">{{activeName}}</span></el-breadcrumb-item>
            <el-breadcrumb-item v-if="activeName2"><span  style="cursor: pointer">{{activeName2}}</span></el-breadcrumb-item>
          </el-breadcrumb>
        </el-header>
        <el-main style="padding: 0;background: #fff;width: 100%;height: 100%;">
          <Content></Content>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
	</div>
</template>

<script>
	import Menu from '../menu/Menu.vue'
	import Header from '../header/Header.vue'
	import Content from '../content/Content.vue'

	export default {
		data() {
			return {}
		},
    methods: {
      backHome() {
        this.$store.state.menuChange = true;
        this.$api.sSetObject('_menuChange', true);
        this.$router.push("/ProjectManage");
      },
      toHistory() {
        this.$router.push(this.activeMenu);
      }
    },
    computed: {
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
      activeName:{
        get(){
          // console.log(this.$store.state.activeMenu)
          return this.$store.state.activeName;
        },
        set(){
        }
      },
      activeName2:{
        get(){
          // console.log(this.$store.state.activeMenu)
          return this.$store.state.activeName2;
        },
        set(){
        }
      }
    },
		components: {
			Menu,
			Header,
			Content
		},
    created: function () {

    }
	}
</script>

<style lang="scss" scoped>
.nav{
  cursor: pointer;
  color: #000;
  &:hover{
    color: #00aced;
  }
}
</style>
