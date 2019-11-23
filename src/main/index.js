'use strict'

import { app, BrowserWindow, ipcMain, dialog, globalShortcut } from 'electron'
const electron = require('electron')
const path = require('path')
const Menu = electron.Menu
const Tray = electron.Tray
var appTray = null
const exeName = path.basename(process.execPath)
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  globalShortcut.register('Ctrl+Shift+L', function () {
    mainWindow.webContents.send('lock')
  })
  globalShortcut.register('Ctrl+Shift+S', function () {
    mainWindow.show()
  })
  mainWindow = new BrowserWindow({
    height: 550,
    useContentSize: true,
    frame: false,
    width: 850,
    transparent: true,
    autoHideMenuBar: true,
    resizable: false,
    maximizable: false,
    show: true,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL, {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
    httpReferrer: ''
  })
  mainWindow.setSkipTaskbar(true)

  var trayMenuTemplate = [
    {
      label: '开机自启',
      type: 'checkbox',
      checked: app.getLoginItemSettings().openAtLogin,
      click: function () {
        if (!app.isPackaged) {
          app.setLoginItemSettings({
            openAtLogin: !app.getLoginItemSettings().openAtLogin,
            path: process.execPath
          })
        } else {
          app.setLoginItemSettings({
            openAtLogin: !app.getLoginItemSettings().openAtLogin
          })
        }
        console.log(app.getLoginItemSettings().openAtLogin)
        console.log(!app.isPackaged)
      }
    },
    {
      label: '锁定',
      icon: `${__static}/lock.png`,
      accelerator: (function () {
        if (process.platform === 'darwin') {
          return 'Alt+Command+L'
        }
        return 'Ctrl+Shift+L'
      })(),
      click: function () {
        mainWindow.webContents.send('lock')
      }
    },
    {
      label: '帮助',
      icon: `${__static}/help.png`,
      click: function () {
        dialog.showMessageBox({
          type: 'info',
          title: '99CFE3',
          message: '图床帮助',
          icon: `${__static}/helpIcon.png`,
          detail: 'ESC                         MIN\nCtrl+Shift+W            EXIT\nCtrl+Shift+L              LOCK(GLOBAL)\nCtrl+Shift+S             SHOW(GLOBAL)'
        })
      }
    },
    {
      label: '关于',
      icon: `${__static}/about.png`,
      click: function () {
        dialog.showMessageBox({
          type: 'info',
          title: '99CFE3',
          message: '曌明图床',
          icon: `${__static}/aboutIcon.png`,
          detail: 'Version: 1.0.0 \nAuthor: ZhaoMing \nDescription: Personal exclusive 99CFE3'
        })
      }
    },
    {
      label: '打开主面板',
      accelerator: (function () {
        if (process.platform === 'darwin') {
          return 'Alt+Command+S'
        }
        return 'Ctrl+Shift+S'
      })(),
      icon: `${__static}/control.png`,
      click: function () {
        mainWindow.show()
      }
    },
    {
      label: '注销并退出',
      icon: `${__static}/logout.png`,
      click: function () {
        appTray.destroy()
        mainWindow.webContents.send('logout')
      }
    },
    {
      label: '退出',
      icon: `${__static}/exit.png`,
      click: function () {
        app.quit()
        app.quit()
      }
    }
  ]
  // const nimage = nativeImage.createFromPath(path.join(__dirname, 'app', 'app.png'))
  appTray = new Tray(`${__static}/app.png`)
  const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
  appTray.setToolTip('曌明图床')
  appTray.setContextMenu(contextMenu)
  appTray.on('click', function () {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// 系统自启动
app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: false,
  path: process.execPath,
  args: [
    '--processStart', `${exeName}`
  ]
})

ipcMain.on('min', e => mainWindow.minimize())
ipcMain.on('max', e => mainWindow.maximize())
ipcMain.on('close', e => mainWindow.close())
ipcMain.on('changeWindowSize', (event, arg) => {
  mainWindow && mainWindow.setSize(arg.width, arg.height)
})
// 网络连接失败
ipcMain.on('online-status-changed', (event, status) => {
  if (!status) {
    mainWindow.webContents.send('no-network-connection')
  } else {
    mainWindow.webContents.send('network-connection-normal')
  }
})
// 窗口置顶
ipcMain.on('setTop', (event, args) => {
  mainWindow.setAlwaysOnTop(args)
})
ipcMain.on('not-login', () => {
  dialog.showMessageBox({
    type: 'info',
    title: '99CFE3‬',
    message: 'NOT-LOGIN-IN',
    icon: `${__static}/aboutIcon.png`,
    detail: '抱歉!你还没以登录,登录后才能锁定'
  })
})
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
