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

	let tm, isCancelled = false
	const excludes = opts.excludes || []
	const files = await fs.readdir(dir).catch((_) => { })

	if (files) {
		for (let file of files) {
			let isDir = await isDirectory(dir + file)
			if (!isDir || excludes.includes(file)) continue

			if (!tm) tm = setTimeout(() => {
				if (opts.onEachDir) {
					isCancelled = opts.onEachDir(dir + file)
					clearTimeout(tm), tm = undefined
				}
			}, 1000);
			if (isCancelled) break


			if (dirs.includes(file)) {
				let foundDir = opts.onFormat ? opts.onFormat(dir, file) : dir + file
				foundDirs.unshift(foundDir)
				opts.onFound && opts.onFound(foundDir, foundDirs)
			}
			else await searchDir(`${dir + file}\\`, dirs, opts, foundDirs)
		}
	}
	if (tm) clearTimeout(tm)
	return foundDirs
}

export { getDir, searchDir }