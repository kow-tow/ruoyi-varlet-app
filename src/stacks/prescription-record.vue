<script setup lang="ts">
import { apiPrescriptionRecord, type PrescriptionRecordEntity } from '@/apis/order'

const { route, backStack } = useAppRouter()
const cfCode = route.query.code
const loading = ref(false)
const activeStep = ref(0)
const prescriptionRecordList = ref<PrescriptionRecordEntity[]>([])

// 刷新
const isRefresh = ref(false)
const handleRefresh = () => {
  getData()
  isRefresh.value = false
}
async function getData() {
  try {
    const res = await apiPrescriptionRecord.load({
      code: cfCode as string,
    })
    if (res.code === 200) {
      prescriptionRecordList.value = res.data ?? []
      activeStep.value = prescriptionRecordList.value.length
    } else {
      Snackbar.error(res.msg ?? `获取记录失败`)
      backStack('', true)
    }
  } catch (e) {
    console.log(e)
  }
}
onMounted(getData)
</script>

<template>
  <router-stack>
    <var-pull-refresh
      v-model="isRefresh"
      class="absolute! inset-0 top-[var(--app-bar-height)]"
      @refresh="handleRefresh"
    >
      <app-header title="处方记录">
        <template #left>
          <app-back :keep-query="route.path.split('/').includes('order-detail')" />
        </template>
      </app-header>
      <var-skeleton :loading="loading" rows="5">
        <section class="flex flex-col p-4">
          <!-- 头 -->
          <div class="p-5px mb-10px flex flex-col">
            <span class="text-slg font-bold">处方【{{ cfCode }} 】的记录</span>
          </div>
          <!-- 步骤条 -->
          <var-steps direction="vertical" :active="activeStep">
            <var-step v-for="item of prescriptionRecordList" :key="item.code"
              ><var-row>{{ item.auditUserName }}:&nbsp;{{ item.auditRemark }}</var-row>
              <var-row class="text-gray-400">{{ item.auditTime }}</var-row></var-step
            >
          </var-steps>
        </section>
      </var-skeleton>
    </var-pull-refresh>
  </router-stack>
</template>
