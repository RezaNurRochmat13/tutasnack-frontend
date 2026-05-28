<script setup lang="ts">
import type { Expense } from '~/types/expense'

const props = defineProps<{
  modelValue: boolean
  editing: Expense | null
  form: { name: string; expenseDate: string; amount: number }
  formError: string
  submitting: boolean
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
        <CardTitle>{{ editing ? 'Edit Expense' : 'Add Expense' }}</CardTitle>
        <CardDescription>{{ editing ? 'Update the expense' : 'Record a new expense' }}</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="exp-name">Name</Label>
          <Input id="exp-name" v-model="form.name" placeholder="e.g. Electricity bill" />
        </div>
        <div class="space-y-2">
          <Label for="exp-date">Date</Label>
          <Input id="exp-date" v-model="form.expenseDate" type="date" />
        </div>
        <div class="space-y-2">
          <Label for="exp-amount">Amount (Rp)</Label>
          <Input id="exp-amount" v-model.number="form.amount" type="number" min="0" placeholder="0" />
        </div>
        <div v-if="formError" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive whitespace-pre-line">{{ formError }}</div>
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
