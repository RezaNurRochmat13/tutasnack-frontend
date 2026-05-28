<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

interface SaleItem {
  name: string
  qty: number
  price: number
}

const customerName = ref('')
const items = ref<SaleItem[]>([{ name: '', qty: 1, price: 0 }])
const paymentMethod = ref('cash')

const total = computed(() => {
  return items.value.reduce((sum, item) => sum + item.price * item.qty, 0)
})

function addItem() {
  items.value.push({ name: '', qty: 1, price: 0 })
}

function removeItem(index: number) {
  if (items.value.length > 1) {
    items.value.splice(index, 1)
  }
}

async function submitSale() {
  // TODO: submit sale to API
  await navigateTo('/dashboard')
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Sales Tracker</h1>
      <p class="text-sm text-muted-foreground">Record new sales transactions</p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>New Sale</CardTitle>
        <CardDescription>Enter the sale details below</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="customer">Customer Name</Label>
          <Input id="customer" v-model="customerName" placeholder="Walk-in Customer" />
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <Label>Items</Label>
            <Button variant="outline" size="sm" @click="addItem">
              <AppIcon name="lucide:plus" class="mr-1 h-4 w-4" />
              Add Item
            </Button>
          </div>

          <div
            v-for="(item, index) in items"
            :key="index"
            class="flex items-end gap-2 rounded-lg border p-3"
          >
            <div class="flex-1 space-y-1">
              <Label :for="`item-name-${index}`">Item</Label>
              <Input
                :id="`item-name-${index}`"
                v-model="item.name"
                placeholder="Item name"
              />
            </div>
            <div class="w-20 space-y-1">
              <Label :for="`item-qty-${index}`">Qty</Label>
              <Input
                :id="`item-qty-${index}`"
                v-model.number="item.qty"
                type="number"
                min="1"
              />
            </div>
            <div class="w-28 space-y-1">
              <Label :for="`item-price-${index}`">Price</Label>
              <Input
                :id="`item-price-${index}`"
                v-model.number="item.price"
                type="number"
                min="0"
                placeholder="0"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              class="mb-0.5"
              @click="removeItem(index)"
            >
              <AppIcon name="lucide:x" class="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div class="space-y-2">
          <Label for="payment">Payment Method</Label>
          <select
            id="payment"
            v-model="paymentMethod"
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="cash">Cash</option>
            <option value="qris">QRIS</option>
            <option value="transfer">Bank Transfer</option>
          </select>
        </div>

        <div class="rounded-lg bg-muted p-4">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Total</span>
            <span class="text-xl font-bold">Rp {{ total.toLocaleString() }}</span>
          </div>
        </div>

        <Button class="w-full" @click="submitSale">
          <AppIcon name="lucide:check" class="mr-2 h-4 w-4" />
          Complete Sale
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
