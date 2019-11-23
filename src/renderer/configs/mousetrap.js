const Mousetrap = require('mousetrap')
var { ipcRenderer } = require('electron')

Mousetrap.bind('esc', () => {
  ipcRenderer.send('min')
}, 'keyup')

Mousetrap.bind(['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11'], () => {
  return false
})

Mousetrap.bind('ctrl+shift+w', () => {
  localStorage.clear()
  ipcRenderer.send('close')
  return false
})
