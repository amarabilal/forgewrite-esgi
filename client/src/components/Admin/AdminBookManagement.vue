<template>
  <div class="book-management">
    <div class="header">
      <h2>Book Management</h2>
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search books..."
          class="form-control"
        >
      </div>
    </div>

    <!-- Books Table -->
    <div class="table-container">
      <table class="books-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in filteredBooks" :key="book.id">
            <td>{{ book.id }}</td>
            <td class="book-title">{{ book.title }}</td>
            <td>{{ book.user?.email || 'Unknown' }}</td>
            <td>{{ book.genre || 'N/A' }}</td>
            <td>
              <span :class="['status-badge', book.status]">
                {{ book.status || 'draft' }}
              </span>
            </td>
            <td>{{ formatDate(book.created_at) }}</td>
            <td>
              <div class="actions">
                <button @click="viewBook(book)" class="btn btn-sm btn-info">View</button>
                <button @click="deleteBook(book)" class="btn btn-sm btn-danger">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- View Book Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click="showViewModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Book Details</h3>
          <button @click="showViewModal = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body" v-if="viewingBook">
          <div class="book-details">
            <p><strong>ID:</strong> {{ viewingBook.id }}</p>
            <p><strong>Title:</strong> {{ viewingBook.title }}</p>
            <p><strong>Author:</strong> {{ viewingBook.user?.email || 'Unknown' }}</p>
            <p><strong>Genre:</strong> {{ viewingBook.genre || 'N/A' }}</p>
            <p><strong>Status:</strong> {{ viewingBook.status || 'draft' }}</p>
            <p><strong>Description:</strong></p>
            <div class="description">
              {{ viewingBook.description || 'No description' }}
            </div>
            <p><strong>Created:</strong> {{ formatDate(viewingBook.created_at) }}</p>
          </div>
          
          <div v-if="viewingBook.chapters && viewingBook.chapters.length > 0" class="book-chapters">
            <h4>Chapters ({{ viewingBook.chapters.length }}):</h4>
            <div class="chapters-list">
              <div v-for="chapter in viewingBook.chapters" :key="chapter.id" class="chapter-item">
                <h5>{{ chapter.order_index }}. {{ chapter.title }}</h5>
                <p>Updated: {{ formatDate(chapter.updated_at) }}</p>
              </div>
            </div>
          </div>

          <div v-if="viewingBook.characters && viewingBook.characters.length > 0" class="book-characters">
            <h4>Characters ({{ viewingBook.characters.length }}):</h4>
            <div class="characters-list">
              <div v-for="character in viewingBook.characters" :key="character.id" class="character-item">
                <h5>{{ character.name }}</h5>
                <p>{{ character.role || 'No role specified' }}</p>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="showViewModal = false" class="btn btn-secondary">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

export default {
  name: 'AdminBookManagement',
  setup() {
    const books = ref([])
    const searchQuery = ref('')
    const showViewModal = ref(false)
    const viewingBook = ref(null)

    const filteredBooks = computed(() => {
      if (!searchQuery.value) return books.value
      
      const query = searchQuery.value.toLowerCase()
      return books.value.filter(book => 
        book.title.toLowerCase().includes(query) ||
        book.genre?.toLowerCase().includes(query) ||
        book.user?.email.toLowerCase().includes(query)
      )
    })

    const fetchBooks = async () => {
      try {
        const response = await api.get('/admin/books')
        books.value = response.data.data
      } catch (error) {
        console.error('Error fetching books:', error)
        alert('Error fetching books')
      }
    }

    const viewBook = async (book) => {
      try {
        const response = await api.get(`/admin/books/${book.id}`)
        viewingBook.value = response.data.data
        showViewModal.value = true
      } catch (error) {
        console.error('Error fetching book details:', error)
        alert('Error fetching book details')
      }
    }

    const deleteBook = async (book) => {
      if (confirm(`Are you sure you want to delete the book "${book.title}"? This will delete all associated chapters, characters, and other data permanently.`)) {
        try {
          await api.delete(`/admin/books/${book.id}`)
          await fetchBooks()
          alert('Book deleted successfully')
        } catch (error) {
          console.error('Error deleting book:', error)
          alert(error.response?.data?.message || 'Error deleting book')
        }
      }
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString()
    }

    onMounted(() => {
      fetchBooks()
    })

    return {
      books,
      searchQuery,
      filteredBooks,
      showViewModal,
      viewingBook,
      fetchBooks,
      viewBook,
      deleteBook,
      formatDate
    }
  }
}
</script>

<style scoped>
.book-management {
  max-width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #333;
}

.search-box {
  width: 300px;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-info:hover {
  background: #138496;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.table-container {
  overflow-x: auto;
}

.books-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.books-table th,
.books-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.books-table th {
  background: #f8f9fa;
  font-weight: 600;
}

.books-table tr:hover {
  background: #f5f5f5;
}

.book-title {
  font-weight: 500;
  color: #007bff;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.published {
  background: #28a745;
  color: white;
}

.status-badge.draft {
  background: #6c757d;
  color: white;
}

.status-badge.archived {
  background: #dc3545;
  color: white;
}

.actions {
  display: flex;
  gap: 4px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.book-details p {
  margin: 8px 0;
}

.description {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  white-space: pre-wrap;
}

.book-chapters,
.book-characters {
  margin-top: 20px;
}

.book-chapters h4,
.book-characters h4 {
  margin-bottom: 10px;
  color: #333;
}

.chapters-list,
.characters-list {
  display: grid;
  gap: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.chapter-item,
.character-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f8f9fa;
}

.chapter-item h5,
.character-item h5 {
  margin: 0 0 5px 0;
  color: #007bff;
}

.chapter-item p,
.character-item p {
  margin: 2px 0;
  font-size: 12px;
  color: #666;
}

.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
