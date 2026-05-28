<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth',
})

const users = ref([
  { id: 1, name: 'Admin', email: 'admin@tutasnack.com', role: 'Owner', status: 'active' as const },
  { id: 2, name: 'Rina Wijaya', email: 'rina@tutasnack.com', role: 'Cashier', status: 'active' as const },
  { id: 3, name: 'Dedi Kurniawan', email: 'dedi@tutasnack.com', role: 'Cashier', status: 'active' as const },
  { id: 4, name: 'Sari Dewi', email: 'sari@tutasnack.com', role: 'Staff', status: 'inactive' as const },
])

const showInviteDialog = ref(false)
const inviteEmail = ref('')
const inviteRole = ref('Cashier')

function inviteUser() {
  if (!inviteEmail.value) return
  users.value.push({
    id: Date.now(),
    name: inviteEmail.value.split('@')[0],
    email: inviteEmail.value,
    role: inviteRole.value,
    status: 'active' as const,
  })
  inviteEmail.value = ''
  showInviteDialog.value = false
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Management Users</h1>
        <p class="text-sm text-muted-foreground">Manage team members and their roles</p>
      </div>
      <Button @click="showInviteDialog = true">
        <Icon name="lucide:user-plus" class="mr-2 h-4 w-4" />
        Invite User
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>{{ users.length }} users in your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div
            v-for="user in users"
            :key="user.id"
            class="flex items-center justify-between rounded-lg border p-3"
          >
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {{ user.name.charAt(0) }}
              </div>
              <div class="space-y-0.5">
                <p class="text-sm font-medium">{{ user.name }}</p>
                <p class="text-xs text-muted-foreground">{{ user.email }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Badge variant="secondary">{{ user.role }}</Badge>
              <Badge :variant="user.status === 'active' ? 'success' : 'warning'">
                {{ user.status }}
              </Badge>
              <Button variant="ghost" size="icon">
                <Icon name="lucide:more-horizontal" class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <div v-if="showInviteDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card class="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Invite User</CardTitle>
          <CardDescription>Send an invitation to join your team</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="invite-email">Email Address</Label>
            <Input id="invite-email" v-model="inviteEmail" type="email" placeholder="user@example.com" />
          </div>
          <div class="space-y-2">
            <Label for="invite-role">Role</Label>
            <select
              id="invite-role"
              v-model="inviteRole"
              class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="Owner">Owner</option>
              <option value="Cashier">Cashier</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div class="flex gap-2">
            <Button variant="outline" class="flex-1" @click="showInviteDialog = false">
              Cancel
            </Button>
            <Button class="flex-1" @click="inviteUser">
              Send Invitation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
