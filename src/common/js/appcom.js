/* eslint-disable */
import Events from 'common/js/events';

/**
 * 获取App信息
 */
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;

var OSFlag = false; // true:ios   false:安卓

if (isAndroid) {
  OSFlag = false;
} else {
  OSFlag = true;
}
window.OSFlag = OSFlag;
var isLogin = false; //true已登录        false未登录

/**
 * 获取Src结束
 */

/**
 * 用户信息
 */
var uid = 0;
var websid = 0;
var secrectname = '';
var logintype = 0;
var roomid = 1048882442;
var coin = 0;
var enterInfo;
var myinfoObj;
var appSrc = ''; //iphone_jx(iphone独立版) android_jx(android独立版) iphone_mbox(iphone航母版) android_mbox(android航母版)
var appVersion = '';
var jsVersion = null; // 此变量（因为安卓航母版 每次增加h5协议之后不能通过appVersion 版本号进行区分是否调取对应的 so 新增此变量）

var h5SinginInfo = ''; //签到token

var roomCache = {}; //app房间内缓存
var appCache = {}; //app级别缓存
var myInfoAndEnterInfoData = {}; //同时获取登录信息进房信息渠道号

var macid = 0;

//非app环境，防止在浏览器报错
if (!window.KuwoInterface && !window.jscObj) {
  window.KuwoInterface = {
    jsCallNative: function(jsonstr) {}
  };
  window.jscObj = {
    getVersionInfo: function() {
      return {
        src: 'h5',
        version: '0.0.0'
      };
    }
  };
}

/**
 * 临时方法 验证是否登录
 */
function tempLoginTest() {
  if (OSFlag) {
    //ios
    setTimeout(function() {
      window.location.href = 'kwip://kwplayerhd/getmyinfoobj';
    }, 100);
  } else {
    //安卓
    var jsonstr =
      '{"action":"control_getmyinfoobj","callback":"getMyInfoObjCallBack"}';
    window.KuwoInterface.jsCallNative(jsonstr);
  }
}

function getMyInfoObjCallBack(data) {
  if ('' != data) {
    myinfoObj = eval('(' + data + ')');
    isLogin = true;
  } else {
    isLogin = false;
  }
  window.isLogin = isLogin;
}

//ios获取用户信息回调
function iosMyInfoObjCallback(data) {
  if ('0' != data) {
    myinfoObj = eval('(' + JSON.stringify(data) + ')');
    macid = myinfoObj.SSID || macid;
    //alert(JSON.stringify(myinfoObj.user));
    isLogin = true;
    window.macid = macid;
  } else {
    isLogin = false;
  }
  window.isLogin = isLogin;
}
window.getMyInfoObjCallBack = getMyInfoObjCallBack;
window.iosMyInfoObjCallback = iosMyInfoObjCallback;
tempLoginTest();
//临时方法结束
/**
 * 获取Src
 */
var getAppSrc = function() {
  if (OSFlag) {
    //appSrc = "iphone_jx";
    //window.location.href = "kwip://kwplayerhd/getversion";
    var iosVersionCallback = window.jscObj.getVersionInfo(); //ios回调用户返回版本号，该版本号可以用于区分独立版或者航母版
    appSrc = iosVersionCallback.src;
    window.appSrc = appSrc;
    // window.appSrc = appSrc;
  } else {
    //appSrc = "android_jx";
    var jsonstr =
      '{"action":"control_getversion","callback":"versionCallBack"}';
    window.KuwoInterface.jsCallNative(jsonstr);
  }
};

//android回调用户返回版本号，该版本号可以用于区分独立版或者航母版
var versionCallBack = function(data) {
  var data = eval('(' + data + ')');
  appSrc = data.src;
  macid = data.macid || macid;
  window.macid = macid;
  window.appSrc = appSrc;
};

//ios回调用户返回版本号，该版本号可以用于区分独立版或者航母版
var iosGetVersionCallback = function(data) {
  appSrc = data.src;
  window.appSrc = appSrc;
};
window.versionCallBack = versionCallBack;
window.iosGetVersionCallback = iosGetVersionCallback;
window.iosGetVersionCallback = iosGetVersionCallback;
/*
 * 获取app版本号
 *
 */
function getAppVersion() {
  //app版本号
  if (OSFlag) {
    var iosVersionCallback = window.jscObj.getVersionInfo(); //ios回调用户返回版本号，该版本号可以用于区分独立版或者航母版
    appVersion = iosVersionCallback.version;
    window.appVersion = appVersion;
  } else {
    var jsonstr =
      '{"action":"control_getversion","callback":"appVersionCallBack"}';
    window.KuwoInterface.jsCallNative(jsonstr);
  }
}

function appVersionCallBack(data) {
  //安卓获取版本号回调
  var data = eval('(' + data + ')');
  appVersion = data.version;
  jsVersion = data.jsversion;
  window.appVersion = appVersion;
  window.jsVersion = parseFloat(jsVersion);
}
window.appVersionCallBack = appVersionCallBack;
getAppSrc();
getAppVersion();

//安卓充值回调
function androidCallback(data) {
  if (data) {
    window.location.reload();
  }
}

function getMyInfoCallBack(data) {
  /*if(!data){//未登录
        try{
            KuwoInterface.jsCallNative('{"action":"control_login_getmyinfo"}');
        }catch(e){}
        return;
    }*/
  var user = eval('(' + data + ')');
  uid = user.uid;
  websid = user.sid;
  logintype = user.logintype;
  secrectname = user.secrectname;
  if (user.roomid) {
    roomid = user.roomid;
  }

  if (user.coin) {
    coin = user.coin;
  }
  window.secrectname = secrectname;
  window.logintype = logintype;
  window.coin = coin;
}
window.androidCallback = androidCallback;
window.getMyInfoCallBack = getMyInfoCallBack;
//ios获取用户信息后回调
function iosMyInfoCallback(data) {
  uid = data.uid;
  websid = data.sid;
  logintype = data.logintype;
  secrectname = data.secrectname;
  if (data.roomid) {
    roomid = data.roomid;
  }
  if (data.coin) {
    coin = data.coin;
  }
  window.secrectname = secrectname;
  window.logintype = logintype;
  window.coin = coin;
}

//iOS充值回调
function iosCallback(data) {
  if (data) {
    window.location.reload();
  }
}
window.iosCallback = iosCallback;
window.iosMyInfoCallback = iosMyInfoCallback;
function swfInvoke() {
  swfInvoke.cmdCallbackLister.trigger('flashNotice', arguments);
}
swfInvoke.cmdCallbackLister = new Events();

function androidNotifty(data) {
  var obj = eval('(' + data + ')');
  swfInvoke.cmdCallbackLister.trigger('flashNotice', obj);
}
function iOSNotiftInfoCallback(data) {
  swfInvoke.cmdCallbackLister.trigger('flashNotice', data);
}

function iosGetEnterInfoCallback(data) {
  enterInfo = data;
  // alert(JSON.stringify(data));
  // window.enterInfo = enterInfo;
  swfInvoke.cmdCallbackLister.trigger('enterInfoNotice', enterInfo);
}

function androidGetEnterInfoCallback(data) {
  var obj = eval('(' + data + ')');
  enterInfo = obj;
  // window.enterInfo = enterInfo;
  swfInvoke.cmdCallbackLister.trigger('enterInfoNotice', enterInfo);
}

function loginReload(data) {
  window.location.reload();
}

function getSinginTokenCallback(data) {
  h5SinginInfo = data;
  window.h5SinginInfo = h5SinginInfo;
}

function roomCacheCallBack(data) {
  var jsonData = JSON.parse(data);
  var key = jsonData.key;
  roomCache[key] = jsonData.value;
  window.roomCache = roomCache;
}

function appCacheCallBack(data) {
  var jsonData = JSON.parse(data);
  var key = jsonData.key;
  appCache[key] = jsonData.value;
  window.appCache = appCache;
}

function getMyInfoAndEnterInfoCallBack(data) {
  var jsonData = JSON.parse(data);
  myInfoAndEnterInfoData = jsonData;
  window.myInfoAndEnterInfoData = myInfoAndEnterInfoData;
}

/**********************与音乐盒相关模块*************************/

var isAppSrc; //是否从盒内进入活动页
var fromHead = false; //是否从盒内首页进入活动页
/**json字符串中非法 有引号相关的 转换成可以正常解析的json字符串**/
function validateJSONStr(data, replaceCharacter) {
  try {
    var json = eval('(' + data + ')');
  } catch (e) {
    try {
      var dataArray = data.split('');
      var dataArrayLength = dataArray.length;
      for (var i = 0; i < dataArrayLength; i++) {
        if (dataArray[i] == ':' && dataArray[i + 1] == '"') {
          for (var j = i + 2; j < dataArrayLength; j++) {
            if (dataArray[j] == '"') {
              if (dataArray[j + 1] != ',' && dataArray[j + 1] != '}') {
                dataArray[j] = replaceCharacter || '\\"';
              } else if (dataArray[j + 1] == ',' || dataArray[j + 1] == '}') {
                break;
              }
            }
          }
        }
      }
      data = dataArray.join('');
    } catch (e) {}
  }
  return data;
}

//手机本地方法调用 ------------------- Start
var nativeUtils = {
  /**
   * 调用本地方法
   *
   * @param {} jsonAdr Required 必须有
   * @param {} jsonIos	Optional
   */
  callNative: function(json) {
    if (!OSFlag) {
      try {
        window.KuwoInterface.jsCallNative(json);
      } catch (e) {}
    } else {
      var data = eval('(' + json + ')');
      var messagingIframe;
      messagingIframe = document.createElement('iframe');
      messagingIframe.style.display = 'none';
      document.documentElement.appendChild(messagingIframe);
      messagingIframe.src =
        'kwip://kwplayerhd/' +
        data.action +
        '?param=' +
        encodeURIComponent(json);
    }
  },
  /**
   * 获取设备信息
   *
   * 回调
   * feedback_deviceinfo(data) （ios）
   * feedback_ardeviceinfo(data) (android)
   */
  getDeviceinfo: function() {
    var jsonstr = '{"action":"control_get_deviceinfo","pagetype":"def"}';
    this.callNative(jsonstr);
  }
};
//手机本地方法调用 ------------------- End

// 调用客户端，获取设备信息
// 自己写好回调函数，安卓的回调函数是feedback_ardeviceinfo(data)，ios是feedback_deviceinfo(data)
// 设备和用户相关信息，客户端会在回调函数中给你

//在自己的页面调用此方法
//nativeUtils.getDeviceinfo();

// 安卓回调
function feedback_ardeviceinfo(data) {
  try {
    data = validateJSONStr(data);
  } catch (e) {}
  var uf = eval('(' + data + ')');
}
// ios回调
function feedback_deviceinfo(data) {
  try {
    data = validateJSONStr(data);
  } catch (e) {}
  var uf = eval('(' + data + ')');
  var heversion = uf.src;
  var heversion1 = heversion.split('_');
  isAppSrc = heversion1[2].slice(0, 5);
  fromHead = true;
  window.fromHead = fromHead;
  window.isAppSrc = isAppSrc;
}

/**********************与音乐盒相关模块*************************/

var documentDomain = 'kuwo.cn';
var projectNs = '/KuwoLive';
var newDomain = location.host;
var appcom = {
  callLogin: function() {
    //呼叫登录页面
    if (OSFlag) {
      //window.open("kwip://kwplayerhd/callLogin");
      window.jscObj.openLoginAlert();
    } else {
      try {
        window.KuwoInterface.jsCallNative(
          '{"action":"control_login_getmyinfo","callback":"loginReload"}'
        );
      } catch (e) {}
    }
  },
  callPay: function() {
    //呼叫充值页面
    if (OSFlag) {
      //ios
      window.open('kwip://kwplayerhd/open_recharge');
    } else {
      //安卓
      var jsonstr =
        '{"action":"control_pay_fragment","callback":"androidCallback"}';
      window.KuwoInterface.jsCallNative(jsonstr);

      jsonstr = '{"action":"pay_fragment","callback":"androidCallback"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  getRoomNotify: function(notify) {
    //获取房间内的通知
    if (OSFlag) {
      setTimeout(function() {
        window.location.href =
          'kwip://kwplayerhd/getnotifyinfo?notify=' + notify;
      }, 1000);
    } else {
      var jsonstr =
        '{"action":"control_getnotifyinfo","callback":"androidNotifty","notify":"' +
        notify +
        '"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  closeSmallPage: function() {
    //关闭视频旁边的H5
    if (OSFlag) {
      window.location.href = 'kwip://kwplayerhd/closethispage';
    } else {
      var jsonstr = '{"action":"control_closesmallpage"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  closeBigPage: function() {
    //关闭大的H5
    if (OSFlag) {
      //window.location.href = "kwip://kwplayerhd/closethispage"; //ios关闭功能已不支持该方式
      window.jscObj.closeH5Page();
    } else {
      var jsonstr = '{"action":"control_closebigpage"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  //type=1 该页面可以被新的openbigh5 请求顶替
  //type=2 该页面不能被新的openbigh5 请求顶替
  openBigPage: function(url, type, showFlag) {
    //打开大的H5  url 路径   type 1  showFlag 0不展示不再展示    1展示不再展示
    if (OSFlag) {
      url = encodeURIComponent(url);
      //window.location.href = "kwip://kwplayerhd/openbigh5?url="+url+"&type="+type+"&showFlag="+showFlag;
      window.jscObj.openOuterH5PageWithUrl(url);
    } else {
      var jsonstr =
        '{"action":"control_openbigh5","url":"' +
        url +
        '","type":"' +
        type +
        '","showFlag":"' +
        showFlag +
        '"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  pushpage: function(url, title) {
    //打开大的H5
    url = encodeURI(url);
    title = encodeURI(title);
    if (OSFlag) {
      window.open('kwip://kwplayerhd/pushpage?url=' + url + '&title=' + title); //url 会encode
    } else {
      var jsonstr =
        '{"action":"control_pushpage","url":"' +
        url +
        '","title":"' +
        title +
        '"}'; //url 会encode
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  //注意该方法的调用跟其他调用ios方法的处理不要同一时间做，需要一个操作完毕后再调用另一个或者每个操作之间留点时间间隔，否则可能导致ios回调不了
  getUserInfo: function() {
    //获取用户信息
    appcom.deleCookie('userid');
    appcom.deleCookie('websid');
    if (OSFlag) {
      //ios
      //ios
      //window.location.href = "kwip://kwplayerhd/getmyinfo";   2018.1.16修改为新接口  半年未更新的用户可能不支持使用app了
      var retObj = window.jscObj.getMyInfo();
      iosMyInfoCallback(retObj);
    } else {
      //安卓
      var getMyinfo =
        '{"action":"control_getmyinfo","callback":"getMyInfoCallBack"}';
      window.KuwoInterface.jsCallNative(getMyinfo);
    }
    var count = 0;
    var int = setInterval(function() {
      count++;
      if (
        uid != 0 &&
        websid != 0 &&
        typeof uid != 'undefined' &&
        typeof websid != 'undefined'
      ) {
        clearInterval(int);
        var data = {
          myinfo: myinfoObj,
          uid: uid,
          websid: websid
        };
        swfInvoke.cmdCallbackLister.trigger('getmyinfoNotice', data);
      }
      if (count > 15) {
        clearInterval(int);
      }
    }, 500);
  },
  deleCookie: function(cookieName) {
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
  },
  //ios返回的该接口的数据结构是固化的(结构已经定死了)，后台enterroom新加的数据结构该接口都收不到，只能利用原来的接口中已有的属性来处理
  getRoomInfo: function() {
    if (OSFlag) {
      window.location.href = 'kwip://kwplayerhd/getenterinfo';
    } else {
      var jsonstr =
        '{"action":"control_getenterinfo","callback":"androidGetEnterInfoCallback"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  refreshCoin: function(coin) {
    //刷新用户星币数, coin刷新的星币数
    var regex = /^(0|[1-9]\d*)$/;
    if (!regex.test(coin)) {
      return;
    }
    if (OSFlag) {
      //ios
      window.location.href = 'kwip://kwplayerhd/refreshCoin?coin=' + coin;
    } else {
      //安卓
      var refreshCoin =
        '{"action":"control_refresh_coin","coin":"' + coin + '"}';
      window.KuwoInterface.jsCallNative(refreshCoin);
    }
  },
  refreshCoin_new: function(coin) {
    //刷新用户星币数, coin刷新的星币数
    var regex = /^(0|[1-9]\d*)$/;
    if (!regex.test(coin)) {
      return;
    }
    if (OSFlag) {
      //ios
      window.jscObj.refreshCoin(coin);
    } else {
      //安卓
      var refreshCoin =
        '{"action":"control_refresh_coin","coin":"' + coin + '"}';
      window.KuwoInterface.jsCallNative(refreshCoin);
    }
  },
  flyScreen: function(stat) {
    if (OSFlag) {
      window.jscObj.animationStateChanged(stat);
    } else {
      var flyScreenParam =
        '{"action":"control_fly_screen","status":' + stat + '}';
      window.KuwoInterface.jsCallNative(flyScreenParam);
    }
  },
  controlPandent: function(display) {
    //display:展开OR收缩 1:收缩 2：展开   type:位置（仅ANDROID需要）
    //控制房间内上 右 左侧挂件
    if (OSFlag) {
      window.jscObj.openStateChanged(display);
    } else {
      var padentParam = '';
      if (display == 1) {
        padentParam = '{"action":"control_foldpendant"}';
      } else {
        padentParam = '{"action":"control_unfoldpendant"}';
      }
      window.KuwoInterface.jsCallNative(padentParam);
    }
  },
  dilogOpen: function(url, index) {
    //房间内弹窗展示，会显示在APP中间
    if (OSFlag) {
      window.jscObj.openDetailH5PageWithUrl(url);
    } else {
      var openDilogParam =
        '{"action":"control_opendialogh5","url":"' +
        url +
        '","index":"' +
        index +
        '"}';
      window.KuwoInterface.jsCallNative(openDilogParam);
    }
  },
  //index标识弹框的唯一标识; iosVersion用来兼容ios前期不支持关闭弹窗的方法
  dilogClose: function(index, iosVersion) {
    if (OSFlag) {
      //IOS 3.6.1后用此关闭
      if (iosVersion && iosVersion >= 361) {
        window.jscObj.closeH5Page();
      } else {
        window.location.href = 'kwip://kwplayerhd/closethispage';
      }
    } else {
      var openDilogParam =
        '{"action":"control_closedialogh5","index":"' + index + '"}';
      window.KuwoInterface.jsCallNative(openDilogParam);
    }
  },
  pushPage: function(url, title) {
    if (OSFlag) {
      window.jscObj.pushOuterH5Page(url, title);
    } else {
      var pushPageParam =
        '{"action":"control_pushpage","url":"' +
        url +
        '","title":"' +
        title +
        '"}';
      window.KuwoInterface.jsCallNative(pushPageParam);
    }
  },
  openRoom: function(roomId, type) {
    //进房间
    // type:调用入口 1表示全站飞屏调用 2流量红包调用 3鱼塘(安卓)
    if (OSFlag) {
      window.jscObj.openShowRoomWithRoomID(roomId);
    } else {
      if (typeof type != 'undefined') {
        var jsonstr =
          '{"action":"control_open_room","roomId":"' +
          roomId +
          '","type":"' +
          type +
          '"}';
      } else {
        var jsonstr =
          '{"action":"control_open_room","roomId":"' + roomId + '"}';
      }
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  closeRoomBanner: function() {
    //关闭直播间焦点图
    if (OSFlag) {
      window.jscObj.closeH5Page();
    } else {
      var jsonstr = '{"action":"control_closeroombanner"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  closePandent: function() {
    //关闭挂件
    if (OSFlag) {
      window.jscObj.closeH5Page();
    } else {
      var jsonstr = '{"action":"control_foldpendant","height":"1"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  closePushPage: function() {
    //2018年1月4日 新增关键弹窗挂件
    if (OSFlag) {
      window.jscObj.closeH5Page();
    } else {
      var jsonstr = '{"action":"control_closeweb"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  shareH5: function(options) {
    //H5分享
    if (!options) return;
    var shareUrl = options.shareUrl ? decodeURIComponent(options.shareUrl) : '';
    var title = options.title ? decodeURIComponent(options.title) : '';
    var desc = options.desc ? decodeURIComponent(options.desc) : '';
    var sharePicUrl = options.sharePicUrl
      ? decodeURIComponent(options.sharePicUrl)
      : '';
    if (OSFlag) {
      window.jscObj.openShareView(shareUrl, title, sharePicUrl, desc);
    } else {
      var jsonstr =
        '{"action":"control_add_share","url":"' +
        shareUrl +
        '","title":"' +
        title +
        '","desc":"' +
        desc +
        '","pic":"' +
        sharePicUrl +
        '"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  H5getSinginToken: function() {
    if (OSFlag) {
      h5SinginInfo = window.jscObj.getSiginInfo();
    } else {
      var jsonstr =
        '{"action":"control_getsigntoken","callback":"getSinginTokenCallback"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  addRoomCache: function(key, value) {
    //app房间内缓存存储，对本房间内有效，离开房间失效 （key value 必须为string类型 否则会造成app进房页面奔溃）
    if (OSFlag) {
      window.jscObj.setNativeValue(value, key);
    } else {
      var jsonstr =
        '{"action":"control_addcache","key":"' +
        key +
        '","value":"' +
        value +
        '"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  getRoomCache: function(key) {
    //app房间内缓存获取，对本房间内有效，离开房间失效
    if (OSFlag) {
      var cache = window.jscObj.getNativeValueByKey(key);
      roomCache[key] = cache;
      window.roomCache = roomCache;
    } else {
      var jsonstr =
        '{"action":"control_getcache","callback":"roomCacheCallBack","key":"' +
        key +
        '"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  addAppCache: function(key, value) {
    //存储app级别缓存 （key value 必须为string类型 否则会造成app进房页面奔溃）
    if (OSFlag) {
      window.jscObj.setAppNativeValue(value, key);
    } else {
      var jsonstr =
        '{"action":"control_addcache_app","key":"' +
        key +
        '","value":"' +
        value +
        '"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  getAppCache: function(key) {
    //获取app级别缓存 （key value 必须为string类型 否则会造成app进房页面奔溃）
    if (OSFlag) {
      var cache = window.jscObj.getAppNativeValueByKey(key);
      appCache[key] = cache;
      window.appCache = appCache;
      //appCache[key] = '1_1521687047';
    } else {
      var jsonstr =
        '{"action":"control_getcache_app","callback":"appCacheCallBack","key":"' +
        key +
        '"}';
      window.KuwoInterface.jsCallNative(jsonstr);
      //appCache[key] = '1_1521687047';
    }
  },
  delAppCache: function(key) {
    //清除指定app级别缓存
    if (OSFlag) {
      window.jscObj.deleteAppNativeValueByKey(key);
    } else {
      var jsonstr = '{"action":"control_delcache_app","key":"' + key + '"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  delAllAppCache: function() {
    //清除所有app级别缓存
    if (OSFlag) {
      window.jscObj.deleteAllAppNativeValue();
    } else {
      var jsonstr = '{"action":"control_clearcache_app"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  openRoomNew: function(roomId, opts) {
    // type:调用入口 1表示全站飞屏调用 2流量红包调用
    var type = null;
    if (OSFlag) {
      type = typeof opts.type != 'undefined' ? opts.type : '';
      var channel = typeof opts.channel != 'undefined' ? opts.channel : '';
      //秀场
      //设置渠道
      if (window.jscObj && window.jscObj.setJXFromChannelId) {
        window.jscObj.setJXFromChannelId(channel);
      }
      //跳房
      if (window.jscObj && window.jscObj.enterRoomWithRoomID) {
        var jsonObj = { h5type: type };
        window.jscObj.enterRoomWithRoomID(roomId, jsonObj);
      } else if (
        window.jscObj &&
        !window.jscObj.enterRoomWithRoomID &&
        window.jscObj.openShowRoomWithRoomID
      ) {
        window.jscObj.openShowRoomWithRoomID(roomId);
      }
      //音乐盒
      var paramstr = { h5type: type };
      paramstr = encodeURIComponent(JSON.stringify(paramstr));
      var jsonstr =
        '{"action":"goto_showroom","channel":"' +
        channel +
        '","roomType":"2","roomId":"' +
        roomId +
        '","param":"' +
        paramstr +
        '"}';
      setTimeout(function() {
        window.location.href =
          'kwip://kwplayerhd/goto_showroom?param=' +
          encodeURIComponent(jsonstr);
      }, 100);
    } else {
      type = typeof opts.type != 'undefined' ? opts.type : '';
      var channel = typeof opts.channel != 'undefined' ? opts.channel : '';
      var jsonstr =
        '{"action":"control_open_room","roomId":"' +
        roomId +
        '","type":"' +
        type +
        '","channel":"' +
        channel +
        '"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  openRoomMusic: function(roomId, opts) {
    //音乐盒点击弹框带渠道号进房
    //type:0表示一般情况，其他情况再说
    var type = typeof opts.type != 'undefined' ? opts.type : '';
    var channel = typeof opts.channel != 'undefined' ? opts.channel : '';
    if (OSFlag) {
      //设置渠道
      if (window.jscObj && window.jscObj.setJXFromChannelId) {
        window.jscObj.setJXFromChannelId(channel);
      }
      //跳房
      if (window.jscObj && window.jscObj.openShowRoomWithRoomID) {
        window.jscObj.openShowRoomWithRoomID(roomId);
      }
    } else {
      var jsonstr =
        '{"action":"control_open_room","roomId":"' +
        roomId +
        '","type":"' +
        type +
        '","channel":"' +
        channel +
        '"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  closeMusicBox: function() {
    //关闭音乐盒点击弹框带渠道号进房
    if (OSFlag) {
      window.jscObj.closeH5Page();
    } else {
      var jsonstr = '{"action":"control_closethis"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  openRoomWithType: function(roomId, type) {
    //区分进房方式
    // type:调用入口 1表示全站飞屏调用 2流量红包调用 3鱼塘
    if (OSFlag) {
      if (window.jscObj && window.jscObj.enterRoomWithRoomID) {
        type = typeof type != 'undefined' ? type : '';
        var jsonObj = { h5type: type };
        window.jscObj.enterRoomWithRoomID(roomId, jsonObj);
      } else if (
        window.jscObj &&
        !window.jscObj.enterRoomWithRoomID &&
        window.jscObj.openShowRoomWithRoomID
      ) {
        window.jscObj.openShowRoomWithRoomID(roomId);
      }
    } else {
      if (typeof type != 'undefined') {
        var jsonstr =
          '{"action":"control_open_room","roomId":"' +
          roomId +
          '","type":"' +
          type +
          '"}';
      } else {
        var jsonstr =
          '{"action":"control_open_room","roomId":"' + roomId + '"}';
      }
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  //聚星，音乐盒共用进房
  openJxAndMusicRoom: function(roomId) {
    if (OSFlag) {
      //跳房
      // 聚星
      if (window.jscObj && window.jscObj.openShowRoomWithRoomID) {
        window.jscObj.openShowRoomWithRoomID(roomId);
      }
      //音乐盒
      var jsonstr =
        '{"action":"goto_showroom","channel":"","roomType":"2","roomId":"' +
        roomId +
        '","param":""}';
      setTimeout(function() {
        window.location.href =
          'kwip://kwplayerhd/goto_showroom?param=' +
          encodeURIComponent(jsonstr);
      }, 100);
    } else {
      var jsonstr = '{"action":"control_open_room","roomId":"' + roomId + '"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  //是否在盒内
  isInApp: function() {
    if (this.isOutApp()) {
      return false;
    }
    if (window.navigator.userAgent.indexOf('kuwopage') > -1) {
      return true;
    } else {
      try {
        var deviceUtils = window.deviceUtils;
        if (
          typeof deviceUtils == 'object' &&
          typeof deviceUtils.ver != 'undefined'
        ) {
          return true;
        }
      } catch (e) {
        return false;
      }
      return false;
    }
  },
  //在盒外
  isOutApp: function() {
    // if (window.location.href.indexOf('fromkw=share') > -1 || this.isQQ() || this.isWeChat() || this.isWeiBo() || this.isInAli()) {
    if (window.location.href.indexOf('fromkw=share') > -1) {
      return true;
    }
    return false;
  },
  getMyInfoAndEnterInfo: function() {
    if (OSFlag) {
      myInfoAndEnterInfoData = window.jscObj.getMyInfoAndEnterRoomInfo();
      window.myInfoAndEnterInfoData = myInfoAndEnterInfoData;
    } else {
      var jsonstr =
        '{"action":"controlGetMyInfo_EnterInfo","callback":"getMyInfoAndEnterInfoCallBack"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  setBannerLogo: function(url) {
    //设置手机直播间收起logo链接
    if (OSFlag) {
      if (window.jscObj.replaceRongYaoPKShowIcon) {
        window.jscObj.replaceRongYaoPKShowIcon(url);
      }
    } else {
      var jsonstr =
        '{"action":"control_roombannerbuttonicon","url":"' + url + '"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  callOpenRoomDeeplink: function(rid) {
    //唤醒app进房
    var deeplink_url = 'splash://juxing.kuwo.cn?type=0&rid=' + rid;
    if (OSFlag) {
      window.location.href = deeplink_url;
    } else {
      var ifr = document.createElement('iframe');
      ifr.style.display = 'none';
      ifr.src = deeplink_url;
      document.documentElement.appendChild(ifr);
    }
  },
  callOpenPageDeeplink: function(title, url) {
    //唤醒app打开指定页面
    var deeplink_url =
      'splash://juxing.kuwo.cn?type=1&title=' + title + '&url=' + url;
    if (OSFlag) {
      window.location.href = deeplink_url;
    } else {
      var ifr = document.createElement('iframe');
      ifr.style.display = 'none';
      ifr.src = deeplink_url;
      document.documentElement.appendChild(ifr);
    }
  },
  setWebviewScroll: function(value) {
    //设置webview是否滑动
    if (OSFlag) {
      //1： 允许，0：不允许
      window.jscObj.setWebViewBouncesEnable &&
        window.jscObj.setWebViewBouncesEnable(value);
    }
  },
  controlPK: function(type) {
    //设置荣耀pk显示隐藏  显示：1，隐藏：2
    if (OSFlag) {
      try {
        window.jscObj.controlPK(type);
      } catch (error) {}
    } else {
      try {
        var jsonstr = '{"action":"control_PK","type":"' + type + '"}';
        window.KuwoInterface.jsCallNative(jsonstr);
      } catch (error) {}
    }
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
  // 进房间
  goRooms: function(roomId) {
    var _this = appcom;
    if (!roomId || roomId == 'undefined') return;
    if (OSFlag) {
      if (appSrc == 'iphone_jx') {
        //ios 独立版
        var versionCompare1 = _this.versionfunegt(appVersion, '4.1.4');
        if (!versionCompare1) {
          return;
        }
      } else if (appSrc == 'iphone_mbox') {
        // ios 航母版
        var versionCompare2 = _this.versionfunegt(appVersion, '8.6.0');
        if (!versionCompare2) {
          return;
        }
      }
    }
    if (window.jscObj) {
      var h5Fun = window.jscObj.getVersionInfo();
      var h5 = h5Fun.src;
      if (h5 == 'h5') {
        window.location.href = 'https://jx.kuwo.cn/' + roomId;
      } else {
        appcom.openRoom(roomId);
      }
    } else {
      appcom.openRoom(roomId);
    }
  },
  setNoLoginMethod: function(call, failCall) {
    // 此方法只适用于app中
    if (!isLogin) {
      // 未登录
      appcom.callLogin();
      failCall && failCall();
    } else {
      call && call();
    }
  },
  applyH5Pendant: function(type, url) {
    //创建挂件
    if (OSFlag) {
      window.jscObj.applyH5Pendant(type, url);
    } else {
      var jsonstr =
        '{"action":"control_applyH5Pendant","type":"' +
        type +
        '","url":"' +
        url +
        '"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  applyH5MorePendant: function(type, url) {
    //创建挂件 与applyH5Pendant 方法的去呗是安卓url：后面少加了两个“”
    if (OSFlag) {
      window.jscObj.applyH5Pendant(type, url);
    } else {
      var jsonstr =
        '{"action":"control_applyH5Pendant","type":"' +
        type +
        '","url":' +
        url +
        '}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  closeH5Pendant: function(type) {
    //销毁挂件
    if (OSFlag) {
      window.jscObj.closeH5Pendant(type);
    } else {
      var jsonstr = '{"action":"control_closeH5Pendant","type":"' + type + '"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
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
  // 此方法为版本新加协议控制（原生底部弹框对应的app版本号控制）
  bottomDilogFlag: function() {
    var _this = appcom;
    if (appSrc == 'iphone_mbox') {
      //ios 航母版
      // 航母版没有新老版本兼容问题
      return true;
    } else if (appSrc == 'iphone_jx') {
      //ios 独立版
      // return _this.versionfunegt(appVersion, '5.4.1');
      return _this.versionfunegt(appVersion, '5.2.1');
    } else if (appSrc == 'android_mbox') {
      //android 航母版
      // 航母版没有新老版本兼容问题  需要通过 jsVersion 进行版本判断 是否调取协议
      return true;
      // return jsVersion == 1 || false;
    } else if (appSrc == 'android_jx') {
      //android 独立版
      return _this.versionfunegt(appVersion, '5.5.0.0');
      // return _this.versionfunegt(appVersion, '5.3.0.0');
    }
  },
  changeH5Pendant: function(type, operate, Id) {
    /**
     * 单个挂件刷新(8号挂件位)
     * @param type 挂件类型:int
     * @param operate 做操类型:int (1:刷新 2:销毁)
     * @param Id 挂件Id:int
     */
    if (OSFlag) {
      window.jscObj.changeH5Pendant(type, operate, Id);
    } else {
      var changeH5PendantParam =
        '{"action":"control_changeH5Pendant","type":"' +
        type +
        '","operate":"' +
        operate +
        '","id":"' +
        Id +
        '"}';
      window.KuwoInterface.jsCallNative(changeH5PendantParam);
    }
  },
  replaceH5Pendant: function(type, urlStr) {
    /**
     * 单个挂件替换 (8号轮播挂件位)
     * @param type 挂件类型:int
     * @param param url 挂件信息: String 例如（'{id: 8, url: ''}'）
     */
    if (OSFlag) {
      window.jscObj.replaceH5Pendant(type, urlStr);
    } else {
      var replaceH5PendantParam =
        '{"action":"control_replaceH5Pendant","type":"' +
        type +
        '","url":"' +
        urlStr +
        '"}';
      window.KuwoInterface.jsCallNative(replaceH5PendantParam);
    }
  },
  bottomDilogOpen: function(url, index) {
    //房间内 半屏弹窗展示，会显示在APP页面最下面由下而上滑动上来
    if (OSFlag) {
      window.jscObj.presentH5PageWithUrl(url);
    } else {
      var openDilogParam =
        '{"action":"control_presentH5PageWithUrl","url":"' +
        url +
        '","index":"' +
        index +
        '"}';
      window.KuwoInterface.jsCallNative(openDilogParam);
    }
  }
};

// window.OSFlag = OSFlag;
// window.appSrc = appSrc;
// window.appVersion = appVersion;
// window.h5SinginInfo = h5SinginInfo;
// window.myInfoAndEnterInfoData = myInfoAndEnterInfoData;

window.swfInvoke = swfInvoke;
window.androidNotifty = androidNotifty;
window.feedback_deviceinfo = feedback_deviceinfo;
window.iOSNotiftInfoCallback = iOSNotiftInfoCallback;
window.iosGetEnterInfoCallback = iosGetEnterInfoCallback;
window.androidGetEnterInfoCallback = androidGetEnterInfoCallback;
window.loginReload = loginReload;
window.getSinginTokenCallback = getSinginTokenCallback;
window.roomCacheCallBack = roomCacheCallBack;
window.appCacheCallBack = appCacheCallBack;
window.getMyInfoAndEnterInfoCallBack = getMyInfoAndEnterInfoCallBack;
export default appcom;
