import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import http from './configs/vueAxiosConfig'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// router.beforeEach((to, from, next) => {
//   var token = localStorage.getItem('token')
//   if (token) {
//     next()
//   } else {
//     if (to.path === '/') {
//       next()
//     } else {
//       next('/')
//     }
//   }
// })

Vue.use(ElementUI)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = http
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
