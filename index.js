const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

function loadApp() {
    const window = new BrowserWindow({
        width: 600,
        height: 800,

        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "./src/preload.js"),
        }
    })

    const reactAppUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, "./client/build/index.html"),
        protocol: "file:",
        slashes: true
    })
    window.loadURL(reactAppUrl);
}

app.whenReady().then(() => {
    loadApp();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
})