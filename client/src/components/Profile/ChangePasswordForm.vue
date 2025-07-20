<template>
  <form @submit.prevent="changePassword">
    <div class="header">
      <h2>
        Changer le mot de passe
      </h2>
      <img src="@/assets/icons/edit-ico.svg" alt="Edit" class="icon" />
    </div>
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
form {
  padding: 24px;
}

h2 {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.header {
  font-family: Hauora, sans-serif;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  font-family: Hauora, sans-serif;
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

input {
  width: 100%;
  padding: 12px 16px;
  background: #E9E7E8;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #3C68C2;
}

button {
  background: #3C68C2;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #2E5AB8;
}

.success {
  color: #28a745;
  background: #d4edda;
  border: 1px solid #c3e6cb;
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 16px;
}

.error {
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 16px;
}

.icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 8px;
}
</style>