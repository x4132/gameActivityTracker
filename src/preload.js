const { ipcRenderer, contextBridge } = require("electron");
const ps = require("ps-node");

var data;

function loadGameActivity() {
    ipcRenderer.send("getAppData");
    ipcRenderer.once("appData", (evt, json) => {
        data = json;
        return json?.activity;
    });
}

function scanProcesses() {
    data.processes.foreach((item) => {
        
    })
}

contextBridge.exposeInMainWorld("electron", {
    loadGameActivity: loadGameActivity
})