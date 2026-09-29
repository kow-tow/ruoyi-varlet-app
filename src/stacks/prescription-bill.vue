<script setup lang="ts">
import VuePdfEmbed from 'vue-pdf-embed'
import { apiOrderSelectPrescription } from '@/apis/order'

const { route, backStack } = useAppRouter()
const url = ref('')
onMounted(async () => {
  const res = await apiOrderSelectPrescription.load({
    code: route.query.code as string,
  })
  if (res.code === 200) {
    url.value = 'data:application/pdf;base64,' + res.msg
  } else {
    backStack('', true)
  }
})
const cMapUrl = import.meta.env.BASE_URL + 'cmaps/'
</script>

<template>
  <router-stack>
    <div class="absolute inset-0 top-[var(--app-bar-height)]">
      <app-header title="处方单">
        <template #left>
          <app-back :keep-query="route.path.split('/').includes('order-detail')" />
        </template>
      </app-header>
      <VuePdfEmbed
        v-if="url"
        :source="{
          cMapUrl,
          url,
        }"
      />
    </div>
  </router-stack>
</template>
