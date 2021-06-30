<template>
	<v-app>
		<v-app-bar app flat dense color="primary" dark></v-app-bar>

		<!-- NAVIGATION DRAWER -->
		<v-navigation-drawer app permanent>
			<v-list-item>
				<v-list-item-content>
					<v-list-item-title class="text-h6">NodeJS Cleaner</v-list-item-title>
					<v-list-item-subtitle>Utilities and Cleaner</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
			<v-divider></v-divider>
			<v-list dense nav>
				<v-list-item link to="/">
					<v-list-item-icon class="mr-4">
						<v-icon>mdi-view-dashboard</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Dashboard</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				<v-list-item link to="/node-modules">
					<v-list-item-icon class="mr-4">
						<v-icon>mdi-nodejs</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>Node Modules</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-main class="grey lighten-2">
			<router-view />
		</v-main>
	</v-app>
</template>

<script>

export default {
	name: 'App',
};
</script>
