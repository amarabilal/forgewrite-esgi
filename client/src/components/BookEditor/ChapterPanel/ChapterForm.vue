<template>
  <form @submit.prevent="submit">
    <input v-model="title" placeholder="Nouveau chapitre..." />
    <button type="submit">Ajouter</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits(['create'])
const title = ref('')

const submit = () => {
  if (!title.value.trim()) return
  emit('create', title.value)
  title.value = ''
}
</script>

<style scoped>
form {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}
input {
  flex: 1;
}
</style>
