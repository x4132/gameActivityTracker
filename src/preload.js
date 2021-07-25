const { ipcRenderer, contextBridge } = require("electron");

var data;

function loadGameActivity(callback) {
    ipcRenderer.send("getAppData");
    ipcRenderer.once("appData", (evt, json) => {
        data = json;
        console.log(data);
        callback(json);
    });
}

function scanProcesses() {
    tasklist().then((ps) => {
        var processes = new Set();
        var isActive = [];
        ps.forEach((process) => {
            processes.add(process.imageName);
        })
        processes = Array.from(processes);
        data.tracking.forEach((item) => {
            if (processes.indexOf(item) != -1) {
                isActive.push(item);
            }
        })
    })
}

contextBridge.exposeInMainWorld("electron", {
    loadGameActivity: loadGameActivity,
    scanProcesses: scanProcesses
})