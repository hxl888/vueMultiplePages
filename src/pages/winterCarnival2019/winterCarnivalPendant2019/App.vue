<template>
  <div id="app">
    <div v-if="showContentFlag">
      <!-- 倒计时 -->
      <div class="defaultClass" v-if="acitveStarFlag" @touchend="goToDetailsFn">
        <div class="djs">
          <p id="downTime">{{ downTimeHtml }}</p>
        </div>
      </div>
      <!-- 正式挂件 -->
      <div v-else>
        <!-- 展开样式 -->
        <div
          class="defaultClass"
          :class="varietyClass"
          v-show="pickDownOrUpFlag"
        >
          <div class="guajianTit">
            <span v-show="carnivalDownFlag"
              >倒计时：{{ carnivalDownTxt }} S</span
            >
          </div>
          <div class="guajianMain">
            <div class="guajianMain_box" v-if="roomActivity.revelry >= 50000">
              <p class="guajianMainBox_tit paiming_infor">
                <span>脱单榜</span>{{ curDay }}/16天<br />
                排名: {{ handleRank(webData.rank) }}<br />
                {{ getPersonDiff(webData.pdiff, webData.prank) }}
              </p>
            </div>
            <div v-else style="position:relative;">
              <div class="taskEndBox1" v-show="taskEndBox1Flag">
                距离完成当前任务差{{ taskDayObj.diffCnt }}狂欢值
              </div>
              <p class="guajianMain_p1">{{ curDay }}/16天</p>
              <div class="guajianMain_box">
                <p class="guajianMainBox_tit">每日任务</p>
                <div class="guajianMain_jindu">
                  <em
                    :style="{
                      width:
                        (roomActivity.revelry / taskDayObj.stateCoin) * 100 +
                        '%'
                    }"
                  ></em>
                  <p>{{ roomActivity.revelry }}/{{ taskDayObj.stateCoin }}</p>
                </div>
              </div>
            </div>
            <div class="guajianMain_p2">
              阶段排名：{{ handleRank(webData.rank, 99) }}<br />
              {{ getPersonDiff(webData.diff, webData.rank) }}
            </div>
            <div class="guajianMain_bot" @touchend="goPicSynPage(2)">
              相册
              <!-- <span>123</span> -->
            </div>
          </div>
          <div class="guajianBot">
            <a
              href="javaScript:void(0)"
              class="moreBtn"
              style="background:red"
              @touchend="goPicSynPage(1)"
              >更多</a
            >
            <a
              href="javaScript:void(0)"
              class="pickUp"
              @touchend="pickDownOrUpFlag = false"
              >收起</a
            >
          </div>
        </div>
        <!-- 收起样式 -->
        <div
          class="defaultClass guajian_zk"
          v-show="!pickDownOrUpFlag"
          style="right:0"
          @touchend="pickDownOrUpFlag = true"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
// require('es6-promise').polyfill();
import 'babel-polyfill';
// import Es6Promise from 'es6-promise';
// Es6Promise.polyfill();
import units from 'common/js/units';
import ajax from 'common/js/ajax';
import appcom from 'common/js/appcom';
export default {
  name: '',
  data() {
    return {
      counter: null,
      downTimeHtml: '00:00',
      showContentFlag: true,
      acitveStarFlag: false, // 正式活动倒计时开关
      carnivalDownFlag: false, // 加成倒计时开关
      pickDownOrUpFlag: true, // 收起展开 开关
      taskEndBox1Flag: false, // 收起展开 开关
      curTm: new Date().getTime() / 1000, //默认时间,拿到系统时间会更新
      isAhcnor: false, // 是否为主播
      roomownerid: 0, // 主播id
      roomid: 0, // 主播房间号
      uid: 0, // 主播房间号
      websid: 0, // 主播房间号
      myinfoObj: null, // 主播房间号
      enterInfo: null, // 主播房间号
      roomActivity: {
        revelry: 60000,
        taskcnt: 0
      },
      userActivity: {
        revstarttm: 0,
        revendtm: 0
      },
      webData: {
        rank: 0,
        diff: 0,
        day: 0,
        prank: 0,
        pdiff: 0,
        htype: 0
      },
      taskDayObj: {
        diffCnt: 0,
        stateCoin: 2000
      },
      carnivalDownTxt: 0,
      curDay: 1, // 活动当前是第几天
      varietyClass: ''
    };
  },
  created() {
    // var _this = this;
    // this.setListenFlash();
    // this.getVarietyClass(this.curDay); // 获取头图class
    // this.getCurTmInterTime(); // 获取头图class
    // this.initPendant();
    setTimeout(() => {
      var data = {
        cmd: 'notifyrevelrytaskfinish',
        tasklvl: 5,
        gid: 2035,
        cnt: 10,
        album: 8,
        taskcnt: 3,
        rank: 23,
        diff: 33,
        prank: 43,
        pdiff: 39,
        fid: 0,
        starttm: 1571813710,
        endtm: 1571814754
      };
      window.swfInvoke.cmdCallbackLister.trigger('flashNotice', data);
      // document.getElementsByTagName('body')[0].style.background = 'red';
      // if (_this.uid == 424444752) {
      // }
    }, 3000);
  },
  mounted() {
    this.setCoverAnimate(); // 获取头图class
  },
  computed: {
    revelry() {
      return this.roomActivity.revelry;
    }
  },
  watch: {
    curDay(n) {
      if (n) {
        this.getVarietyClass(n);
      }
    },
    revelry(n) {
      if (n) {
        this.poorTaskDiff(n);
      }
    },
    userActivity: {
      handler(val) {
        // console.log('---', val.revendtm);
        if (val.revstarttm < this.curTm && val.revendtm > this.curTm) {
          this.carnivalDownTxt = Math.floor(val.revendtm - this.curTm);
          this.carnivalDownFlag = true;
          this.setCarnivalDownTxt(val.revendtm);
          this.getVarietyClass(this.curDay);
        } else {
          this.carnivalDownFlag = false;
        }
      },
      deep: true
    }
  },
  methods: {
    listen() {
      var _this = this;
      window.swfInvoke.cmdCallbackLister.listen('enterInfoNotice', function(
        data
      ) {
        _this.enterInfo = data;
        _this.roomid = data.room.id;
        _this.roomownerid = data.room.ownerid;
      });

      window.swfInvoke.cmdCallbackLister.listen('getmyinfoNotice', function(
        data
      ) {
        _this.myinfoObj = data;
        _this.uid = data.uid;
        _this.websid = data.websid;
      });

      var anchorTime = null;
      clearTimeout(anchorTime);
      anchorTime = setTimeout(() => {
        _this.getIsAhchor();
      }, 3000);
      _this.setListenFlash();
    },
    setListenFlash() {
      let _this = this;
      window.swfInvoke.cmdCallbackLister.listen('flashNotice', function(obj) {
        if (!obj) return;
        if (obj.cmd == 'notifyrevelrychg') {
          // 每日任务变化通知
          _this.notifyrevelrychgFn(obj);
          return;
        } else if (obj.cmd == 'notifyrevelrytaskfinish') {
          // 3、完成任务通知
          _this.notifyrevelrytaskfinishFn(obj);
          return;
        } else if (obj.cmd == 'notifyrevelrytaskfinish10') {
          // 4、完成12次任务时
          _this.notifyrevelrytaskfinish10Fn(obj);
          return;
        } else if (obj.cmd == 'notifydayrevelryrank') {
          // 5、主播日/阶段排名变化
          _this.notifydayrevelryrankFn(obj);
          return;
        } else if (obj.cmd == 'notifyrevelryspeed') {
          // 10.2、用户加成时间通知
          _this.notifyrevelryspeedFn(obj);
          return;
        } else if (obj.cmd == 'notifyrevelrybadgeup') {
          // 11、用户徽章升级通知
          // _this.notifyrevelrybadgeupFn(obj);
          return;
        } else if (obj.cmd == 'notifyfmautumn2019') {
          // 12、"幸运彩蛋"烟花通知
          _this.notifyfmautumn2019Fn(obj);
          return;
        } else if (obj.cmd == 'notifyrobcolouregg') {
          // 14、用户点击"幸运彩蛋"烟花抢到币的数量通知
          _this.notifyrobcoloureggFn(obj);
          return;
        } else if (obj.cmd == 'notifyglobalwinterdaychg') {
          // 15、切天通知
          _this.notifyglobalwinterdaychgFn(obj);
          return;
        }
      });
    },
    notifyrevelrychgFn(obj) {
      this.roomActivity.revelry = obj.revelry || 0;
    },
    notifyrevelrytaskfinishFn(obj) {
      var tasklvl = obj.tasklvl || 1,
        gid = obj.gid || 0,
        cnt = obj.cnt || 0,
        album = obj.album || 0,
        taskcnt = obj.taskcnt || 0,
        gidName = this.getGiftName(gid);
      var taskArr = [
          '',
          '任务一',
          '任务二',
          '任务三',
          '任务四',
          '任务五',
          '脱单任务'
        ],
        rewardObj = {
          2: `获得${gid ? `${gidName}${cnt}个,` : ''}${
            // eslint-disable-next-line vue/no-parsing-error
            album ? `相册${album}个` : ''
          }`,
          3: `获得${gid ? `${gidName}${cnt}个,` : ''}${
            // eslint-disable-next-line vue/no-parsing-error
            album ? `相册${album}个` : ''
          }`,
          4: `获得${gid ? `${gidName}${cnt}个,` : ''}${
            // eslint-disable-next-line vue/no-parsing-error
            album ? `相册${album}个` : ''
          }`,
          5: `获得${gid ? `${gidName}${cnt}个,` : ''}${
            // eslint-disable-next-line vue/no-parsing-error
            album ? `相册${album}个 ` : ''
          }获得价值6600星币"幸运彩蛋“烟花礼物一个`,
          6: `超过5000进入脱单榜，前5有奖`
        },
        tipTxt =
          tasklvl == 1
            ? `<p>恭喜主播完成${taskcnt}次任务一,累计完成12天，将获得咔嚓相机 1000个</p>`
            : `<p>恭喜主播完成${taskArr[tasklvl]},${rewardObj[tasklvl]}</p>`,
        closeTip = `提示信息${units.getRandomNumber(1, 1000)}`,
        tanObj = { closeTip: closeTip, type: 3, tipTxt: tipTxt },
        commonUrl = `tanObj=${units.formatObjToStr(tanObj)}`,
        url = `https://jx.kuwo.cn/KuwoLive/jsp/alone/huodong/winterCarnivalTan2019.html?random=${Math.random()}&${commonUrl}`;
      if (taskcnt == 12) return;
      appcom.dilogOpen(url, closeTip);
    },
    notifyrevelrytaskfinish10Fn() {
      var closeTip = `提示信息${units.getRandomNumber(1, 1000)}`,
        tipTxt = '',
        tanObj = { closeTip: closeTip, type: 2, tipTxt: tipTxt },
        commonUrl = `tanObj=${units.formatObjToStr(tanObj)}`,
        url = `https://jx.kuwo.cn/KuwoLive/jsp/alone/huodong/winterCarnivalTan2019.html?random=${Math.random()}&${commonUrl}`;

      appcom.dilogOpen(url, closeTip);
    },
    notifydayrevelryrankFn(obj) {
      this.webData.rank = obj.rank || 0;
      this.webData.diff = obj.diff || 0;
      this.webData.prank = obj.prank || 0;
      this.webData.pdiff = obj.pdiff || 0;
    },
    notifyrevelryspeedFn(obj) {
      if (this.uid == obj.fid) {
        this.userActivity.revstarttm = obj.starttm || 0;
        this.userActivity.revendtm = obj.endtm || 0;
      }
    },
    notifyrevelrybadgeupFn() {
      // var _this = this,
      //   badgeid = Math.floor(obj.badgeid) || 0,
      //   fonlinestatus = Math.floor(obj.fonlinestatus) || 0,
      //   fid = Math.floor(obj.fid) || 0;
      // if (fid != _this.uid) return;
      // var closeTip = `提示信息${units.getRandomNumber(1, 1000)}`,
      //   tanObj = {
      //     closeTip: closeTip,
      //     type: 6,
      //     tipTxt: `<img src="//imagexc.kuwo.cn/kuwolive/huodong/familyLeagueAutumn2019/pendant/hz_pic${badgeid}.png">`
      //   },
      //   commonUrl = `tanObj=${units.formatObjToStr(tanObj)}`,
      //   url = `https://jx.kuwo.cn/KuwoLive/jsp/alone/huodong/winterCarnivalTan2019.html?random=${Math.random()}&${commonUrl}`;
      // appcom.dilogOpen(url, closeTip);
    },
    notifyfmautumn2019Fn(obj) {
      var _this = this;
      if (Math.floor(obj.rid) == Math.floor(_this.roomid)) {
        var coindropUrl = `https://jx.kuwo.cn/KuwoLive/jsp/alone/huodong/coinDrop.jsp?nickname=${
          _this.enterInfo.user.nickname
        }&flowerid=${obj.append || 0}&type=102`;
        appcom.openBigPage(coindropUrl);
      }
    },
    notifyrobcoloureggFn(obj) {
      var cnt = obj.cnt || 0,
        url = `https://jx.kuwo.cn/KuwoLive/jsp/alone/huodong/coins.jsp?cnt=${cnt}`;
      appcom.dilogOpen(url, '抢星币');
    },
    notifyglobalwinterdaychgFn(obj) {
      this.curDay = obj.daytype;
      this.roomActivity.revelry = 0;
      this.webData.rank = 0;
      this.webData.diff = 0;
      this.webData.prank = 0;
      this.webData.pdiff = 0;
      this.webData.htype = 0;
    },
    callApp() {
      var notify =
        'notifyrevelrychg|notifyrevelrytaskfinish|notifyrevelrytaskfinish10|notifydayrevelryrank|notifyrevelryspeed|notifyrevelrybadgeup|notifyfmautumn2019|notifyrobcolouregg';
      appcom.getRoomNotify(notify);
    },
    initPendant() {
      var _this = this,
        url = `getroominfo&rid=${_this.roomid}&callback=?`;
      // url = `getroominfo&rid=602628&callback=?`;

      ajax.callZhiboServer(url, function(res) {
        var systm = res.systm; //系统时间
        _this.curTm = systm;
        _this.getCurTmInterTime();
        _this.callApp();
        // var goTm = new Date('2019/09/03 20:38:00').getTime() / 1000;
        var goTm = new Date('2019/10/23 12:00:00').getTime() / 1000;
        if (systm < goTm) {
          var diff = goTm - systm,
            diffTm = Math.floor(diff),
            sec = diffTm % 60,
            min = Math.floor(diffTm / 60),
            oMin = units.handleTime(min),
            oSec = units.handleTime(sec);
          _this.downTimeHtml = `${oMin}:${oSec}`;
          _this.countdown(min, sec, _this.initPendant);
          return;
        }
        if (res.status == 1) {
          _this.roomActivity = res.activity;
          _this.pendant();
          // 测试----------------------- star
          // _this.activity = {
          //     sw1909sectscore: 1660000,
          //     sw1909verseacmp: 10,
          //     sw1909verseid: 5,
          //     taskbrave: 47200,
          //     bravefcnt: 5,
          //     teamid: 3,
          //     curround: 3,
          //     ctstatus: 1
          // }
          // 测试-----------------------end
        }
      });
    },
    getUserDetailsFun() {
      // 用户是否押注当前房间主播
      var _this = this,
        url = `getroomuserinfo&uid=${_this.uid || 0}&sid=${_this.websid ||
          0}&rid=${_this.roomid}`;
      ajax.callZhiboServer(url, function(res) {
        if (res.status == 1) {
          _this.userActivity.revstarttm = res.activity.revendtm;
          _this.userActivity.revendtm = res.activity.revendtm;
          _this.initPendant();
        }
      });
    },
    pendant() {
      let _this = this,
        queryUrl = `activity/winterCarnival20191106?fun=defPendant&tid=${_this.roomownerid}`;
      ajax.callWebServer(queryUrl, function(res) {
        if (res.status == '200') {
          let data = res.data;
          _this.webData = data;
          _this.curDay = data.day;
          _this.getVarietyClass(_this.curDay); // 获取头图class
        }
      });
      // 测试------ start
      // var data = {
      //     rank: 3,
      //     srank: 8,
      //     trank: 63,
      //     }
      // _this.webData = data;
      // _this.curDay = data.day;
      // 测试------ end
    },
    handleRank(rank, limit = 0) {
      return units.handleRank(rank, limit);
    },
    goPicSynPage(type) {
      var closeTip = null,
        tanObj = null,
        commonUrl = null,
        url = null;
      if (type == 1) {
        // 更多
        closeTip = `提示信息${units.getRandomNumber(1, 1000)}`;
        tanObj = { closeTip: closeTip, type: 1, roomownerid: this.roomownerid };
        commonUrl = `tanObj=${units.formatObjToStr(tanObj)}`;
        url = `https://jx.kuwo.cn/KuwoLive/jsp/alone/huodong/winterCarnivalInfo2019.html?random=${Math.random()}&${commonUrl}`;
      } else {
        // 相片合成
        // if (window.isLogin) {
        //   closeTip = `提示信息${units.getRandomNumber(1, 1000)}`;
        //   tanObj = {
        //     closeTip: closeTip,
        //     type: 2,
        //     uid: this.uid,
        //     rid: this.roomid,
        //     sid: this.websid,
        //     curDay: this.curDay
        //   };
        //   commonUrl = `tanObj=${units.formatObjToStr(tanObj)}`;
        //   url = `https://jx.kuwo.cn/KuwoLive/jsp/alone/huodong/winterCarnivalInfo2019.html?random=${Math.random()}&${commonUrl}`;
        // } else {
        //   appcom.callLogin();
        //   return;
        // }
        closeTip = `提示信息${units.getRandomNumber(1, 1000)}`;
        tanObj = {
          closeTip: closeTip,
          type: 2,
          uid: this.uid,
          rid: this.roomid,
          sid: this.websid,
          curDay: this.curDay
        };
        commonUrl = `tanObj=${units.formatObjToStr(tanObj)}`;
        url = `https://jx.kuwo.cn/KuwoLive/jsp/alone/huodong/winterCarnivalInfo2019.html?random=${Math.random()}&${commonUrl}`;
        console.log(
          '%curl: ',
          'color: MidnightBlue; background: Aquamarine; font-size: 20px;',
          url
        );
      }
      appcom.dilogOpen(url, closeTip);
    },
    goToDetailsFn() {
      appcom.pushPage(
        'https://jx.kuwo.cn/KuwoLive/jsp/alone/huodong/djkh2019h5.jsp?type=2',
        '活动详情'
      );
    },
    setCarnivalDownTxt(endtime) {
      var _this = this,
        interVal = null;
      interVal = setInterval(() => {
        if (this.carnivalDownTxt == 0) {
          _this.carnivalDownFlag = false;
          _this.getVarietyClass();
          clearInterval(interVal);
          return;
        }
        this.carnivalDownTxt = Math.floor(endtime - _this.curTm);
      }, 1000);
    },
    poorTaskDiff(revelry) {
      var diffCnt = 0,
        stateCoin = 2000;
      if (revelry >= 50000) {
        diffCnt = 0;
      } else if (revelry >= 30000) {
        diffCnt = 50000 - revelry;
      } else if (revelry >= 12000) {
        diffCnt = 30000 - revelry;
      } else if (revelry >= 6000) {
        diffCnt = 12000 - revelry;
      } else if (revelry >= 2000) {
        diffCnt = 6000 - revelry;
      } else {
        diffCnt = 2000 - revelry;
      }
      this.taskDayObj = {
        diffCnt: diffCnt,
        stateCoin: stateCoin
      };
    },
    getVarietyClass(n) {
      var arrClass = [
        'sum2019_guajian_yinyue',
        'sum2019_guajian_chaoliu',
        'sum2019_guajian_keji',
        'sum2019_guajian'
      ];
      if (this.carnivalDownFlag) {
        this.varietyClass =
          arrClass[Math.ceil(n / 4) - 1] + ' sum2019_guajian_jc5';
      } else {
        this.varietyClass = arrClass[Math.ceil(n / 4) - 1];
      }
    },
    getGiftName(id = 0) {
      var obj = {
        2035: '咔嚓相机',
        2036: '野狼disco',
        2037: '发光气泡泡',
        2038: 'VR游乐场',
        2039: '火锅冰淇淋',
        2040: '冬日狂欢大特效',
        2041: '幸运彩蛋',
        5115: '狂欢王者座驾'
      };
      return obj[id] || '';
    },
    getPersonDiff(diff = 0, rank = 0) {
      var tipTxt = '';
      var diffs = diff > 0 ? diff : 1;
      if (!rank) return '暂无收礼求支持!';
      if (rank == 1) {
        tipTxt = `超第2名:${diffs}`;
      } else {
        tipTxt = `距上1名差:${diffs}`;
      }
      return tipTxt;
    },
    setCoverAnimate() {
      var _this = this,
        num = 1;
      setInterval(() => {
        num++;
        if (num % 2 == 0) {
          _this.taskEndBox1Flag = true;
        } else {
          _this.taskEndBox1Flag = false;
        }
      }, 8000);
    },
    countdown(min, sec, callback) {
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
            var downRanDomTime = units.getRandomNumber(1000, 5000);
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
          minHtml = units.handleTime(min);
          secHtml = units.handleTime(sec);
        }
        _this.downTimeHtml = `${minHtml}:${secHtml}`;
      };
      if (_this.counter) {
        clearInterval(_this.counter);
      }
      _this.counter = setInterval(run, 1000);
    },
    getIsAhchor() {
      // 判断是主播还是用户
      if (
        this.myinfoObj &&
        this.myinfoObj.user &&
        this.myinfoObj.user.id == this.enterInfo.user.id &&
        this.enterInfo.user.singerstatus == 2
      ) {
        // 是主播
        this.isAhcnor = true;
      } else {
        this.isAhcnor = false;
      }
      this.getUserDetailsFun();
      // this.initPendant();
    },
    getCurTmInterTime() {
      // 时刻更新系统时间
      var _this = this;
      setInterval(() => {
        _this.curTm++;
      }, 1000);
    }
  }
};
</script>
<style lang="">
html,
body,
div,
p {
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
}
body {
  font-size: 100px;
  overflow: hidden;
}
.defaultClass {
  position: absolute;
  right: 0.1rem;
  bottom: 0.1rem;
}
.taskEndBox1 {
  position: absolute;
  bottom: 0;
  left: 0.02rem;
  width: 1.52rem;
  padding-bottom: 0.02rem;
  background: linear-gradient(9deg, #00ffde, #ffee63 100%);
  border: 0.02rem solid #091239;
  border-radius: 0.1rem;
  color: #001a46;
  line-height: 0.21rem;
  text-align: center;
  font-size: 0.18rem;
  font-weight: bold;
  padding-top: 0.03rem;
  z-index: 999;
  /* white-space: nowrap; */
}
.sum2019_guajian {
  width: 1.64rem;
  margin: 0 auto;
  position: relative;
}
.guajianTit {
  width: 1.88rem;
  height: 0.81rem;
  background: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/guajianBg.png)
    0 -0.84rem;
  background-size: 1.88rem 5rem;
  position: absolute;
  z-index: 1;
  margin: -0.32rem 0 0 -0.13rem;
}
.guajianMain {
  width: 1.6rem;
  height: 1.27rem;
  padding-top: 0.41rem;
  background: linear-gradient(9deg, #f25e36, #fae48c 100%);
  border-radius: 0.15rem 0.15rem 0.01rem 0.01rem;
  border: 0.02rem solid #f5561a;
  position: relative;
}
.guajianMain_p1 {
  height: 0.22rem;
  line-height: 0.22rem;
  text-align: center;
  color: #001a46;
  font-weight: bold;
  font-weight: bold;
  font-size: 0.18rem;
}
.guajianMain_box {
  width: 1.52rem;
  padding-bottom: 0.02rem;
  background: linear-gradient(9deg, #00ffde, #ffee63 100%);
  border: 0.02rem solid #091239;
  margin: 0 auto;
  border-radius: 0.1rem;
}
.guajianMainBox_tit {
  color: #001a46;
  line-height: 0.21rem;
  text-align: center;
  font-size: 0.18rem;
  font-weight: bold;
  padding-top: 0.03rem;
  white-space: nowrap;
}
.guajianMain_p2 {
  line-height: 0.24rem;
  font-size: 0.18rem;
  padding: 0.03rem 0 0 0.07rem;
  color: #ffffff;
  white-space: nowrap;
}
.guajianMain_bot {
  height: 0.32rem;
  background: linear-gradient(180deg, #ffac68, #f2653a 100%);
  width: 1.6rem;
  position: absolute;
  bottom: -0.36rem;
  border: 0.02rem solid #f5561a;
  border-top: none;
  left: -0.02rem;
  box-shadow: 0 0.03rem 0 #ffd398 inset;
  line-height: 0.32rem;
  display: flex;
  font-size: 0.2rem;
  font-weight: bold;
  justify-content: center;
  color: #001a46;
  border-radius: 0 0 0.15rem 0.15rem;
}
.guajianMain_bot span {
  width: 0.56rem;
  height: 0.22rem;
  color: #fff;
  text-align: center;
  line-height: 0.22rem;
  margin: 0.06rem 0 0 0.15rem;
  background: #e04e19;
  border-radius: 0.11rem;
}
.guajianBot {
  width: 1.6rem;
  height: 0.4rem;
  border: 0.02rem solid #1c409e;
  border-radius: 0.15rem;
  background: #1c409e;
  color: #001a46;
  font-size: 0.2rem;
  font-weight: bold;
  margin-top: 0.32rem;
  display: flex;
  overflow: hidden;
  line-height: 0.4rem;
  position: relative;
  z-index: 1;
}
.guajianBot a {
  width: 50%;
  color: #001a46;
  text-align: center;
  line-height: 0.4rem;
  display: block;
  height: 0.4rem;
  background: linear-gradient(9deg, #faf042, #ffe6a8 100%);
  margin-right: 0.02rem;
  box-shadow: 0 0.03rem 0 #fffbd9 inset;
}
.guajianBot a + a {
  margin-right: 0;
}
.guajianMain_jindu {
  width: 1.44rem;
  height: 0.16rem;
  background: #3da4b0;
  border: 0.02rem solid #091239;
  border-radius: 0.15rem;
  margin: 0.02em auto 0;
  overflow: hidden;
  position: relative;
}
.guajianMain_jindu em {
  display: block;
  background: #ffea00;
  box-shadow: 0 0.03rem 0 rgba(255, 255, 255, 0.68) inset;
  height: 0.16rem;
}
.guajianMain_jindu p {
  width: 1.44rem;
  height: 0.16rem;
  line-height: 0.16rem;
  text-align: center;
  color: #001a46;
  font-size: 0.18rem;
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
}
.sum2019_guajian_keji .guajianTit {
  background: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/guajianBg.png)
    0 -1.8rem;
  background-size: 1.88rem 5rem;
}
.sum2019_guajian_chaoliu .guajianTit {
  background: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/guajianBg.png)
    0 -2.67rem;
  background-size: 1.88rem 5rem;
}
.sum2019_guajian_yinyue .guajianTit {
  background: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/guajianBg.png)
    0 -3.57rem;
  background-size: 1.88rem 5rem;
}
.sum2019_guajian_keji .guajianMain {
  background: linear-gradient(9deg, #0086ac, #19fff1 100%);
  border-color: #02577e;
}
.sum2019_guajian_keji .guajianMain_bot {
  background: linear-gradient(180deg, #c1ffdf, #05e5b7 100%);
  border-color: #02577e;
  box-shadow: 0 0.03rem 0 #e0ffef inset;
}
.sum2019_guajian_keji .guajianMain_bot span {
  background: #02577e;
}
.sum2019_guajian_jc5 .guajianTit {
  width: 1.88rem;
  height: 0.3rem;
  background: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/guajianBg.png)
    0 0;
  background-size: 1.88rem 5rem;
  color: #062963;
  text-align: center;
  padding-top: 0.47rem;
  font-size: 0.18rem;
  font-weight: bold;
  margin: -0.3rem 0 0 -0.11rem;
}
.sum2019_guajian_chaoliu .guajianMain {
  background: linear-gradient(9deg, #a235d4, #ffb6d7 100%);
  border-color: #7f20a2;
}
.sum2019_guajian_chaoliu .guajianMain_bot {
  background: linear-gradient(180deg, #ffb2f1, #fa64ca 100%);
  border-color: #7f20a2;
  box-shadow: 0 0.03rem 0 #ffd6f7 inset;
}
.sum2019_guajian_chaoliu .guajianMain_bot span {
  background: #7f20a2;
}
.sum2019_guajian_yinyue .guajianMain {
  background: linear-gradient(9deg, #5b5dc9, #4ad1fd 100%);
  border-color: #1c409e;
}
.sum2019_guajian_yinyue .guajianMain_bot {
  background: linear-gradient(180deg, #86fff2, #1dcaf5 100%);
  border-color: #1c409e;
  box-shadow: 0 0.03rem 0 #c2fffa inset;
}
.sum2019_guajian_yinyue .guajianMain_bot span {
  background: #1c409e;
}
.guajianMainBox_tit span {
  margin-right: 0.2rem;
}
.paiming_infor {
  text-align: left;
  padding-left: 0.05rem;
  margin-bottom: 0.02rem;
}
.djs {
  width: 1.86rem;
  height: 1.34rem;
  background: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/djs.png);
  background-size: 1.86rem 1.34rem;
}
.djs p {
  color: #001a46;
  font-size: 0.4rem;
  font-weight: bold;
  text-align: center;
  padding-top: 0.77rem;
}
.djs {
  width: 1.86rem;
  height: 1.34rem;
  background: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/djs.png);
  background-size: 1.86rem 1.34rem;
}
.djs p {
  color: #001a46;
  font-size: 0.4rem;
  font-weight: bold;
  text-align: center;
  padding-top: 0.77rem;
}
.guajian_zk {
  width: 1.94rem;
  height: 1.08rem;
  background: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/guajian_zk.png);
  background-size: 1.94rem 1.08rem;
}
</style>
