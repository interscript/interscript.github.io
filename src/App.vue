<template>
  <div id="app">
    <Sample />
  </div>
</template>

<script>
import Sample from './components/Sample.vue'

export default {
  name: 'App',
  components: {
    Sample
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 2rem auto;

  .logo {
    height: 100px;
    width: 100px;
    margin: 20px;
  }
}
</style>
