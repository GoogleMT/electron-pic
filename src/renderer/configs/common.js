export const sleep = (sleepTime) => {
  let timer = null
  console.log(`进入休眠, 时间为: ${sleepTime}`)
  return new Promise((resolve, reject) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      resolve('success')
    }, sleepTime)
  })
}
