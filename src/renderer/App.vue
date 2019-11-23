<template>
  <div id="app">
    <transition name="my">
      <router-view></router-view>
    </transition> 
  </div>
</template>

<script>
  require('./configs/mousetrap.js')
  var { ipcRenderer } = require('electron')
  export default {
    mounted () {
      ipcRenderer.on('logout', () => {
        localStorage.clear()
        ipcRenderer.send('close')
      })
      const updateOnlineStatus = () => {
        ipcRenderer.send('online-status-changed', navigator.onLine)
      }
      window.addEventListener('online', updateOnlineStatus)
      window.addEventListener('offline', updateOnlineStatus)
      updateOnlineStatus()
      ipcRenderer.on('no-network-connection', () => {
        this.$store.dispatch('networkDis')
      })
      ipcRenderer.on('network-connection-normal', () => {
        this.$store.dispatch('networkSuccess')
      })
    }
  }
</script>

<style lang="css" scoped>
  /* CSS */
  #app {
    width: 100vw;
    height: 100vh;
    color: #e5e5e5;
    border-radius: 10px;
    overflow: hidden;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    -webkit-user-select: none
  }
  .my-enter,
  .my-leave-to{
    opacity: 0;
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);
    transform-origin: center bottom;
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
  .my-enter-active,
  .my-leave-active{
    transition: all 2s cubic-bezier(0.175, 0.885, 0.32, 1);
  }
</style>
