<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const stats = [
  { label: 'Total Sales Today', value: 'Rp 2.450.000', icon: 'trending-up', change: '+12.5%', variant: 'success' as const },
  { label: 'Total Expenses', value: 'Rp 890.000', icon: 'wallet', change: '-3.2%', variant: 'warning' as const },
  { label: 'Net Income', value: 'Rp 1.560.000', icon: 'banknote', change: '+8.7%', variant: 'success' as const },
  { label: 'Orders Today', value: '47', icon: 'shopping-cart', change: '+5', variant: 'default' as const },
]

const recentTransactions = [
  { id: 1, customer: 'Budi Santoso', item: 'Nasi Goreng + Es Teh', amount: 45000, status: 'completed' as const },
  { id: 2, customer: 'Siti Rahayu', item: 'Mie Ayam + Jus Jeruk', amount: 35000, status: 'completed' as const },
  { id: 3, customer: 'Ahmad Rizki', item: 'Ayam Bakar + Es Campur', amount: 55000, status: 'pending' as const },
  { id: 4, customer: 'Dewi Lestari', item: 'Sate Ayam + Es Teh', amount: 40000, status: 'completed' as const },
]
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-sm text-muted-foreground">Overview of your snack business today</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card v-for="stat in stats" :key="stat.label">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            {{ stat.label }}
          </CardTitle>
          <Icon :name="`lucide:${stat.icon}`" class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stat.value }}</div>
          <p class="mt-1 text-xs">
            <span :class="stat.variant === 'success' ? 'text-green-600 dark:text-green-400' : stat.variant === 'warning' ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted-foreground'">
              {{ stat.change }}
            </span>
            <span class="text-muted-foreground"> from yesterday</span>
          </p>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <Card class="col-span-1">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest orders from today</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div
              v-for="tx in recentTransactions"
              :key="tx.id"
              class="flex items-center justify-between rounded-lg border p-3"
            >
              <div class="space-y-1">
                <p class="text-sm font-medium">{{ tx.customer }}</p>
                <p class="text-xs text-muted-foreground">{{ tx.item }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium">Rp {{ tx.amount.toLocaleString() }}</p>
                <Badge :variant="tx.status === 'completed' ? 'success' : 'warning'" class="mt-1">
                  {{ tx.status }}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card class="col-span-1">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks</CardDescription>
        </CardHeader>
        <CardContent class="space-y-3">
          <Button variant="outline" class="w-full justify-start gap-3" @click="navigateTo('/sales-tracker')">
            <Icon name="lucide:plus-circle" class="h-5 w-5" />
            New Sale
          </Button>
          <Button variant="outline" class="w-full justify-start gap-3" @click="navigateTo('/expense-tracker')">
            <Icon name="lucide:minus-circle" class="h-5 w-5" />
            Add Expense
          </Button>
          <Button variant="outline" class="w-full justify-start gap-3" @click="navigateTo('/sales-income')">
            <Icon name="lucide:file-bar-chart" class="h-5 w-5" />
            View Reports
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
