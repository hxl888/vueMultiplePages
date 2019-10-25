<template>
  <div id="app">
    <img class="imgtest" src="./images/logo.png" />
    测试用例
  </div>
</template>

<script>
import 'common/css/reset.css';

export default {
  name: 'app'
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
