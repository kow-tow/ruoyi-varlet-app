<script setup lang="ts">
import { DatePickerProps } from '@varlet/ui'

type Props = Omit<DatePickerProps, 'modelValue' | 'date' | 'range'> & {
  modelValue: [string, string]
}
const props = defineProps<Props>()
const text = computed(() => `${props.modelValue[0]} ~ ${props.modelValue[1]}`)
const inputRef = useTemplateRef('inputRef')
function handleInputFocus() {
  inputRef.value?.blur()
  showPicker.value = true
}
const showPicker = ref(false)
</script>
<template>
  <var-input ref="inputRef" placeholder="请选择日期" readonly :model-value="text" @focus="handleInputFocus" />
  <var-popup v-model:show="showPicker" position="bottom">
    <var-date-picker v-bind="{ ...props, modelValue: props.modelValue, type: 'date', range: true }">
      <template #range>
        <span> {{ text }} </span>
        <var-button text type="success" @click="showPicker = false">
          <var-icon name="check" />
        </var-button>
      </template>
    </var-date-picker>
  </var-popup>
</template>
<style lang="less" scoped>
:deep(.var-date-picker__title-date) {
  --date-picker-title-date-justify-content: space-between;
  & > div {
    display: contents;
  }
}
</style>
