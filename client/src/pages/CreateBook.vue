<template>
  <div class="create-book">
    <div class="create-book-container">
      <!-- Left side - Cover upload -->
      <div class="left-side">
        <button class="back-button" @click="$router.go(-1)">
          ← Mes listes
        </button>
        
        <div class="cover-upload-section">
          <div class="cover-upload">
            <img src="@/assets/icons/cover-ico.svg" alt="Cover" class="cover-icon" />
            <p>Changer la couverture</p>
          </div>
        </div>
      </div>

      <!-- Right side - Form -->
      <div class="right-side">
        <div class="logo">
          <h1>ForgeWrite</h1>
        </div>

        <form @submit.prevent="createBook" class="book-form">
          <div class="form-group">
            <label for="title">Titre du livre</label>
            <input v-model="title" id="title" required class="form-input" />
          </div>

          <div class="form-group">
            <label for="genre">Genre</label>
            <input v-model="genre" id="genre" class="form-input" />
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea v-model="description" id="description" rows="3" class="form-input" />
          </div>

          <button type="submit" class="create-button">
            <img src="@/assets/add-book/button.png" alt="Écrire" />
          </button>
        </form>

        <p v-if="error" class="error">{{ error }}</p>
      </div>
    </div>
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
  min-height: 100vh;
  background: #FCF8ED;
  padding: 0;
  margin: 0;
}

.create-book-container {
  display: flex;
  min-height: 100vh;
}

/* Left side - 50% width with primary color */
.left-side {
  flex: 1;
  background: #3C68C2;
  position: relative;
  display: flex;
  flex-direction: column;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.cover-upload-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cover-upload {
  text-align: center;
  color: white;
  cursor: pointer;
  padding: 40px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.cover-upload:hover {
  background: rgba(255, 255, 255, 0.1);
}

.cover-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  filter: brightness(0) invert(1);
}

.cover-upload p {
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
}

/* Right side - 50% width with form */
.right-side {
  flex: 1;
  background: #FCF8ED;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.logo h1 {
  color: #3C68C2;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
}

.book-form {
  max-width: 500px;
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #3C68C2;
  font-weight: 500;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: #E9E7E8;
  border: 2px solid transparent;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3C68C2;
}

.form-input::placeholder {
  color: #888;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

.create-button {
  background: transparent;
  border: none;
  cursor: pointer;
  margin: 30px auto 0;
  display: block;
  transition: transform 0.2s;
}

.create-button:hover {
  transform: scale(1.05);
}

.create-button img {
  width: 80%;
  height: auto;
}

.error {
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 12px 16px;
  border-radius: 6px;
  margin-top: 20px;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .create-book-container {
    flex-direction: column;
  }
  
  .left-side,
  .right-side {
    flex: none;
  }
  
  .left-side {
    min-height: 40vh;
  }
  
  .right-side {
    padding: 20px;
  }
}
</style>
