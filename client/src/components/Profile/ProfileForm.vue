<template>
  <form @submit.prevent="save">
    <div class="header">
      <h2>
        Modifier le profil
      </h2>
      <img src="@/assets/icons/edit-ico.svg" alt="Edit" class="icon" />
    </div>
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
  padding: 24px;
}

h2 {
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  font-family: Hauora, sans-serif;
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

.icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 8px;
}
</style>