<template>
  <div class="project-nav">
    <el-row class="project-config">
      <el-col :span="4">
        <div class="project-block" @click="nav(0)">
          <div class="project-img">
            <img src="../../../common/img/pic04.png" alt="">
            <div style="border-bottom: 10px solid #f9cc2b;"></div>
          </div>
          <div class="nav-item"><div class="sort-number">1</div>环境配置</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="project-block" @click="nav(1)">
          <div class="project-img">
            <img src="../../../common/img/pic06.png" alt="">
             <div style="border-bottom: 10px solid #9358ac;"></div>
          </div>
          <div class="nav-item"><div class="sort-number">2</div>数据还原</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="project-block" @click="nav(2)">
          <div class="project-img">
            <img src="../../../common/img/pic03.png" alt="">
            <div style="border-bottom: 10px solid #56aeee;"></div>
          </div>
          <div class="nav-item"><div class="sort-number">3</div>数据脱敏</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="project-block" @click="nav(3)">
          <div class="project-img">
            <img src="../../../common/img/pic05.png" alt="">
             <div style="border-bottom: 10px solid #f84436;"></div>
          </div>
          <div class="nav-item"><div class="sort-number">4</div>比对规则</div>
        </div>
      </el-col>
    </el-row>
    <el-row class="project-config">
      <img src="../../../common/img/next02.png" alt="" style="margin-left: 13px;">
    </el-row>
    <el-row class="project-config">
      <el-col :span="4">
        <div class="project-block" @click="nav(4)">
          <div class="project-img">
            <img src="../../../common/img/pic01.png" alt="">
            <div style="border-bottom: 10px solid #8dc25a;"></div>
          </div>
          <div class="nav-item">功能测试</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="project-block" @click="nav(5)">
          <div class="project-img">
            <img src="../../../common/img/pic02.png" alt="">
            <div style="border-bottom: 10px solid #00c6db;"></div>
          </div>
          <div class="nav-item">普通压测</div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="project-block" @click="nav(6)">
          <div class="project-img">
            <img src="../../../common/img/pic07.png" alt="">
            <div style="border-bottom: 10px solid #2E8B57;"></div>
          </div>
          <div class="nav-item">混合压测</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  export default {
    components: {
    },
    data() {
      return {
        navList: [
          '/EnvConfig',
          '/DataConfig',
          '/Desensitization',
          '/RuleConfig',
          '/FunctionTest',
          '/PressureTest',
          '/ScenePressureTest',
        ]
      }
    },
    computed: {
    },
    methods: {
      nav(index){
        this.$router.push(this.navList[index]);
      }
    },
    created() {
      this.$store.state.menuChange = false;
      this.$api.sSetObject('_menuChange', false);
      this.$store.state.activeMenu = this.$route.path;
      this.$store.state.activeName = null;
    }
  }

</script>

<style lang="scss" scoped>
  .project-nav{
    background: #f9f9f9;
    padding-left: 30px;
    height: 100%;
    min-height: 450px;
    .project-test,.project-config{
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding-right: 40px;
      .el-col-4 {
        width: 16%;
        margin-left: 13px;
        min-height: 150px;
      }
      .title{
        font-size: 24px;
      }
      .nav-item{
        line-height: 30px;
        font-size: 15px;
        text-align: center;
        .sort-number{
          display: inline-block;
          width:15px;
          height:15px;
          line-height: 15px;
          border-radius: 50%;
          border: 2px solid;
          text-align: center;
          font-size: 13px;
          font-weight: 500;
        }
      }
      .project-block{
        border:1px solid #ccc;
        cursor: pointer;
        box-sizing: border-box;
        background: #f9f9f9;
        height: 156px;
        margin: 5px 0;
        .project-img{
          background: #fff;
          height: 120px;
          text-align: center;
          margin: 0 auto;
          border-bottom: 1px solid #ccc;
          img{
            padding: 18px 0 15px 0;
          }
          div{
           width: 120px;
           margin: 0 auto;
          }
        }
      }
    }
  }
</style>
