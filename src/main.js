import Vue from 'vue'
import App from './App.vue'
import { Plugin } from 'vue-fragment'
import 'interscript'

Vue.use(Plugin)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
