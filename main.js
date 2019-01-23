const {
  app,
  Menu,
  Tray,
  BrowserWindow,
  globalShortcut,
  clipboard,
  ipcMain
} = require('electron');

const path = require('path');
const request = require('request');
var Store = require('./comps/store.js')

let tray = null
let win = null
let user = null
let pw = null
let ip = null

const store = new Store({
  configName: 'user-settings',
  defaults: {
    phoneSettings: {
      'ip': '',
      'user': '',
      'password': ''
    }
  }
});

ipcMain.on('makecall-action', (event, arg) => {
makeCall(arg)
});


function openSettingsWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 300,
    frame:false
  })

  win.loadURL(__dirname + '/app/index.html')
  win.on('minimize', function (event) {
    event.preventDefault();
    win.hide();
  });
}

function startTrayApp() {
  const trayIcon = path.join(__dirname, '/icon.ico');
  tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([{
      label: 'Abheben',
      click: answerCall
    },
    {
      label: 'Stummschalten',
      click: muteCall
    },
    // {
    //   label: 'Anrufen',
    //   click: makeCall
    // },
    {
      label: 'Einstellungen',
      click: openSettings
    },
    {
      label: 'Beenden',
      click: killApp
    }
  ])
  tray.setToolTip('YeaPhone 0.1.0')
  tray.setContextMenu(contextMenu)

  globalShortcut.register('CommandOrControl+Y', () => {
    // makeCall(clipboard.readText())
    prepCall()
  })
  globalShortcut.register('CommandOrControl+M', () => {
    muteCall()
  })
  globalShortcut.register('CommandOrControl+J', () => {
    answerCall()
  })
  let settings = store.get('phoneSettings')
  user = settings.user
  pw = settings.password
  ip = settings.ip
}

app.on('ready', startTrayApp)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {}
})

function prepCall() {
  let callWin = new BrowserWindow({
    width: 500,
    height: 120,
    frame:false
  })
  callWin.loadURL(__dirname + '/app/callScreen/index.html')
  callWin.on('minimize', function (event) {
    event.preventDefault();
    callWin.hide();
  });
}

function makeCall(numberToDial) {
  if (!isNaN(numberToDial)) {
    console.log("Making Call")
    tray.displayBalloon({
      content: "Rufnummer wird gewählt : " + numberToDial,
      title: "YeaPhone"
    });
    let call_url = 'http://' + user + ':' + pw + '@' + ip + '/cgi-bin/ConfigManApp.com?'
    request.get({
      url: call_url + 'number=' + numberToDial + '&outgoing_uri=URI'
    }, function (e, r) {
      console.log(e, r)
    });
  } else {
    tray.displayBalloon({
      content: "Prüfen Sie die Nummer",
      title: "YeaPhone"
    });
  }

}

function answerCall() {
  console.log("Answer Call")
  let call_url = 'http://' + user + ':' + pw + '@' + ip + '/cgi-bin/ConfigManApp.com?key=ENTER'

  request.get({
    url: call_url
  }, function (e, r) {
    console.log(e, r)
  });
  tray.displayBalloon({
    content: 'Anruf wird angenommen',
    title: "YeaPhone"
  });
}

function muteCall() {
  let call_url = 'http://' + user + ':' + pw + '@' + ip + '/cgi-bin/ConfigManApp.com?key=MUTE'
  request.get({
    url: call_url
  }, function (e, r) {
    console.log(e, r)
  });
  tray.displayBalloon({
    content: 'Telefon gestummt',
    title: "YeaPhone"
  });
}

function openSettings() {
  openSettingsWindow()
}

function killApp() {
  app.quit()
}