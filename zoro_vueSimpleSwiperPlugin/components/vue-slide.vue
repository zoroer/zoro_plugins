<!--
 * @fileoverview  vue无缝轮播图
 * @author haihan | haihan@kaochong.com
 * @version 1.0 | 2019-09-05 | haihan

 ********
 sources          为轮播图使用的图片资源，类型array
 translateSpeed   平移的速度，类型Number，单位ms
 intervalSpeed    动画的速度，类型Number，单位ms
 needPagination   是否需要页码块，类型Boolean
 ********
-->

<template>
  <div class="slide-container">
    <ul class="slide-ul" ref="slideUl">
      <li class="slide-li" v-for="(item, index) in sources" :key="index">
        <img :src="item" />
      </li>
    </ul>
    <div class="tab-dot-ul" v-if="needPagination">
      <span
        v-for="(item, index) in originSource"
        :class="[paginationIndex === index && 'active', 'dot-li']"
        @click="dotClick(index)">
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      sources: {
        type: Array,
        default: () => []
      },
      translateSpeed: {
        type: Number,
        default: 1000
      },
      intervalSpeed: {
        type: Number,
        default: 3000
      },
      needPagination: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        activeIndex: 0,
        paginationIndex: 0,
        timer: null
      }
    },
    computed: {
      originSource() {
        return this.sources.slice(0, this.sources.length-1);
      }
    },
    methods: {
      init() {
        this.handledSlideSource();
        this.handleSlideAnimate();
        this.handleTransitionEnd();
      },
      // 轮播动画
      handleSlideAnimate() {
        this.timer = setInterval(() => {
          // 单独定义pagination控制
          this.paginationIndex = this.paginationIndex < this.sources.length-2
            ? this.paginationIndex+1 : 0;
          this.activeIndex++;

          this.$refs.slideUl.style.transition = `all ${this.translateSpeed/1000}s ease-in-out`;
          this.$refs.slideUl.style.transform = `translate3d(${-6.9 * this.activeIndex}rem, 0, 0)`;
        }, this.intervalSpeed);
      },
      // 重置位置
      handleTransitionEnd() {
        this.$refs.slideUl.addEventListener('transitionend', () => {
          if (this.activeIndex >= this.sources.length-1) {
            this.activeIndex = 0;
            this.$refs.slideUl.style.transition = 'all 0s';
            this.$refs.slideUl.style.transform = `translate3d(0, 0, 0)`;
          }
        }, false);
      },
      // 复制第一个资源并更新盒子宽度
      handledSlideSource() {
        this.sources.push(this.sources.slice(0, 1));
        this.$refs.slideUl.style.width = this.sources.length * 6.9 + 'rem';
      },
      // dot点击
      dotClick(index) {
        clearInterval(this.timer);
        this.$refs.slideUl.style.transition = `all ${this.translateSpeed/1000}s ease-in-out`;
        this.$refs.slideUl.style.transform = `translate3d(${-6.9 * index}rem, 0, 0)`;
        this.activeIndex = index;
        this.paginationIndex = index;
        window.setTimeout(() => {
          this.handleSlideAnimate();
        }, 16.66);
      },
      // 页面失去焦点停止动画
      bindHidden() {
        let hiddenProperty = 'hidden' in document ? 'hidden' :
          'webkitHidden' in document ? 'webkitHidden' :
            'mozHidden' in document ? 'mozHidden' : null;
        let visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
        document.addEventListener(visibilityChangeEvent, () => {
          if (document[hiddenProperty]) {
            clearInterval(this.timer);
          } else{
            this.handleSlideAnimate();
          }
        });
      }
    },
    mounted() {
      this.init();
      this.bindHidden();
    },
    destroyed() {
      clearInterval(this.timer);
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  .slide-container {
    position: relative;
    height: 3rem;
    width: 6.9rem;
    border-radius: .15rem;
    margin: 0 auto;
    overflow: hidden;
    box-shadow: .02rem .04rem .1rem rgba(144, 146, 153, 0.16);
    .slide-ul {
      position: absolute;
      height: 3rem;
      list-style-type: none;
      .slide-li {
        width: 6.9rem;
        display: inline-block;
        img {
          display: block;
          height: 3rem;
          width: 100%;
        }
      }
    }
    .tab-dot-ul {
      position: absolute;
      bottom: .2rem;
      left: 0;
      z-index: 1;
      width: 100%;
      text-align: center;
      .dot-li {
        width: .15rem;
        height: .05rem;
        display: inline-block;
        margin-right: .07rem;
        background-color: #EBECED;
        border-radius: .02rem;
        :last-child {
          margin-right: 0;
        }
        &.active {
          background-color: #FFDD04;
          width: .26rem;
        }
      }
    }
  }
</style>
