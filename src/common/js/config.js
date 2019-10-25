// var appSrc = "h5";

//临时解决config写死appSrc问题
var appSrc = '';
var u_config = navigator.userAgent;
var isAndroid_config =
  u_config.indexOf('Android') > -1 || u_config.indexOf('Adr') > -1;

var OSFlag_config = true; // true:ios   false:安卓

if (isAndroid_config) {
  OSFlag_config = false;
} else {
  OSFlag_config = true;
}

/**
 * 获取Src
 */
var getAppSrc_config = function() {
  if (OSFlag_config) {
    try {
      var iosVersionCallback = window.jscObj.getVersionInfo(); //ios回调用户返回版本号，该版本号可以用于区分独立版或者航母版
      appSrc = iosVersionCallback.src;
    } catch (e) {
      appSrc = 'h5';
    }
  } else {
    try {
      var jsonstr =
        '{"action":"control_getversion","callback":"versionCallBack_config"}';
      window.KuwoInterface.jsCallNative(jsonstr);
    } catch (e) {
      appSrc = 'h5';
    }
  }
};

//android回调用户返回版本号，该版本号可以用于区分独立版或者航母版
// eslint-disable-next-line no-unused-vars
var versionCallBack_config = function(data) {
  // eslint-disable-next-line no-redeclare
  var data = eval('(' + data + ')');
  appSrc = data.src;
};

getAppSrc_config();

var CONFIG = {
  documentDomain: 'kuwo.cn', // 一级域名，涉及cookie，一定要与servlet层返回的cookie域相同，慎动
  src: appSrc,
  projectNs: 'http://',
  projectNs_HTTPS: 'https://',
  KUWOLIVE_SERVICE: '//zhiboserver.kuwo.cn/proxy.p?src=' + appSrc + '&cmd=',
  KUWOLIVE_SERVICE_HTTPS:
    '//zhiboserver.kuwo.cn/proxy.p?src=' + appSrc + '&cmd=',
  SOCKET_LOGIN: '1', //SOCKET登录成功的ID
  SOCKET_JOIN: '2', //SOCKET加入频道
  SOCKET_LEAVE: '3', //SOCKET离开频道
  PRIVATE_CHANNEL: '5', //私聊频道ID
  PRIVATE_TYPE: '2', //私聊类型
  SOCKET_CMD_CHANNEL_ID: '6', //为全局频道,属于通知消息
  SOCKET_MSG_F_SYSTEM: '0', //SOCKET消息类型
  SOCKET_PRIVATE_MSG: '2e90f4a7-7288-42fc-a4a3-ce45113f8935', //为私聊类型
  SOCKET_SYSTEM_MSG: '6d21ac2f-6c4c-4f3a-b4c6-ee31742fc6b9', //为系统类型 如断网等
  SOCKET_CHANNEL_MSG: '7aec3273-2914-4b7e-8ea2-92be3235b485', //为频道类型
  SOCKET_COMMAND_MSG: '7c4f7dd2-968e-4d11-a2f7-29bbcc01c5c5', //为命令类型
  SOCKET_TIPS_MSG: '154bb6b5-c87f-434a-aa7b-fba2bdf715d8' //为提示信息类型
};

export default CONFIG;
