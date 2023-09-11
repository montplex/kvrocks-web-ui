<template>
	<AModal
		:title="type === 'cluster' ? 'Create Cluster' : 'Create Shard'"
		:width="720"
		:open="modelValue"
		:destroy-on-close="true"
		@cancel="emits('update:modelValue', false)"
	>
		<a-form
			ref="formRef"
			:model="formState"
			layout="vertical"
			name="create_cluster_from"
		>
			<a-form-item
				v-if="type === 'cluster'"
				name="name"
				label="Name"
				:rules="[{ required: true, message: 'Please enter the name' }]"
			>
				<a-input
					v-model:value="formState.name"
					placeholder="Please enter the name."
				/>
			</a-form-item>
			<a-form-item
				v-if="type === 'cluster'"
				name="replica"
				label="Number of replica"
				:rules="[{ required: true, type: 'number', min: 1, max: 10 }]"
			>
				<a-input-number
					v-model:value="formState.replica"
					:min="1"
					class="w-full"
				/>
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
			<a-form-item
				v-for="(node, index) in formState.nodes"
				:key="index"
				:label="index === 0 ? 'Nodes' : ''"
				:name="['nodes', index]"
				:rules="{
					required: true,
					message: 'nodes can not be null',
					trigger: 'change',
				}"
			>
				<a-input-group compact class="!flex">
					<a-input
						v-model:value="formState.nodes[index]"
						placeholder="please input node"
					/>
					<!-- v-if="dynamicValidateForm.domains.length > 1" -->
					<a-button
						class="flex_cc text-[#8c8c8c]"
						:icon="h(DeleteOutlined)"
						@click="removeDomain(index)"
					/>
				</a-input-group>
			</a-form-item>

			<a-form-item>
				<a-button
					type="dashed"
					class="flex_cc text-[#8c8c8c]"
					style="width: 30%"
					:icon="h(PlusOutlined)"
					@click="formAddNodes"
				>
					Add Node
				</a-button>
			</a-form-item>

			<a-form-item
				label="Password"
				name="password"
				:rules="[{ required: false }]"
			>
				<a-input-password v-model:value="formState.password" />
			</a-form-item>
		</a-form>
		<template #footer>
			<a-space size="middle" class="py-3">
				<a-button @click="$emit('update:modelValue', false)">Cancel</a-button>
				<a-button type="primary" :loading="createLoading" @click="hcSubmit"
					>Submit</a-button
				>
			</a-space>
		</template>
	</AModal>
</template>

<script setup lang="ts">
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { message, type FormInstance } from 'ant-design-vue'
import { h } from 'vue'

const props = defineProps({
	modelValue: {
		type: Boolean,
		required: true,
	},
	type: {
		type: String as PropType<'cluster' | 'shard'>,
		default: 'cluster',
	},
})

const emits = defineEmits([
	'update:modelValue',
	'ClusterCreated',
	'ShardCreated',
])

const formRef = ref<FormInstance>()
const createLoading = ref(false)

const formState = reactive({
	name: '',
	replica: 1,
	password: '',
	nodes: [''],
})

const route = useRoute()
const namespace = route.params.namespace as string
const cluster = ref(route.query.cluster as string)

/** 创建集群  */
const hcCreateCluster = () => {
	if (formState.nodes.length === 0) {
		message.error('nodes can not be null')
		return
	}
	formRef.value
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
		.finally(() => (createLoading.value = false))
}

/** 创建分片 */
const hcCreateShard = () => {
	if (formState.nodes.length === 0) {
		message.error('nodes can not be null')
		return
	}
	formRef.value
		?.validateFields()
		.then(async () => {
			createLoading.value = true
			const { password, nodes } = toRaw(formState)
			const res = await createShard(namespace, cluster.value, {
				password,
				nodes,
			})
			if (res.data === 'created') {
				message.success('create shard success')
				emits('ShardCreated')
				// list.value?.unshift(toRaw(formState).name)
			}
			emits('update:modelValue', false)
			formRef.value?.resetFields()
		})
		.catch((info) => {
			console.log('Validate Failed:', info)
		})
		.finally(() => (createLoading.value = false))
}

const hcSubmit = () =>
	props.type === 'cluster' ? hcCreateCluster() : hcCreateShard()

const formAddNodes = () => {
	;(formState.nodes as string[]).push('')
}
const removeDomain = (index: number) => {
	formState.nodes.splice(index, 1)
	// const index = formState.nodes.indexOf(item as never);
	// if (index !== -1) {
	//   formState.nodes.splice(index, 1);
	// }
}
</script>
