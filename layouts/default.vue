<script setup lang="ts">
const store = useAuthStore()
const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="min-h-screen">
    <AppSidebar />

    <div class="pl-64">
      <header class="sticky top-0 z-30 flex h-16 items-center justify-end gap-4 border-b border-border bg-background px-6">
        <button
          class="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent"
          @click="toggleTheme"
        >
          <AppIcon
            :name="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'"
            class="h-5 w-5"
          />
        </button>
        <div class="flex items-center gap-3">
          <AppIcon name="lucide:bell" class="h-5 w-5 text-muted-foreground" />
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
            {{ store.user?.name?.charAt(0) || 'U' }}
          </div>
        </div>
      </header>

      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
