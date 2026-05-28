<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

import type { SalesIncome } from '~/types/sales-income'
import type { Store } from '~/types/store'

const toast = useToast()

const { list, create, update, remove } = useSalesIncome()
const { list: listStores } = useStores()

const allData = ref<SalesIncome[]>([])
const stores = ref<Store[]>([])
const loading = ref(false)

const page = ref(1)
const perPage = 10
const totalPages = computed(() => Math.max(1, Math.ceil(allData.value.length / perPage)))
const totalItems = computed(() => allData.value.length)

const paginatedData = computed(() => {
  const start = (page.value - 1) * perPage
  return allData.value.slice(start, start + perPage)
})

const showDialog = ref(false)
const editing = ref<SalesIncome | null>(null)
const formError = ref('')
const form = reactive({ salesDate: '', amount: 0, storeId: '' })

function formatDate(iso: string) {
  return iso.split('T')[0]
}

async function fetchData() {
  loading.value = true
  try {
    allData.value = await list()
    stores.value = await listStores()
    page.value = 1
  } catch (e: any) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function goToPage(p: number) {
  page.value = p
}

function openCreate() {
  editing.value = null
  formError.value = ''
  form.salesDate = new Date().toISOString().split('T')[0]
  form.amount = 0
  form.storeId = stores.value[0]?.id || ''
  showDialog.value = true
}

function openEdit(item: SalesIncome) {
  editing.value = item
  formError.value = ''
  form.salesDate = formatDate(item.salesDate)
  form.amount = item.amount
  form.storeId = item.storeId
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
  if (form.amount <= 0) { formError.value = 'Amount must be greater than 0'; return }

  try {
    if (editing.value) {
      await update(editing.value.id, {
        salesDate: form.salesDate,
        amount: form.amount,
        storeId: form.storeId,
      })
    } else {
      await create({
        salesDate: form.salesDate,
        amount: form.amount,
        storeId: form.storeId,
      })
    }
    showDialog.value = false
    await fetchData()
    toast.success(editing.value ? 'Income entry updated' : 'Income entry created')
  } catch (e: any) {
    formError.value = parseApiError(e)
  }
}

async function confirmDelete(id: string) {
  if (!confirm('Delete this income entry?')) return
  try {
    await remove(id)
    await fetchData()
    toast.success('Income entry deleted')
  } catch (e: any) {
    toast.error(parseApiError(e))
  }
}

const totalIncome = computed(() => allData.value.reduce((sum, i) => sum + i.amount, 0))

onMounted(fetchData)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Sales Income</h1>
        <p class="text-sm text-muted-foreground">Track your revenue and earnings</p>
      </div>
      <Button @click="openCreate">
        <AppIcon name="lucide:plus" class="mr-2 h-4 w-4" />
        Add Income
      </Button>
    </div>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Income List</CardTitle>
          <CardDescription>Total: Rp {{ totalIncome.toLocaleString() }} &middot; {{ totalItems }} entries</CardDescription>
        </div>
      </CardHeader>
      <CardContent class="p-0">
        <div v-if="loading" class="flex items-center justify-center py-12">
          <AppIcon name="lucide:loader-circle" class="h-6 w-6 animate-spin text-muted-foreground" />
        </div>

        <template v-else-if="allData.length === 0">
          <div class="py-12 text-center text-sm text-muted-foreground">
            No income entries yet. Click "Add Income" to create one.
          </div>
        </template>

        <template v-else>
          <table class="w-full">
            <thead>
              <tr class="border-b text-left text-xs font-medium text-muted-foreground">
                <th class="px-6 py-3">Store</th>
                <th class="px-6 py-3">Date</th>
                <th class="px-6 py-3 text-right">Amount</th>
                <th class="px-6 py-3 text-right w-28">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in paginatedData"
                :key="item.id"
                class="border-b last:border-0 hover:bg-muted/50"
              >
              <td class="px-6 py-4 text-sm">{{ item.store?.name || '-' }}</td>
                <td class="px-6 py-4 text-sm">{{ formatDate(item.salesDate) }}</td>
                <td class="px-6 py-4 text-sm text-right font-medium">Rp {{ item.amount.toLocaleString() }}</td>
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
              <Button
                variant="outline"
                size="sm"
                :disabled="page <= 1"
                @click="goToPage(page - 1)"
              >
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
              <Button
                variant="outline"
                size="sm"
                :disabled="page >= totalPages"
                @click="goToPage(page + 1)"
              >
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
          <CardTitle>{{ editing ? 'Edit Income' : 'Add Income' }}</CardTitle>
          <CardDescription>{{ editing ? 'Update the income entry' : 'Record a new income entry' }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="inc-date">Date</Label>
            <Input id="inc-date" v-model="form.salesDate" type="date" />
          </div>
          <div class="space-y-2">
            <Label for="inc-store">Store</Label>
            <select
              id="inc-store"
              v-model="form.storeId"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="" disabled>Select store</option>
              <option v-for="s in stores" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="inc-amount">Amount (Rp)</Label>
            <Input id="inc-amount" v-model.number="form.amount" type="number" min="0" placeholder="0" />
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
