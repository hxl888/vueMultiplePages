<template>
  <div id="container">
    <div id="list">
      <slot name="default">></slot>
    </div>
    <!-- <span class="prev" @touchend="rotate('left')"></span> -->
    <span class="next" @touchend.prevent.stop="rotate('right')"></span>
    <div class="originBox" v-show="sliderItemsLen > 1">
      <span
        class="originSp"
        v-for="item in sliderItemsLen"
        :class="{ on: item == index }"
        :key="item"
      ></span>
    </div>
  </div>
</template>

<script>
// import units from 'common/js/units';
export default {
  name: 'carousel',
  props: {
    options: {
      type: Object
    }
  },
  data() {
    return {
      setInval: null,
      defaultSetting: {
        width: '1.68rem',
        height: '.8rem',
        time: 15000,
        index: 1
      },
      originHtml: '',
      setting: {},
      list: null,
      sliderItemsDom: null,
      originSptemsDom: null,
      sliderItemsLen: null,
      prev: null,
      next: null,
      index: null
    };
  },
  created() {
    this.$nextTick(() => {
      this.setting = Object.assign(this.defaultSetting, this.options);
      this.list = document.querySelector('#list');
      this.originBox = document.querySelector('.originBox');
      this.sliderItemsDom = this.list.getElementsByClassName('swiper-slide');
      this.originSptemsDom = this.originBox.getElementsByClassName('originSp');
      this.sliderItemsLen = this.getShowSliderLen(this.sliderItemsDom);
      this.index =
        this.setting.index > this.sliderItemsLen ? 1 : this.setting.index;
      this.list.style.left =
        parseFloat(this.setting.width) -
        this.index * parseFloat(this.setting.width) +
        'rem'; // 改变left值
      this.animateFun();
    });
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    rotate(dir) {
      let _this = this,
        newLeft = 0, // 变化后的left值
        _thisLeft = parseFloat(_this.list.style.left) || 0, // 原left值
        sliderWidth = parseFloat(_this.setting.width), // 可见视口宽度，这里也是一张图片宽度
        len = _this.sliderItemsLen, // 图片总张数
        totalWidth = len * sliderWidth;
      if (dir === 'left') {
        // 点击左按钮，往前一张
        if (!_thisLeft) {
          newLeft = _thisLeft + sliderWidth;
        } else {
          newLeft = _thisLeft + sliderWidth;
          _this.index--;
        }
        if (newLeft > 0) {
          // 如果是第一张图片往前切换，则切换到最后一张
          newLeft = -totalWidth + sliderWidth;
          _this.index = len;
        }
        _this.list.style.left = newLeft + 'rem'; // 改变left值
        // this.showButtons();
      }
      if (dir === 'right') {
        // 点击右按钮，往后一张, 则left值增加一个负sliderWidth
        if (!_thisLeft) {
          newLeft = _thisLeft - sliderWidth;
          _this.index++;
        } else {
          newLeft = _thisLeft - sliderWidth;
          _this.index++;
        }
        if (newLeft <= -totalWidth) {
          newLeft = 0;
          _this.index = 1;
        }
        _this.list.style.left = newLeft + 'rem'; // 改变left值
      }
      window.swiperIndex = _this.index; // 暴露出去，供全局对象使用
    },
    getShowSliderLen(data) {
      var len = 0,
        _this = this;
      if (!data.length) return 0;
      for (var i = 0; i < data.length; i++) {
        if (_this.getDomStyle(data[i], 'display') != 'none') {
          len++;
        }
      }
      return len;
    },
    getDomStyle(dom, styleName) {
      return dom.currentStyle
        ? dom.currentStyle[styleName]
        : getComputedStyle(dom, null)[styleName];
    },
    triggle(element, method) {
      var func = element[method];
      return func && func();
    },
    animateFun() {
      var _this = this;
      clearInterval(_this.setInval);
      _this.setInval = setInterval(() => {
        _this.rotate('right');
      }, this.setting.time);
    }
  }
};
</script>
<style lang="">
#container {
  overflow: hidden;
  position: relative;
  left: 50%;
  height: 0.8rem;
  width: 1.68rem;
  margin-left: -0.84rem;
}
#list {
  height: 0.9rem;
  position: absolute;
  z-index: 1;
}
.swiper-slide {
  float: left;
  width: 1.68rem;
  height: 100%;
}
.originBox {
  position: absolute;
  bottom: 0.03rem;
  left: 50%;
  width: 1.4rem;
  margin-left: -0.7rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 66;
}
.originBox .originSp {
  display: inline-block;
  margin-right: 0.1rem;
  width: 0.06rem;
  height: 0.06rem;
  border-radius: 50%;
  border: thin solid #0740bb;
  background: #fff;
}
.originSp:last-child {
  margin-right: 0;
}
.originSp.on {
  width: 0.12rem;
  height: 0.06rem;
  border-radius: 0.05rem;
  background: #f8de4b;
}
.arrow {
  cursor: pointer;
  text-align: center;
  font-size: 36px;
  font-weight: bold;
  width: 0.4rem;
  height: 0.3rem;
  position: absolute;
  z-index: 999;
  top: 0;
  overflow: hidden;
  text-indent: 3rem;
}
.prev,
.next {
  display: block;
  position: absolute;
  top: 0;
  z-index: 99;
  width: 0.3rem;
  height: 0.3rem;
}
.prev {
  left: 0;
  /* background: red; */
}
.next {
  /* background: blue; */
  right: 0;
}
</style>
