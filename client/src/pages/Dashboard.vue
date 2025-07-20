<template>
  <div class="dashboard">
    <h1>📚 Mes projets</h1>

    <button @click="goToCreate" class="create-btn">➕ Nouveau livre</button>

    <select v-model="selectedStatus" class="status-filter">
      <option value="all">🔁 Tous les livres</option>
      <option value="en cours">🟢 En cours</option>
      <option value="en pause">🟡 En pause</option>
      <option value="terminé">✅ Terminé</option>
      <option value="abandonné">❌ Abandonné</option>
      <option value="brouillon">📝 Brouillon</option>
    </select>

    <div v-if="filteredBooks.length > 0" class="counter">
      📘 {{ filteredBooks.length }} livre(s) affiché(s)
    </div>

    <div v-else class="empty">
      Aucun livre à afficher pour ce statut.
    </div>

    <ul class="book-list" v-if="filteredBooks.length > 0">
      <li
        v-for="book in filteredBooks"
        :key="book.id"
        @click="goToBook(book.id)"
        class="book-item"
      >
        <div class="book-header">
          <h2>{{ book.title }}</h2>

          <span class="status-badge" :class="book.status">
            {{ book.status }}
          </span>

          <div class="actions">
            <button @click.stop="openEdit(book)">🖊️</button>
            <button @click.stop="confirmDelete(book.id)">🗑️</button>
          </div>
        </div>

        <p>{{ book.genre || 'Genre non défini' }}</p>
        <small>Créé le {{ new Date(book.created_at).toLocaleDateString() }}</small>

        <div v-if="editingBook === book.id" class="edit-form" @click.stop>
          <input v-model="edited.title" placeholder="Titre" />
          <input v-model="edited.genre" placeholder="Genre" />
          <textarea v-model="edited.description" placeholder="Description" />

          <select v-model="edited.status">
            <option value="en cours">🟢 En cours</option>
            <option value="en pause">🟡 En pause</option>
            <option value="terminé">✅ Terminé</option>
            <option value="abandonné">❌ Abandonné</option>
            <option value="brouillon">📝 Brouillon</option>
          </select>

          <div class="edit-actions">
            <button @click="saveEdit(book.id)">💾 Enregistrer</button>
            <button @click="cancelEdit">Annuler</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
interface Book {
  id: number
  title: string
  genre?: string
  description?: string
  status: string
  created_at: string
}


const books = ref<Book[]>([])
const editingBook = ref<number | null>(null)
const edited = ref({ title: '', genre: '', description: '', status: '' })

const router = useRouter()
const auth = useAuthStore()

const selectedStatus = ref('all')

onMounted(() => {
  if (!auth.token) {
    router.push('/login')
  } else {
    fetchBooks()
  }
})

const fetchBooks = async () => {
  try {
    const res = await api.get('/books')
    books.value = res.data.data
  } catch (error) {
    console.error('Erreur chargement livres', error)
  }
}

const goToCreate = () => {
  router.push('/books/new')
}

const goToBook = (id: number) => {
  router.push(`/books/${id}`)
}

const openEdit = (book: any) => {
  editingBook.value = book.id
  edited.value = {
    title: book.title,
    genre: book.genre,
    description: book.description,
    status: book.status
  }
}

const cancelEdit = () => {
  editingBook.value = null
  edited.value = { title: '', genre: '', description: '', status: '' }
}

const saveEdit = async (id: number) => {
  try {
    await api.put(`/books/${id}`, edited.value)
    await fetchBooks()
    cancelEdit()
  } catch (err) {
    console.error('Erreur modification', err)
  }
}

const confirmDelete = async (id: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
    try {
      await api.delete(`/books/${id}`)
      await fetchBooks()
    } catch (err) {
      console.error('Erreur suppression', err)
    }
  }
}

const filteredBooks = computed(() => {
  if (selectedStatus.value === 'all') return books.value
  return books.value.filter(book => book.status === selectedStatus.value)
})
</script>

<style scoped>
.dashboard {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
}

.create-btn {
  margin-bottom: 1rem;
}

.status-filter {
  font-size: 0.9rem;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}

.counter {
  margin-bottom: 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
}

.book-list li {
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s ease;
  position: relative;
}

.book-list li:hover {
  background: #f8f8f8;
}

.book-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.actions button {
  background: none;
  border: none;
  margin-left: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
}

.edit-form {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  text-transform: lowercase;
  font-weight: bold;
  color: white;
}

.status-badge.en\ cours {
  background-color: green;
}
.status-badge.en\ pause {
  background-color: goldenrod;
}
.status-badge.terminé {
  background-color: #444;
}
.status-badge.abandonné {
  background-color: crimson;
}
.status-badge.brouillon {
  background-color: steelblue;
}
</style>
