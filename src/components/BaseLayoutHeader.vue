<template>
	<a-layout-header class="flex items-center !h-[50px] !bg-white !px-4">
		<!-- <a-button @click="$emit('update:modelValue',modelValue ? false : true)" class="flex items-center justify-center">
			<template #icon>
				<MenuUnfoldOutlined v-if="modelValue" />
				<MenuFoldOutlined v-else />
			</template>
		</a-button> -->
	</a-layout-header>
</template>
<script setup lang="ts">
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>
