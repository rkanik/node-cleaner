<template>
	<v-container>
		<v-btn
			large
			rounded
			color="primary"
			:loading="loading"
			@click="handleSearchNodeModules"
		>Search Node Modules</v-btn>

		<v-card flat color="white" class="mt-3" :loading="loading">
			<v-card-title>Node Modules</v-card-title>
			<v-card-text>
				<v-list dense>
					<v-list-item two-line :key="dirIndex" v-for="(dir, dirIndex) in nodeModules">
						<v-list-item-avatar>
							<v-icon color="primary" class="grey lighten-2" dark>mdi-folder</v-icon>
						</v-list-item-avatar>
						<v-list-item-content>
							<v-list-item-title>{{dir.appName}}</v-list-item-title>
							<v-list-item-subtitle>{{dir.appPath}}</v-list-item-subtitle>
						</v-list-item-content>
						<v-list-item-action>
							<v-menu transition="slide-x-transition" bottom right>
								<template v-slot:activator="{ on, attrs }">
									<v-btn icon v-bind="attrs" v-on="on">
										<v-icon size="20" color="grey" class="text--darken-1">mdi-dots-vertical</v-icon>
									</v-btn>
								</template>
								<v-list dense>
									<!-- OPEN IN FILE EXPLORER -->
									<v-list-item dense @click="handleOpenInExplorer(dir.nodeModulesPath)">
										<v-list-item-icon class="mr-3">
											<v-icon size="22" color="orange">mdi-folder</v-icon>
										</v-list-item-icon>
										<v-list-item-content>
											<v-list-item-title>Open in Explorer</v-list-item-title>
										</v-list-item-content>
									</v-list-item>
									<!-- OPEN WITH VS CODE -->
									<v-list-item dense @click="handleOpenInVSCode(dir.appPath)">
										<v-list-item-icon class="mr-3">
											<v-icon size="22" color="blue">mdi-microsoft-visual-studio-code</v-icon>
										</v-list-item-icon>
										<v-list-item-content>
											<v-list-item-title>Open with Code</v-list-item-title>
										</v-list-item-content>
									</v-list-item>
									<!-- ACTIONS -->
									<v-divider></v-divider>
									<v-list-item dense>
										<v-list-item-icon class="mr-3">
											<v-icon size="22" color="green">mdi-nodejs</v-icon>
										</v-list-item-icon>
										<v-list-item-content>
											<v-list-item-title>Delete /node_modules</v-list-item-title>
										</v-list-item-content>
									</v-list-item>
									<v-list-item dense>
										<v-list-item-icon class="mr-3">
											<v-icon size="22" color="grey">mdi-playlist-remove</v-icon>
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
			</v-card-text>
		</v-card>
	</v-container>
</template>

<script>

const {
	FIND_NODE_MODULES,
	PROGRESS_NODE_MODULES,
	OPEN_IN_EXPLORER,
	OPEN_WITH_VS_CODE
} = require('../consts')._COMMANDS

export default {
	name: 'Home',
	data: () => ({
		loading: false,
		nodeModules: [
			// {
			// 	"appName": "vue-electron-app",
			// 	"appPath": "W:\\github.com\\bromix\\vue-electron-app",
			// 	"nodeModulesPath":
			// 		"W:\\github.com\\bromix\\vue-electron-app\\node_modules"
			// },
			// {
			// 	"appName": "ReactPortfolio",
			// 	"appPath": "W:\\_Fiverr\\shubhamkumar007\\ReactPortfolio",
			// 	"nodeModulesPath": "W:\\_Fiverr\\shubhamkumar007\\ReactPortfolio\\node_modules"
			// }
		]
	}),
	created() {
		this.$ipc.on(PROGRESS_NODE_MODULES, data => {
			this.nodeModules = data
		});
	},
	methods: {
		handleSearchNodeModules() {
			this.loading = true
			this.$ipc.emit(FIND_NODE_MODULES, () => {
				this.loading = false
			});
		},
		handleOpenInExplorer(dir) {
			this.$ipc.emit(OPEN_IN_EXPLORER, dir, () => { })
		},
		handleOpenInVSCode(dir) {
			this.$ipc.emit(OPEN_WITH_VS_CODE, dir, () => { })
		},
	}
}
</script>
