<script setup lang="ts">
import bg from '@/assets/images/home_bg.jpg'
import { useUserStore } from '@/store/user'
import { getTimePeriod } from '@/utils/time'

const { pushStack } = useAppRouter()

// 登录信息
const user = useUserStore()
const ws = useHeartbeat()
Reflect.set(window, 'ws', ws)
</script>

<template>
  <!-- 顶部 -->
  <header
    class="fixed flex w-full justify-center pb-12 pt-20"
    :style="`
        background-image: url('${bg}');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
      `"
  >
    <var-row>
      <var-col class="text-2xl text-white">
        <span>{{ getTimePeriod() }}好，{{ user.nickName || `主人` }}</span>
      </var-col>
    </var-row>
  </header>
  <section class="z-1 relative">
    <main class="w-full px-4 pt-36">
      <var-card>
        <section class="flex h-60 flex-col gap-2">
          <var-row>我的办理</var-row>
          <nav class="grid flex-1 grid-cols-2 grid-rows-2 gap-4">
            <section
              class="grid-area-[1/1/3/2] flex flex-1 items-center justify-center gap-4 rounded-md bg-[var(--chip-primary-color)]"
              @click="pushStack('order-list')"
            >
              <div class="text-3xl">📝</div>
              <div class="grid justify-items-center gap-4">
                <var-badge
                  type="danger"
                  :hidden="ws.history[11].data < 1 || ws.history[11].hasRead === true"
                  :value="ws.history[11].data"
                  :offset-x="8"
                  :offset-y="4"
                  class="line-height-4"
                >
                  <div class="text-2xl">待审方</div>
                </var-badge>
                <var-button type="primary" size="small" class="w-15 line-height-1"> 查看 </var-button>
              </div>
            </section>
            <section
              class="grid-area-[1/2/2/3] flex flex-1 items-center justify-center gap-4 rounded-md bg-[var(--chip-danger-color)]"
              @click="pushStack('doctor-statistics')"
            >
              <div class="grid">
                <div>医师统计</div>
                <div>RECORD</div>
              </div>
              <div class="text-2xl">📑</div>
            </section>
            <section
              class="grid-area-[2/2/3/3] flex flex-1 items-center justify-center gap-4 rounded-md bg-[var(--chip-default-color)]"
              @click="pushStack('own-signature')"
            >
              <div class="grid">
                <div>签名设置</div>
                <div>DEPLOY</div>
              </div>
              <div class="text-2xl">⚙</div>
            </section>
          </nav>
        </section>
      </var-card>
      <section></section>
    </main>
  </section>
  <router-stack-view />
</template>
<style scoped>
main {
  --card-background: hsla(278, 44%, 96%, 0.86);
}
</style>
<route lang="json">
{
  "meta": {
    "stacks": [
      "sign-in",
      {
        "name": "order-list",
        "children": [
          "sign-in",
          {
            "name": "consultation-record",
            "children": ["sign-in"]
          },
          {
            "name": "prescription-record",
            "children": ["sign-in"]
          },
          {
            "name": "prescription-bill",
            "children": ["sign-in"]
          },
          {
            "name": "order-detail",
            "children": ["sign-in", "consultation-record", "prescription-record", "prescription-bill"]
          }
        ]
      },
      {
        "name": "doctor-statistics",
        "children": ["sign-in"]
      },
      {
        "name": "own-signature",
        "children": ["sign-in"]
      }
    ]
  }
}
</route>
