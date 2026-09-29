<script setup lang="ts">
import type { SelectOption, VarFile } from '@varlet/ui'
import { apiDepartmentPort, apiDoctorList /*, apiDoctorSetAvatar*/, apiDoctorSetInfo } from '@/apis/doctor'
import { useDictsStore, type DictItem } from '@/store/dicts'
import { useUserStore } from '@/store/user'
import { assign } from '@/utils/record'

const user = useUserStore()
const dicts = useDictsStore()
const SYS_NORMAL_DISABLE_DICTI_ITEMS = reactive<DictItem[]>([])
onMounted(async () => {
  SYS_NORMAL_DISABLE_DICTI_ITEMS.splice(
    0,
    Infinity,
    ...(await dicts.getDictItemsByName('sys_normal_disable')).toSorted((x, y) => x.dictSort - y.dictSort),
  )
})
const JOB_TITLE_OPTIONS = reactive<SelectOption[]>([])
onMounted(async () => {
  JOB_TITLE_OPTIONS.splice(
    0,
    Infinity,
    ...(
      await apiDepartmentPort.load({
        name: '医师专业技术职务,药师卫生技术人员专业技术职务',
        page: 1,
        size: 99,
      })
    ).data.map((i) => ({ label: i.guojiaName, value: `${i.id}` })),
  )
})

const DEPT_OPTIONS = reactive<SelectOption[]>([])
onMounted(async () => {
  DEPT_OPTIONS.splice(
    0,
    Infinity,
    ...(
      await apiDepartmentPort.load({
        name: '科别,',
        page: 1,
        size: 300,
      })
    ).data.map((i) => ({ label: i.guojiaName, value: `${i.id}` })),
  )
})
const { backStack } = useAppRouter()
const id = ref(NaN)

const isRefresh = ref(false)
const formData = reactive({
  auto: 0 as 0 | 1,
  dept_id: '',
  doctorLicenseNumber: '',
  id,
  idCard: '',
  job_title_id: '',
  name: '',
  phone: '',
  prescriptionRight: 0 as 0 | 1,
  imgBase64: '',
  // imgUrl: '',
})
const handleRefresh = () => {
  getData().then(() => (fabActive.value = false))
  isRefresh.value = false
}
async function getData() {
  const res = await apiDoctorList.load()
  if (res.code === 200) {
    const row = res.rows[0]
    if (res.rows.length === 1 && user.roles.includes('doctor') && row.userId === user.id) {
      id.value = row.id
      assign(formData, {
        ...row,
        job_title_id: row.jobTitleId,
        dept_id: row.deptId,
      })
      avatarfile.value = formData.imgBase64
        ? [
            {
              url: formData.imgBase64,
              cover: formData.imgBase64,
            },
          ]
        : []
    } else {
      Snackbar.error(`仅限使用医师账户修改本人资料`)
      backStack()
    }
  } else {
    backStack()
  }
}
const fabActive = ref(false)
const fabType = ref<`info` | `success`>(`info`)
const fabIcon = ref('check')
const loading = ref(false)
const oversize = () => Snackbar.warning('文件大小超出2M限制')
const avatarfile = ref<VarFile[]>([])
/*async*/ function uploadEffect(file: VarFile) {
  // 按照PC端需要调用这个接口 但是其实没必要
  /*
  const res = await apiDoctorSetAvatar.load({
    avatarfile: file.file!,
  })
  if (res.code === 200) {
    assign(formData, {
      ...res.data,
      imgBase64: file.url,
    })
    return true
  }
  return false
  */
  formData.imgBase64 = file.url!
  return true
}
const formRef = useTemplateRef('formRef')
async function submit() {
  if (!(await formRef.value!.validate())) {
    return
  }
  loading.value = true
  try {
    const res = await apiDoctorSetInfo.load(formData)
    if (res.code === 200) {
      await user.getInfo()
      Snackbar.success(res.msg)
      fabActive.value = false
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(getData)
</script>
<template>
  <router-stack>
    <var-pull-refresh
      v-model="isRefresh"
      class="absolute! inset-0 top-[var(--app-bar-height)] flex flex-col"
      @refresh="handleRefresh"
    >
      <app-header title="医师资料">
        <template #left>
          <app-back />
        </template>
      </app-header>
      <main class="flex-1 overflow-auto p-4">
        <var-form ref="formRef" scroll-to-error="start">
          <var-space direction="column" :size="[14, 0]">
            <var-uploader
              v-model="avatarfile"
              :maxlength="1"
              :maxsize="1024 * 1024 * 2"
              @before-read="uploadEffect"
              @oversize="oversize"
            />
            <var-input v-model="formData.name" placeholder="请输入姓名" :rules="(v) => !!v || '姓名不能为空'" />
            <var-input
              v-model="formData.phone"
              placeholder="请输入电话号码"
              :rules="(v) => !!v || '电话号码不能为空'"
            />
            <var-input
              v-model="formData.idCard"
              placeholder="请输入身份证号"
              :rules="(v) => !!v || '身份证号不能为空'"
            />
            <var-radio-group
              v-model="formData.prescriptionRight"
              :rules="(v) => [0, 1].includes(v) || '必须选择一个处方权'"
            >
              <span class="inline-flex items-center text-[var(--field-decorator-blur-color)]">处方权：</span>
              <var-radio
                v-for="i of SYS_NORMAL_DISABLE_DICTI_ITEMS"
                :key="i.dictValue"
                :checked-value="Number.parseInt(i.dictValue)"
                >{{ i.dictLabel }}</var-radio
              >
            </var-radio-group>
            <var-input
              v-model="formData.doctorLicenseNumber"
              placeholder="请输入职业证号"
              :rules="(v) => !!v || '职业证号不能为空'"
            />
            <var-select
              v-if="formData.job_title_id && JOB_TITLE_OPTIONS.length"
              v-model="formData.job_title_id"
              placeholder="请选择职称"
              :rules="(v) => !!v || '必须选择一个职称'"
              :options="JOB_TITLE_OPTIONS"
            />
            <var-select
              v-if="formData.dept_id && DEPT_OPTIONS.length"
              v-model="formData.dept_id"
              placeholder="请选择科室"
              :rules="(v) => !!v || '必须选择一个科室'"
              :options="DEPT_OPTIONS"
            />
            <var-radio-group v-model="formData.auto" :rules="(v) => [0, 1].includes(v) || '必须选择是否启用自动审核'">
              <span class="inline-flex items-center text-[var(--field-decorator-blur-color)]">自动审核：</span>
              <var-radio :checked-value="0">开启</var-radio>
              <var-radio :checked-value="1">关闭</var-radio>
            </var-radio-group>
          </var-space>
        </var-form>
      </main>
    </var-pull-refresh>
    <var-fab
      v-model:active="fabActive"
      :type="fabType"
      position="right-bottom"
      :z-index="99999999"
      :inactive-icon="fabIcon"
      right="2rem"
      :drag="true"
    >
      <var-button-group vertical type="primary" class="rounded-none! w-full gap-1">
        <var-button size="large" class="w-full! rounded!" :loading type="success" @click="submit"> 保存 </var-button>
        <var-button size="large" class="w-full! rounded!" @click="handleRefresh"> 重置 </var-button>
      </var-button-group>
    </var-fab>
  </router-stack>
</template>
