<template>
  <div class="function-detail-item">
    <div class="title">查看明细</div>
    <div class="result-num">
      <span class="item">
        接口：{{uri}}
      </span>
      <span class="item">
        测试开始时间：{{startTime}}
      </span>
      <span class="item">
        测试结束时间：{{startTime}}
      </span>
    </div>
    <el-row>
      <el-col :span="2" class="col-1" >失败信息：</el-col>
      <el-col :span="16">
        <el-input  type="textarea" v-model="failRmk" placeholder="" style="min-height: 100px"></el-input>
      </el-col>
    </el-row>
    <el-row >
      <el-col :span="2" class="col-1">请求报文：</el-col>
      <el-col :span="16" >
        <el-input :autosize="{ minRows: 2, maxRows: 8}" type="textarea" v-model="parameter" placeholder="" style="min-height: 100px"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10" style="margin-left: 5%;margin-right: 2%;line-height: 40px;">
        <label>期望响应报文</label>
        <!--<el-input :autosize="{ minRows: 2, maxRows: 8}"  type="textarea" v-model="qResponse" placeholder="" style="height: 300px"></el-input>-->
      </el-col>
      <el-col :span="10" style="line-height: 40px;">
        <label>实际响应报文</label>
        <!--<el-input :autosize="{ minRows: 2, maxRows: 8}" type="textarea" v-model="sResponse" placeholder="" style="height: 300px"></el-input>-->
      </el-col>
    </el-row>
    <div id="view" style="margin-left: 5%;margin-right: 2%;"></div>
    <div class="back">
      <el-button type="" @click="submit" style="background: #5bc0de;color: #fff;">新增对比规则</el-button>
      <el-button type="" @click="back" style="width: 100px;">返回</el-button>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts/lib/echarts';
  import 'echarts/lib/chart/bar';
  import 'echarts/lib/component/tooltip';
  import 'echarts//lib/component/legend';
  import 'echarts//lib/component/title';
  import CodeMirror from 'codemirror'
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/addon/merge/merge.js'
  import 'codemirror/addon/merge/merge.css'
  import DiffMatchPatch from 'diff-match-patch'
  window.diff_match_patch = DiffMatchPatch
  window.DIFF_DELETE = -1
  window.DIFF_INSERT = 1
  window.DIFF_EQUAL = 0
  export default {
    data() {
      return {
        funResDetailItem: null,
        uri: '',
        startTime: null,
        endTime: null,
        id: '',
        failRmk: null,
        parameter: null,
        qResponse: null,
        sResponse: null,
      }
    },
    computed: {
    },
    methods: {
      loadData() {
        var self = this;
        var url = 'project/' + this.projectCode + '/testFunc/view/queryTFuncExecutionResultByGroupUriDetail';
        var p = {
          "id": this.id
        }
        // console.log(p)
        self.$api.post(url, p, r => {
          console.log(r)

          this.failRmk = r.data.failRmk;
          this.parameter = this.formatJson(r.data.parameter);
          // this.parameter = JSON.stringify(r.data.parameter,null,2);
          this.qResponse = this.formatJson(r.data.qResponse);
          this.sResponse = this.formatJson(r.data.sResponse);
          this.initUI(this.qResponse,this.sResponse);
        })
      },
      initUI(value,orig2) {
        if (value == null) return;
        let target = document.getElementById("view");
        target.innerHTML = "";
        CodeMirror.MergeView(target, {
          value: value,//上次内容
          origLeft: null,
          orig: orig2,//本次内容
          lineNumbers: true,//显示行号
          mode: "text/html",
          highlightDifferences: true,
          connect: 'align',
          readOnly: true,//只读 不可修改
        });
      },
      submit(){
        this.$router.push("/NewRule?uri="+ this.uri);
        // this.$router.push({path:'/NewRule'});
      },
      back() {
        window.history.back();
      },
      formatJson(txt, compress) {
        var indentChar = ' ';
        if (/^\s*$/.test(txt)) {
          // alert('数据为空,无法格式化! ');
          return;
        }
        try {
          var data = eval('(' + txt + ')');
        }
        catch (e) {
          // alert('数据源语法错误,格式化失败! 错误信息: ' + e.description, 'err');
          // return;
          return txt;
        }
        var draw = [], last = false, This = this, line = compress ? '' : '\n', nodeCount = 0, maxDepth = 0;

        var notify = function (name, value, isLast, indent/*缩进*/, formObj) {
          nodeCount++;
          /*节点计数*/
          for (var i = 0, tab = ''; i < indent; i++)tab += indentChar;
          /* 缩进HTML */
          tab = compress ? '' : tab;
          /*压缩模式忽略缩进*/
          maxDepth = ++indent;
          /*缩进递增并记录*/
          if (value && value.constructor == Array) {/*处理数组*/
            draw.push(tab + (formObj ? ('"' + name + '":') : '') + '[' + line);
            /*缩进'[' 然后换行*/
            for (var i = 0; i < value.length; i++) {
              notify(i, value[i], i == value.length - 1, indent, false);
            }
            draw.push(tab + ']' + (isLast ? line : (',' + line)));
            /*缩进']'换行,若非尾元素则添加逗号*/
          } else if (value && typeof value == 'object') {/*处理对象*/
            draw.push(tab + (formObj ? ('"' + name + '":') : '') + '{' + line);
            /*缩进'{' 然后换行*/
            var len = 0, i = 0;
            for (var key in value) {
              len++;
            }
            for (var key in value) {
              notify(key, value[key], ++i == len, indent, true);
            }
            draw.push(tab + '}' + (isLast ? line : (',' + line)));
            /*缩进'}'换行,若非尾元素则添加逗号*/
          } else {
            if (typeof value == 'string') {
              value = '"' + value + '"';
            }
            draw.push(tab + (formObj ? ('"' + name + '":') : '') + value + (isLast ? '' : ',') + line);
          }
        };
        var isLast = true, indent = 0;
        notify('', data, isLast, indent, false);
        return draw.join('');
      },
    },
    created() {
      this.projectCode = this.$api.sGetObject('_projectCode');
      this.funResDetailItem = this.$api.sGetObject('_funResDetailItem');
      // console.log(this.funResDetailItem)
      this.funResDetail = this.$api.sGetObject('_funResDetail');
      console.log(this.funResDetailItem);
      this.uri = this.funResDetail.uri;
      this.id = this.funResDetailItem.id;
      this.startTime = this.datetimeFormat(this.funResDetailItem.startTime);
      this.endTime = this.datetimeFormat(this.funResDetailItem.endTime);
      this.loadData();
    }
  }
</script>

<style lang="scss" scoped>
  .function-detail-item{
    .title{
      margin-top: 30px;
      margin-left: 2%;
      font-size: 24px;
      color: #999999;
    }
    .col-1{
      margin-left: 5%;
      line-height: 40px;
    }
    .result-num{
      margin-top: 30px;
      margin-left: 2%;
      margin-right: 2%;
      padding-bottom: 30px;
      .item{
        display: inline-block;
        padding: 0 10px;
        height: 30px;
        background: #5bc0de;
        color: #fff;
        line-height: 30px;
        border-radius: 3px;
        text-align: center;
        margin-right: 2%;
      }
    }
    .back{
      text-align: center;
      margin-top: 30px;
      margin-bottom: 40px;
    }
  }
</style>
