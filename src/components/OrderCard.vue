<script setup lang="ts">
import { type OrderSelect4PE as OrderSelect } from '@/apis/order'
import { useDictsStore } from '@/store/dicts'

defineProps<{
  order: OrderSelect
}>()
const dicts = useDictsStore()
const YB_UPLOAD_DICT = ref<Record<string, any>>({})
const AUDIT_STATUS_DICT = ref<Record<string, any>>({})
onMounted(async () => {
  YB_UPLOAD_DICT.value = await dicts.getDictByName('yb_upload')
  AUDIT_STATUS_DICT.value = await dicts.getDictByName('audit_status')
})
</script>
<template>
  <var-card style="--cell-padding: 0">
    <var-cell>
      <span class="inline-flex gap-3 text-4xl">
        <span class="font-black">{{ order.patientName }}</span>
        <span>{{ order.patientSex }}</span>
        <span>{{ order.patientAge && `${order.patientAge}岁` }}</span>
      </span>
      <template #extra>
        <span class="whitespace-nowrap">{{ AUDIT_STATUS_DICT[`${order.audit}`] }}</span>
      </template>
    </var-cell>
    <section class="mb-2 mt-1 table w-full text-4xl">
      <div v-for="row of order.detailedList" :key="row.id" class="table-row">
        <span class="table-cell">{{ row.name }}</span>
        <span class="table-cell text-right">{{ row.number }} {{ row.unit }}</span>
      </div>
    </section>
    <section class="mt-8 text-2xl">{{ order.medType === '14' ? order.diagnosisIds : order.diagnosisText }}</section>
    <section class="text-2xl">{{ order.medTypeName }}</section>
    <section class="text-2xl">{{ order.createDate }}</section>
    <section class="text-2xl">{{ order.deptName }}</section>
    <template #extra>
      <slot
        :dicts="{
          YB_UPLOAD_DICT,
          AUDIT_STATUS_DICT,
        }"
      ></slot>
    </template>
  </var-card>
</template>
