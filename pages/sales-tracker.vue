<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

import type { SalesTracker } from '~/types/sales-tracker'
import type { Store } from '~/types/store'
import type { PaginationMeta } from '~/types/pagination'

const toast = useToast()

const { list, create, update, remove } = useSalesTracker()
const { list: listStores } = useStores()

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
const form = reactive({ salesDate: '', storeId: '', saleCount: 0, soldCount: 0 })

function formatDate(iso: string) {
  return iso.split('T')[0]
}

async function fetchData() {
  loading.value = true
  try {
    const [res, storeList] = await Promise.all([
      list(page.value, perPage),
      listStores(),
    ])
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
  form.salesDate = formatDate(item.salesDate)
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

  try {
    if (editing.value) {
      await update(editing.value.id, {
        salesDate: form.salesDate,
        storeId: form.storeId,
        saleCount: form.saleCount,
        soldCount: form.soldCount,
      })
    } else {
      await create({
        salesDate: form.salesDate,
        storeId: form.storeId,
        saleCount: form.saleCount,
        soldCount: form.soldCount,
      })
    }
    showDialog.value = false
    await fetchData()
    toast.success(editing.value ? 'Tracker entry updated' : 'Tracker entry created')
  } catch (e: any) {
    formError.value = parseApiError(e)
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
      <CardContent class="p-0">
        <div v-if="loading" class="flex items-center justify-center py-12">
          <AppIcon name="lucide:loader-circle" class="h-6 w-6 animate-spin text-muted-foreground" />
        </div>

        <template v-else-if="data.length === 0">
          <div class="py-12 text-center text-sm text-muted-foreground">
            No tracker entries yet. Click "Add Entry" to create one.
          </div>
        </template>

        <template v-else>
          <table class="w-full">
            <thead>
              <tr class="border-b text-left text-xs font-medium text-muted-foreground">
                <th class="w-10 px-6 py-3">#</th>
                <th class="px-6 py-3">Date</th>
                <th class="px-6 py-3">Store</th>
                <th class="px-6 py-3 text-right">Sale Count</th>
                <th class="px-6 py-3 text-right">Sold Count</th>
                <th class="px-6 py-3 text-right w-28">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in data"
                :key="item.id"
                class="border-b last:border-0 hover:bg-muted/50"
              >
                <td class="px-6 py-4 text-sm text-muted-foreground">{{ (page - 1) * perPage + index + 1 }}</td>
                <td class="px-6 py-4 text-sm">{{ formatDate(item.salesDate) }}</td>
                <td class="px-6 py-4 text-sm">{{ item.store?.name || '-' }}</td>
                <td class="px-6 py-4 text-sm text-right">{{ item.saleCount }}</td>
                <td class="px-6 py-4 text-sm text-right">{{ item.soldCount }}</td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" @click="openEdit(item)">
                      <AppIcon name="lucide:pencil" class="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" class="text-destructive hover:text-destructive" @click="confirmDelete(item.id)">
                      <AppIcon name="lucide:trash-2" class="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="totalPages > 1" class="flex items-center justify-between border-t px-6 py-3">
            <p class="text-sm text-muted-foreground">
              Page {{ page }} of {{ totalPages }}
            </p>
            <div class="flex gap-1">
              <Button variant="outline" size="sm" :disabled="page <= 1" @click="goToPage(page - 1)">
                <AppIcon name="lucide:chevron-left" class="h-4 w-4" />
                Prev
              </Button>
              <Button
                v-for="p in totalPages"
                :key="p"
                :variant="p === page ? 'default' : 'outline'"
                size="sm"
                @click="goToPage(p)"
              >
                {{ p }}
              </Button>
              <Button variant="outline" size="sm" :disabled="page >= totalPages" @click="goToPage(page + 1)">
                Next
                <AppIcon name="lucide:chevron-right" class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </template>
      </CardContent>
    </Card>

    <div v-if="showDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card class="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>{{ editing ? 'Edit Tracker Entry' : 'Add Tracker Entry' }}</CardTitle>
          <CardDescription>{{ editing ? 'Update the tracker entry' : 'Record a new sales tracker entry' }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="track-date">Date</Label>
            <Input id="track-date" v-model="form.salesDate" type="date" />
          </div>
          <div class="space-y-2">
            <Label for="track-store">Store</Label>
            <select
              id="track-store"
              v-model="form.storeId"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="" disabled>Select store</option>
              <option v-for="s in stores" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="track-sale">Sale Count</Label>
            <Input id="track-sale" v-model.number="form.saleCount" type="number" min="0" placeholder="0" />
          </div>
          <div class="space-y-2">
            <Label for="track-sold">Sold Count</Label>
            <Input id="track-sold" v-model.number="form.soldCount" type="number" min="0" placeholder="0" />
          </div>
          <div v-if="formError" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {{ formError }}
          </div>
          <div class="flex gap-2">
            <Button variant="outline" class="flex-1" @click="showDialog = false">Cancel</Button>
            <Button class="flex-1" @click="handleSave">{{ editing ? 'Update' : 'Save' }}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
