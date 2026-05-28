<script setup lang="ts">
const store = useAuthStore()
const { navItems } = useNavigation()
const { logout } = useAuth()
const toast = useToast()
const route = useRoute()

function isActive(item: { to: string }) {
  return route.path === item.to
}

function handleLogout() {
  toast.info('Logged out')
  logout()
}
</script>

<template>
  <aside class="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
    <div class="flex h-16 items-center gap-3 border-b border-sidebar-muted px-6">
      <img src="/img/tuta-snack-white.png" alt="TutaSnack" class="h-8 w-auto" />
      <span class="text-lg font-bold text-sidebar-foreground">TutaSnack</span>
    </div>

    <nav class="flex flex-col gap-1 p-4">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
        :class="isActive(item)
          ? 'bg-sidebar-accent text-sidebar-foreground'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-muted hover:text-sidebar-foreground'"
      >
        <AppIcon :name="`lucide:${item.icon}`" class="h-5 w-5" />
        <span>{{ item.label }}</span>
        <span
          v-if="item.badge"
          class="ml-auto rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground"
        >
          {{ item.badge }}
        </span>
      </NuxtLink>
    </nav>

    <div class="absolute bottom-0 left-0 right-0 border-t border-sidebar-muted p-4">
      <div class="flex items-center gap-3 rounded-lg px-3 py-2.5">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-muted">
          <AppIcon name="lucide:user" class="h-4 w-4 text-sidebar-foreground" />
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-medium text-sidebar-foreground">{{ store.user?.name || 'User' }}</span>
          <span class="text-xs text-sidebar-foreground/60">{{ store.user?.email || '' }}</span>
        </div>
        <button class="ml-auto text-sidebar-foreground/60 hover:text-sidebar-foreground" @click="handleLogout">
          <AppIcon name="lucide:log-out" class="h-5 w-5" />
        </button>
      </div>
    </div>
  </aside>
</template>
