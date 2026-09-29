<script setup lang="ts">
import { ref, watch } from 'vue'

const { router, route } = useAppRouter()
const active = ref()

const tabs = ref([
  {
    label: '首页',
    icon: 'home',
    name: '/home',
  },
  /*{
    label: 'TOPIC',
    icon: 'heart',
    name: '/topic',
  },
  {
    label: 'MESSAGE',
    icon: 'border-radius',
    namespace: 'i',
    name: '/message',
  },*/
  {
    label: '我的',
    icon: 'account-circle',
    name: '/profile',
  },
])

watch(
  () => route.path,
  (newValue) => {
    active.value = newValue
  },
  { immediate: true },
)
</script>

<template>
  <div class="box-border h-[100dvh] overflow-y-auto pb-[51px]">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>

    <var-bottom-navigation v-model:active="active" safe-area fixed>
      <var-bottom-navigation-item
        v-for="item in tabs"
        :key="item.label"
        :label="item.label"
        :icon="item.icon"
        :name="item.name"
        @click="router.replace(item.name)"
      />
    </var-bottom-navigation>
  </div>
</template>
