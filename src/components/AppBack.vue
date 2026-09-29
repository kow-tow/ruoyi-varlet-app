<script setup lang="ts">
const { backStack } = useAppRouter()
defineProps<{
  keepQuery?: boolean
}>()
</script>

<template>
  <var-button color="transparent" text-color="#fff" round text @click="backStack('', keepQuery)">
    <var-icon class="text-[30px]!" name="chevron-left" />
  </var-button>
</template>
