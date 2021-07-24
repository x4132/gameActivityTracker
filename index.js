const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const url = require("url");

var window;

function loadApp() {
    window = new BrowserWindow({
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

ipcMain.on("getAppData", () => {
    const appDataPath = app.getPath("userData");
    fs.readFile(path.join(appDataPath, "./data.json"), { encoding: "utf-8" }, (err, data) => {
        if (err) throw new Error(err);
        var json = JSON.parse(data);
        window.webContents.send('appData', json);
    })
})

app.whenReady().then(() => {
    loadApp();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
})