<template>
  <div class="wrapper">
    <input id="copy-input" ref="copyUrlnput" type="text">
    <transition-group tag="div" appear class="photo-box" enter-active-class='animated go' leave-active-class='animated come'>
      <div class="item" v-for="(item, index) in urls" :key="item">
        <el-image
          style="width: 100px; height: 100px;"
          :src="item"
          :preview-src-list="urls"
        >
        </el-image>
        <div class="operation">
          <el-tooltip class="item" effect="dark" content="复制链接" placement="bottom-start">
            <i class="el-icon-document-copy" @click="copyUrlHandler(item)"></i>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除地址" placement="bottom-start">
            <i class="el-icon-delete" @click="delUrlHandler(index)"></i>
          </el-tooltip>
        </div>
      </div>
    </transition-group>
    <div class="page-footer">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="18"
        layout="prev, pager, next"
        :total="pic_total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { sleep } from '../../configs/common'
export default {
  data () {
    return {
      urls: [],
      pic_total: 18
    }
  },
  mounted () {
    // 网络异常监听
    if (!this.$store.state.Counter.network_stae) {
      this.$message({
        message: '抱歉,网络连接错误,请检查网络连接',
        type: 'error',
        center: true
      })
      return false
    }
    this.getImageArr(1)()
  },
  methods: {
    handleCurrentChange (val) {
      this.urls.length = 0
      console.log(`当前页: ${val}`)
      this.getImageArr(val)()
    },
    getImageArr (page) {
      let self = this
      return async function getImageArr () {
        let retArr = await self.$http.post('main/getimages/', {
          limit: 18,
          page: page
        })
        if (page === 1) {
          self.pic_total = retArr.data[1]['page_sum']
        }
        for (var i = 0; i < retArr.data[0].length; i++) {
          await sleep(300)
          self.urls.push(retArr.data[0][i]['filename'])
        }
        console.log(retArr.data[0])
      }
    },
    copyUrlHandler (url) {
      let copyUrlDom = this.$refs.copyUrlnput
      copyUrlDom.value = url
      copyUrlDom.select()
      document.execCommand('Copy')
      this.$message({
        type: 'success',
        message: 'Copied to clipboard'
      })
    },
    delUrlHandler (index) {
      this.$http.post('main/imageper/0', {
        filename: this.urls[index]
      })
      console.log(index)
      this.urls.splice(index, 1)
    }
  }
}
</script>
<style lang="css" scoped>
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
  @keyframes zoomOutUp {
    40% {
      opacity: 1;
      transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
      animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    }
    to {
      opacity: 0;
      transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -2000px, 0);
      transform-origin: center bottom;
      animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    }
  }
  .come {
     animation: zoomOutUp 1s ease;
   }
  
  .wrapper {
    position: relative;
    height: 100%;
  }
  #copy-input {
    position: absolute;
    top: 300px;
    left: 300px;
    z-index: -50;
  }
  .photo-box {
    display: flex;
    height: 100%;
    flex-wrap: wrap;
    justify-content: center;
    box-sizing: border-box;
    padding: 8px 8px 28px 8px;
  }
  .item {
    margin: 2px;
    width: 100px;
    height: 125px;
    padding: 2px;
  }
  .item .operation {
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
  }
  .item .operation i {
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border-radius: 50%;
  }
  .item .operation i:hover {
    background-color: rgb(84,92,100);
    color: #409eff;
    cursor: pointer;
  }
  .page-footer {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 28px;
    width: 670px;
    border-top: .5px dashed #d9d9d9;
    text-align: center;
  }
</style>
<style lang="css">
  .el-dialog, .el-pager li {
    background: none !important;
  }
  .el-pagination .btn-next, .el-pagination .btn-prev {
    background: none !important;
  }
</style>