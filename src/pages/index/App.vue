<template>
  <div id="app">
    <img class="imgtest" src="./images/logo.png" />
    测试用例
  </div>
</template>

<script>
import 'common/css/reset.css';
// import ajax from 'common/js/ajax';
export default {
  name: 'app',
  data() {
    return {};
  },
  created() {
    // this.pendant();
  },
  methods: {
    pendant() {
      // let queryUrl = `activity/annualCeremony20191206?fun=defPendant&tid=888&userround=2020&ffround=1`;
      // ajax.callWebServer(queryUrl, function(res) {
      //   console.log('res: ', res);
      // });
    }
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.imgtest {
  display: block;
  width: 2rem;
}
</style>
