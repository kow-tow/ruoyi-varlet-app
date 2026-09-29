<script setup lang="ts">
import { apiAudit, apiOrderSelectDetail, OrderDetailed, type OrderSelectDetail } from '@/apis/order'
import OrderAuditDialog from '@/components/OrderAuditDialog.vue'
import { useDictsStore } from '@/store/dicts'
import sleep from '@/utils/sleep'

const { pushStack, backStack, route } = useAppRouter()
const dicts = useDictsStore()
const loading = ref(true)
const btnLoading = ref(false)
const YB_UPLOAD_DICT = ref<Record<string, any>>({})
const AUDIT_STATUS_DICT = ref<Record<string, any>>({})
onMounted(async () => {
  YB_UPLOAD_DICT.value = await dicts.getDictByName('yb_upload')
  AUDIT_STATUS_DICT.value = await dicts.getDictByName('audit_status')
})
const orderDetail = reactive<OrderSelectDetail>({} as OrderSelectDetail)
const active = ref<0 | 1 | 2 | 3 | 4>(0)
const ypxxTab = ref('')
const fabIcon = ref(`plus`)
const fabType = ref<`info` | `success`>(`info`)
const fabActive = ref(false)
const dragList = ref<OrderDetailed[]>([])
const inputDis = ref(true)
const showAudit = ref(false)

// 下拉刷新
const isRefresh = ref(false)
const handleRefresh = () => {
  getData()
  isRefresh.value = false
}

// 审核控制
const auditController = () => {
  // 收起菜单
  fabActive.value = false
  showAudit.value = true
}

// 审核
const audit = async (data: { audit: 0 | 1 | -9; auditRemark: string }) => {
  btnLoading.value = true
  Snackbar.info(`上传中预计8秒后完成，请稍等...`)
  try {
    const resPromise = apiAudit.load({
      code: orderDetail.code as string,
      ...data,
    })
    const sleepPromise = sleep(0)
    const res = (await Promise.all([resPromise, sleepPromise]))[0]
    if (res.code === 200) {
      Snackbar.success(res?.msg ?? `操作成功`)
      backStack()
    } else {
      Snackbar.error(res?.msg ?? `操作失败`)
    }
  } catch (e) {
    console.log(e)
  } finally {
    btnLoading.value = false
  }
}

// 修改药品
const editDrug = () => {
  if (ypxxTab.value) {
    fabIcon.value = `check`
    fabType.value = `success`
    inputDis.value = false
  } else {
    Snackbar.warning(`至少展开一项`)
  }
}

async function getData() {
  try {
    if (Object.hasOwn(route.query, 'active')) {
      fabActive.value = true
    }
    const res = await apiOrderSelectDetail.load({
      code: route.query.code as string,
    })
    if (res.code === 200) {
      Object.assign(orderDetail, res.data)
      dragList.value = orderDetail.orderDetailedList
      loading.value = false
    } else {
      Snackbar.error(res.msg ?? `获取详情失败`)
    }
  } catch (e) {
    console.log(e)
  }
}
onMounted(getData)
</script>

<template>
  <router-stack @popped="getData">
    <var-skeleton title :loading>
      <var-pull-refresh
        v-model="isRefresh"
        class="absolute! inset-0 top-[var(--app-bar-height)] flex flex-col"
        @refresh="handleRefresh"
      >
        <app-header title="处方详情">
          <template #left>
            <app-back v-show="!btnLoading" />
          </template>
        </app-header>
        <var-tabs
          v-model:active="active"
          color="var(--color-primary)"
          active-color="var(--color-on-primary)"
          inactive-color="var(--color-on-info)"
        >
          <var-tab>处方信息</var-tab>
          <var-tab>就诊信息</var-tab>
          <var-tab>药品信息</var-tab>
          <var-tab>医师信息</var-tab>
          <!-- <var-tab>计费信息</var-tab> -->
        </var-tabs>
        <var-tabs-items v-model:active="active" class="flex-1">
          <!-- 处方信息 -->
          <var-tab-item class="overflow-auto">
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">处方编码: </span>
              <div class="item-div">{{ orderDetail.code }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">创建时间: </span>
              <div class="item-div">{{ orderDetail.createDate }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">完成时间: </span>
              <div class="item-div">{{ orderDetail.successDate }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">患者姓名: </span>
              <div class="item-div">{{ orderDetail.patientName }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">患者性别: </span>
              <div class="item-div">{{ orderDetail.patientSex }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">联系方式: </span>
              <div class="item-div">{{ orderDetail.patientPhone }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">患者证件号码: </span>
              <div class="item-div">{{ orderDetail.patientCard }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">统筹区: </span>
              <div class="item-div">{{ orderDetail.ordinationAreaName }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">处方类型: </span>
              <div class="item-div">{{ orderDetail.type == '1' ? '西药处方' : '中药处方' }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">联系地址: </span>
              <div class="item-div">{{ orderDetail.patientAddress }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">处方状态: </span>
              <div class="item-div">
                {{ YB_UPLOAD_DICT[`${orderDetail.state}`] }}
              </div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">是否需要支付: </span>
              <div class="item-div">{{ orderDetail.isPay == 1 ? '不需要' : '需要' }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">支付状态: </span>
              <div class="item-div">{{ orderDetail.payStateMachine }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">更新时间: </span>
              <div class="item-div">{{ orderDetail.updateDate }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">上传备注: </span>
              <div class="item-div">{{ orderDetail.remarks }}</div>
              <var-divider margin="0" />
            </var-space>
          </var-tab-item>
          <!-- 就诊信息 -->
          <var-tab-item class="overflow-auto">
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">门诊编码: </span>
              <div class="item-div">{{ orderDetail.iptOtpNo }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">就诊ID: </span>
              <div class="item-div">{{ orderDetail.mdtrtId }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">险种类别: </span>
              <div class="item-div">{{ orderDetail.insuTypeName }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">医疗类别: </span>
              <div class="item-div">{{ orderDetail.medTypeName }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">诊断信息: </span>
              <div class="item-div">{{ orderDetail.diagnosisText }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">过敏史: </span>
              <div class="item-div">{{ orderDetail.allergiesText }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">不适症状: </span>
              <div class="item-div">{{ orderDetail.discomfortSymptoms }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">病种: </span>
              <div class="item-div">{{ orderDetail.diagnosisIds }}</div>
              <var-divider margin="0" />
            </var-space>
          </var-tab-item>
          <!-- 药品信息 -->
          <var-tab-item class="overflow-auto">
            <var-space direction="column" size="large" class="h-40px p-10px" style="--space-size-large-y: 0">
              <div class="flex items-center justify-between text-sm font-bold">
                <var-button
                  v-if="false"
                  class="rounded-none leading-[var(--button-small-height)]"
                  size="small"
                  @click="editDrug"
                  >修改药品信息</var-button
                >
                <span v-else></span>
                当前状态: {{ orderDetail.state === 0 ? '待审核' : '已审核' }}
              </div>
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <var-collapse
                v-for="item in dragList"
                :key="item.id"
                v-model="ypxxTab"
                accordion
                :elevation="1"
                :offset="false"
              >
                <!-- 每个药品 -->
                <var-collapse-item :title="item.name" :name="item.itemno">
                  <template #icon>数量: {{ item.number }}</template>
                  <var-space direction="column" size="large" class="p-10px">
                    <!-- <span class="text-sm font-bold">药品代码: </span>
                    <div class="item-div">{{ item.ypdm }}</div> -->
                    <var-input v-model="item.ypdm" placeholder="药品代码" :disabled="inputDis" />
                  </var-space>
                  <var-space direction="column" size="large" class="p-10px">
                    <!-- <span class="text-sm font-bold">单位: </span>
                    <div class="item-div">{{ item.unit }}</div> -->
                    <var-input v-model="item.unit" placeholder="单位" :disabled="inputDis" />
                  </var-space>
                  <var-space direction="column" size="large" class="p-10px">
                    <!-- <span class="text-sm font-bold">规格: </span>
                    <div class="item-div">{{ item.specifications }}</div> -->
                    <var-input v-model="item.specifications" placeholder="规格" :disabled="inputDis" />
                  </var-space>
                  <var-space direction="column" size="large" class="p-10px">
                    <!-- <span class="text-sm font-bold">生产企业: </span>
                    <div class="item-div">{{ item.supplierName }}</div> -->
                    <var-input v-model="item.supplierName" placeholder="生产企业" :disabled="inputDis" />
                  </var-space>
                  <var-space direction="column" size="large" class="p-10px">
                    <!-- <span class="text-sm font-bold">用法: </span>
                    <div class="item-div">{{ item.yf }}</div> -->
                    <var-input v-model="item.yf" placeholder="用法" :disabled="inputDis" />
                  </var-space>
                  <var-space direction="column" size="large" class="p-10px">
                    <!-- <span class="text-sm font-bold">频次: </span>
                    <div class="item-div">{{ item.pc }}</div> -->
                    <var-input v-model="item.pc" placeholder="频次" :disabled="inputDis" />
                  </var-space>
                  <var-space direction="column" size="large" class="p-10px">
                    <!-- <span class="text-sm font-bold">每次剂量: </span>
                    <div class="item-div">{{ item.mcjl }}</div> -->
                    <var-input v-model="item.mcjl" placeholder="单位" :disabled="inputDis" />
                  </var-space>
                  <var-space direction="column" size="large" class="p-10px">
                    <!-- <span class="text-sm font-bold">剂量单位: </span>
                    <div class="item-div">{{ item.jldw }}</div> -->
                    <var-input v-model="item.jldw" placeholder="剂量单位" :disabled="inputDis" />
                  </var-space>
                  <var-space direction="column" size="large" class="p-10px">
                    <!-- <span class="text-sm font-bold">使用天数: </span>
                    <div class="item-div">{{ item.syts }}</div> -->
                    <var-input v-model="item.syts" placeholder="使用天数" :disabled="inputDis" />
                  </var-space>
                </var-collapse-item>
              </var-collapse>
              <var-divider margin="0" />
            </var-space>
          </var-tab-item>
          <!-- 医师信息 -->
          <var-tab-item class="overflow-auto">
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">开方医师：</span>
              <div class="item-div">{{ orderDetail.doctorEntity.name }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">所属医院: </span>
              <div class="item-div">{{ orderDetail.hospital.name }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">开方科室: </span>
              <div class="item-div">{{ orderDetail.doctorEntity.deptName }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">开方职称: </span>
              <div class="item-div">{{ orderDetail.doctorEntity.jobTitle }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">开方状态: </span>
              <div class="item-div">
                {{ AUDIT_STATUS_DICT[`${orderDetail.audit}`] }}
              </div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">审核备注: </span>
              <div class="item-div">{{ orderDetail.auditRemark }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">审方医师: </span>
              <div class="item-div">{{ orderDetail.sfDoctorEntity.name }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">所属医院: </span>
              <div class="item-div">{{ orderDetail.hospital.name }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">审方科室: </span>
              <div class="item-div">{{ orderDetail.sfDoctorEntity.deptName }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">审方职称: </span>
              <div class="item-div">{{ orderDetail.sfDoctorEntity.jobTitle }}</div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">审方状态: </span>
              <div class="item-div">
                {{ AUDIT_STATUS_DICT[`${orderDetail.approverAudit}`] }}
              </div>
              <var-divider margin="0" />
            </var-space>
            <var-space direction="column" size="large" class="p-10px">
              <span class="text-sm font-bold">审方备注: </span>
              <div class="item-div">{{ orderDetail.approverRemark }}</div>
              <var-divider margin="0" />
            </var-space>
          </var-tab-item>
          <!-- 计费信息 -->
          <!-- <var-tab-item class="overflow-auto"></var-tab-item> -->
        </var-tabs-items>
      </var-pull-refresh>
      <var-fab
        v-model:active="fabActive"
        :type="fabType"
        position="right-bottom"
        :z-index="99999999"
        :inactive-icon="fabIcon"
        right="2rem"
        :drag="true"
      >
        <var-button-group vertical type="primary" class="rounded-none! w-full gap-1">
          <var-button
            size="large"
            class="w-full! rounded!"
            type="success"
            :loading="btnLoading"
            :disabled="orderDetail.audit !== 0 || orderDetail.state !== 0"
            @click="auditController"
          >
            审核
          </var-button>
          <var-button size="large" class="w-full! rounded!" @click="pushStack('consultation-record')">
            问诊记录
          </var-button>
          <var-button size="large" class="w-full! rounded!" @click="pushStack('prescription-record')">
            处方记录
          </var-button>
          <var-button size="large" class="w-full! rounded!" @click="pushStack('prescription-bill')">
            处方单
          </var-button>
        </var-button-group>
      </var-fab>
      <OrderAuditDialog v-model:show="showAudit" @submit="audit" />
    </var-skeleton>
  </router-stack>
</template>

<style lang="less" scoped>
.text-sm font-bold {
  font-weight: bold;
}
.item-div {
  word-break: break-all;
  color: #696969;
}
</style>
