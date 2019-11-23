<template>
  <div class="login-wrapper">
    <div class="login-container" @keyup.enter="login">
      <div class="control">
        <span class="title">
          99CFE3‬
        </span>
        <div class="control-btn">
          <i class="el-icon-minus" @click="handler('min')"></i>
          <i class="el-icon-close" @click="handler('close')"></i>
        </div>  
      </div>
      <div class="logo">
        <div class="profile">
        </div>
        <p class="message">一个专注于后台的前端程序员</p>
      </div>
      <div class="form-wrapper">
        <input v-model="form.username" type="text" class="username" placeholder="用户名" />
        <input v-model="form.password" type="password" class="password" placeholder="密码" />
        <input type="button" value="登录" class="login" @click="login">
      </div>
    </div>
  </div>
</template>
<script>
const { ipcRenderer } = require('electron')
const md5 = require('md5')
// let db = require('../configs/datastore')
export default {
  name: 'login',
  data () {
    return {
      form: {
        username: ''.trim(),
        password: ''.trim()
      }
    }
  },
  mounted () {
    ipcRenderer.on('lock', () => {
      console.log('xxx')
      if (!localStorage.getItem('token')) {
        ipcRenderer.send('not-login')
      }
    })
  },
  methods: {
    handler (order) {
      ipcRenderer.send(order)
    },
    to_main () {
      this.$router.push({name: 'main'})
    },
    login () {
      let { username, password } = this.form
      let salt = parseInt(new Date().getTime() / 100)
      if (username === '' || password === '' || username.length < 5 || password.length < 8) {
        this.$message({
          message: '抱歉,账号密码格式不对或者为空了',
          type: 'error',
          center: true
        })
      } else {
        if (!this.$store.state.Counter.network_stae) {
          this.$message({
            message: '抱歉,网络连接错误,请检查网络连接',
            type: 'error',
            center: true
          })
          return false
        }
        this.$http.post('public/login/pc', {
          username: username,
          pwd: btoa(md5(password + 'ILOVEYOUZOUXIAOLINUNTILDEATH')),
          salt: salt,
          sign: btoa(navigator.userAgent + salt + md5('ILOVEYOUZOUXIAOLINUNTILDEATH'))
        }).then(res => {
          localStorage.setItem('token', res.data['token'])
          localStorage.setItem('lockpwd', btoa(md5(password + 'ILOVEYOUZOUXIAOLINUNTILDEATH')))
          this.to_main()
        }).catch(res => {
          this.form.username = ''
          this.form.password = ''
        })
      }
    }
  }
}
</script>
<style lang="css" scoped>
  @keyframes fonttransiton {
    0% {
      color: #99cfe3
    }
    100% {
      color: #3efc99
    }
  }
  .login-wrapper {
    position: relative;
    height: 100%;
  }
  .login-container {
    margin: 14px auto;
    width: 530px;
    height: 400px;
    border-radius: 8px;
    background-color: #2b2b36;
  }
  .control {
    height: 30px;
    font-size: 20px;
    line-height: 24px;
    text-align: right;
    background-color: #23232e;
    -webkit-app-region: drag;
  }
  .control .title {
    float: left;
    height: 100%;
    padding-left: 10px;
    line-height: 30px;
    font-size: 14px;
    color: #3efc99;
  }
  .control-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60px;
    height: 100%;
    float: right;
    -webkit-app-region: no-drag;
  }
  .control-btn i {
    flex: 1;
    padding: 5px;
    text-align: center;
  }
  .control-btn i:hover {
    background-color: red;
  }
  .logo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    align-items:center;
    padding: 10px;
  }
  .logo .profile {
    width: 100px;
    height: 100px;
    border: solid #fff 4px;
    border-radius: 50%;
    background: url('/static/profile.jpg');
    background-size: cover;
  }
  .logo .message {
    animation: fonttransiton 2s ease-in infinite alternate;
  }
  .form-wrapper {
    margin: 0 auto;
    width: 340px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    align-items:center;
  }
  .form-wrapper input {
    flex: 1;
    width: 80%;
    padding: 14px 10px;
    background: none;
    outline: none;
    border: none;
    font-weight: 100;
    font-size: 18px;
    border-bottom: 1px solid#484856;
  }
  .form-wrapper .username {
    color: #9199aa;
  }
  .form-wrapper .password {
    color: #dd3e3e;
  }
  .form-wrapper .login {
    margin-top: 14px;
    padding: 10px 55px;
    width: auto;
    color: #fff;
    font-size: 22px;
    background-color: #108bf3;
    border-radius: 8px;
  }
</style>

