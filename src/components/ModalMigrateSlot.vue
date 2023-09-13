<template>
	<AModal
		title="Migrate Slot "
		:width="720"
		:open="modelValue"
		:destroy-on-close="true"
		@cancel="emits('update:modelValue', false)"
	>
		<a-radio-group v-model:value="type">
			<a-radio-button :value="1">Migrate Slot And Data</a-radio-button>
			<a-radio-button :value="2">Migrate Slot Only</a-radio-button>
		</a-radio-group>

		<a-form
			ref="formRef"
			:model="data"
			layout="vertical"
			name="create_cluster_from"
		>
			<a-form-item
				label="Source"
				name="nodes"
				:rules="[{ required: true, message: 'Please choose the Nodes' }]"
			>
				<a-select
					v-model:value="data.slots"
					mode="multiple"
					style="width: 100%"
					placeholder="Select nodes."
					option-label-prop="children"
				>
					<a-select-option
						v-for="(item, index) in nodes"
						:key="index"
						:value="item.addr"
						:label="item.addr"
					>
						<span class="flex_c">
							<span role="img" :aria-label="item.addr">
								<IconNode />
							</span>
							&nbsp;&nbsp;{{ item.addr }}
						</span>
					</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item
				label="Target"
				name="nodes"
				:rules="[{ required: true, message: 'Please choose the Nodes' }]"
			>
				<a-select
					v-model:value="data.slots"
					mode="multiple"
					style="width: 100%"
					placeholder="Select nodes."
					option-label-prop="children"
				>
					<a-select-option
						v-for="(item, index) in nodes"
						:key="index"
						:value="item.addr"
						:label="item.addr"
					>
						<span class="flex_c">
							<span role="img" :aria-label="item.addr">
								<IconNode />
							</span>
							&nbsp;&nbsp;{{ item.addr }}
						</span>
					</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item
				v-if="type === 1"
				name="slot"
				label="Slot"
				:rules="[{ required: true, type: 'number', min: 1, max: 10 }]"
			>
				<a-input v-model:value="data.slot" class="w-full" />
			</a-form-item>
		</a-form>
		<template #footer>
			<a-space size="middle" class="py-3">
				<a-button @click="$emit('update:modelValue', false)">Cancel</a-button>
				<a-button type="primary" :loading="loading" @click="hcSubmit"
					>Submit</a-button
				>
			</a-space>
		</template>
	</AModal>
</template>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import type { MigrateBody } from '#/cluster'

defineProps<{
	modelValue: boolean
	nodes: any[]
}>()

const emits = defineEmits(['update:modelValue', 'onOk'])

const formRef = ref<FormInstance>()
const loading = ref(false)

const data = reactive<MigrateBody>({
	source: 0,
	target: 1,
	slot: 123,
	slots: [],
})
const type = ref(1)

const route = useRoute()
const namespace = route.params.namespace as string
const cluster = ref(route.query.cluster as string)

/** 创建集群  */
const hcCreateCluster = () => {
	/* if (formState.nodes.length === 0) {
		message.error('nodes can not be null')
		return
	} */
	/* formRef.value
		?.validateFields()
		.then(async () => {
			createLoading.value = true
			const res = await createCluster(namespace, toRaw(formState))
			if (res.data === 'created') {
				message.success('create success')
				emits('ClusterCreated', toRaw(formState).name)
				// list.value?.unshift(toRaw(formState).name)
			}
			emits('update:modelValue', false)
			formRef.value?.resetFields()
		})
		.catch((info) => {
			console.log('Validate Failed:', info)
		})
		.finally(() => (createLoading.value = false)) */
}

const hcSubmit = () => {
	console.log('submit')
}
</script>
