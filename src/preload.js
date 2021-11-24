const _ = require('lodash')
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld(
	"ipcRenderer", {
	emit: (channel, ...args) => {
		const payload = !_.isFunction(args[0]) ? args[0] : null
		const callback = args.find(arg => _.isFunction(arg))

		ipcRenderer.send(channel, payload)
		if (callback) ipcRenderer.once(channel, (_, ...data) => {
			callback(...data)
		})
	},
	on: (channel, func) => {
		ipcRenderer.on(channel, (_, ...args) => func(...args))
	}
});