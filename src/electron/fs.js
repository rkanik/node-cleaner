/* eslint-disable no-unused-vars */
import fs from "fs/promises"
import path from 'path'

const getDir = dirStr => path.join(__dirname, dirStr)
const isDir = path => new Promise(res => {
	fs.stat(path)
		.then(stat => res(stat.isDirectory()))
		.catch(() => res(false))
})

const searchDir = async (dir, dirs, opts = {}, foundDirs = []) => {
	const excludes = opts.excludes || []
	const files = await fs.readdir(dir).catch((_) => { })
	if (files) {
		for (let file of files) {
			if (!(await isDir(dir + file)) || excludes.includes(file)) continue
			else if (dirs.includes(file)) {
				foundDirs.unshift(
					opts.select
						? opts.select(dir, file)
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