<template>
  <div class="wrapper">
    <div class="header">
      <div class="profile">
        <i class="el-icon-switch-button" @click="log_out"></i>
      </div>
      <p class="title">曌明图床</p>
      <div class="control">
        <i class="el-icon-paperclip" :class="setTopClassArr" @click="setTopHandler" ></i>
        <i class="el-icon-remove-outline" @click="handler('min')"></i>
        <i class="el-icon-circle-close" @click="handler('close')"></i>
      </div>
    </div>
    <div class="main-con">
      <div class="side">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409eff"
          router
        > 
          <el-menu-item index="/main/upload">
            <i class="el-icon-upload"></i>
            <span slot="title">上传区</span>
          </el-menu-item>
          <el-menu-item index="/main/photo">
            <i class="el-icon-picture"></i>
            <span slot="title">相册</span>
          </el-menu-item>
        </el-menu>
        <div class="net-status common">
          <span :class="{ 'status': true, 'disconnect': !this.$store.state.Counter.network_stae }"></span> <span class="prompt-msg">网络正常</span>
        </div>
        <div class="go-website common">
          <el-link type="info" icon="el-icon-position" @click="open('http://www.baidu.com')">去官网</el-link>
          <el-link
            type="info"
            icon="el-icon-aim"
            @click="open('https://developer.mozilla.org/zh-CN/')"
          >去CMS</el-link>
        </div>
      </div>
      <div class="main">
        <transition name="my">
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <div class="unlock-box" v-show="unlockMask">
      <div :class="unlockClass">
        <input type="password" class="unlock-pwd" v-model="unlockpwd" @keydown.enter="unlockHandler">
        <el-button type="info" icon="el-icon-unlock" circle @click="unlockHandler"></el-button>
        <p class="error-msg" v-show="errorMsg">密码错误,请重新输入。</p>
      </div>
    </div>
  </div>
</template>
<script>
var { ipcRenderer } = require('electron')
var md5 = require('md5')
export default {
  data () {
    return {
      unlockpwd: '',
      errorMsg: false,
      unlockClass: ['unlock-msg-con'],
      unlockMask: false,
      setTopClassArr: []
    }
  },
  beforeCreate () {
    localStorage.getItem('token') === 'undefined' && this.$router.push({name: 'login'})
    localStorage.getItem('token') || this.$router.push({name: 'login'})
  },
  mounted () {
    ipcRenderer.on('lock', () => {
      this.unlockMask = true
    })
    this.$message({
      message: '登录成功',
      type: 'success'
    })
    // let a = 2
    // setInterval(() => {
    //   a += 1
    //   if (a % 2 === 0) {
    //     this.$store.dispatch('networkDis')
    //   } else {
    //     this.$store.dispatch('networkSuccess')
    //   }
    //   console.log(this.$store.state.Counter.network_stae)
    // }, 1000)
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    },
    handler (order) {
      ipcRenderer.send(order)
    },
    setTopHandler () {
      if (this.setTopClassArr.length === 0) {
        this.setTopClassArr.push('setTop')
        ipcRenderer.send('setTop', true)
      } else {
        this.setTopClassArr.pop()
        ipcRenderer.send('setTop', false)
      }
    },
    log_out () {
      this.$confirm('此操作将会退出登录, 是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        localStorage.clear()
        ipcRenderer.send('close')
      }).catch(() => {
        this.$message({
          type: 'success',
          message: '取消退出登录成功'
        })
      })
    },
    unlockHandler () {
      let allowPwd = btoa(md5(this.unlockpwd + 'ILOVEYOUZOUXIAOLINUNTILDEATH'))
      let getCache = localStorage.getItem('lockpwd')
      if (allowPwd !== getCache) {
        this.unlockpwd = ''
        this.unlockClass.push('autherror')
        this.errorMsg = true
        let timer = setTimeout(() => {
          this.unlockClass.pop()
          clearTimeout(timer)
        }, 600)
      } else {
        this.errorMsg = false
        this.unlockMask = false
      }
    }
  }
}
</script>

<style lang="css" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  background-color: rgba(84,92,100,.85);
}
.header {
  display: flex;
  height: 6vh;
  line-height: 6vh;
}
.profile {
  padding: 0 15px;
}
.profile i {
  font-size: 20px;
  cursor: pointer;
  transition: all .8s;
}
.profile i:hover {
  color: #f56c6c;
}
.title {
  flex: 1;
  margin: 0;
  text-align: center;
  -webkit-app-region: drag;
}
.control {
  display: flex;
}
.control .setTop {
  color: #409eff;
  background-color: rgba(255, 255, 255, 0.2)
}
.control i {
  padding: 0 4px;
  margin: 0 4px;
  line-height: 6vh;
  font-size: 20px;
  cursor: pointer;
}
.control i:hover {
  color: #409eff;
}
.main-con {
  flex: 1;
  display: flex;
}
.side {
  position: relative;
  width: 180px;
  height: 94vh;
}
.common {
  position: absolute;
  display: flex;
  width: 100%;
  height: 40px;
}
.net-status {
  justify-content: center;
  align-items: center;
  bottom: 40px;
  font-size: 14px;
  color: #999
}
.net-status .status {
  margin-right: 6px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #09f175;
}
.net-status .disconnect {
  background-color: #FD563C;
}

.go-website {
  bottom: 0;
}
.go-website a {
  flex: 1;
  line-height: 40px;
}
.go-website a:hover {
  color: #409eff;
}
.unlock-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 10px;
  z-index: 1024;
  background-color: rgba(128, 128, 128, .5);
}
.unlock-msg-con {
  position: fixed;
  text-align: center;
  top: 50%; 
  left: 50%;
  margin: -25px 0 0 -250px;
  width: 500px;
  height: 50px;
}
.autherror {
  animation: shake 1s ease;
}
.unlock-msg-con .error-msg {
  font-size: 14px;
  color: #f00;
  text-align: center;
}
.unlock-pwd {
  padding: 6px 10px;
  background: none;
  font-size: 18px;
  border-radius: 20px;
  color: #fff;
  border: #409eff solid 2px;
}
.unlock-pwd:focus {
  outline: none;
}
.main {
  flex: 1;
}
.my-enter,
.my-leave-to{
  opacity: 0;
  transform: translate3d(0, -100%, 0);
}
.my-enter-active,
.my-leave-active{
  transition: all .5s;
}
@keyframes shake {
  from,
  to {
    transform: translate3d(0, 0, 0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translate3d(-15px, 0, 0);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translate3d(15px, 0, 0);
  }
}
</style>
