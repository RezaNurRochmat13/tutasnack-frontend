<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const { request } = useApi()

const totalExpense = ref(0)
const grossRevenue = ref(0)
const netRevenue = ref(0)
const netIncome = computed(() => grossRevenue.value - totalExpense.value)
const loading = ref(true)

const currentYear = new Date().getFullYear()
const selectedYear = ref(currentYear)
const years = computed(() => {
  const y = currentYear
  return [y - 2, y - 1, y, y + 1]
})

interface MonthlyRecap {
  year: number
  month: string
  total: number
}
const monthlyData = ref<MonthlyRecap[]>([])

async function fetchTotals() {
  const [expenseRes, revenueRes]: any[] = await Promise.all([
    request('/dashboard/total-expense', { method: 'GET' }),
    request('/dashboard/total-revenue', { method: 'GET' }),
  ])
  totalExpense.value = expenseRes.data?.total ?? expenseRes.total ?? 0
  const rd = revenueRes.data || revenueRes
  grossRevenue.value = rd.gross ?? 0
  netRevenue.value = rd.net ?? 0
}

async function fetchMonthlyRecap() {
  const res: any = await request(`/dashboard/monthly-recap?year=${selectedYear.value}`, { method: 'GET' })
  monthlyData.value = (res.data || res || []) as MonthlyRecap[]
}

async function fetchAll() {
  loading.value = true
  try {
    await Promise.all([fetchTotals(), fetchMonthlyRecap()])
  } catch (e: any) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

watch(selectedYear, fetchMonthlyRecap)

onMounted(fetchAll)

function monthName(m: string) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[parseInt(m, 10) - 1] || m
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <p class="text-sm text-muted-foreground">Overview of your business</p>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <AppIcon name="lucide:loader-circle" class="h-6 w-6 animate-spin text-muted-foreground" />
    </div>

    <template v-else>
      <div class="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium text-muted-foreground">Gross Revenue</CardTitle>
            <AppIcon name="lucide:trending-up" class="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-green-600">Rp {{ grossRevenue.toLocaleString() }}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium text-muted-foreground">Total Expense</CardTitle>
            <AppIcon name="lucide:wallet" class="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold text-destructive">Rp {{ totalExpense.toLocaleString() }}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="flex flex-row items-center justify-between pb-2">
            <CardTitle class="text-sm font-medium text-muted-foreground">Net Income</CardTitle>
            <AppIcon name="lucide:banknote" class="h-4 w-4" :class="netIncome >= 0 ? 'text-green-600' : 'text-destructive'" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold" :class="netIncome >= 0 ? 'text-green-600' : 'text-destructive'">
              Rp {{ netIncome.toLocaleString() }}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Monthly Recap</CardTitle>
            <CardDescription>Revenue recap by month</CardDescription>
          </div>
          <div class="flex items-center gap-2">
            <Label for="year-filter" class="text-sm">Year</Label>
            <select
              id="year-filter"
              v-model="selectedYear"
              class="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
        </CardHeader>
        <CardContent class="p-0">
          <div class="overflow-x-auto">
            <table class="w-full">
            <thead>
              <tr class="border-b text-left text-xs font-medium text-muted-foreground">
                <th class="w-10 px-6 py-3">#</th>
                <th class="px-6 py-3">Month</th>
                <th class="px-6 py-3 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in monthlyData"
                :key="`${item.year}-${item.month}`"
                class="border-b last:border-0 hover:bg-muted/50"
              >
                <td class="px-6 py-4 text-sm text-muted-foreground">{{ index + 1 }}</td>
                <td class="px-6 py-4 text-sm font-medium">{{ monthName(item.month) }} {{ item.year }}</td>
                <td class="px-6 py-4 text-sm text-right">Rp {{ item.total.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
          </div>

          <div v-if="monthlyData.length === 0" class="py-12 text-center text-sm text-muted-foreground">
            No data for {{ selectedYear }}
          </div>
        </CardContent>
      </Card>

      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent class="space-y-3">
            <Button variant="outline" class="w-full justify-start gap-3" @click="navigateTo('/sales-tracker')">
              <AppIcon name="lucide:plus-circle" class="h-5 w-5" />
              New Sale
            </Button>
            <Button variant="outline" class="w-full justify-start gap-3" @click="navigateTo('/expense-tracker')">
              <AppIcon name="lucide:minus-circle" class="h-5 w-5" />
              Add Expense
            </Button>
            <Button variant="outline" class="w-full justify-start gap-3" @click="navigateTo('/sales-income')">
              <AppIcon name="lucide:file-bar-chart" class="h-5 w-5" />
              View Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </template>
  </div>
</template>
