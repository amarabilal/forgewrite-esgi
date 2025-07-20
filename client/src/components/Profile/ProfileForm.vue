<template>
    <form @submit.prevent="save">
      <h2>📝 Modifier le profil</h2>
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>
      <button type="submit">Enregistrer</button>
      <p v-if="message" class="success">{{ message }}</p>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useAuthStore } from '@/store/authStore'
  import api from '@/services/api'
  
  const auth = useAuthStore()
  const email = ref(auth.user?.email || '')
  const message = ref('')
  
  const save = async () => {
    try {
      await api.put('/users/me', { email: email.value })
      message.value = 'Email mis à jour avec succès.'
      await auth.fetchMe()
    } catch (err) {
      message.value = 'Erreur lors de la mise à jour.'
    }
  }
  </script>
  
  <style scoped>
  form {
    margin-bottom: 2rem;
  }
  .success {
    color: green;
    margin-top: 0.5rem;
  }
  </style>
  