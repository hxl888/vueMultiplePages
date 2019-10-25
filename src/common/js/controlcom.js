import Events from 'common/events';

/**
 * 获取App信息
 */
var u = navigator.userAgent;
var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
var roomCache = [];
var appSrc = null;
var appVersion = null;
var OSFlag = true; // true:ios   false:安卓

if (isAndroid) {
  OSFlag = false;
} else {
  OSFlag = true;
}

var enterInfo;

function swfInvoke() {
  swfInvoke.cmdCallbackLister.trigger('flashNotice', arguments);
}
swfInvoke.cmdCallbackLister = new Events();

//监听通知
function androidNotifty(data) {
  var obj = eval('(' + data + ')');
  swfInvoke.cmdCallbackLister.trigger('flashNotice', obj);
}
function iOSNotiftInfoCallback(data) {
  swfInvoke.cmdCallbackLister.trigger('flashNotice', data);
}

//进房
function androidGetEnterInfoCallback(data) {
  var obj = eval('(' + data + ')');
  enterInfo = obj;
  swfInvoke.cmdCallbackLister.trigger('enterInfoNotice');
}
/**
 * 获取Src
 */
var getAppSrc = function() {
  if (OSFlag) {
    //appSrc = "iphone_jx";
    //window.location.href = "kwip://kwplayerhd/getversion";
    var iosVersionCallback = window.jscObj.getVersionInfo(); //ios回调用户返回版本号，该版本号可以用于区分独立版或者航母版
    appSrc = iosVersionCallback.src;
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
};

//ios回调用户返回版本号，该版本号可以用于区分独立版或者航母版
var iosGetVersionCallback = function(data) {
  appSrc = data.src;
};

/*
 * 获取app版本号
 *
 */
function getAppVersion() {
  //app版本号
  if (OSFlag) {
    var iosVersionCallback = window.jscObj.getVersionInfo(); //ios回调用户返回版本号，该版本号可以用于区分独立版或者航母版
    appVersion = iosVersionCallback.version;
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
}

getAppSrc();
getAppVersion();

var controlcom = {
  getRoomNotify: function(notify) {
    //获取房间内的通知
    if (OSFlag) {
      window.jscObj.getChatRoomSocketNotificationInfoWithCmd(notify);
    } else {
      var jsonstr =
        '{"action":"control_getnotifyinfo","callback":"androidNotifty","notify":"' +
        notify +
        '"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    }
  },
  getRoomInfo: function() {
    if (OSFlag) {
      enterInfo = window.jscObj.getEnterRoomInfo();
      swfInvoke.cmdCallbackLister.trigger('enterInfoNotice');
    } else {
      var jsonstr =
        '{"action":"control_getenterinfo","callback":"androidGetEnterInfoCallback"}';
      window.KuwoInterface.jsCallNative(jsonstr);
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
  addRoomCache: function(key, value) {
    //app房间内缓存存储，对本房间内有效，离开房间失效
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
    } else {
      var jsonstr =
        '{"action":"control_getcache","callback":"roomCacheCallBack","key":"' +
        key +
        '"}';
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
  getVersion: function() {
    // 安卓版本待确定
    var self = controlcom;
    if (appSrc == 'iphone_mbox') {
      //ios 航母版
      // 航母版没有新老版本兼容问题
      return true;
    } else if (appSrc == 'iphone_jx') {
      //ios 独立版
      return self.versionfunegt(appVersion, '5.2.2');
      // return self.versionfunegt(appVersion, '5.2.1');
    } else if (appSrc == 'android_mbox') {
      //android 航母版
      // 航母版没有新老版本兼容问题1
      return true;
    } else if (appSrc == 'android_jx') {
      //android 独立版
      return self.versionfunegt(appVersion, '5.3.0.0');
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
export default controlcom;
