<template>
<div>
  <PageHeader/>
  <div id="app">
    <router-view></router-view> <!-- 라우터 뷰 -->
  </div>
  <PageFooter/>
</div>
</template>

<script>
import PageHeader from './components/component/PageHeader.vue'
import PageFooter from './components/component/PageFooter.vue'

export default {
  name: 'App',
  components: {
    PageHeader,
    PageFooter,
  }
}
</script>

<style>
#app {
  font-family: bmjua;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
