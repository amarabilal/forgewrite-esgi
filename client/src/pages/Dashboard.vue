<template>
  <div class="dashboard">
    <h1>📚 Mes projets</h1>

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

    <div v-else-if="selectedStatus !== 'all'" class="empty">
      Aucun livre à afficher pour ce statut.
    </div>

    <div class="dashboard-content">
      <!-- Left sidebar for Add New Book -->
      <div class="sidebar-left">
        <AddBookCard @add-book="goToCreate" />
      </div>
      
      <!-- Right section for existing books -->
      <div class="books-section">
        <div class="books-grid">
          <BookCard 
            v-for="book in filteredBooks"
            :key="book.id"
            :book="book"
            @open-book="goToBook(book.id)"
            @edit-book="goToBook(book.id)"
            @edit-details="openEdit(book)"
            @delete-book="confirmDelete(book.id)"
          />
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editingBook" class="edit-modal" @click.self="cancelEdit">
      <div class="edit-form">
        <h3>Modifier le livre</h3>
        <input v-model="edited.title" placeholder="Titre" />
        <input v-model="edited.genre" placeholder="Genre" />
        <textarea v-model="edited.description" placeholder="Description" rows="4"></textarea>

        <select v-model="edited.status">
          <option value="en cours">🟢 En cours</option>
          <option value="en pause">🟡 En pause</option>
          <option value="terminé">✅ Terminé</option>
          <option value="abandonné">❌ Abandonné</option>
          <option value="brouillon">📝 Brouillon</option>
        </select>

        <div class="edit-actions">
          <button @click="saveEdit(editingBook)" class="save-btn">💾 Enregistrer</button>
          <button @click="cancelEdit" class="cancel-btn">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import BookCard from '@/components/BookCard.vue'
import AddBookCard from '@/components/AddBookCard.vue'

interface Book {
  id: number
  title: string
  genre?: string
  description?: string
  status: string
  created_at: string
}

const books = ref<Book[]>([])
const editingBook = ref<Book | null>(null)
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

const openEdit = (book: Book) => {
  editingBook.value = book
  edited.value = {
    title: book.title,
    genre: book.genre || '',
    description: book.description || '',
    status: book.status
  }
}

const cancelEdit = () => {
  editingBook.value = null
  edited.value = { title: '', genre: '', description: '', status: '' }
}

const saveEdit = async (book: Book) => {
  try {
    await api.put(`/books/${book.id}`, edited.value)
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
  padding-top: 100px;
  padding-bottom: 50px;
  width: 100%;
  max-width: 100%;
  margin: 0;
  background-color: #FCF8ED;
  min-height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;
}

.dashboard h1 {
  color: #004687;
  margin-bottom: 30px;
  text-align: center;
  font-size: 2.5rem;
}

.status-filter {
  padding: 10px 15px;
  margin-bottom: 30px;
  border: 2px solid #3C68C2;
  border-radius: 8px;
  background: white;
  color: #004687;
  font-size: 16px;
  cursor: pointer;
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 300px;
  font-weight: 500;
}

.status-filter:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(60, 104, 194, 0.2);
}

.counter {
  text-align: center;
  margin-bottom: 30px;
  color: #004687;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 15px;
  border-radius: 8px;
}

.empty {
  text-align: center;
  color: #004687;
  font-style: italic;
  padding: 40px 20px;
  background: white;
  border: 2px dashed #3C68C2;
  border-radius: 12px;
  font-size: 1.2rem;
}

.dashboard-content {
  display: flex;
  gap: 20px;
  align-items: stretch;
  min-height: 60vh;
  padding: 0 20px;
  max-width: 100%;
}

.sidebar-left {
  flex: 1;
  max-width: 33.333%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.books-section {
  flex: 2;
  max-width: 66.667%;
  display: flex;
  justify-content: center;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 30px;
  width: 100%;
  justify-items: center;
}

/* Edit Modal */
.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.edit-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.edit-form h3 {
  color: #004687;
  margin-bottom: 20px;
  text-align: center;
}

.edit-form input,
.edit-form textarea,
.edit-form select {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
}

.edit-form input:focus,
.edit-form textarea:focus,
.edit-form select:focus {
  outline: none;
  border-color: #3C68C2;
  box-shadow: 0 0 0 3px rgba(60, 104, 194, 0.1);
}

.edit-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 20px;
}

.save-btn {
  background: #3C68C2;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.2s;
}

.save-btn:hover {
  background: #004687;
}

.cancel-btn {
  background: #f0f0f0;
  color: #333;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.cancel-btn:hover {
  background: #e0e0e0;
}
</style>
