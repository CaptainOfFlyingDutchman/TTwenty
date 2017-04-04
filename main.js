const electron = require('electron')
const path = require('path')

const { app, BrowserWindow, Tray, Menu } = electron
const appConfig = require('./config')

let mainWindow = null
const appIcon = path.resolve(__dirname, 'app.png')
let tray = null
let timerInterval = null;

const createTray = _ => {
    if (!tray) {
        tray = new Tray(appIcon)
        const contextMenu = Menu.buildFromTemplate([
            { 
                label: 'Open', 
                click: (menuItem, browserWindow, event) => {
                    createWindow()
                }
            },
            { 
                label: 'Quit',
                click: _ => {
                    if (timerInterval) clearInterval(timerInterval)
                    app.quit();
                }
            }
        ])
        tray.setContextMenu(contextMenu)
    }
}

const createWindow = _ => {
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize
    if (!mainWindow) {
        mainWindow = new BrowserWindow({
            width: width,
            height: height,
            minimizable: false,
            alwaysOnTop: true,
            frame: false,
            skipTaskbar: true,
            resizable: false
        })
        mainWindow.loadURL(`file://${__dirname}/index.html`)

        mainWindow.on('closed', _ => {
            mainWindow = null
        })
              
        createTray()
        closeWindow()
    }
}

const closeWindow = _ => {
    setTimeout(_ => {
        console.log('closing window')
        if (mainWindow) mainWindow.close()
    }, appConfig.stayTimer)
}

timerInterval = setInterval(_ => {
    console.log('opening window')
    createWindow()
    
}, appConfig.intervalTimer)


app.on('ready', _ => {
    // createWindow()
    createTray();
})

app.on('window-all-closed', _ => {

})
