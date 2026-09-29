<script setup lang="ts">
import type { SelectOption } from '@varlet/ui'
import dayjs from 'dayjs'
import { debounce } from 'es-toolkit'
import { apiDepartmentPort, apiDoctorStatistics, type DoctorStatistic } from '@/apis/doctor'
import VarletDateRangeInput from '@/components/VarletDateRangeInput.vue'

const index = useZIndex()

const isRefresh = ref(false)
const handleRefresh = async () => {
  await doctorListRefresh()
  isRefresh.value = false
}
const now = dayjs()
const now_fmt = now.format('YYYY-MM-DD')
const query = reactive({
  startDate: now_fmt,
  endDate: now_fmt,
  keyword: '',
  isOnline: -1 as -1 | 0 | 1,
  deptName: '',
})
const doctorList = reactive<DoctorStatistic[]>([])
const doctorListPageNum = ref(1)
const doctorListisLoading = ref(false)
const doctorListisLoadCompleted = ref(false)
const doctorListRefresh = async () => {
  doctorList.splice(0)
  doctorListPageNum.value = 1
  doctorListisLoadCompleted.value = true
  await nextTick()
  doctorListisLoadCompleted.value = false
}
const doctorListLoadMore = async () => {
  doctorListisLoading.value = true
  const res = await apiDoctorStatistics.load({
    pageNum: `${doctorListPageNum.value}`,
    pageSize: '10',
    startDate: query.startDate,
    endDate: query.endDate,
    keyword: query.keyword,
    isOnline: query.isOnline,
    deptName: query.deptName,
  })
  if (res.code === 200) {
    doctorListPageNum.value += 1
    doctorList.push(...res.rows)
    if (doctorList.length >= res.total) {
      doctorListisLoadCompleted.value = true
    }
  } else {
    doctorListisLoadCompleted.value = true
  }
  doctorListisLoading.value = false
}
watch(index, () => document.documentElement.style.setProperty('--floating-panel-z-index', `${index.value + 1}`), {
  immediate: true,
})
watch(query, debounce(doctorListRefresh, 999))
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
    ).data.map((i) => ({ label: i.guojiaName })),
  )
})
</script>
<template>
  <router-stack>
    <var-pull-refresh
      v-model="isRefresh"
      class="absolute! inset-0 top-[var(--app-bar-height)] flex flex-col"
      @refresh="handleRefresh"
    >
      <app-header title="医师统计">
        <template #left>
          <app-back />
        </template>
      </app-header>
      <div class="flex-1 overflow-auto pb-24">
        <var-list
          v-model:loading="doctorListisLoading"
          :finished="doctorListisLoadCompleted"
          @load="doctorListLoadMore"
        >
          <div class="px-4">
            <var-card v-for="doctor of doctorList" :key="doctor.id" class="mt-4">
              <div>所属医院: {{ doctor.hospitalName }}</div>
              <div>科室: {{ doctor.deptName }}</div>
              <div>医生执业证号: {{ doctor.doctorLicenseNumber }}</div>
              <div>姓名: {{ doctor.name }}</div>
              <div>在线状态: {{ doctor.isRecycle === 0 ? '在线' : '离线' }}</div>
              <div>在线时长: {{ doctor.onlineTime }}分钟</div>
              <details :name="`${doctor.id}`">
                <summary>在线情况</summary>
                <div>
                  <div class="indent-1em">总数: {{ doctor.toltalNumber }}</div>
                  <div class="indent-1em">未审核数: {{ doctor.wnumber }}</div>
                  <div class="indent-1em">审核数: {{ doctor.snumber }}</div>
                  <div class="indent-1em">驳回数: {{ doctor.returnNumber }}</div>
                </div>
              </details>
              <details :name="`${doctor.id}`">
                <summary>审核情况</summary>
                <div>
                  <div class="indent-1em">小于5分钟: {{ doctor.anumber }}</div>
                  <div class="indent-1em">5到10分钟: {{ doctor.bnumber }}</div>
                  <div class="indent-1em">10到15分钟: {{ doctor.cnumber }}</div>
                  <div class="indent-1em">大于15分钟: {{ doctor.dnumber }}</div>
                </div>
              </details>
            </var-card>
          </div>
        </var-list>
      </div>
      <var-floating-panel>
        <var-space class="mx-4" direction="column" size="large">
          <VarletDateRangeInput
            :model-value="[query.startDate, query.endDate]"
            :max="now_fmt"
            @update:model-value="
              ([startDate, endDate]) => {
                ;[query.startDate, query.endDate] = [startDate, endDate]
              }
            "
          />
          <var-input v-model="query.keyword" placeholder="请输入姓名或身份证号" />
          <var-select v-model="query.deptName" clearable placeholder="请选择科室" :options="DEPT_OPTIONS" />
          <var-select
            v-model="query.isOnline"
            :options="[
              { value: -1, label: '全部' },
              { value: 0, label: '在线' },
              { value: 1, label: '离线' },
            ]"
          />
        </var-space>
      </var-floating-panel>
    </var-pull-refresh>
  </router-stack>
</template>
