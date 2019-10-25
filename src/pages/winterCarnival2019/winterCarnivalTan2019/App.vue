<template>
  <div id="app">
    <div>
      <div class="tips2" v-if="tanObj.type == 1">
        <div v-html="tanObj.tipTxt"></div>
        <a
          href="javaScript:void(0)"
          class="tips2_btn"
          @touchend="closeTanboxFn"
        ></a>
      </div>
      <!-- 12次任务完成弹框 -->
      <div class="renwu_tips1" v-if="tanObj.type == 2">
        <p>恭喜主播累计完成12次任务一，奖励咔嚓相机 1000个，已自动放入库存。</p>
        <a
          href="javaScript:void(0)"
          class="renwu_tips1_btn"
          @touchend="closeTanboxFn"
        ></a>
      </div>

      <!--任务完成弹框-->
      <div class="renwu_tips2" v-if="tanObj.type == 3">
        <div v-html="tanObj.tipTxt"></div>
        <a
          href="javaScript:void(0)"
          class="renwu_tips2_btn"
          @touchend="closeTanboxFn"
        ></a>
      </div>
    </div>
  </div>
</template>

<script>
import 'babel-polyfill';
import units from 'common/js/units';
import appcom from 'common/js/appcom';
export default {
  name: '',
  data() {
    return {
      showContentFlag: true,
      args: null,
      tanObj: {
        type: 0,
        tipTxt: '',
        closeTip: ''
      }
    };
  },
  created() {
    let _this = this;
    this.args = units.getQueryStringArgs();
    this.tanObj = this.args.tanObj
      ? JSON.parse(decodeURIComponent(decodeURIComponent(this.args.tanObj)))
      : {};
    setTimeout(() => {
      _this.closeTanboxFn();
    }, 10000);
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    closeTanboxFn() {
      appcom.dilogClose(this.tanObj.closeTip, 361);
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
.renwu_tips1 {
  width: 5.02rem;
  height: 4.83rem;
  background: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/renwu1.png);
  background-size: 5.02rem 4.83rem;
  position: relative;
  margin: 0 auto;
}
.renwu_tips1 p {
  color: #fff;
  font-size: 0.28rem;
  text-align: center;
  padding: 1.9rem 0.75rem 0 0.6rem;
  line-height: 0.45rem;
}
.renwu_tips1_btn {
  width: 2.16rem;
  height: 0.66rem;
  position: absolute;
  left: 50%;
  margin-left: -1.17rem;
  bottom: 0.67rem;
}
.renwu_tips2 {
  width: 4.89rem;
  height: 4.99rem;
  background: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/renwu2.png);
  background-size: 4.89rem 4.99rem;
  position: relative;
  margin: 0 auto;
}
.renwu_tips2_btn {
  width: 2.16rem;
  height: 0.66rem;
  position: absolute;
  left: 50%;
  margin-left: -1.13rem;
  bottom: 0.67rem;
}
.renwu_tips2 p {
  font-size: 0.3rem;
  color: #222a61;
  line-height: 0.39rem;
  padding: 1.9rem 0.65rem 0;
  text-align: center;
}
.tips2 {
  width: 4.8rem;
  height: 2.7rem;
  background: url(//imagexc.kuwo.cn/kuwolive/huodong/winterCarnival2019/pendant/tips2.png);
  background-size: 4.8rem 2.7rem;
  position: relative;
  margin: 0 auto;
}
.tips2_btn {
  width: 2.17rem;
  height: 0.66rem;
  position: absolute;
  left: 50%;
  margin-left: -1.13rem;
  bottom: 0.38rem;
}
.tips2 p {
  color: #014061;
  font-size: 0.24rem;
  padding: 0.3rem 0.45rem 0;
  text-align: center;
  line-height: 0.39rem;
}
</style>
