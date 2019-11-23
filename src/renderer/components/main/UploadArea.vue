<template>
  <div>
    <div :class="draggerClass"  ref="uploadarea" @click="click_input">
      <i class="el-icon-upload"></i>
      <div class="el-upload-text">将文件拖到此处，或<em>点击上传</em></div>
      <p class="upload-info-msg">最多一次只能上传4张照片</p>
    </div>
    <div class="progress-tar">
      <el-progress :percentage="percentage" :color="customColors" v-show="progress_bar"></el-progress>
    </div>
    <p class="hint">链接格式</p>
    <div class="link-format">
      <el-switch
        v-model="markdown"
        active-text="Markdown"
        inactive-text="URL">
      </el-switch>
    </div>
    <transition-group tag="div" class="link-show-list" enter-active-class='animated go'>
      <p class="link-item" v-for="(item, index) in arr" :key="item + index">
        <code @click="onClickHandler" >
          {{ item | dispose(markdown) }}
        </code>
      </p>
    </transition-group>
    <input type="text" ref="copyDom" class="copy-dom">
    <input @change="inputUploadFunc" ref="inputer" type="file" name="file" multiple="multiple" class="el-upload-input" required accept="image/gif, image/jpeg, image/jpg, image/png, image/svg">   
  </div>
</template>
<script>
import { sleep } from '../../configs/common'
export default {
  data () {
    return {
      draggerClass: [
        'upload-dragger'
      ],
      markdown: true,
      progress_bar: false,
      arr: [],
      percentage: 0,
      customColors: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ],
      file: ''
    }
  },
  mounted () {
    // setInterval(() => {
    //   this.arr.unshift(Math.random())
    // }, 600)
    let oUploadAreaDom = this.$refs.uploadarea
    this.addEventHandler(oUploadAreaDom, 'dragenter', this.normalHander)
    this.addEventHandler(oUploadAreaDom, 'dragover', this.normalHander)
    this.addEventHandler(oUploadAreaDom, 'dragleave', this.normalHander)
    this.addEventHandler(oUploadAreaDom, 'drop', this.dropHandler)
  },
  methods: {
    inputUploadFunc (e) {
      let inputDOM = this.$refs.inputer
      this.file = inputDOM.files
      this.inputUploadHandler()
    },
    inputUploadHandler () {
      if (!this.$store.state.Counter.network_stae) {
        this.$message({
          message: '抱歉,网络连接错误,请检查网络连接',
          type: 'error',
          center: true
        })
        return false
      }
      var dataFile = new FormData()
      for (let i = 0; i < this.file.length; i++) {
        dataFile.append('f1', this.file[i])
      }
      let self = this
      this.progress_bar = true

      async function upload () {
        let retResult = await self.$http.post('main/uploadimage', dataFile, {
          transformRequest: [data => data],
          onUploadProgress: progressEvent => {
            let complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
            if (complete > 100 || complete === 100) {
              self.progress_bar = false
            }
            self.percentage = complete
          }
        })
        for (var i = 0; i < retResult.data.length; i++) {
          await sleep(500)
          // 将读取的数据放入到本地缓存中
          self.arr.push(retResult.data[i])
        }
      }
      upload()
    },
    normalHander (e) {
      e.preventDefault()
      if (e.type === 'dragenter') {
        this.draggerClass.push('active')
      }
      if (e.type === 'dragleave') {
        this.draggerClass.pop()
      }
    },
    onClickHandler (e) {
      let copyValue = e.target.innerText
      let copyDom = this.$refs.copyDom
      copyDom.value = copyValue.trim()
      copyDom.select()
      document.execCommand('Copy')
      this.$message({
        type: 'success',
        message: 'Copied to clipboard'
      })
    },
    addEventHandler (obj, type, func) {
      obj.addEventListener(type, func, false)
    },
    dropHandler (e) {
      e.preventDefault()
      this.draggerClass.pop()
      this.file = e.dataTransfer.files
      this.inputUploadHandler()
    },
    select_link () {
      console.log(this)
    },
    click_input () {
      this.$refs.inputer.click()
    },
    copy_code () {
      alert('1111')
    }
  },
  filters: {
    dispose (msg, arg) {
      if (arg) return `![](${msg})`.replace(/\n/g, '').trim()
      return msg
    }
  }
}
</script>
<style scoped>
  @keyframes zoomInDown {
    from {
      opacity: 0;
      transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
      animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }
    60% {
      opacity: 1;
      transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
      animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    }
  }
  .go{
    animation: zoomInDown 2s ease;
  }
  .upload-dragger {
    margin: 14px auto;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    width: 450px;
    height: 220px;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.5s
  }
  .upload-dragger:hover {
    border-color: #409eff;
    background-color: rgb(251, 253, 255)
  }
  .active {
    border-color: #409eff;
    background-color: rgb(251, 253, 255)
  }
  .el-icon-upload {
    font-size: 75px;
    color: #c0c4cc;
    margin: 60px 0 16px;
    line-height: 50px;
  }
  .el-upload-text {
    color: #606266;
    font-size: 16px;
    text-align: center;
  }
  em {
    color: #409eff;
    font-style: normal;
  }
  .upload-info-msg {
    color: #f00;
    font-size: 14px;
  }
  .el-upload-input {
    display: none
  }
  .progress-tar {
    margin: auto;
    box-sizing: border-box;
    padding-left: 24px;
    width: 450px;
    height: 16px;
  }
  .hint {
    font-size: 12px;
    text-align: center;
    color: 12px;
  }
  .link-format {
    margin: 0 auto;
    width: 260px;
    text-align: center;
  }
  .link-show-list {
    margin: 8px auto 0;
    box-sizing: border-box;
    padding: 12px 0;
    width: 500px;
    height: 140px;
    overflow-y: auto;
  }
  .link-item {
    margin: 0;
    box-sizing: border-box;
    font-size: 16px;
    color: #fff;
  }
  code {
    display: inline-block;
    cursor: text;
    padding: 6px;
  }
  code:hover {
    cursor: text;
    background-color: rgb(28, 50, 72)
  }
  .copy-dom {
    opacity: 0;
    position: absolute;
    top: 200px;
    left: 400px;
    z-index: -10;
  }
</style>