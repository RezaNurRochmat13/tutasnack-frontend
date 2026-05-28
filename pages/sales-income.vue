<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

const periods = ['Today', 'This Week', 'This Month', 'Custom']
const selectedPeriod = ref('This Month')

const incomeData = [
  { date: '01 May', amount: 450000, orders: 12 },
  { date: '02 May', amount: 520000, orders: 15 },
  { date: '03 May', amount: 380000, orders: 10 },
  { date: '04 May', amount: 610000, orders: 18 },
  { date: '05 May', amount: 490000, orders: 14 },
  { date: '06 May', amount: 550000, orders: 16 },
  { date: '07 May', amount: 720000, orders: 20 },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Sales Income</h1>
        <p class="text-sm text-muted-foreground">Track your revenue and earnings</p>
      </div>
      <div class="flex gap-2">
        <Button
          v-for="period in periods"
          :key="period"
          :variant="selectedPeriod === period ? 'default' : 'outline'"
          size="sm"
          @click="selectedPeriod = period"
        >
          {{ period }}
        </Button>
      </div>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Income Overview</CardTitle>
        <CardDescription>Daily revenue for {{ selectedPeriod.toLowerCase() }}</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div
            v-for="item in incomeData"
            :key="item.date"
            class="flex items-center justify-between rounded-lg border p-3"
          >
            <div class="text-sm font-medium">{{ item.date }}</div>
            <div class="flex items-center gap-6">
              <div class="text-sm text-muted-foreground">{{ item.orders }} orders</div>
              <div class="text-sm font-semibold">Rp {{ item.amount.toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
