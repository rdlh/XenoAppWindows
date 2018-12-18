const { app } = require('electron')


// Startup events
if (require('electron-squirrel-startup')) app.quit()

const setupEvents = require('./installers/setupEvents');
if (setupEvents.handleSquirrelEvent()) {
	process.exit();
}


// Global
const { BrowserWindow, Tray, Menu, Notification } = require('electron')
const { machineIdSync } = require('node-machine-id')

var os = require('os')
var path = require('path')
var PubNub = require('pubnub')
const ElectronOnline = require('electron-online')
const connection = new ElectronOnline()
const deviceName = os.hostname()
let deviceId = machineIdSync({original: true}).split("-").join("_");

let win
let tray = null

const gotTheLock = app.requestSingleInstanceLock()
const rootPath = path.join('./')
let i18n


// Set eventListener max value to infinity
require('events').EventEmitter.prototype._maxListeners = Infinity;



// Check if internet connection, if not display disconnected.html
connection.on('online', () => {
	if (win !== undefined) {
		win.loadURL("https://xeno.app/device_redirect?kind=desktop&device_udid=" + deviceId + "&device_name=" + deviceName);
	}
})

connection.on('offline', () => {
	if (win !== undefined) {
		win.loadFile('disconnected.html')
	}
})



// Method to create window
function createWindow () {
	// Needed to display toast notifications
	app.setAppUserModelId("com.squirrel.XenoApp.XenoApp");
	
	
	win = new BrowserWindow({
		width: 1200,
		height: 800,
		icon: path.join(__dirname, 'assets/icons/xenoicon.ico'),
		webPreferences: {
			nodeIntegration: false
		}
	});
	win.setMenu(null);
	win.loadURL("https://xeno.app/device_redirect?kind=desktop&device_udid=" + deviceId + "&device_name=" + deviceName);
	
	
	// Create pubnub then subscribe to channel
	var pubnub = new PubNub({
		subscribeKey: "sub-c-f2c09560-e75c-11e8-a895-42b57d7e7824",
		publishKey: "pub-c-fb5b8985-44cf-4cd3-b415-a181a6bb1eb5"
	});
  
	pubnub.addListener({
        status: function(statusEvent) {
        },
        message: function(msg) {
			if (!win.isFocused() || !win.isVisible()) {
				var notif = new Notification({
					title: msg.message.title,
					body: msg.message.content,
					icon: path.join(__dirname, 'assets\\icons\\xenoicon_png.png')
				});
				notif.show();
			}
        },
        presence: function(presenceEvent) {
        }
    })
  
	pubnub.subscribe({
		channels: [deviceId]
	});

	
	// Do not kill the app when closing main window, keep it running from the system tray
	win.on('close', function (event) {
		if(!app.isQuiting){
			event.preventDefault();
			win.hide();
		}
		return false;
	});
}

// Handle second instance
if (!gotTheLock) {
	app.quit()
} else {
	app.on('second-instance', (event, commandLine, workingDirectory) => {
		if (win) {
			win.show()
		}
	})
	app.on('ready', () => {
		i18n = new(require('./translations/i18n'))
		
		
		// Create tray menu
		if (tray == null) {
			tray = new Tray(path.join(__dirname, 'assets/icons/xenoicon.ico'))
			var contextMenu = Menu.buildFromTemplate([
				{label: i18n.__('open'), click:  function(){
					win.show();
				}},
				{label: i18n.__('quit'), click:  function(){
					app.isQuiting = true;
					app.quit();
				}}
			]);
			tray.setToolTip('Xeno');
			tray.on("double-click", function() {
				win.show()
			});
			tray.setContextMenu(contextMenu);
		}
		createWindow();
	})
}

app.on('activate', () => {
	if (win === null) {
		createWindow()
	}
});