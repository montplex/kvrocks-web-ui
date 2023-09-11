<template>
	<div class="overflow-hidden">
		<div class="_heade">
			<span class="_title">NameSpace</span>
			<span class="_right">
				<a-tooltip
					title="Create NameSpace"
					:auto-adjust-overflow="true"
					placement="leftTop"
				>
					<a-button
						type="primary"
						class="flex items-center justify-center"
						@click="open = true"
					>
						<template #icon>
							<PlusCircleOutlined />
						</template>
					</a-button>
				</a-tooltip>
			</span>
		</div>
		<div class="_body">
			<!-- Cache 列表 -->
			<a-spin :spinning="loading">
				<div class="grid gap-10 sm:grid-cols-3">
					<div
						v-for="(item, index) in store.nameSpaceList"
						:key="index"
						:cy-id="'redis-db-' + item"
						class="min-h-20 flex flex-col border border-gray-200 rounded-lg shadow-sm"
					>
						<header class="p-4 sm:p-6 sm:pb-4 sm:pt-5">
							<div class="flex items-center">
								<div
									class="flex cursor-pointer items-center gap-2 text-lg text-[#1677ff] hover:opacity-70"
									@click="hcNameSpace(item)"
								>
									<IconNameSpace />
									<span>{{ item }}</span>
								</div>
								<a-button
									type="link"
									style="color: #111"
									class="ml-auto flex items-center text-[14px] hover:!text-[#f07b61]"
									:icon="h(DeleteOutlined)"
									@click="hcDel(item, index)"
								>
									Delete
								</a-button>
							</div>
						</header>
					</div>
				</div>
			</a-spin>
		</div>
	</div>

	<a-modal
		v-model:open="open"
		title="Create NameSpace"
		:ok-button-props="{
			loading: createLoading,
		}"
		@ok="onOk"
	>
		<a-form
			ref="formRef"
			:model="formState"
			layout="vertical"
			name="form_in_modal"
		>
			<a-form-item
				name="name"
				label="Name"
				:rules="[{ required: true, message: 'Please enter the name' }]"
			>
				<a-input
					v-model:value="formState.name"
					placeholder="Please enter the name."
				/>
			</a-form-item>
		</a-form>
	</a-modal>
</template>
<script lang="ts" setup>
import {
	PlusCircleOutlined,
	DeleteOutlined,
	ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import { message, type FormInstance, Modal } from 'ant-design-vue'
import { ref, h, createVNode } from 'vue'

const loading = ref(true)
const createLoading = ref(false)
const store = useClusterStore()

onMounted(async () => {
	loading.value = true
	let res = await getNamespaceList()
	store.setNameSpaceList(res.data.namespaces)
	loading.value = false
})

const formRef = ref<FormInstance>()
const open = ref<boolean>(false)

const formState = reactive({
	name: '',
})

const onOk = () => {
	formRef.value
		?.validateFields()
		.then(async (values) => {
			createLoading.value = true
			const res = await createNamespace(toRaw(formState).name)
			if (res.data === 'created') {
				message.success('create success')
				store!.nameSpaceList.unshift(toRaw(formState).name as never)
			}
			open.value = false
			formRef.value?.resetFields()
		})
		.catch((info) => {
			console.log('Validate Failed:', info)
		})
		.finally(() => (createLoading.value = false))
}

const hcDel = async (namespace: string, index: number) => {
	Modal.confirm({
		title: 'Delete these Namespace?',
		icon: createVNode(ExclamationCircleOutlined),
		content: h('p', null, [
			h('span', null, 'Confirm delete the Namespace named '),
			h('code', { class: 'bg-[#f9f9f9] rounded  text-[#f07b61]' }, namespace),
			h('span', null, '.'),
		]),
		okText: 'Delete',
		okType: 'danger',
		onOk() {
			loading.value = true
			delNamespace(namespace)
				.then((res) => {
					if (res.data === 'ok') {
						message.success('delete success')
						store.nameSpaceList?.splice(index, 1)
						loading.value = false
					}
				})
				.catch(() => message.error('delete fail'))
		},
	})
}

const router = useRouter()
const hcNameSpace = (namespace: string) => {
	router.push({ name: 'Clusters', params: { namespace } })
}
</script>

<style lang="scss">
._heade {
	display: flex;
	align-items: center;
	min-height: 56px;
	margin-bottom: -1px;
	padding: 0 24px;
	color: rgba(0, 0, 0, 0.88);
	font-weight: 600;
	font-size: 16px;
	background: transparent;
	border-bottom: 1px solid #f0f0f0;
	border-radius: 8px 8px 0 0;

	._title {
		flex: 1;
	}
}

._body {
	padding: 24px;
	border-radius: 0 0 8px 8px;
}
</style>
