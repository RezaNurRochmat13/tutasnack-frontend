<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const category = ref('')
const description = ref('')
const amount = ref(0)
const date = ref(new Date().toISOString().split('T')[0])

const expenses = ref([
  { id: 1, category: 'Ingredients', description: 'Flour 25kg', amount: 180000, date: '2026-05-27' },
  { id: 2, category: 'Packaging', description: 'Paper bags + labels', amount: 95000, date: '2026-05-27' },
  { id: 3, category: 'Utilities', description: 'Electricity bill', amount: 350000, date: '2026-05-26' },
  { id: 4, category: 'Maintenance', description: 'Fryer repair', amount: 150000, date: '2026-05-25' },
])

const totalExpenses = computed(() => {
  return expenses.value.reduce((sum, e) => sum + e.amount, 0)
})

async function addExpense() {
  if (!description.value || !amount.value) return
  expenses.value.unshift({
    id: Date.now(),
    category: category.value || 'Other',
    description: description.value,
    amount: amount.value,
    date: date.value,
  })
  description.value = ''
  amount.value = 0
  category.value = ''
}

const expenseCategories = ['Ingredients', 'Packaging', 'Utilities', 'Maintenance', 'Rent', 'Salary', 'Marketing', 'Other']
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Expense Tracker</h1>
      <p class="text-sm text-muted-foreground">Monitor and manage your business expenses</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add Expense</CardTitle>
          <CardDescription>Record a new expense</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="exp-category">Category</Label>
            <select
              id="exp-category"
              v-model="category"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="" disabled>Select category</option>
              <option v-for="cat in expenseCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <Label for="exp-desc">Description</Label>
            <Input id="exp-desc" v-model="description" placeholder="What was this expense for?" />
          </div>
          <div class="space-y-2">
            <Label for="exp-amount">Amount (Rp)</Label>
            <Input id="exp-amount" v-model.number="amount" type="number" min="0" placeholder="0" />
          </div>
          <div class="space-y-2">
            <Label for="exp-date">Date</Label>
            <Input id="exp-date" v-model="date" type="date" />
          </div>
          <Button class="w-full" @click="addExpense">
            <AppIcon name="lucide:plus-circle" class="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expense History</CardTitle>
          <CardDescription>Total: Rp {{ totalExpenses.toLocaleString() }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <div
              v-for="expense in expenses"
              :key="expense.id"
              class="flex items-center justify-between rounded-lg border p-3"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <Badge>{{ expense.category }}</Badge>
                  <span class="text-xs text-muted-foreground">{{ expense.date }}</span>
                </div>
                <p class="text-sm font-medium">{{ expense.description }}</p>
              </div>
              <p class="text-sm font-semibold text-destructive">
                -Rp {{ expense.amount.toLocaleString() }}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
