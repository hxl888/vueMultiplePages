import CONFIG from 'common/js/config';
import axios from 'axios';
// var RandomNumBoth = function(Min, Max) {
//   var Range = Max - Min;
//   var Rand = Math.random();
//   var num = Min + Math.round(Rand * Range); //四舍五入
//   return num;
// };
var ajax = {
  //请求后台接口
  callZhiboServer: function(url, callback) {
    var jsonpUrl = CONFIG.KUWOLIVE_SERVICE + url + '&r=' + Math.random();
    return new Promise(function(resolve) {
      var _url = jsonpUrl + '&callback=' + callback;
      var callbackName = callback;
      var head = document.getElementsByTagName('head')[0];
      //设置传递给后台的回调参数名
      var script = document.createElement('script');
      head.appendChild(script);
      //创建jsonp回调函数
      window[callbackName] = function(json) {
        resolve(json);
        head.removeChild(script);
        clearTimeout(script.timer);
        window[callbackName] = null;
      };
      script.src = _url;
    });
  },
  //请求Web端接口
  callWebServer: function(url, callback) {
    // axios.defaults.baseURL = 'https://jx.kuwo.cn/';
    if (url.indexOf('?') > 0) {
      url = url + '&r=' + Math.random();
    } else {
      url = url + '?r=' + Math.random();
    }
    var domain = '//' + window.location.host + '/KuwoLive/';
    // var domain = 'https://jx.kuwo.cn/KuwoLive/';
    axios({
      method: 'get',
      dataType: 'json',
      url: domain + url
    })
      .then(function(response) {
        return callback && callback(response.data);
      })
      .catch(function(error) {
        // console.log(error);
        return Promise.reject(error);
        // errorCallback && errorCallback(error);
      });
  }
};
export default ajax;
