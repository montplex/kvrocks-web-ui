<template>
	<div class="overflow-x-hidden">
		<!-- :theme="{ token: { colorPrimary: '#00b96b' } }" -->
		<a-config-provider>
			<!-- <router-view v-slot="{ Component }">
				<transition name="fade" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view> -->
			<router-view />
		</a-config-provider>
	</div>
</template>

<script setup lang="ts"></script>
<style>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
