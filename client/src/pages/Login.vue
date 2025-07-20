<template>
  <div class="auth-container">
    <h1>Connexion 🔐</h1>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" required autocomplete="email" />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input id="password" v-model="password" type="password" required autocomplete="current-password" />
      </div>

      <div class="form-group" v-if="requires2FA">
        <label for="token2FA">Code 2FA</label>
        <input id="token2FA" v-model="token2FA" type="text" inputmode="numeric" required />
      </div>

      <button type="submit">
        {{ requires2FA ? 'Vérifier le code 2FA' : 'Se connecter' }}
      </button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const token2FA = ref('')
const error = ref('')
const requires2FA = ref(false)

const handleLogin = async () => {
  try {
    error.value = ''
    await auth.login({
      email: email.value,
      password: password.value,
      token2FA: token2FA.value || undefined,
    })
    router.push('/dashboard')
  } catch (err: any) {
    if (err.is2FARequired) {
      requires2FA.value = true
    } else {
      error.value = err.response?.data?.message || 'Erreur inconnue.'
    }
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
}
.form-group {
  margin-bottom: 1rem;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
