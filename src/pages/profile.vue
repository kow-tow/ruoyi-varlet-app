<script setup lang="ts">
import bg from '@/assets/images/profile_bg.jpg'
import avatar from '@/assets/images/profile.png'
import { useUserStore } from '@/store/user'

const { pushStack, router } = useAppRouter()

const user = useUserStore()
const ws = useHeartbeat()
const switchAccount = async (logout: boolean) => {
  const state = await Dialog({
    message: '确认登出账户吗',
  })
  if (state === 'confirm') {
    if (logout) {
      await user.logOut()
      ws.close()
      if (window.InjectApi) {
        const flag = window.InjectApi.stopSocket()
        console.log('window.InjectApi.startSocket', flag)
      }
    }
    router.push('/home/sign-in')
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-[#000]">
    <var-image :src="bg" />
  </div>
  <section class="absolute inset-4 bottom-[calc(var(--bottom-navigation-height)+16px)]">
    <header class="flex">
      <var-avatar class="mx-auto my-14" :src="user.avatar || avatar" size="large" lazy />
    </header>
    <main class="grid gap-4">
      <var-card @click="pushStack('own-doctor-info')">
        <div class="flex justify-between text-white">
          <span>医师资料</span>
          <var-icon name="chevron-right" />
        </div>
      </var-card>
      <var-card @click="switchAccount(true)">
        <div class="flex justify-between">
          <span>切换账户</span>
          <var-icon name="chevron-right" />
        </div>
      </var-card>
    </main>
  </section>
  <router-stack-view />
</template>
<style scoped>
main {
  --card-background: hsla(278, 44%, 96%, 0.5);
  --shadow-key-umbra-opacity: rgba(255, 255, 255, 0.2);
  --shadow-key-penumbra-opacity: rgba(255, 255, 255, 0.14);
  --shadow-key-ambient-opacity: rgba(255, 255, 255, 0.12);
}
</style>
<route lang="json">
{
  "meta": {
    "stacks": [
      "sign-in",
      {
        "name": "own-doctor-info",
        "children": ["sign-in"]
      }
    ]
  }
}
</route>
