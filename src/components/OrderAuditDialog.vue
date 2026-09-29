<script setup lang="ts">
import type { DialogProps } from '@varlet/ui/types'

const show = defineModel<boolean>('show')
const audit = ref<0 | 1 | -9>(1)
const auditRemark = ref<string>('')
const closed = () => {
  audit.value = 1
  auditRemark.value = ''
}
const emit = defineEmits<{
  submit: [data: { audit: 0 | 1 | -9; auditRemark: string }]
  cancel: []
}>()
const closeBeforeDo: DialogProps['onBeforeClose'] = (action, done) => {
  if (action === 'confirm') {
    if (audit.value === -9 && auditRemark.value === '') {
      Snackbar.warning(`请填写填写理由`)
      return
    }
    emit('submit', {
      audit: audit.value,
      auditRemark: auditRemark.value,
    })
  } else {
    emit('cancel')
  }
  done()
}
</script>
<template>
  <var-dialog v-model:show="show" title="审核" @before-close="closeBeforeDo" @closed="closed">
    <var-radio-group v-model="audit">
      <var-radio :checked-value="1">同意</var-radio>
      <var-radio :checked-value="-9">不同意</var-radio>
    </var-radio-group>
    <var-input v-model="auditRemark" placeholder="请输入理由" textarea />
  </var-dialog>
</template>
