<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const email = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  // TODO: implement login logic
  await navigateTo('/dashboard')
  loading.value = false
}
</script>

<template>
  <Card class="w-full max-w-md mx-4">
    <CardHeader class="text-center">
      <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
        <Icon name="lucide:ice-cream" class="h-7 w-7 text-primary-foreground" />
      </div>
      <CardTitle class="text-2xl">Welcome Back</CardTitle>
      <CardDescription>Sign in to your TutaSnack account</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="space-y-4" @submit.prevent="handleLogin">
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input id="email" v-model="email" type="email" placeholder="admin@tutasnack.com" />
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Label for="password">Password</Label>
            <NuxtLink to="#" class="text-xs text-muted-foreground hover:text-primary">
              Forgot password?
            </NuxtLink>
          </div>
          <Input id="password" v-model="password" type="password" placeholder="••••••••" />
        </div>
        <Button type="submit" class="w-full" :disabled="loading">
          <Icon v-if="loading" name="lucide:loader-circle" class="mr-2 h-4 w-4 animate-spin" />
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </Button>
      </form>
    </CardContent>
    <CardFooter class="justify-center">
      <p class="text-sm text-muted-foreground">
        Don't have an account?
        <NuxtLink to="/register" class="font-medium text-primary hover:underline">
          Sign Up
        </NuxtLink>
      </p>
    </CardFooter>
  </Card>
</template>
