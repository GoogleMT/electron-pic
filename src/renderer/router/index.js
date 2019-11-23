import Vue from 'vue'
import Router from 'vue-router'
import {ipcRenderer} from 'electron'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: require('@/components/login').default,
      beforeEnter: (to, from, next) => {
        let auth = !!localStorage.getItem('token')
        if (auth) {
          next('/main')
        } else {
          ipcRenderer.send('changeWindowSize', {width: 530, height: 400})
          console.log('进入登录页')
          next()
        }
      }
    },
    { path: '/main', redirect: '/main/upload' },
    {
      path: '/main',
      name: 'main',
      component: require('@/components/wrapper').default,
      beforeEnter: (to, from, next) => {
        ipcRenderer.send('changeWindowSize', {width: 850, height: 550})
        console.log('进入主页')
        next()
      },
      children: [
        {
          path: 'upload',
          component: require('@/components/main/UploadArea').default
        },
        {
          path: 'photo',
          components: require('@/components/main/photo')
        }
      ]
    }
  ]
})
