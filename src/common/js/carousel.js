let setInval = null;
let Carousel = function(options) {
  var _this = this,
    defaultSetting = {
      width: '1.8rem',
      height: '.9rem',
      index: 1
    };
  // _this.container = document.querySelector(_this.setting.container);
  // _this.sliderItemsLen = _this.sliderItemsDom.length;
  // _this.buttons = document.querySelector("#buttons").getElementsByTagName('span');
  _this.setting = Object.assign(defaultSetting, options);
  _this.list = document.querySelector('#list');
  _this.sliderItemsDom = _this.list.getElementsByClassName('swiper-slide');
  _this.sliderItemsLen = _this.getShowSliderLen(_this.sliderItemsDom);
  _this.prev = document.querySelector('#prev');
  _this.next = document.querySelector('#next');
  _this.index =
    _this.setting.index > _this.sliderItemsLen ? 1 : _this.setting.index;
  _this.list.style.left =
    parseFloat(_this.setting.width) -
    _this.index * parseFloat(_this.setting.width) +
    'rem'; // 改变left值
  _this.prev.onclick = function() {
    // 点击按钮调用rotate方法切换到上一张
    _this.rotate('left');
  };
  _this.next.onclick = function() {
    // 点击按钮调用rotate方法切换到下一张
    _this.rotate('right');
  };
  clearInterval(setInval);
  _this.animateFun();
};
Carousel.prototype = {
  rotate: function(dir) {
    // 定义rotate方法
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
      // showButtons();
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
        //
        newLeft = 0;
        _this.index = 1;
      }
      _this.list.style.left = newLeft + 'rem'; // 改变left值
      // showButtons();
    }
    window.swiperIndex = _this.index; // 暴露出去，供全局对象使用
    // function showButtons(){  // rotate方法里面又定义了showButtons方法
    //     for(let i=0; i< _this.buttons.length; i++){
    //         if(_this.buttons[i].className === 'on'){
    //             _this.buttons[i].className = ''; // 清除原圆点高亮状态
    //             break;
    //         }
    //     }
    //     _this.buttons[_this.index-1].className ='on';
    // }
  },
  getShowSliderLen: function(data) {
    var len = 0,
      _this = this;
    if (!data.length) return 0;
    for (var i = 0; i < data.length; i++) {
      if (_this.getDomStyle(data[i], 'display') == 'block') {
        len++;
      }
    }
    return len;
  },
  getDomStyle: function(dom, styleName) {
    return dom.currentStyle
      ? dom.currentStyle[styleName]
      : getComputedStyle(dom, null)[styleName];
  },
  triggle: function(element, method) {
    var func = element[method];
    return func();
  },
  animateFun: function() {
    var _this = this;
    clearInterval(setInval);
    setInval = setInterval(() => {
      _this.triggle(document.querySelector('#next'), 'onclick');
    }, 10000);
  }
};
