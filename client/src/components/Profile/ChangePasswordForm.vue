<template>
    <form @submit.prevent="changePassword">
      <h2>🔐 Changer le mot de passe</h2>
      <div class="form-group">
        <label>Mot de passe actuel</label>
        <input v-model="currentPassword" type="password" required />
      </div>
      <div class="form-group">
        <label>Nouveau mot de passe</label>
        <input v-model="newPassword" type="password" required />
      </div>
      <button type="submit">Changer</button>
      <p v-if="message" :class="{ success: success, error: !success }">{{ message }}</p>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import api from '@/services/api'
  
  const currentPassword = ref('')
  const newPassword = ref('')
  const message = ref('')
  const success = ref(false)
  
  const changePassword = async () => {
    try {
      await api.put('/users/me/password', {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      })
      success.value = true
      message.value = 'Mot de passe mis à jour.'
    } catch (err) {
      success.value = false
      message.value = 'Erreur lors du changement de mot de passe.'
    }
  }
  </script>
  
  <style scoped>
  .success {
    color: green;
  }
  .error {
    color: red;
  }
  </style>
  