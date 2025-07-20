<template>
  <div class="auth-container">
    <h1>Créer un compte 📝</h1>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" required />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input id="password" v-model="password" type="password" required />
      </div>

      <button type="submit">S’inscrire</button>
    </form>

    <p v-if="success" class="success">{{ success }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const router = useRouter()

const handleRegister = async () => {
  try {
    error.value = ''
    success.value = ''

    const res = await api.post('/auth/register', {
      email: email.value,
      password: password.value
    })

    success.value = res.data.message
    router.push('/login')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erreur inconnue.'
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
  padding: 2rem;
}

.success {
  color: green;
  margin-top: 1rem;
}

.error {
  color: red;
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
