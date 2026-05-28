export default defineNuxtPlugin(() => {
  const store = useAuthStore()
  store.loadSession()
})
