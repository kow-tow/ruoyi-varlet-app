<script setup lang="ts">
import { apiDoctorList, apiDoctorSetSignature } from '@/apis/doctor'
import { useUserStore } from '@/store/user'

const user = useUserStore()
const { backStack } = useAppRouter()
const id = ref(NaN)
const signatureUrl = ref('')
const signatureRef = useTemplateRef('signatureRef')
const isRefresh = ref(false)
const handleRefresh = () => {
  getData()
  isRefresh.value = false
}
async function getData() {
  const res = await apiDoctorList.load()
  if (res.code === 200) {
    const row = res.rows[0]
    if (res.rows.length === 1 && user.roles.includes('doctor') && row.userId === user.id) {
      id.value = row.id
      signatureUrl.value = row.signatureUrl ?? ''
      resetSignature()
    } else {
      Snackbar.error(`仅限使用医师账户修改本人签名`)
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

function clearSignature() {
  const canvas: HTMLCanvasElement = Reflect.get(signatureRef.value!, 'canvas')
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    return (img: HTMLImageElement) => ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  }
}

function resetSignature() {
  if (signatureUrl.value) {
    const img = new Image()
    img.onload = function () {
      clearSignature()?.(img)
      fabActive.value = false
    }
    img.src = signatureUrl.value
  }
}

async function saveSignature() {
  const file = signatureRef.value!.confirm()
  if (!file) {
    Snackbar.warning(`请签名`)
    return
  }
  loading.value = true
  try {
    const res = await apiDoctorSetSignature.load({
      file: signatureRef.value!.confirm(),
      id: id.value,
    })
    if (res.code === 200) {
      Snackbar.success(res.msg)
      signatureUrl.value = file
      fabActive.value = false
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(getData)
onMounted(() => {
  window.addEventListener('resize', resetSignature)
})
onUnmounted(() => {
  window.removeEventListener('resize', resetSignature)
})
</script>
<template>
  <router-stack>
    <var-pull-refresh
      v-model="isRefresh"
      class="absolute! inset-0 top-[var(--app-bar-height)]"
      style="--signature-height: calc(343px - var(--app-bar-height))"
      @refresh="handleRefresh"
    >
      <app-header title="签名设置">
        <template #left>
          <app-back />
        </template>
      </app-header>
      <main class="m-4" @touchstart.stop @touchmove.stop @touchend.stop>
        <var-signature ref="signatureRef" />
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
        <var-button size="large" class="w-full! rounded!" :loading type="success" @click="saveSignature">
          保存
        </var-button>
        <var-button size="large" class="w-full! rounded!" @click="resetSignature"> 重置 </var-button>
        <var-button size="large" class="w-full! rounded!" @click="clearSignature()"> 清空 </var-button>
      </var-button-group>
    </var-fab>
  </router-stack>
</template>
