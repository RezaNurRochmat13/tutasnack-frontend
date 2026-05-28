<script setup lang="ts">
const store = useAuthStore()
const colorMode = useColorMode()
const sidebarOpen = ref(false)

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="min-h-screen">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="lg:pl-64">
      <header class="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background px-4 md:px-6">
        <button class="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent lg:hidden" @click="sidebarOpen = true">
          <AppIcon name="lucide:menu" class="h-5 w-5" />
        </button>

        <div class="ml-auto flex items-center gap-4">
          <button class="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent" @click="toggleTheme">
            <AppIcon :name="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'" class="h-5 w-5" />
          </button>
          <div class="flex items-center gap-3">
            <AppIcon name="lucide:bell" class="h-5 w-5 text-muted-foreground" />
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {{ store.user?.name?.charAt(0) || 'U' }}
            </div>
          </div>
        </div>
      </header>

      <main class="p-4 md:p-6">
        <slot />
      </main>
    </div>

    <ToastDisplay />
  </div>
</template>
