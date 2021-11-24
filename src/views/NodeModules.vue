<template>
	<v-container>
		<v-toolbar
			flat
			color="transparent"
		>
			<v-toolbar-title>Node Modules</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn
				small
				depressed
				class="mr-3"
				color="success"
				@click="sendTest"
			>TEST</v-btn>
			<v-btn
				small
				depressed
				class="mr-3"
				color="error"
				v-if="loading"
				@click="handleCancelSearchNodeModules"
			>Cancel</v-btn>
			<v-btn
				small
				depressed
				color="primary"
				:loading="loading"
				@click="handleSearchNodeModules"
			>Search Node Modules</v-btn>
		</v-toolbar>

		<v-combobox
			v-model="currentDirModel"
			item-text="path"
			item-value="path"
			:items="currentDirSubDirs"
			placeholder="C:"
			class="mx-4"
			dense
		>

			<template #item="{item, on, attrs}">
				<v-list-item
					v-on="on"
					v-bind="attrs"
					two-line
					dense
				>
					<v-list-item-avatar>
						<v-icon
							dark
							class="grey lighten-1"
						>
							mdi-folder
						</v-icon>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title>{{item.name}}</v-list-item-title>
						<v-list-item-subtitle>{{item.path}}</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</template>
		</v-combobox>

		<div
			class="px-4 caption truncate"
			v-if="currentSearchDir"
		>
			<v-progress-circular
				indeterminate
				color="primary"
				size="12"
				width="1"
			/>
			{{ currentSearchDir }}
		</div>
		<v-toolbar
			flat
			dense
			class="mx-4"
			v-if="selectedNodeModules.length"
		>
			<v-btn
				small
				depressed
				color="error"
				@click="handleBulkDeleteNodeModules"
			>
				<v-icon left>mdi-delete</v-icon>
				Delete selected
			</v-btn>
		</v-toolbar>
		<v-list
			dense
			class="px-4"
			color="transparent"
		>
			<v-list-item
				two-line
				:key="dirIndex"
				:class="[dir.isSelected ? 'primary lighten-4' : 'white', {'mt-1': dirIndex}]"
				v-for="(dir, dirIndex) in nodeModules"
			>
				<v-list-item-avatar
					class="grey lighten-2"
					@click="dir.isSelected = !dir.isSelected"
				>
					<v-checkbox
						v-if="dir.isSelected"
						readonly
						hide-details
						class="mt-0 pt-0"
						style="width:24px"
						v-model="checkboxIsChecked"
					/>
					<v-icon
						v-else
						dark
						color="primary"
					>mdi-folder</v-icon>
				</v-list-item-avatar>
				<v-list-item-content>
					<v-list-item-title>{{dir.appName}}</v-list-item-title>
					<v-list-item-subtitle>{{dir.appPath}}</v-list-item-subtitle>
				</v-list-item-content>
				<v-list-item-action>
					<v-menu
						transition="slide-x-transition"
						bottom
						right
					>
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								icon
								v-bind="attrs"
								v-on="on"
							>
								<v-icon
									size="20"
									color="grey"
									class="text--darken-1"
								>mdi-dots-vertical</v-icon>
							</v-btn>
						</template>
						<v-list dense>
							<!-- OPEN IN FILE EXPLORER -->
							<v-list-item
								dense
								@click="handleOpenInExplorer(dir.nodeModulesPath)"
							>
								<v-list-item-icon class="mr-3">
									<v-icon
										size="22"
										color="orange"
									>mdi-folder</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title>Open in Explorer</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<!-- OPEN WITH VS CODE -->
							<v-list-item
								dense
								@click="handleOpenInVSCode(dir.appPath)"
							>
								<v-list-item-icon class="mr-3">
									<v-icon
										size="22"
										color="blue"
									>mdi-microsoft-visual-studio-code</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title>Open with Code</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<!-- ACTIONS -->
							<v-divider></v-divider>
							<v-list-item
								dense
								@click="handleDeleteNodeModules([dir.nodeModulesPath])"
							>
								<v-list-item-icon class="mr-3">
									<v-icon
										size="22"
										color="green"
									>mdi-nodejs</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title>Delete /node_modules</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
							<v-list-item dense>
								<v-list-item-icon class="mr-3">
									<v-icon
										size="22"
										color="grey"
									>mdi-playlist-remove</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title>Ignore</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-menu>
				</v-list-item-action>
			</v-list-item>
		</v-list>
	</v-container>
</template>

<script>
import _ from 'lodash'

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

export default {
	name: 'Home',
	data: () => ({
		loading: false,
		checkboxIsChecked: true,
		currentSearchDir: null,
		nodeModules: [],
		currentDir: { path: 'W:\\' },
		currentDirSubDirs: []
	}),
	computed: {
		currentDirModel: {
			get() {
				return this.currentDir
			},
			set(v) {
				if (!v) return (this.currentDir = null)

				if (!_.isString(v)) this.currentDir = v
				else this.currentDir = { path: v }

				if (!this.currentDir.path.endsWith('\\')) {
					this.currentDir.path += '\\'
				}

				this.onGetSubDirs(this.currentDir)
			}
		},
		selectedNodeModules() {
			return this.nodeModules.filter(nm => {
				return nm.isSelected
			})
		}
	},
	created() {
		let local = localStorage.getItem('___aaa-bbb-aaa___')
		if (local) this.nodeModules = JSON.parse(local)

		this.onGetSubDirs(this.currentDir)

		this.$ipc.on(PROGRESS_NODE_MODULES, dir => {
			// let exist = this.nodeModules.some(
			// 	nm => nm.nodeModulesPath === dir.nodeModulesPath
			// )
			// if (!exist) {
			this.nodeModules.unshift(dir)
			localStorage.setItem(
				'___aaa-bbb-aaa___',
				JSON.stringify(this.nodeModules)
			)
			// }
		});
		this.$ipc.on(EACH_DIR, dir => { this.currentSearchDir = dir });
		this.$ipc.on(PROGRESS_DELETE_NODE_MODULES, dir => {
			this.nodeModules = this.nodeModules.filter(nmDir => {
				return nmDir.nodeModulesPath !== dir
			})
		});
	},
	methods: {
		onGetSubDirs(dir) {
			this.$ipc.emit(GET_SUB_DIRS, dir, subDirs => {
				this.currentDirSubDirs = subDirs
			})
		},
		sendTest() {
			this.$ipc.emit(TEST, { message: 'Hello' }, res => {
				console.log(res, JSON.stringify(res))
			})
		},
		toggleSelectNodeModule(index) {
			if (this.selectedNodeModulesIndexes.includes(index))
				this.selectedNodeModulesIndexes =
					this.selectedNodeModulesIndexes.filter(i => i !== index)
			else this.selectedNodeModulesIndexes.push(index)
		},
		handleSearchNodeModules() {
			this.loading = true
			this.nodeModules = []
			this.$ipc.emit(FIND_NODE_MODULES, this.currentDir, () => {
				this.loading = false
				this.currentSearchDir = null
			});
		},
		handleCancelSearchNodeModules() {
			this.$ipc.emit(CANCELLED_SEARCHING_NODE_MODULES, () => {
				this.loading = false
				this.currentSearchDir = null
			});
		},
		handleOpenInExplorer(dir) {
			this.$ipc.emit(OPEN_IN_EXPLORER, dir)
		},
		handleOpenInVSCode(dir) {
			this.$ipc.emit(OPEN_WITH_VS_CODE, dir)
		},
		handleBulkDeleteNodeModules() {
			this.handleDeleteNodeModules(
				this.selectedNodeModules.map(nm => {
					return nm.nodeModulesPath
				})
			)
		},
		handleDeleteNodeModules(dirs) {
			this.$ipc.emit(DELETE_NODE_MODULES, dirs)
		},
	}
}
</script>
