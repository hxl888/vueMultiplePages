/* eslint-disable indent */
/**公共方法
 * xinlei.hu
 */
var commonUtil = {
  getRandomNumber: function(min, max) {
    // 获取随机数
    return parseInt(Math.random() * (max - min + 1) + min);
  },
  handleRank: function(rank, limit) {
    var rankText = '';
    rank = parseInt(rank);
    if (limit) {
      if (rank > limit || rank == -1 || rank == 0) {
        rankText = limit + '+';
      } else if (rank > 0 && rank <= limit) {
        rankText = rank;
      }
    } else {
      rankText = rank == -1 || rank == 0 ? '暂无' : rank;
    }

    return rankText;
  },
  getPercentage: function(cnt1, cnt2) {
    // 获得百分比数字
    var num = 0;

    if (cnt1 == 0 && cnt2 == 0) {
      num = 50;
    } else if (cnt1 != 0 && cnt2 == 0) {
      num = 100;
    } else {
      num = (cnt1 / (cnt1 + cnt2)) * 100;
    }
    return num;
  },
  throttle(func, delay) {
    var timer = null;
    var startTime = Date.now();
    return function() {
      var curTime = Date.now();
      var remaining = delay - (curTime - startTime);
      var context = this;
      var args = arguments;
      clearTimeout(timer);
      if (remaining <= 0) {
        func.apply(context, args);
        startTime = Date.now();
      } else {
        timer = setTimeout(func, remaining);
      }
    };
  },
  debounce(fn, delay) {
    let delays = delay || 500;
    let timer;
    return function() {
      let th = this;
      let args = arguments;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        timer = null;
        fn.apply(th, args);
      }, delays);
    };
  },
  versionfunegt: function(ver1, ver2) {
    var version1pre = parseFloat(ver1);
    var version2pre = parseFloat(ver2);
    var version1next = ver1.replace(version1pre + '.', '');
    var version2next = ver2.replace(version2pre + '.', '');
    if (version1pre > version2pre) {
      return true;
    } else if (version1pre < version2pre) {
      return false;
    } else {
      if (version1next >= version2next) {
        return true;
      } else {
        return false;
      }
    }
  },
  changeLocalHistroy: function(type) {
    // 改变地址栏中的type 防止跳页面再跳回来之后页面 导航回到默认tab页
    history.replaceState({}, null, '?type=' + type);
  },
  getPicImg: function(picUrl, smal) {
    if (!smal)
      return picUrl
        ? decodeURIComponent(picUrl)
        : '//imagexc.kuwo.cn/kuwolive/136-136-user.jpg';
    if (picUrl) {
      picUrl = decodeURIComponent(picUrl);
      if (!smal) {
        // 返回原图
        return commonUtil.resetPicurl(picUrl);
      }
      // 返回小图 加b后缀小图
      if (picUrl.indexOf('.jpg') == -1) return commonUtil.resetPicurl(picUrl);
      return commonUtil.resetPicurl(picUrl.split('.jpg')[0] + 'b.jpg');
    } else {
      return '//imagexc.kuwo.cn/kuwolive/136-136-user.jpg';
    }
  },
  resetPicurl: function(url) {
    if (!url) return;
    // return location.protocol + '//' + url.split('://')[1];
    return (
      url.replace('http://imgxc1.kwcdn', 'https://kwimg') ||
      url.replace('https://imgxc1.kwcdn', 'https://kwimg')
    );
  },
  getName: function(name) {
    return name ? decodeURIComponent(name) : '';
  },
  showFamilyPic: function(fmid) {
    // 家族徽章图片
    if (!parseInt(fmid))
      return '//imagexc.kuwo.cn/kuwolive/huodong/h5familyLeagueSpring2019/mobile/noBadge.png'; // 暂时写
    return '//imagexc.kuwo.cn/kuwolive/klive/badge_bak2/' + fmid + '.png';
  },
  showActivePic: function(badgeId, flag) {
    // 活动等级勋章
    flag = flag || false;
    if (!badgeId)
      // return '//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019pc/0.png'
      return '//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019pc/0.png';
    if (flag) {
      // 小图
      return '//imagexc.kuwo.cn/kuwolive/badge/' + badgeId + '_s.png?';
    } else {
      // 大图
      return '//imagexc.kuwo.cn/kuwolive/badge/' + badgeId + '.png?';
    }
  },
  handleTime: function(time) {
    return time < 10 ? '0' + time : time;
  },
  getRequest: function() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf('?') != -1) {
      var str = url.substr(1),
        strs = str.split('&');
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
      }
    }
    return theRequest;
  },
  getIsAhchor: function() {
    // 判断是主播还是用户
    if (
      window.myinfoObj &&
      window.myinfoObj.user &&
      window.myinfoObj.user.id == window.enterInfo.user.id &&
      window.enterInfo.user.singerstatus == 2
    ) {
      // 是主播
      return true;
    } else {
      return false;
    }
  },
  getDownDateStr: function(downTimeStr, nowDateNum, call) {
    var tow = function(n) {
      return n >= 0 && n < 10 ? '0' + n : '' + n;
    };
    var oldTime = nowDateNum * 1000; //现在距离1970年的毫秒数
    var newDate = new Date(downTimeStr);
    var newTime = newDate.getTime(); //2019年距离1970年的毫秒数
    if (newTime - oldTime > 0) {
      var second = Math.floor((newTime - oldTime) / 1000); //未来时间距离现在的秒数
      var day = Math.floor(second / 86400); //整数部分代表的是天；一天有24*60*60=86400秒 ；
      second = second % 86400; //余数代表剩下的秒数；
      var hour = Math.floor(second / 3600); //整数部分代表小时；
      second %= 3600; //余数代表 剩下的秒数；
      var minute = Math.floor(second / 60);
      second %= 60;
    } else {
      day = 0;
      hour = 0;
      minute = 0;
      second = 0;
      call && call();
      return '00:00:00';
    }
    var str =
      '<span>' +
      tow(day) +
      '</span><em>天</em>' +
      '<span>' +
      tow(hour) +
      '</span><em>时</em>';
    '<span>' +
      tow(minute) +
      '</span><em>分</em>' +
      '<span>' +
      tow(second) +
      '</span><em>秒</em>';

    return str;
  },
  countdown(min, sec, txtCallback, callback) {
    var _this = this;
    var minHtml = '';
    var secHtml = '';

    var run = function() {
      if (min == 0 && sec == 0) {
        minHtml = '00';
        secHtml = '00';
        if (_this.counter) {
          clearInterval(_this.counter);
        }
        if (callback && typeof callback == 'function') {
          // 随机数防止 倒计时结束同时向服务请求、服务器承载过大！！！（1s 到 5s 之前的随机数 分批去请求接口）
          var downRanDomTime = _this.getRandomNumber(1000, 5000);
          setTimeout(function() {
            callback();
          }, downRanDomTime);
        }
      } else if (min >= 0) {
        if (sec > 0) {
          sec--;
        } else if (sec == 0) {
          min--;
          sec = 59;
        }
        minHtml = _this.handleTime(min);
        secHtml = _this.handleTime(sec);
      }
      txtCallback && txtCallback(`${minHtml}:${secHtml}`);
      // _this.downTimeHtml = `${minHtml}:${secHtml}`;
    };
    if (_this.counter) {
      clearInterval(_this.counter);
    }
    _this.counter = setInterval(run, 1000);
  },
  dateFormat: function(dateTime, flag, str) {
    var strs = str ? str : '/';
    if (typeof dateTime === 'number') {
      var oDate = new Date(dateTime * 1000);
      var year = oDate.getFullYear();
      var month =
        oDate.getMonth() + 1 >= 10
          ? oDate.getMonth() + 1
          : '0' + (oDate.getMonth() + 1);
      var date =
        oDate.getDate() >= 10 ? oDate.getDate() : '0' + oDate.getDate();
      var hours =
        oDate.getHours() >= 10 ? oDate.getHours() : '0' + oDate.getHours();
      var minutes =
        oDate.getMinutes() >= 10
          ? oDate.getMinutes()
          : '0' + oDate.getMinutes();
      var seconds =
        oDate.getSeconds() >= 10
          ? oDate.getSeconds()
          : '0' + oDate.getSeconds();
      if (flag) {
        return year + strs + month + strs + date;
      } else {
        return (
          year +
          strs +
          month +
          strs +
          date +
          ' ' +
          hours +
          ':' +
          minutes +
          ':' +
          seconds
        );
      }
    } else {
      return '';
    }
  },
  formatObjToStr: function(obj) {
    return encodeURIComponent(encodeURIComponent(JSON.stringify(obj)));
  },
  isEmptyObj: function(obj) {
    // 判断对象是否为空 返回true则为空对象，false则不是空对象
    return (
      !Object.getOwnPropertySymbols(obj).length &&
      !Object.getOwnPropertyNames(obj).length
    );
  },
  isArray: function(obj) {
    // 判断是否为数组
    return Object.prototype.toString.call(obj) == '[object Array]';
  },
  /*
  /*
   * 判断obj是否为一个整数
   */
  isInteger: function(obj) {
    return Math.floor(obj) === obj;
  },
  /*
   * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, num: 314}
   */
  toInteger: function(floatNum) {
    var ret = { times: 1, num: 0 };
    if (commonUtil.isInteger(floatNum)) {
      ret.num = floatNum;
      return ret;
    }
    var strfi = floatNum + '';
    var dotPos = strfi.indexOf('.');
    var len = strfi.substr(dotPos + 1).length;
    var times = Math.pow(10, len);
    var intNum = parseInt(floatNum * times + 0.5, 10);
    ret.times = times;
    ret.num = intNum;
    return ret;
  },
  checkNumber: function(str) {
    // 判断是否为数字
    var n = Number(str);
    if (!isNaN(n)) {
      return true;
    }
    return false;
  },
  getQueryStringArgs: function() {
    var qs = location.search.length > 0 ? location.search.substring(1) : '',
      args = {},
      items = qs.length ? qs.split('&') : [],
      item = null,
      name = null,
      value = null,
      i = 0,
      len = items.length;

    for (i = 0; i < len; i++) {
      item = items[i].split('=');
      name = decodeURIComponent(decodeURIComponent(item[0]));
      value = decodeURIComponent(decodeURIComponent(item[1]));
      if (name.length) {
        args[name] = value;
      }
    }
    return args;
  },
  /*
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   * @param a {number} 运算数1
   * @param b {number} 运算数2
   * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
   *
   */
  operation: function(a, b, op) {
    var o1 = commonUtil.toInteger(a);
    var o2 = commonUtil.toInteger(b);
    var n1 = o1.num;
    var n2 = o2.num;
    var t1 = o1.times;
    var t2 = o2.times;
    var max = t1 > t2 ? t1 : t2;
    var result = null;
    switch (op) {
      case 'add':
        if (t1 === t2) {
          // 两个小数位数相同
          result = n1 + n2;
        } else if (t1 > t2) {
          // o1 小数位 大于 o2
          result = n1 + n2 * (t1 / t2);
        } else {
          // o1 小数位 小于 o2
          result = n1 * (t2 / t1) + n2;
        }
        return result / max;
      case 'subtract':
        if (t1 === t2) {
          result = n1 - n2;
        } else if (t1 > t2) {
          result = n1 - n2 * (t1 / t2);
        } else {
          result = n1 * (t2 / t1) - n2;
        }
        return result / max;
      case 'multiply':
        result = (n1 * n2) / (t1 * t2);
        return result;
      case 'divide':
        result = (n1 / n2) * (t2 / t1);
        return result;
    }
  },
  add: function(a, b) {
    // 加
    return commonUtil.operation(a, b, 'add');
  },
  subtract: function(a, b) {
    // 减
    return commonUtil.operation(a, b, 'subtract');
  },
  multiply: function(a, b) {
    // 乘
    return commonUtil.operation(a, b, 'multiply');
  },
  divide: function(a, b) {
    // 除
    return commonUtil.operation(a, b, 'divide');
  }
};
export default commonUtil;
