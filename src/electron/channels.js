import { shell, ipcMain } from 'electron'
import { exec } from 'child_process'
import { searchDir } from './fs'

const {
	FIND_NODE_MODULES,
	PROGRESS_NODE_MODULES,
	OPEN_IN_EXPLORER,
	OPEN_WITH_VS_CODE,
	EACH_DIR
} = require('../consts')._COMMANDS

export const registerChannels = win => {

	const send = (event, data) => {
		win.webContents.send(event, data);
	}

	ipcMain.on(FIND_NODE_MODULES, async () => {
		const nodeModules = await searchDir("W:\\", ['node_modules'], {
			excludes: [
				'.git', 'protanopia', 'Android Studio',
				'allinone-dark', 'utilty.helpers', 'rkenger', 'rkanik-me',
				'_Encoder', 'node-cleaner', 'golang'
			],
			onFound(files) { send(PROGRESS_NODE_MODULES, files); },
			onFormat(dir, file) {
				const location = dir.split('\\')
				return {
					appName: [...location][location.length - 2],
					appPath: dir.substr(0, dir.length - 1),
					nodeModulesPath: dir + file
				}
			},
			onEachDir(dir) { send(EACH_DIR, dir) }
		})
		send(FIND_NODE_MODULES, nodeModules);
	})

	ipcMain.on(OPEN_IN_EXPLORER, (_, dir) => {
		shell.showItemInFolder(dir)
	})

	ipcMain.on(OPEN_WITH_VS_CODE, (_, dir) => {
		exec(`code ${dir}`)
	})

}