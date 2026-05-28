export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.client) {
    const token = localStorage.getItem('auth_token')
    if (!token && to.path !== '/login' && to.path !== '/register') {
      return navigateTo('/login')
    }
  }
})
