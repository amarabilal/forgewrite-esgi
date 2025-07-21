<template>
  <div class="comments-view">
    <!-- Toast notification -->
    <div :class="['toast', { 'toast-visible': showToast }]">
      <div class="toast-content">
        <img :src="saveIcon" alt="Succès" class="toast-icon" />
        <span>{{ toastMessage }}</span>
      </div>
    </div>

    <div class="comments-header">
      <img :src="commentIcon" alt="Commentaires" class="header-icon" />
      <h2>Commentaires du livre</h2>
    </div>

    <div class="comment-form">
      <textarea
        v-model="newComment"
        placeholder="Écrire un commentaire..."
        rows="4"
        class="comment-textarea"
      ></textarea>
      <button @click="submitComment" :disabled="!newComment.trim()" class="submit-button">
        <img :src="sendIcon" alt="Envoyer" class="button-icon" />
        Envoyer
      </button>
    </div>

    <div v-if="loading" class="status loading">
      <div class="loading-spinner"></div>
      Chargement des commentaires...
    </div>
    
    <div v-else-if="commentStore.comments.length === 0" class="status empty">
      <img :src="commentIcon" alt="Aucun commentaire" class="empty-icon" />
      Aucun commentaire pour le moment
    </div>

    <div v-else class="comments-container">
      <div v-for="comment in commentStore.comments" :key="comment.id" class="comment-card">
        <div class="comment-content">{{ comment.content }}</div>
        <div class="comment-meta">
          <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
          <button @click="deleteComment(comment.id)" class="delete-button">
            <img :src="trashIcon" alt="Supprimer" class="delete-icon" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCommentStore } from '@/store/useCommentStore'

// Import SVG icons
import commentIcon from '@/assets/icons/comment-ico.svg?url'
import sendIcon from '@/assets/icons/send-ico.svg?url'
import trashIcon from '@/assets/icons/trash-ico.svg?url'
import saveIcon from '@/assets/icons/save-ico.svg?url'

const route = useRoute()
const bookId = Number(route.params.id)

const commentStore = useCommentStore()
const newComment = ref('')
const loading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const showToastMessage = (message: string) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const submitComment = async () => {
  if (!newComment.value.trim()) return
  await commentStore.createComment({
    book_id: bookId,
    content: newComment.value.trim(),
  })
  showToastMessage('Commentaire ajouté avec succès!')
  newComment.value = ''
}

const deleteComment = async (id: number) => {
  await commentStore.deleteComment(id)
  showToastMessage('Commentaire supprimé avec succès!')
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(async () => {
  loading.value = true
  await commentStore.fetchComments(bookId)
  loading.value = false
})
</script>

<style scoped>
.comments-view {
  max-width: 1200px;
  min-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  display: flex;
  flex-direction: column;
}

.toast {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  background: #28a745;
  color: white;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 20px rgba(40, 167, 69, 0.3);
  z-index: 9999;
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  pointer-events: none;
}

.toast-visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toast-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
}

.comments-header {
  background: linear-gradient(135deg, #3C68C2, #2558B8);
  color: white;
  padding: 1.5rem;
  margin: -2rem -2rem 2rem -2rem;
  border-radius: 16px 16px 0 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  width: 28px;
  height: 28px;
  filter: brightness(0) invert(1);
}

.comments-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.comment-form {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  margin-bottom: 2rem;
}

.comment-textarea {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background-color: white;
  transition: all 0.3s ease;
  outline: none;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.comment-textarea:focus {
  border-color: #3C68C2;
  box-shadow: 0 0 0 3px rgba(60, 104, 194, 0.1);
}

.submit-button {
  background: #3C68C2;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
  box-shadow: 0 2px 8px rgba(60, 104, 194, 0.3);
}

.submit-button:hover:not(:disabled) {
  background-color: #2558B8;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(60, 104, 194, 0.4);
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
}

.status {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.status.loading {
  background: #f0f8ff;
  color: #3C68C2;
  border: 2px solid #e6f2ff;
}

.status.empty {
  background: #f8f9fa;
  color: #6c757d;
  border: 2px solid #e9ecef;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e6f2ff;
  border-top: 2px solid #3C68C2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.empty-icon {
  width: 24px;
  height: 24px;
  filter: invert(42%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(94%) contrast(92%);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.comments-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.comments-container::-webkit-scrollbar {
  width: 8px;
}

.comments-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.comments-container::-webkit-scrollbar-thumb {
  background: #3C68C2;
  border-radius: 10px;
}

.comments-container::-webkit-scrollbar-thumb:hover {
  background: #2558B8;
}

.comment-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.comment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.comment-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #2c3e50;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3C68C2;
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-date {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.delete-button {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.delete-button:hover {
  background-color: #c82333;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.delete-icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
}
</style>
