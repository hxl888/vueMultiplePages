<template>
  <div id="app" v-if="showContentFlag">
    <div class="tips" v-if="tanObj.type == 1">
      <div class="tips_tit">总排名：{{ rankNum }}</div>
      <a
        href="javaScript:void(0)"
        class="tips_close"
        @touchend="closeTanboxFn"
      ></a>
      <a
        href="javaScript:void(0)"
        class="tips_btn"
        @touchend="goToMorePageFn"
      ></a>
      <div href="javaScript:void(0)" class="tipsPic104">
        <img :src="userPic1" class="img1" />
        <img :src="userPic2" class="img2" />
      </div>
      <p class="tips_p1">阶段第一玩家</p>
      <p class="tips_p2">
        <a href="javaScript:void(0)">{{ getName(userObj.user.nickName) }}</a>
      </p>
      <p class="tips_p3">贡献值：{{ userObj.user.cnt || 0 }}</p>
    </div>
    <!-- 相册 -->
    <div class="photo" :class="heaTopClass" v-if="tanObj.type == 2">
      <a
        href="javaScript:void(0)"
        class="photo_close"
        @touchend="closeTanboxFn"
      ></a>
      <div class="photo_show"></div>
      <a href="javaScript:void(0)" class="photo_btn" @touchend="golotteryFn">
        <span>{{ frequency }}</span>
      </a>
      <p class="photo_ps">点击按钮可获得相片碎片哦！</p>
      <div class="photoList" v-for="item in 3" :key="item">
        <div class="photoImg">
          <img
            v-for="items in 4"
            :key="items"
            :src="
              getPic(picSrcArr.slice(item * 4 - 4, item * 4)[items - 1], item)
            "
            :class="getClass(items)"
          />
        </div>
        <p class="photoTit">
          <span
            >{{ activeNameArr[Math.ceil(tanObj.curDay / 4) - 1]
            }}{{ phoNumArr[item - 1] }}</span
          >{{ activeGiftNumArr[item - 1] }}
        </p>
        <div class="photo_jlPic">
          <em class="photo_jl_icon"></em>
          <img
            src="//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/photo_jlPic1.png"
          />
          <p v-if="activeGiftObj.name[item - 1]">
            <span>{{ activeGiftObj.name[item - 1] }}</span>
            <strong>{{ activeGiftObj.numArr[item - 1] }}</strong>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'babel-polyfill';
import units from 'common/js/units';
import ajax from 'common/js/ajax';
import appcom from 'common/js/appcom';
export default {
  name: '',
  data() {
    return {
      showContentFlag: true,
      args: null,
      tanObj: { type: 1, curDay: 1, sid: 0, rid: 0 },
      userObj: null,
      frequency: 0,
      picSrcArr: [],
      activeNameArr: ['音乐', '潮流', '科技', '美食'],
      giftNameArr: ['野狼disco', '发光气泡狗', 'VR游乐场', '火锅冰淇淋'],
      activeGiftNumArr: ['1套', '1套', '2套'],
      phoNumArr: ['相片一', '相片二', '相片三'],
      activeGiftObj: {
        name: ['专场活动礼物', '', '狂欢王者座驾'],
        numArr: ['10个', '', '2小时']
      }
    };
  },
  created() {
    this.args = units.getQueryStringArgs();
    this.tanObj = this.args.tanObj
      ? JSON.parse(decodeURIComponent(decodeURIComponent(this.args.tanObj)))
      : {};
    console.log(
      '%cthis.tanObj: ',
      'color: MidnightBlue; background: Aquamarine; font-size: 20px;',
      this.tanObj
    );
    if (this.tanObj.type == 1) {
      this.info1();
    } else {
      this.info2();
    }
  },
  mounted() {},
  computed: {
    rankNum() {
      return units.handleRank(this.userObj.rank, 99);
    },
    userPic1() {
      return units.getPicImg(this.userObj.pic, true);
    },
    userPic2() {
      return units.showActivePic(this.userObj.badgeid, true);
    },
    heaTopClass() {
      var classArr = [
        'photo_yinyue',
        'photo_chaoliu',
        'photo_keji',
        'photo_meishi'
      ];
      return classArr[Math.ceil(this.tanObj.curDay / 4) - 1];
    }
  },
  watch: {},
  methods: {
    getName(name) {
      return units.getName(name);
    },
    getPic(name, index) {
      return `//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/pho_${index}_${name}.png`;
    },
    getClass(num) {
      return `photoImg${num}`;
    },
    info1() {
      let _this = this,
        queryUrl = `activity/winterCarnival20191106?fun=hoverPendant&tid=${_this.tanObj.roomownerid}`;
      ajax.callWebServer(queryUrl, function(res) {
        if (res.status == '200') {
          let data = res.data;
          _this.userObj = data;
          _this.showContentFlag = true;
        }
      });
    },
    info2() {
      let _this = this,
        queryUrl = `activity/winterCarnival20191106?fun=musicAlbum&uid=${_this.tanObj.uid}`;
      ajax.callWebServer(queryUrl, function(res) {
        if (res.status == '200') {
          let data = res.data;
          this.info2Html(data.cnt || 0);
          _this.frequency = data.num;
          _this.showContentFlag = true;
        }
      });
    },
    info2Html(cnt) {
      var arr = [];
      for (var i = 1, j = 0; j < 12; i = i * 2, j++) {
        if ((cnt & i) != 0) {
          // 有相片
          arr[j] = `bright`;
        } else {
          // 无相片
          arr[j] = `gray`;
        }
      }
      this.picSrcArr = arr;
    },
    golotteryFn() {
      var _this = this,
        url = `revelryalbumchip&uid=${_this.tanObj.uid}&sid=${_this.tanObj.sid}&rid=${_this.tanObj.rid}`;
      ajax.callZhiboServer(url, function(res) {
        if (res.status == 1) {
          _this.albumFinishing(res);
        }
      });
    },
    albumFinishing(res) {
      var _this = this,
        album = res.album,
        chip = res.chip,
        albumchip = res.albumchip,
        indexs = 0;
      this.info2Html(albumchip); // 重新调整相片

      // 抽取的哪个碎片
      for (var i = 1, j = 0; j < 12; i = i * 2, j++) {
        if ((chip & i) != 0) {
          // 有相片
          indexs = j + 1;
        }
      }
      var giftArr = [],
        closeTip = null,
        tipTxt = null,
        tanObj = null,
        commonUrl = null,
        url = null;

      giftArr = ['相册一', '相册二', '相册三'];
      closeTip = `提示信息${units.getRandomNumber(1, 1000)}`;
      tipTxt = `<p>手气真棒,恭喜抽取${
        this.activeNameArr[Math.ceil(this.tanObj.curDay / 4) - 1]
      }${giftArr[album - 1]}中的碎片${indexs % 4 == 0 ? 4 : indexs % 4}</p>`;
      tanObj = { closeTip: closeTip, type: 1, tipTxt: tipTxt };
      commonUrl = `tanObj=${units.formatObjToStr(tanObj)}`;
      url = `https://jx.kuwo.cn/KuwoLive/jsp/alone/huodong/winterCarnivalTan2019.html?random=${Math.random()}&${commonUrl}`;

      appcom.dilogOpen(url, closeTip);

      if (album) {
        // 已经集齐相片
        setTimeout(() => {
          giftArr = [
            `相册一,奖励专场活动${
              _this.giftNameArr[Math.ceil(this.tanObj.curDay / 4) - 1]
            }10个`,
            '相册二,奖励狂欢值积分加成120s',
            '相册三,奖励狂欢王者座驾，有效期2小时'
          ];
          closeTip = `提示信息${units.getRandomNumber(1, 1000)}`;
          tipTxt = `<p>恭喜合成${
            _this.activeNameArr[Math.ceil(_this.tanObj.curDay / 4) - 1]
          }${giftArr[album - 1]}</p>`;
          tanObj = { closeTip: closeTip, type: 1, tipTxt: tipTxt };
          commonUrl = `tanObj=${units.formatObjToStr(tanObj)}`;
          url = `https://jx.kuwo.cn/KuwoLive/jsp/alone/huodong/winterCarnivalTan2019.html?random=${Math.random()}&${commonUrl}`;

          appcom.dilogOpen(url, closeTip);
        }, 2000);
      }
    },
    closeTanboxFn() {
      appcom.dilogClose(this.tanObj.closeTip, 361);
    },
    goToMorePageFn() {
      appcom.dilogClose(this.tanObj.closeTip, 361);
      appcom.pushPage(
        'https://jx.kuwo.cn/KuwoLive/jsp/alone/huodong/winterCarnivalInfo2019.html',
        '活动详情'
      );
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
}
.tips {
  width: 4.75rem;
  height: 2.95rem;
  background: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/tips.png);
  background-size: 4.75rem 2.95rem;
  position: relative;
  margin: 0 auto;
}
.tips_tit {
  height: 2.4rem;
  height: 0.42rem;
  line-height: 0.42rem;
  font-weight: bold;
  font-size: 0.28rem;
  padding: 0.06rem 0 0 0.3rem;
}
.tips_close {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  right: 0.13rem;
  top: 0.23rem;
}
.tips_btn {
  width: 3.6rem;
  height: 0.62rem;
  position: absolute;
  bottom: 0.24rem;
  left: 50%;
  margin-left: -1.73rem;
}
.tipsPic104 {
  width: 1.04rem;
  height: 1.04rem;
  float: left;
  margin: 0.25rem 0.2rem 0 0.78rem;
  position: relative;
}
.tipsPic104 .img1 {
  width: 1.04rem;
  height: 1.04rem;
  border-radius: 0.1rem;
  display: block;
}
.tipsPic104 .img2 {
  position: absolute;
  bottom: 0;
  left: 50%;
  margin-left: -0.28rem;
  width: 0.56rem;
  height: 0.2rem;
}
.tipsPic104 span {
  position: absolute;
  bottom: -0.14rem;
  left: 50%;
  margin-left: -0.28rem;
}
.tips_p1,
.tips_p2,
.tips_p3 {
  height: 0.36rem;
  line-height: 0.36rem;
  color: #001a46;
  font-size: 0.24rem;
}
.tips_p1 {
  padding-top: 0.2rem;
}
.tips_p2 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #001a46;
  font-weight: bold;
}
.tips_p2 a {
  color: #001a46;
}
.tips_p3 {
  font-weight: bold;
}

/* 相册 */
.photo {
  width: 5.92rem;
  height: 9.7rem;
  border-radius: 0.2rem;
  border: 0.04rem solid #02577e;
  position: relative;
  margin: 0 auto;
  margin-top: 0.8rem;
}
.photo_yinyue .photo_show,
.photo_chaoliu .photo_show,
.photo_keji .photo_show,
.photo_meishi .photo_show {
  width: 5.1rem;
  height: 0.85rem;
  background-image: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/photoBg.png);
  background-size: 5.9rem 4.5rem;
  position: absolute;
  left: 50%;
  margin: -0.49rem 0 0 -2.5rem;
}
.photo_yinyue .photo_show {
  background-position: 0 0;
}
.photo_chaoliu .photo_show {
  background-position: 0 -0.9rem;
}
.photo_keji .photo_show {
  background-position: 0 -1.87rem;
}
.photo_meishi .photo_show {
  background-position: 0 -2.84rem;
}

.photo_close {
  width: 0.27rem;
  height: 0.27rem;
  background: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/photoBg.png) -2.96rem -3.79rem;
  background-size: 5.9rem 4.5rem;
  position: absolute;
  right: 0.15rem;
  top: 0.15rem;
}
.photo_btn {
  position: relative;
  width: 2.8rem;
  height: 0.65rem;
  background: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/photoBg.png)
    0 -3.79rem;
  background-size: 5.9rem 4.5rem;
  display: block;
  margin: 0.25rem auto 0;
}
.photo_btn span {
  padding: 0 0.05rem;
  height: 0.24rem;
  background: #ff2e5a;
  text-align: center;
  line-height: 0.24rem;
  border-radius: 0.12rem;
  position: absolute;
  right: 0.2rem;
  top: 0;
  color: #262864;
  font-size: 0.18rem;
  font-weight: bold;
}
.photo_ps {
  font-size: 0.18rem;
  color: #262864;
  height: 0.45rem;
  line-height: 0.35rem;
  text-align: center;
}
.photoList {
  width: 5.56rem;
  height: 2.52rem;
  border: 0.02rem solid #1a1b5c;
  border-radius: 0.05rem;
  margin: 0 auto 0.2rem;
}
.photoImg {
  width: 3.14rem;
  height: 2.34rem;
  border: 0.03rem solid #1a1b5c;
  background: #1a1b5c;
  float: left;
  margin: 0.06rem 0.07rem 0 0.06rem;
  border-radius: 0.05rem;
  overflow: hidden;
  position: relative;
}
.photoImg img {
  width: 1.56rem;
  height: 1.16rem;
  display: block;
}
.photoImg1,
.photoImg2,
.photoImg3,
.photoImg4 {
  position: absolute;
}
.photoImg1 {
  left: 0;
  top: 0;
}
.photoImg2 {
  right: 0;
  top: 0;
}
.photoImg3 {
  left: 0;
  bottom: 0;
}
.photoImg4 {
  right: 0;
  bottom: 0;
}
.photoTit {
  font-size: 0.24rem;
  color: #1a1b5c;
  padding-top: 0.3rem;
  font-weight: bold;
}
.photoTit span {
  color: #ffd633;
  font-weight: bold;
  font-size: 0.28rem;
  text-shadow: -1px 1px 0 #0d1b55, 1px 1px 0 #0d1b55, -1px -1px 0 #0d1b55,
    1px -1px 0 #0d1b55;
  margin-right: 0.24rem;
}
.photo_jlPic {
  width: 2.06rem;
  height: 1.31rem;
  border: 0.02rem solid #1a1b5c;
  border-radius: 0.03rem;
  margin: 0.2rem 0 0 0;
  display: inline-block;
  vertical-align: top;
  position: relative;
}
.photo_jlPic img {
  width: 2.13rem;
  height: 1.35rem;
  display: block;
}
.photo_jl_icon {
  width: 0.6rem;
  height: 0.24rem;
  background: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/photoBg.png) -3.39rem -3.79rem;
  background-size: 5.9rem 4.5rem;
  position: absolute;
  left: -0.05rem;
  top: 0.04rem;
}
.photo_jlPic p {
  height: 0.3rem;
  line-height: 0.3rem;
  color: #fff;
  font-size: 0.18rem;
  position: absolute;
  width: 94%;
  padding: 0 3%;
  left: 0;
  bottom: 0;
  background: #1a1b5c;
  display: flex;
  white-space: nowrap;
}
.photo_jlPic p span {
  width: 1.5rem;
}
.photo_keji {
  background: linear-gradient(9deg, #0d7caf, #64f4ec 100%);
  border-color: #02577e;
}
.photo_keji .photoList {
  background: linear-gradient(0deg, #2795bc, #71e2e2 100%);
}
.photo_keji .photo_jlPic {
  background: #2795bc;
}
.photo_yinyue {
  background: linear-gradient(180deg, #14d6f5, #385dd5 49%, #495aac 100%);
  border-color: #1a1b5c;
}
.photo_yinyue .photoList {
  background: linear-gradient(0deg, #647fce, #9eb5f9 100%);
}
.photo_yinyue .photo_jlPic {
  background: #647fce;
}
.photo_chaoliu {
  background: linear-gradient(0deg, #a235d4, #db61ac 49%, #ffb6d7 100%);
  border-color: #7f20a2;
}
.photo_chaoliu .photoList {
  background: linear-gradient(0deg, #e277b9, #efa0d6 100%);
}
.photo_chaoliu .photo_jlPic {
  background: #e277b9;
}
.photo_meishi {
  background: linear-gradient(9deg, #f24718, #fad955 100%);
  border-color: #f5561a;
}
.photo_meishi .photoList {
  background: linear-gradient(0deg, #fc8032, #fac564 100%);
}
.photo_meishi .photo_jlPic {
  background: #fd8d49;
}
</style>
