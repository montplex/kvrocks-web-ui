<template>
	<AModal
		title="Create Node"
		:open="open"
		:destroy-on-close="true"
		@cancel="open = false"
	>
		<a-form
			ref="formRef"
			:model="formState"
			layout="vertical"
			name="create_node_from"
			class="mt-4"
		>
			<a-form-item
				name="addr"
				label="IP Address"
				:rules="[{ required: true, message: 'Please enter the address' }]"
			>
				<a-input v-model:value="formState.addr" placeholder="127.0.0.1:6666" />
			</a-form-item>

			<!-- <a-form-item label="Nodes" name="nodes" :rules="[{ required: true, message: 'Please choose the Nodes' }]">
					<a-select v-model:value="formState.nodes" mode="multiple" style="width: 100%" placeholder="Select nodes."
						option-label-prop="children">
						<a-select-option v-for="(item, index) in nodes" :key="index" :value="item.addr" :label="item.addr">
							<span class="flex_c">
								<span role="img" :aria-label="item.addr">
									<IconNode />
								</span>
								&nbsp;&nbsp;{{ item.addr }}
							</span>
						</a-select-option>
					</a-select>
				</a-form-item> -->
			<!-- master, slave, sentinel。 -->

			<a-form-item
				label="Role"
				name="role"
				:rules="[{ required: true, message: 'Please choose the role.' }]"
			>
				<a-select
					v-model:value="formState.role"
					style="width: 100%"
					placeholder="Select role."
					option-label-prop="children"
				>
					<a-select-option key="master" value="master" label="Master">
						<span class="flex_c">
							<span role="img" aria-label="slave">
								<IconClusterRole />
							</span>
							&nbsp;&nbsp;Master
						</span>
					</a-select-option>
					<a-select-option key="slave" value="slave" label="Slave">
						<span class="flex_c">
							<span role="img" aria-label="slave">
								<IconClusterRole />
							</span>
							&nbsp;&nbsp;Slave
						</span>
					</a-select-option>
					<a-select-option key="Sentinel" value="sentinel" label="Sentinel">
						<span class="flex_c">
							<span role="img" aria-label="slave">
								<IconClusterRole />
							</span>
							&nbsp;&nbsp;Sentinel
						</span>
					</a-select-option>
				</a-select>
			</a-form-item>

			<a-form-item
				label="Password"
				name="password"
				:rules="[{ required: false }]"
			>
				<a-input-password
					v-model:value="formState.password"
					placeholder="Enter the password."
				/>
			</a-form-item>
		</a-form>
		<template #footer>
			<a-space size="middle" class="py-3">
				<a-button @click="open = false">Cancel</a-button>
				<a-button type="primary" :loading="createLoading" @click="$emit('onOk')"
					>Submit</a-button
				>
			</a-space>
		</template>
	</AModal>
</template>

<script setup lang="ts">
import { message, type FormInstance } from 'ant-design-vue'
const open = ref(false)

const formRef = ref<FormInstance>()
const createLoading = ref(false)
const store = useClusterStore()
const shard = ref()

const formState = reactive({
	addr: '',
	role: 'slave',
	password: '',
})

const route = useRoute()
const namespace = route.params.namespace as string
const cluster = route.query.cluster as string

const onOk = async () => {
	formRef.value
		?.validateFields()
		.then(async () => {
			createLoading.value = true
			message.loading({ content: 'Creating...', key: 'createnode' })
			createNode({
				namespace,
				cluster: cluster ?? store.current[0] ?? store.clusters[0].name,
				shard: shard.value,
				data: toRaw(formState),
			}).then((res) => {
				if (res.data === 'created') {
					message.success({
						content: 'Created successfully',
						key: 'createnode',
						duration: 2,
					})
					formRef.value?.resetFields()
					open.value = false
				}
			})
		})
		.finally(() => (createLoading.value = false))
}

defineExpose({ onOk, open, shard })
</script>
