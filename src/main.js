import Vue from 'vue'
import router from './router'
import App from './App'
import store from './store'; // vuex

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../src/common/style/common.css'
Vue.use(ElementUI);

import {mixin} from './mixins/index'
Vue.mixin(mixin);

import api from './common/js/index'
Vue.prototype.$api = api;
window.store = store;
// // 引入vue-amap
// import AMap from 'vue-amap';
// Vue.use(AMap);
//
// // 初始化vue-amap
// AMap.initAMapApiLoader({
//   // 申请的高德key
//   key: '0296ed2b5d64b75e6dd46fe87b45b686',
//   // 插件集合
//   plugin: ['']
// });

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  // render: h => h(App)
  components: { App },
  template: '<App/>'
})

