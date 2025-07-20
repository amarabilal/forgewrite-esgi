<template>
  <nav class="navbar">
    <div class="nav-left">
      <RouterLink to="/">📝 ForgeWrite</RouterLink>
    </div>

    <div class="nav-right">
      <template v-if="isAuthenticated">
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <RouterLink to="/profile" class="username">{{ user?.email }}</RouterLink>
        <button @click="logout">Se déconnecter</button>
      </template>

      <template v-else>
        <RouterLink to="/login">Connexion</RouterLink>
        <RouterLink to="/register">Inscription</RouterLink>
      </template>
    </div>
  </nav>
</template>
<script setup lang="ts">
  import { RouterLink, useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/authStore'
  import { computed } from 'vue'

  const router = useRouter()
  const auth = useAuthStore()

  const isAuthenticated = computed(() => !!auth.token)
  const user = computed(() => auth.user)

  const logout = async () => {
    await auth.logout()
  }
</script>
<style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    padding: 1rem 2rem;
    background-color: #f4f1ec;
    border-bottom: 1px solid #ccc;
  }
  .nav-left a,
  .nav-right a {
    margin: 0 1rem;
    text-decoration: none;
    color: #5a3e2b;
    font-weight: bold;
  }
  .username {
    margin: 0 1rem;
    color: #999;
    text-decoration: none;
    cursor: pointer;
  }

  button {
    background: transparent;
    border: none;
    color: #a03c3c;
    cursor: pointer;
  }
</style>