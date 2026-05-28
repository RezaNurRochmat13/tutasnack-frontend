<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

import type { Store } from '~/types/store'

const { list, create, update, remove } = useStores()
const toast = useToast()

const allData = ref<Store[]>([])
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
const editing = ref<Store | null>(null)
const formError = ref('')
const form = reactive({ name: '', description: '', address: '' })

async function fetchData() {
  loading.value = true
  try {
    allData.value = await list()
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
  form.name = ''
  form.description = ''
  form.address = ''
  showDialog.value = true
}

function openEdit(item: Store) {
  editing.value = item
  formError.value = ''
  form.name = item.name
  form.description = item.description || ''
  form.address = item.address || ''
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

  const payload: any = { name: form.name }
  if (form.description.trim()) payload.description = form.description
  if (form.address.trim()) payload.address = form.address

  try {
    if (editing.value) {
      await update(editing.value.id, payload)
    } else {
      await create(payload)
    }
    showDialog.value = false
    await fetchData()
    toast.success(editing.value ? 'Store updated' : 'Store created')
  } catch (e: any) {
    formError.value = parseApiError(e)
  }
}

async function confirmDelete(id: string) {
  if (!confirm('Delete this store?')) return
  try {
    await remove(id)
    await fetchData()
    toast.success('Store deleted')
  } catch (e: any) {
    toast.error(parseApiError(e))
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Stores</h1>
        <p class="text-sm text-muted-foreground">Manage your store locations</p>
      </div>
      <Button @click="openCreate">
        <AppIcon name="lucide:plus" class="mr-2 h-4 w-4" />
        Add Store
      </Button>
    </div>

    <Card>
      <CardHeader class="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Store List</CardTitle>
          <CardDescription>{{ totalItems }} locations</CardDescription>
        </div>
      </CardHeader>
      <CardContent class="p-0">
        <div v-if="loading" class="flex items-center justify-center py-12">
          <AppIcon name="lucide:loader-circle" class="h-6 w-6 animate-spin text-muted-foreground" />
        </div>

        <template v-else-if="allData.length === 0">
          <div class="py-12 text-center text-sm text-muted-foreground">
            No stores yet. Click "Add Store" to create one.
          </div>
        </template>

        <template v-else>
          <table class="w-full">
            <thead>
              <tr class="border-b text-left text-xs font-medium text-muted-foreground">
                <th class="w-10 px-6 py-3">#</th>
                <th class="px-6 py-3">Name</th>
                <th class="px-6 py-3">Description</th>
                <th class="px-6 py-3">Address</th>
                <th class="px-6 py-3 text-right w-28">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in paginatedData"
                :key="item.id"
                class="border-b last:border-0 hover:bg-muted/50"
              >
                <td class="px-6 py-4 text-sm text-muted-foreground">{{ (page - 1) * perPage + index + 1 }}</td>
                <td class="px-6 py-4 text-sm font-medium">{{ item.name }}</td>
                <td class="px-6 py-4 text-sm text-muted-foreground">{{ item.description || '—' }}</td>
                <td class="px-6 py-4 text-sm text-muted-foreground">{{ item.address || '—' }}</td>
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
          <CardTitle>{{ editing ? 'Edit Store' : 'Add Store' }}</CardTitle>
          <CardDescription>{{ editing ? 'Update the store details' : 'Register a new store location' }}</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="store-name">Store Name</Label>
            <Input id="store-name" v-model="form.name" placeholder="e.g. TutaSnack Kemanggisan" />
          </div>
          <div class="space-y-2">
            <Label for="store-desc">Description <span class="text-muted-foreground">(optional)</span></Label>
            <Input id="store-desc" v-model="form.description" placeholder="e.g. Main branch" />
          </div>
          <div class="space-y-2">
            <Label for="store-addr">Address <span class="text-muted-foreground">(optional)</span></Label>
            <Input id="store-addr" v-model="form.address" placeholder="e.g. Jl. Kemanggisan No. 123" />
          </div>
          <div v-if="formError" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive whitespace-pre-line">
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
