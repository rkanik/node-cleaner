const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
	"ipcRenderer", {
	emit: (channel, arg1, arg2) => {
		ipcRenderer.send(channel, arg2 ? arg1 : null)
		ipcRenderer.once(channel, (_, ...args) => arg2 ? arg2(...args) : arg1(...args))
	},
	on: (channel, func) => {
		ipcRenderer.on(channel, (_, ...args) => func(...args))
	}
});