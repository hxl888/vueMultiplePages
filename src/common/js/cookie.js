/**
 * cookie的相关工具模块
 */
import CONFIG from 'common/js/config';
var documentDomain = CONFIG.documentDomain; // 一级域名，涉及cookie，一定要与servlet层返回的cookie域相同，慎动
var projectNs = CONFIG.projectNs;
var newDomain = location.host;

var COOKIE = {
  getCookie: function(cookieName) {
    var arg = cookieName + '=';
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
      var j = i + alen;
      if (document.cookie.substring(i, j) == arg) {
        var endstr = document.cookie.indexOf(';', j);
        if (endstr == -1) {
          endstr = document.cookie.length;
        }
        var ret = unescape(document.cookie.substring(j, endstr));
        if (ret != '') {
          return ret;
        }
      }
      i = document.cookie.indexOf(' ', i) + 1;
      if (i == 0) break;
    }
    return '';
  },
  addCookie: function(cookieName, cookieValue, tm) {
    //tm过期日期的时间戳
    var expdate = new Date();
    var argv = arguments;
    var argc = arguments.length;
    var exp = 365 * 24 * 3600;
    var expires = argc > 2 && argv[2] != 0 ? argv[2] : null;
    var path = '/';
    var domain = documentDomain;
    var secure = argc > 5 ? argv[5] : false;

    if (tm) {
      expdate.setTime(tm);
    } else {
      expdate.setTime(expdate.getTime() + exp * 10);
    }

    document.cookie =
      cookieName +
      '=' +
      escape(cookieValue) +
      '; expires=' +
      expdate.toGMTString() +
      (path == null ? '' : '; path=' + path) +
      (domain == null ? '' : '; domain=' + domain) +
      (secure == true ? '; secure' : '');
  },
  setCookie: function(cookieName, cookieValue, exp) {
    var expdate = new Date();
    var argv = arguments;
    var argc = arguments.length;
    var path = '/';
    var domain = documentDomain;
    var secure = argc > 5 ? argv[5] : false;
    expdate.setTime(expdate.getTime() + exp * 1000);
    document.cookie =
      cookieName +
      '=' +
      encodeURIComponent(cookieValue) +
      '; expires=' +
      expdate.toGMTString() +
      (path == null ? '' : '; path=' + path) +
      (domain == null ? '' : '; domain=' + domain) +
      (secure == true ? '; secure' : '');
  },
  delCookie: function(cookieName) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 100);
    document.cookie =
      cookieName +
      '=; path=/; domain=' +
      documentDomain +
      '; expires=' +
      exp.toGMTString();
    document.cookie =
      cookieName +
      '=; path=' +
      projectNs +
      '/lb/; domain=' +
      newDomain +
      '; expires=' +
      exp.toGMTString();
    document.cookie = cookieName + '=; path=/; expires=' + exp.toGMTString();
  }
};
export default COOKIE;
