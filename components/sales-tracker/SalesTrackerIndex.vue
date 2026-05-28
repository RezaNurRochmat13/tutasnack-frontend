<script setup lang="ts">
import type { SalesTracker } from '~/types/sales-tracker'
import type { Store } from '~/types/store'
import type { PaginationMeta } from '~/types/pagination'

const { list, create, update, remove } = useSalesTracker()
const { list: listStores } = useStores()
const toast = useToast()

const data = ref<SalesTracker[]>([])
const stores = ref<Store[]>([])
const loading = ref(false)
const pagination = ref<PaginationMeta | null>(null)

const page = ref(1)
const perPage = 10
const totalPages = computed(() => pagination.value?.totalPages ?? 1)
const totalItems = computed(() => pagination.value?.total ?? 0)

const showDialog = ref(false)
const editing = ref<SalesTracker | null>(null)
const formError = ref('')
const submitting = ref(false)
const form = reactive({ salesDate: '', storeId: '', saleCount: 0, soldCount: 0 })

async function fetchData() {
  loading.value = true
  try {
    const [res, storeList] = await Promise.all([list(page.value, perPage), listStores()])
    data.value = res.data
    pagination.value = res.pagination
    stores.value = storeList
  } catch (e: any) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function goToPage(p: number) {
  page.value = p
  fetchData()
}

function openCreate() {
  editing.value = null
  formError.value = ''
  form.salesDate = new Date().toISOString().split('T')[0]
  form.storeId = stores.value[0]?.id || ''
  form.saleCount = 0
  form.soldCount = 0
  showDialog.value = true
}

function openEdit(item: SalesTracker) {
  editing.value = item
  formError.value = ''
  form.salesDate = item.salesDate.split('T')[0]
  form.storeId = item.storeId
  form.saleCount = item.saleCount
  form.soldCount = item.soldCount
  showDialog.value = true
}

function parseApiError(e: any): string {
  const issues = e?.body?.error?.issues
  if (Array.isArray(issues)) {
    return issues.map((i: any) => `${i.path?.join('.')}: ${i.message}`).join('\n')
  }
  return e?.body?.error?.message || e?.body?.message || e.message || 'Something went wrong'
}

async function handleSave() {
  formError.value = ''
  if (!form.storeId) { formError.value = 'Please select a store'; return }

  submitting.value = true
  try {
    if (editing.value) {
      await update(editing.value.id, { salesDate: form.salesDate, storeId: form.storeId, saleCount: form.saleCount, soldCount: form.soldCount })
    } else {
      await create({ salesDate: form.salesDate, storeId: form.storeId, saleCount: form.saleCount, soldCount: form.soldCount })
    }
    showDialog.value = false
    await fetchData()
    toast.success(editing.value ? 'Tracker entry updated' : 'Tracker entry created')
  } catch (e: any) {
    formError.value = parseApiError(e)
  } finally {
    submitting.value = false
  }
}

async function confirmDelete(id: string) {
  if (!confirm('Delete this tracker entry?')) return
  try {
    await remove(id)
    await fetchData()
    toast.success('Tracker entry deleted')
  } catch (e: any) {
    toast.error(parseApiError(e))
  }
}

onMounted(() => {
  page.value = 1
  fetchData()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Sales Tracker</h1>
        <p class="text-sm text-muted-foreground">Monitor your daily sales performance</p>
      </div>
      <Button @click="openCreate">
        <AppIcon name="lucide:plus" class="mr-2 h-4 w-4" />
        Add Entry
      </Button>
    </div>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tracker List</CardTitle>
          <CardDescription>{{ totalItems }} entries</CardDescription>
        </div>
      </CardHeader>

      <SalesTrackerList
        :items="data"
        :loading="loading"
        :page="page"
        :per-page="perPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        @edit="openEdit"
        @delete="confirmDelete"
        @go-to-page="goToPage"
      />
    </Card>

    <SalesTrackerForm
      v-model="showDialog"
      :editing="editing"
      :form="form"
      :form-error="formError"
      :submitting="submitting"
      :stores="stores"
      @save="handleSave"
    />
  </div>
</template>
