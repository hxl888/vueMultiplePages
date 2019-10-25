/**
 *  功能: 解析通知
 *  示例:
 *  cmd=notifyhonourflghtend
 *	groupid=2
 *	memlist{//队员列表
 *	  mem<id|rid|name|pic|team|exp|mvp|lvl>{
 *	    3|6666|test|picurl|1|200|0|2
 *	    4|5555|test1|picurl|2|300|1|1
 *	    ...
 *	  }
 *	}
 *
 *  author: yongyang.hu
 */
var parseNotify = function(msg) {
  var strArrStart = msg.split('\n');
  var obj = {}; //最终输出json

  var outerArr = [];
  var innerArr = [];
  var keys = [];
  var values = [];
  var valuesItem = [];
  var isClear = false;

  //去掉数组里空字符串
  var strArr = [];
  for (var j = 0; j < strArrStart.length; j++) {
    if (strArrStart[j] != '') {
      strArr.push(strArrStart[j]);
    }
  }

  for (var i = 0; i < strArr.length; i++) {
    var item = strArr[i];
    //var inner = {}; //内层字段存放 如：mem
    // var innerKeys = {}; //mem json数组每个对象key
    // var innerValues = {}; //mem json数组每个对象value

    if (item.indexOf('}') > -1) {
      isClear = true;
      if (i == strArr.length - 1) {
        values.push(valuesItem);
      }
      continue;
    } else if (item.indexOf('{') > -1) {
      if (item.indexOf('<') > -1 && item.indexOf('>') > -1) {
        // mem<id|exp>{
        var innerName = '';
        innerName = item.substring(0, item.indexOf('<'));
        innerArr.push(innerName);

        //innerKeys -> {mem:[id,exp]}
        var temNames = item.substring(item.indexOf('<') + 1, item.indexOf('>'));
        var names = temNames.split('|');
        keys.push(names);
      } else {
        //memlist{
        // outer -> {memlist:memlist}
        var outerName = '';
        outerName = item.substring(0, item.indexOf('{'));
        outerArr.push(outerName);
      }
    } else if (item.indexOf('=') > -1 && item.indexOf('|') == -1) {
      // groupid=1
      var keyVal = item.split('=');
      var key = keyVal[0];
      var value = keyVal[1];
      //组装obj
      obj[key] = value;
    } else if (item.indexOf('|') > -1 && item.indexOf('{') == -1) {
      // 1|2
      var valArr = item.split('|');
      if (isClear) {
        //添加后清空
        values.push(valuesItem);
        valuesItem = [];
        isClear = false;
      }
      valuesItem.push(valArr);
    }
  }

  var handle_arr = [];

  for (var k = 0; k < values.length; k++) {
    var valueItem = values[k];
    var keyItem = keys[k];
    var arr = [];
    for (var o = 0; o < valueItem.length; o++) {
      var value_item = valueItem[o]; //["11", "0"]
      var curObj = {};
      for (var w = 0; w < value_item.length; w++) {
        var v = value_item[w];
        var keyName = keyItem[w];
        curObj[keyName] = v;
      }
      arr.push(curObj);
    }
    handle_arr.push(arr);
  }
  for (var n = 0; n < outerArr.length; n++) {
    var outer_key = outerArr[n];
    var innerObj = {};
    var inner_key = innerArr[n];
    innerObj[inner_key] = handle_arr[n];
    obj[outer_key] = innerObj;
  }

  return obj;
};
export default parseNotify;
