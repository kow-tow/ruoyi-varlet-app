<script setup lang="ts">
import { apiAudit, apiOrderSelect4PE, apiOrderSelect4PED, type OrderSelect4PE as OrderSelect } from '@/apis/order'
import OrderAuditDialog from '@/components/OrderAuditDialog.vue'
import OrderCard from '@/components/OrderCard.vue'
import { assign } from '@/utils/record'
import sleep from '@/utils/sleep'

const { pushStack } = useAppRouter()
const active = ref<0 | 1>(0)
const isRefresh = ref(false)
const handleRefresh = async () => {
  await orderListRefresh(active.value)
  isRefresh.value = false
}
const ws = useHeartbeat()
const orderList = reactive<[OrderSelect[], OrderSelect[]]>([[], []])

watch(
  () => orderList[0].length,
  (length) => {
    ws.history[11].data = length
    if (ws.history[11].hasRead !== void 0) {
      ws.history[11].hasRead = true
    }
  },
)
watch(
  () => ws.history[11].hasRead,
  (v, o) => {
    if (o === void 0 && v === false) {
      return (ws.history[11].hasRead = true)
    }
    if (o === false && v === true) {
      return orderListRefresh(0)
    }
  },
)

const orderListPageNum = reactive([1, 1])
const orderListisLoading = reactive([false, false])
const orderListisLoadCompleted = reactive([false, false])
const orderListRefresh = async (n: 0 | 1) => {
  orderList[n].splice(0)
  orderListPageNum[n] = 1
  orderListisLoadCompleted[n] = true
  await nextTick()
  orderListisLoadCompleted[n] = false
}
const orderListLoadMore = async (n: 0 | 1) => {
  orderListisLoading[n] = true
  const res = await [apiOrderSelect4PE, apiOrderSelect4PED][n].load({
    pageNum: `${orderListPageNum[n]}`,
    pageSize: '10',
    audit: n && void 0,
    state: n && void 0,
  })
  if (res.code === 200) {
    orderListPageNum[n] += 1
    orderList[n].push(...res.rows)
    if (orderList[n].length >= res.total) {
      orderListisLoadCompleted[n] = true
    }
  } else {
    orderListisLoadCompleted[n] = true
  }
  orderListisLoading[n] = false
}
const showAudit = ref(false)
const currentCode = ref<string>()
// 审核
const audit = async (data: { audit: 0 | 1 | -9; auditRemark: string }) => {
  Snackbar.info(`上传中预计8秒后完成，请稍等...`)
  try {
    const resPromise = apiAudit.load({
      code: currentCode.value!,
      ...data,
    })
    const sleepPromise = sleep(0)
    const res = (await Promise.all([resPromise, sleepPromise]))[0]
    if (res.code === 200) {
      Snackbar.success(res?.msg ?? `操作成功`)
      const filter = (order: OrderSelect, eq = true) => (order.code === currentCode.value) === eq
      const effect = (order: OrderSelect) => assign(order, data)
      orderList[0].splice(0, Infinity, ...orderList[0].filter((o) => filter(o, false)))
      orderList[1].filter((o) => filter(o)).forEach(effect)
    } else {
      Snackbar.error(res?.msg ?? `操作失败`)
    }
  } catch (e) {
    console.log(e)
  } finally {
    currentCode.value = void 0
  }
}
</script>

<template>
  <router-stack>
    <var-pull-refresh
      v-model="isRefresh"
      class="absolute! inset-0 top-[var(--app-bar-height)] flex flex-col"
      @refresh="handleRefresh"
    >
      <app-header title="处方审核">
        <template #left>
          <app-back />
        </template>
      </app-header>
      <var-tabs v-model:active="active">
        <var-tab style="--chip-default-text-color: currentColor; --chip-default-color: transparent">
          <var-badge
            type="danger"
            :hidden="ws.history[11].data < 1"
            :value="ws.history[11].data"
            :offset-x="0"
            :offset-y="8"
          >
            <var-chip>待审方</var-chip>
          </var-badge>
        </var-tab>
        <var-tab>全部处方</var-tab>
      </var-tabs>
      <OrderAuditDialog v-model:show="showAudit" @submit="audit" @cancel="currentCode = void 0" />
      <var-tabs-items v-model:active="active" class="flex-1">
        <var-tab-item>
          <div class="h-full overflow-auto">
            <var-list
              v-model:loading="orderListisLoading[0]"
              :finished="orderListisLoadCompleted[0]"
              @load="orderListLoadMore(0)"
            >
              <div class="px-4">
                <OrderCard v-for="order of orderList[0]" :key="order.code" :order class="mt-4">
                  <var-button
                    :disabled="order.audit !== 0 || order.state !== 0 || !!currentCode"
                    :loading="order.code === currentCode"
                    type="primary"
                    @click="() => ((currentCode = order.code), (showAudit = true))"
                  >
                    审核
                  </var-button>
                  <var-menu placement="bottom" same-width :offset-y="6" class="ml-2">
                    <var-button-group type="primary">
                      <var-button @click="pushStack('order-detail', { code: order.code })"> 详情 </var-button>
                      <var-button class="px-1!">
                        <var-icon name="menu-down" :size="24" />
                      </var-button>
                    </var-button-group>
                    <template #menu>
                      <var-cell ripple @click="pushStack('consultation-record', { code: order.code })">
                        问诊记录
                      </var-cell>
                      <var-cell ripple @click="pushStack('prescription-record', { code: order.code })">
                        处方记录
                      </var-cell>
                      <var-cell ripple @click="pushStack('prescription-bill', { code: order.code })"> 处方单 </var-cell>
                    </template>
                  </var-menu>
                </OrderCard>
              </div>
            </var-list>
          </div>
        </var-tab-item>
        <var-tab-item>
          <div class="h-full overflow-auto">
            <var-list
              v-model:loading="orderListisLoading[1]"
              :finished="orderListisLoadCompleted[1]"
              @load="orderListLoadMore(1)"
            >
              <div class="px-4">
                <OrderCard v-for="order of orderList[1]" :key="order.code" :order class="mt-4">
                  <var-button
                    :disabled="order.audit !== 0 || order.state !== 0 || !!currentCode"
                    :loading="order.code === currentCode"
                    type="primary"
                    @click="() => ((currentCode = order.code), (showAudit = true))"
                  >
                    审核
                  </var-button>
                  <var-menu placement="bottom" same-width :offset-y="6" class="ml-2">
                    <var-button-group type="primary">
                      <var-button @click="pushStack('order-detail', { code: order.code })"> 详情 </var-button>
                      <var-button class="px-1!">
                        <var-icon name="menu-down" :size="24" />
                      </var-button>
                    </var-button-group>
                    <template #menu>
                      <var-cell ripple @click="pushStack('consultation-record', { code: order.code })">
                        问诊记录
                      </var-cell>
                      <var-cell ripple @click="pushStack('prescription-record', { code: order.code })">
                        处方记录
                      </var-cell>
                      <var-cell ripple @click="pushStack('prescription-bill', { code: order.code })"> 处方单 </var-cell>
                    </template>
                  </var-menu>
                </OrderCard>
              </div>
            </var-list>
          </div>
        </var-tab-item>
      </var-tabs-items>
    </var-pull-refresh>
  </router-stack>
</template>
