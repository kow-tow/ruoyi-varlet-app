<script setup lang="ts">
import { useUserStore } from '@/store/user'

// Effect: set css/var
useDark()

const user = useUserStore()
const ws = useHeartbeat()
onMounted(async () => {
  await user.getInfo()
  ws.init(user.id)
})
watch(ws.connectionStatus, (status) => console.log(`ws: ${status}`))
</script>

<template>
  <router-view />
</template>
