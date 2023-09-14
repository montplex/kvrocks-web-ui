<template>
	<AModal
		title="Migrate Slot "
		:open="open"
		:destroy-on-close="true"
		@cancel="open = false"
	>
		<a-radio-group v-model:value="type" class="my-3">
			<a-radio-button :value="1">Migrate Slot And Data</a-radio-button>
			<a-radio-button :value="2">Migrate Slot Only</a-radio-button>
		</a-radio-group>

		<a-form
			ref="formRef"
			:model="data"
			layout="vertical"
			name="create_cluster_from"
			class="my-4"
		>
			<!-- <a-form-item label="Source" name="source" :rules="[{ required: true, message: 'Please choose the Nodes' }]">
				<a-select v-model:value="data.source"  style="width: 100%" placeholder="Select nodes."
					option-label-prop="children">
					<a-select-option v-for="item in nodes" :key="item.key" :value="item.key" :label="item.addr">
						<span class="flex_c">
							<span role="img" :aria-label="item.addr">
								<IconNode />
							</span>
							&nbsp;&nbsp;{{ item.addr }}
						</span>
					</a-select-option>
				</a-select>
			</a-form-item> -->
			<!-- <a-form-item label="Target" name="target" :rules="[{ required: true, message: 'Please choose the Nodes' }]">
				<a-select v-model:value="data.target"  style="width: 100%" placeholder="Select nodes."
					option-label-prop="children">
					<a-select-option v-for="(item, index) in targetList" :key="item.addr" :value="item.key" :label="item.addr">
						<span class="flex_c">
							<span role="img" :aria-label="item.addr">
								<IconNode />
							</span>
							&nbsp;&nbsp;{{ item.addr }}
						</span>
					</a-select-option>
				</a-select>
			</a-form-item> -->

			<a-form-item
				label="Source"
				name="source"
				:rules="[{ required: true, message: 'Please input the source index' }]"
			>
				<a-input
					v-model:value="data.source"
					class="w-full"
					placeholder="input source index."
				/>
			</a-form-item>

			<a-form-item
				label="Target"
				name="target"
				:rules="[{ required: true, message: 'Please input the target indexs' }]"
			>
				<a-input
					v-model:value="data.target"
					class="w-full"
					placeholder="input target index."
				/>
			</a-form-item>

			<a-form-item
				v-if="type === 1"
				name="slot"
				label="Slot"
				:rules="[{ required: true, message: 'Please input the slot' }]"
			>
				<a-input
					v-model:value="data.slot"
					class="w-full"
					placeholder="input slot."
				/>
			</a-form-item>

			<div v-if="type === 2">
				<a-form-item
					v-for="(node, index) in data.slots"
					:key="index"
					:label="index === 0 ? 'Slots' : ''"
					:name="['slots', index]"
					:rules="{
						required: true,
						message: 'Slot can not be null',
						trigger: 'change',
					}"
				>
					<a-input-group compact class="!flex">
						<a-input
							v-model:value="data.slots![index]"
							placeholder="please input slot"
						/>
						<!-- <a-button
						v-if="data.slots!.length > 1"
						class="flex_cc text-[#8c8c8c]"
						:icon="h(DeleteOutlined)"
						@click="removeDomain(index)"
					/> -->
					</a-input-group>
				</a-form-item>

				<!-- <a-form-item>
				<a-button
					type="dashed"
					class="flex_cc text-[#8c8c8c]"
					style="width: 30%"
					:icon="h(PlusOutlined)"
					@click="formAddNodes"
				>
					Add Slot
				</a-button>
			</a-form-item> -->
			</div>
		</a-form>
		<template #footer>
			<a-space size="middle" class="py-3">
				<a-button @click="open = false">Cancel</a-button>
				<a-button type="primary" :loading="loading" @click="hcSubmit"
					>Submit</a-button
				>
			</a-space>
		</template>
	</AModal>
</template>

<script setup lang="ts">
import { message, type FormInstance } from 'ant-design-vue'
import type { MigrateBody } from '#/cluster'

const open = ref(false)
const type = ref(1)

const formRef = ref<FormInstance>()
const loading = ref(false)

const emits = defineEmits(['onOk'])

const data = reactive<MigrateBody>({
	source: '',
	target: '',
	slot: undefined,
	slots: ['', ''],
})

const route = useRoute()
const namespace = route.params.namespace as string
const store = useClusterStore()

const hcSubmit = () => {
	const cluster = route.query.cluster as string
	formRef.value
		?.validateFields()
		.then(async () => {
			loading.value = true
			MigrateSlotData({
				namespace,
				cluster: cluster ?? store.current[0] ?? store.clusters[0].name,
				data: toRaw(data),
			}).then((res) => {
				if (res.data === 'ok') {
					message.success('migrate success')
					emits('onOk')
				}
			})
			formRef.value?.resetFields()
		})
		.finally(() => (loading.value = false))
}

defineExpose({ open })
</script>
