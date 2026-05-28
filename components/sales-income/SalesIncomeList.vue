<script setup lang="ts">
import type { SalesIncome } from '~/types/sales-income'

defineProps<{
  items: SalesIncome[]
  loading: boolean
  page: number
  perPage: number
  totalPages: number
  totalItems: number
}>()

const emit = defineEmits<{
  edit: [item: SalesIncome]
  delete: [id: string]
  goToPage: [page: number]
}>()
</script>

<template>
  <CardContent class="p-0">
    <div v-if="loading" class="flex items-center justify-center py-12">
      <AppIcon name="lucide:loader-circle" class="h-6 w-6 animate-spin text-muted-foreground" />
    </div>

    <template v-else-if="items.length === 0">
      <div class="py-12 text-center text-sm text-muted-foreground">
        No income entries yet. Click "Add Income" to create one.
      </div>
    </template>

    <template v-else>
      <div class="overflow-x-auto">
        <table class="w-full">
        <thead>
          <tr class="border-b text-left text-xs font-medium text-muted-foreground">
            <th class="w-10 px-6 py-3">#</th>
            <th class="px-6 py-3">Store</th>
            <th class="px-6 py-3">Date</th>
            <th class="px-6 py-3 text-right">Amount</th>
            <th class="px-6 py-3 text-right w-28">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in items"
            :key="item.id"
            class="border-b last:border-0 hover:bg-muted/50"
          >
            <td class="px-6 py-4 text-sm text-muted-foreground">{{ (page - 1) * perPage + index + 1 }}</td>
            <td class="px-6 py-4 text-sm">{{ item.store?.name || '-' }}</td>
            <td class="px-6 py-4 text-sm">{{ (item.salesDate as string).split('T')[0] }}</td>
            <td class="px-6 py-4 text-sm text-right font-medium">Rp {{ item.amount.toLocaleString() }}</td>
            <td class="px-6 py-4 text-right">
              <div class="flex justify-end gap-1">
                <Button variant="ghost" size="icon" @click="emit('edit', item)">
                  <AppIcon name="lucide:pencil" class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" class="text-destructive hover:text-destructive" @click="emit('delete', item.id)">
                  <AppIcon name="lucide:trash-2" class="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      </div>

      <div v-if="totalPages > 1" class="flex flex-col gap-2 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-muted-foreground">Page {{ page }} of {{ totalPages }}</p>
        <div class="flex flex-wrap gap-1">
          <Button variant="outline" size="sm" :disabled="page <= 1" @click="emit('goToPage', page - 1)">
            <AppIcon name="lucide:chevron-left" class="h-4 w-4" />
            Prev
          </Button>
          <div class="hidden gap-1 sm:flex">
            <Button
              v-for="p in totalPages"
              :key="p"
              :variant="p === page ? 'default' : 'outline'"
              size="sm"
              @click="emit('goToPage', p)"
            >
              {{ p }}
            </Button>
          </div>
          <Button variant="outline" size="sm" :disabled="page >= totalPages" @click="emit('goToPage', page + 1)">
            Next
            <AppIcon name="lucide:chevron-right" class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </template>
  </CardContent>
</template>
