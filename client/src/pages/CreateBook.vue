<template>
  <div class="create-book">
    <h1>➕ Nouveau projet</h1>
    <form @submit.prevent="createBook">
      <div class="form-group">
        <label for="title">Titre</label>
        <input v-model="title" id="title" required />
      </div>

      <div class="form-group">
        <label for="genre">Genre</label>
        <input v-model="genre" id="genre" />
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea v-model="description" id="description" rows="3" />
      </div>

      <button type="submit">Créer</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const title = ref('')
const genre = ref('')
const description = ref('')
const error = ref('')

const router = useRouter()

const createBook = async () => {
  try {
    const res = await api.post('/books', {
      title: title.value,
      genre: genre.value,
      description: description.value
    })

    const bookId = res.data.data?.id || res.data.id

    await api.post('/chapters', {
      book_id: bookId,
      title: 'Chapitre 1',
      content: '',
      order_index: 0
    })

    router.push(`/books/${bookId}`)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erreur création du livre.'
  }
}
</script>

<style scoped>
.create-book {
  max-width: 600px;
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
