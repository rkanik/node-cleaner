import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import './assets/scss/main.scss'

Vue.config.productionTip = false

Vue.prototype.$ipc = window.ipcRenderer

new Vue({
  router,
  store,
  vuetify,
  created() {
    if (this.$route.path !== '/')
      this.$router.push('/')
  },
  render: h => h(App)
}).$mount('#app')
