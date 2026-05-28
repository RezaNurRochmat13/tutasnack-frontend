<script setup lang="ts">
import type { Expense } from '~/types/expense'
import type { PaginationMeta } from '~/types/pagination'

const { list, create, update, remove } = useExpenses()
const toast = useToast()

const data = ref<Expense[]>([])
const loading = ref(false)
const pagination = ref<PaginationMeta | null>(null)

const page = ref(1)
const perPage = 10
const totalPages = computed(() => pagination.value?.totalPages ?? 1)
const totalItems = computed(() => pagination.value?.total ?? 0)

const showDialog = ref(false)
const editing = ref<Expense | null>(null)
const formError = ref('')
const submitting = ref(false)
const form = reactive({ name: '', expenseDate: '', amount: 0 })

async function fetchData() {
  loading.value = true
  try {
    const res = await list(page.value, perPage)
    data.value = res.data
    pagination.value = res.pagination
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
  form.name = ''
  form.expenseDate = new Date().toISOString().split('T')[0]
  form.amount = 0
  showDialog.value = true
}

function openEdit(item: Expense) {
  editing.value = item
  formError.value = ''
  form.name = item.name
  form.expenseDate = item.expenseDate.split('T')[0]
  form.amount = item.amount
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
  if (!form.name.trim()) { formError.value = 'Name is required'; return }
  if (form.amount <= 0) { formError.value = 'Amount must be greater than 0'; return }

  submitting.value = true
  try {
    if (editing.value) {
      await update(editing.value.id, { name: form.name, expenseDate: form.expenseDate, amount: form.amount })
    } else {
      await create({ name: form.name, expenseDate: form.expenseDate, amount: form.amount })
    }
    showDialog.value = false
    await fetchData()
    toast.success(editing.value ? 'Expense updated' : 'Expense created')
  } catch (e: any) {
    formError.value = parseApiError(e)
  } finally {
    submitting.value = false
  }
}

async function confirmDelete(id: string) {
  if (!confirm('Delete this expense?')) return
  try {
    await remove(id)
    await fetchData()
    toast.success('Expense deleted')
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
        <h1 class="text-2xl font-bold">Expense Tracker</h1>
        <p class="text-sm text-muted-foreground">Monitor and manage your business expenses</p>
      </div>
      <Button @click="openCreate">
        <AppIcon name="lucide:plus" class="mr-2 h-4 w-4" />
        Add Expense
      </Button>
    </div>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Expense List</CardTitle>
          <CardDescription>{{ totalItems }} entries</CardDescription>
        </div>
      </CardHeader>

      <ExpenseList
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

    <ExpenseForm
      v-model="showDialog"
      :editing="editing"
      :form="form"
      :form-error="formError"
      :submitting="submitting"
      @save="handleSave"
    />
  </div>
</template>
