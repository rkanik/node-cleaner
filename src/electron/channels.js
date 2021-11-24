import { shell, ipcMain } from 'electron'
import { exec } from 'child_process'
import { searchDir } from './fs'
import fs from 'fs/promises'
import path from 'path'
// import rimraf from/

const {
	TEST,
	EACH_DIR,
	OPEN_IN_EXPLORER,
	FIND_NODE_MODULES,
	OPEN_WITH_VS_CODE,
	DELETE_NODE_MODULES,
	PROGRESS_NODE_MODULES,
	CANCELLED_SEARCHING_NODE_MODULES,
	PROGRESS_DELETE_NODE_MODULES,
	GET_SUB_DIRS
} = require('../consts')._COMMANDS

const isCancelled = {
	searchingNodeModules: false
}

export const registerChannels = win => {

	const send = (event, data) => {
		win.webContents.send(event, data);
	}

	ipcMain.on(TEST, async (_, payload) => {
		console.log(TEST, payload)

		const folder = 'C:'

		const readdirRes = await fs
			.readdir(folder, { withFileTypes: true })
			.catch((err) => console.log('ERROR::', err.message))

		const files = readdirRes
			.filter(dirent => dirent.isDirectory())
			.map(dirent => {
				return {
					name: dirent.name,
					path: path.resolve(folder, dirent.name)
				}
			})

		send(TEST, files);
	})

	ipcMain.on(GET_SUB_DIRS, async (_, payload) => {

		const readdirRes = await fs
			.readdir(payload.path, { withFileTypes: true })
			.catch((err) => console.log('ERROR::', err.message))

		const files = readdirRes
			.filter(dirent => dirent.isDirectory())
			.map(dirent => {
				return {
					name: dirent.name,
					path: path.resolve(payload.path, dirent.name)
				}
			})

		send(GET_SUB_DIRS, files);
	})

	ipcMain.on(FIND_NODE_MODULES, async (_, dir) => {
		const nodeModules = await searchDir(dir.path, ['node_modules'], {
			excludes: [
				'.git', 'protanopia', 'Android Studio', 'vendor',
				'allinone-dark', 'utilty.helpers', 'rkenger', 'rkanik-me',
				'_Encoder', 'node-cleaner', 'golang'
			],
			onEachDir(dir) {
				send(EACH_DIR, dir)
				return isCancelled.searchingNodeModules
			},
			onFound(file) { send(PROGRESS_NODE_MODULES, file); },
			onFormat(dir, file) {
				const location = dir.split('\\')
				return {
					isSelected: false,
					appName: [...location][location.length - 2],
					appPath: dir.substr(0, dir.length - 1),
					nodeModulesPath: dir + file
				}
			},
		})
		isCancelled.searchingNodeModules = false
		send(FIND_NODE_MODULES, nodeModules);
	})

	ipcMain.on(CANCELLED_SEARCHING_NODE_MODULES, () => {
		isCancelled.searchingNodeModules = true
	})

	ipcMain.on(OPEN_IN_EXPLORER, (_, dir) => {
		console.log('OPEN_IN_EXPLORER', dir)
		shell.showItemInFolder(dir)
	})

	ipcMain.on(OPEN_WITH_VS_CODE, (_, dir) => {
		console.log('OPEN_WITH_VS_CODE', dir)
		exec(`code ${dir}`)
	})

	ipcMain.on(DELETE_NODE_MODULES, (_, dirs) => {
		for (let dir of dirs) {
			exec(`rm -rf ${dir}`, (err) => {
				!err && send(PROGRESS_DELETE_NODE_MODULES, dir)
			})
		}
		send(DELETE_NODE_MODULES, dirs)
	})
}