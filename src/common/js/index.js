import md5 from 'js-md5';
import {Message} from 'element-ui'

// 引用axios
var axios = require('axios')

// 自定义判断元素类型JS
function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

/* token校验，加密校验 */
function sign(p) {
  let token;
  let user = sGetObject("_user");
  if (user == undefined || user == null) {
    token = '';
  }
  else {
    token = user.token;
  }
  var signData = {
    token: token,
    // time: time,
    reqData: p,
    // sign: md5(content).toUpperCase()
  }
  //return JSON.stringify(signData);
  return signData;
  // console.log(signData)
};

/*
  接口处理函数
  这个函数每个项目都是不一样的，我现在调整的是适用于
  https://cnodejs.org/api/v1 的接口，如果是其他接口
  需要根据接口的参数进行调整。参考说明文档地址：
  https://cnodejs.org/topic/5378720ed6e2d16149fa16bd
  主要是，不同的接口的成功标识和失败提示是不一致的。
  另外，不同的项目的处理方法也是不一致的，这里出错就是简单的alert
*/

function apiAxios(method, url, params, success, failure) {
  // console.log(url)
  var self = this;
  if (params) {
    if(url == 'login'){
      var psw = md5(params.password);
      params.password = psw;
    }else if(url == '/user/changePwd'){
      var psw = md5(params.oldPwd);
      params.oldPwd = psw;
      params = sign(params);
    }
    else{
      params = sign(params);
    }
    // console.log(params);
    // console.log(url);
  }
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: process.env.API_ROOT,
    withCredentials: false,
    headers: url.indexOf("/admin/uploadFile")>=0? {'Content-Type': 'multipart/form-data'}:{},
    //timeout: 5000,
    // headers: {
    //   'X-Requested-With': 'XMLHttpRequest',
    //   'Content-Type': 'application/json; charset=UTF-8'
    // }
  })
    .then(function (res) {
      // console.log(res)
      if (res.data.status === 200) {
        if (res.data.message) {
          if (success) {
            success(res.data)
          }
        } else {
          // console.log(res)
          Message.error({
            message: JSON.stringify(res.data)
          })
        }
      } else if(res.data.status === 403101){
        alert('Token is null or expired.')
        sessionStorage.clear();
        window.location.reload();
      } else {
        // console.log(res)
        Message.error({
          message: res.data.data || res.data.message
        })
      }
    })
    .catch(function (err) {
      console.log(err);
      // console.log(url)
      Message.error({
        message: '服务器异常'
      })
      // let res = err.response
      // if (err) {
      //   Message.error({
      //     message: res.status
      //   })
      //   window.alert('api error, HTTP CODE: ' + res.status)
      // }
    })
}

function sGetObject(k) {
  try {
    var v = sessionStorage.getItem(k);
    return v == null ? null : JSON.parse(v);
  } catch (e) {
  }
};

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure) {
    return apiAxios('GET', url, params, success, failure)
  },
  post: function (url, params, success, failure) {
    return apiAxios('POST', url, params, success, failure)
  },
  put: function (url, params, success, failure) {
    return apiAxios('PUT', url, params, success, failure)
  },
  delete: function (url, params, success, failure) {
    return apiAxios('DELETE', url, params, success, failure)
  },
  sSetObject: function (k, v) {
    try {
      sessionStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
    }
  },
  sGetObject: function (k) {
    try {
      var v = sessionStorage.getItem(k);
      return v == null ? null : JSON.parse(v);
    } catch (e) {
    }
  }
}
