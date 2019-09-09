<!--
 * @fileoverview
 * @author haihan | haihan@kaochong.com
 * @version 1.0 | 2018-12-03 | haihan
-->

<template>
  <div>
    <Slide :sources="slideSources"></Slide>
  </div>
</template>

<script>
  import Slide from './components/vue-slide';
  export default {
    components: {
      Slide
    },
    data() {
      return {
        slideSources: [
          require('./imgs/sys-course1.png'),
          require('./imgs/sys-course2.png'),
          require('./imgs/sys-course3.png'),
          require('./imgs/sys-course4.png')
        ]
      }
    }
  };
</script>

<style lang="less" type="text/less" scoped>
</style>
