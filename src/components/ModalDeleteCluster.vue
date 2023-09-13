<template>
	<Modal
		cancel-text="Cancel"
		ok-text="Delete"
		:open="modelValue"
		:destroy-on-close="true"
		:confirm-loading="loading"
		:ok-button-props="{ disabled: !hasdel, loading: loading, danger: true }"
		@cancel="$emit('update:modelValue', false)"
		@ok="$emit('onDel', name)"
	>
		<template #title>
			<div class="flex_c gap-2">
				<ExclamationCircleFilled class="text-[22px] text-[#faad14]" />
				Delete this Cluster4 ?
			</div>
		</template>
		<div class="my-6 rounded-lg bg-gray-100 px-6 py-4 space-y-2">
			<p class="mb-2">
				Please type
				<span class="px-3px">
					<TypographyText code strong class="text-red-500">
						{{ name }}
					</TypographyText>
				</span>
				to confirm.
			</p>
			<AInput
				v-model:value="cname"
				placeholder="Enter the name of the cluster."
				@input="nameInput"
			/>
		</div>
	</Modal>
</template>

<script setup lang="ts">
import { Modal, TypographyText } from 'ant-design-vue'
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
const props = defineProps<{ modelValue: boolean; name: string }>()

const loading = ref(false)
const hasdel = ref(false)
const cname = ref<string>()
defineEmits(['update:modelValue', 'onDel'])

const nameInput = (e: any) => (hasdel.value = e.target.value === props.name)
</script>

<style lang="scss"></style>
