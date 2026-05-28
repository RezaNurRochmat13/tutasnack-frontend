<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const store = useAuthStore()
const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')

async function handleRegister() {
  error.value = ''

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  try {
    await register({ name: name.value, email: email.value, password: password.value })
  } catch (e: any) {
    error.value = e.message
  }
}
</script>

<template>
  <Card class="w-full max-w-md mx-4">
    <CardHeader class="text-center">
      <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary p-2">
        <img src="/img/tuta-snack-white.png" alt="TutaSnack" class="h-full w-full object-contain" />
      </div>
      <CardTitle class="text-2xl">Create Account</CardTitle>
      <CardDescription>Register your TutaSnack account</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="space-y-4" @submit.prevent="handleRegister">
        <div class="space-y-2">
          <Label for="name">Full Name</Label>
          <Input id="name" v-model="name" placeholder="John Doe" />
        </div>
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input id="email" v-model="email" type="email" placeholder="john@example.com" />
        </div>
        <div class="space-y-2">
          <Label for="password">Password</Label>
          <Input id="password" v-model="password" type="password" placeholder="••••••••" />
        </div>
        <div class="space-y-2">
          <Label for="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" v-model="confirmPassword" type="password" placeholder="••••••••" />
        </div>
        <div v-if="error" class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {{ error }}
        </div>
        <Button type="submit" class="w-full" :disabled="store.loading">
          <AppIcon v-if="store.loading" name="lucide:loader-circle" class="mr-2 h-4 w-4 animate-spin" />
          {{ store.loading ? 'Creating account...' : 'Create Account' }}
        </Button>
      </form>
    </CardContent>
    <CardFooter class="justify-center">
      <p class="text-sm text-muted-foreground">
        Already have an account?
        <NuxtLink to="/login" class="font-medium text-primary hover:underline">
          Sign In
        </NuxtLink>
      </p>
    </CardFooter>
  </Card>
</template>
