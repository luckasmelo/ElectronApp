// Modules to control application life and create native browser window
const { app, BrowserWindow, Notification, Tray, Menu, nativeImage } = require('electron')
const path = require('path')
let tray = null;
let mainWindow = null;

const createWindow = () => {
  if(!tray)
    createTray()

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  mainWindow.on('close', event => {
    event.preventDefault(); //this prevents it from closing. The `closed` event will not fire now
    mainWindow.hide();
  })
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}


//Variables to show notifications
const NOTIFICATION_TITLE = 'Basic Notification'
const NOTIFICATION_BODY = 'Notification from the Main process'


//Function to Show Notifications
function showNotification () {
    new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
}).then(showNotification)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


function createTray () {
  const icon = path.join(__dirname, '/public/assets/hat.png') // required.
  const trayicon = nativeImage.createFromPath(icon)
  tray = new Tray(trayicon.resize({ width: 16 }))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show()
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.exit() // actually exit the app with none dialog confirmation.
      }
    },
  ])

  tray.setContextMenu(contextMenu)
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

