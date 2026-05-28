<script setup lang="ts">
import type { SalesTracker } from '~/types/sales-tracker'
import type { Store } from '~/types/store'

const props = defineProps<{
  modelValue: boolean
  editing: SalesTracker | null
  form: { salesDate: string; storeId: string; saleCount: number; soldCount: number }
  formError: string
  submitting: boolean
  stores: Store[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  save: []
}>()
</script>

<template>
  <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
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
        <div v-if="formError" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{{ formError }}</div>
        <div class="flex gap-2">
          <Button variant="outline" class="flex-1" @click="emit('update:modelValue', false)">Cancel</Button>
          <Button class="flex-1" :disabled="submitting" @click="emit('save')">
            <AppIcon v-if="submitting" name="lucide:loader-circle" class="mr-2 h-4 w-4 animate-spin" />
            {{ editing ? 'Update' : 'Save' }}
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
