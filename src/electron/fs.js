/* eslint-disable no-unused-vars */
import fs from "fs/promises"
import path from 'path'

const getDir = dirStr => path.join(__dirname, dirStr)
const isDirectory = path => new Promise(res => {
	fs.stat(path)
		.then(stat => res(stat.isDirectory()))
		.catch(() => res(false))
})

const searchDir = async (dir, dirs, opts = {}, foundDirs = []) => {
	const excludes = opts.excludes || []
	const files = await fs.readdir(dir).catch((_) => { })
	if (files) {
		for (let file of files) {
			let isDir = await isDirectory(dir + file)
			if (!isDir || excludes.includes(file)) continue
			opts.onEachDir && opts.onEachDir(dir + file)
			if (dirs.includes(file)) {
				foundDirs.unshift(
					opts.onFormat
						? opts.onFormat(dir, file)
						: dir + file
				)
				opts.onFound && opts.onFound(foundDirs)
			}
			else await searchDir(`${dir + file}\\`, dirs, opts, foundDirs)
		}
	}
	return foundDirs
}

export { getDir, searchDir }