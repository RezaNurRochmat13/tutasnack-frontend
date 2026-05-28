<script setup lang="ts">
import type { SalesIncome } from '~/types/sales-income'
import type { Store } from '~/types/store'

const props = defineProps<{
  modelValue: boolean
  editing: SalesIncome | null
  form: { salesDate: string; amount: number; storeId: string }
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
