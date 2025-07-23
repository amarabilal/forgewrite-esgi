<template>
  <nav class="navbar">
    <div class="nav-left">
      <RouterLink to="/" class="logo">ForgeWrite</RouterLink>
    </div>

    <div class="nav-right">
      <template v-if="isAuthenticated">
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <RouterLink v-if="isAdmin" to="/admin" class="admin-link">Admin</RouterLink>
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
  const isAdmin = computed(() => auth.user?.role === 'admin')

  const logout = async () => {
    await auth.logout()
  }
</script>
<style scoped>
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background-color: #3C68C2;
    border-bottom: 1px solid #FCF8ED;
  }
  
  .nav-right {
    display: flex;
    align-items: center;
  }
  .nav-left a,
  .nav-right a {
    margin: 0 1rem;
    text-decoration: none;
    color: #FCF8ED;
    font-weight: bold;
    transition: opacity 0.3s ease;
  }
  
  .logo {
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
  }
  
  .nav-left a:hover,
  .nav-right a:hover {
    opacity: 0.8;
  }
  
  .username {
    margin: 0 1rem;
    color: #FCF8ED;
    opacity: 0.8;
    text-decoration: none;
    cursor: pointer;
  }

  .admin-link {
    background: rgba(252, 248, 237, 0.1);
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
    border: 1px solid rgba(252, 248, 237, 0.3);
  }

  .admin-link:hover {
    background: rgba(252, 248, 237, 0.2);
  }

  button {
    background: transparent;
    border: 1px solid #FCF8ED;
    color: #FCF8ED;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  button:hover {
    background: #FCF8ED;
    color: #3C68C2;
  }
</style>