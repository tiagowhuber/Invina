<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'

const router = useRouter()
const adminStore = useAdminStore()

const password = ref('')
const error = ref('')

const handleLogin = () => {
  error.value = ''
  
  if (adminStore.login(password.value)) {
    router.push('/admin')
  } else {
    error.value = 'Invalid password. Try "admin123"'
    password.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl text-center">Admin Login</CardTitle>
        <p class="text-sm text-center text-muted-foreground mt-2">
          Enter password to access admin panel
        </p>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <Label for="password">Password</Label>
            <Input 
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter admin password"
              class="mt-1"
              autofocus
            />
          </div>

          <div v-if="error" class="p-3 bg-destructive/10 text-destructive text-sm rounded">
            {{ error }}
          </div>

          <Button 
            type="submit"
            :disabled="!password"
            class="w-full"
          >
            Login
          </Button>

          <div class="text-center">
            <router-link 
              to="/" 
              class="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to Events
            </router-link>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
