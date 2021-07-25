const { ipcRenderer, contextBridge } = require("electron");
const electron = require("electron");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const tasklist = require('tasklist');

var data;
var activeProcesses = [];
var userData;
var currentActive = "";

function loadGameActivity(callback) {
    ipcRenderer.send("getAppData");
    ipcRenderer.once("appData", (evt, json) => {
        data = json;
        console.log(data);
        callback(json);
    });
}

ipcRenderer.send("userDataPath");
ipcRenderer.on("userDataPath", (evt, data) => {
    userData = data;
})

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

        console.log(isActive);
        var equality = _.isEqual(activeProcesses, isActive);
        if (isActive.length > 0) {
            if (!equality) {
                activeProcesses = isActive;
                newActivity();
            } else updateClock();
            currentActive = isActive[0];
        }
    })
}

function updateClock() {
    fs.readFile(path.join(userData, "./data.json"), (err, data) => {
        var json = JSON.parse(data);
        json.activity[json.activity.length - 1].endDate = Date.now();
        data = json;
        console.log("updateClock");
        fs.writeFileSync(path.join(userData, "./data.json"), JSON.stringify(json));
    });
}

function newActivity() {
    fs.readFile(path.join(userData, "./data.json"), (err, data) => {
        var json = JSON.parse(data);
        json.activity.push({ "startDate": Date.now(), "endDate": Date.now(), "process": activeProcesses[0] })
        data = json;
        console.log("newActivity");
        fs.writeFileSync(path.join(userData, "./data.json"), JSON.stringify(json));
    });
}

function fetchData() {
    var a = data;
    a.currentActive = currentActive || "Nothing!";
    return a;
}

setInterval(scanProcesses, 1000);

contextBridge.exposeInMainWorld("electron", {
    loadGameActivity: loadGameActivity,
    fetchData: fetchData
})