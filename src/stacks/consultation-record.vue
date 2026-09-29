<script setup lang="ts">
import { apiOrderSelectChatRecords, type OrderSelectChatRecord } from '@/apis/order'
import Chat from '@/components/Chat.vue'

const { route, backStack } = useAppRouter()
onMounted(async () => {
  const res = await apiOrderSelectChatRecords.load({
    code: route.query.code as string,
  })
  if (res.code === 200) {
    history.value = res.data
  } else {
    backStack('', true)
  }
})
const history = ref<OrderSelectChatRecord[]>([])
</script>

<template>
  <router-stack>
    <div class="absolute inset-0 top-[var(--app-bar-height)]">
      <app-header title="问诊记录">
        <template #left>
          <app-back keep-query />
        </template>
      </app-header>
      <Chat v-model="history" class="border-box p-2" />
    </div>
  </router-stack>
</template>
