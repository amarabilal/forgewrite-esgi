<template>
  <div class="comments-view">
    <h2>💬 Commentaires du livre</h2>

    <div class="form">
      <textarea
        v-model="newComment"
        placeholder="Écrire un commentaire..."
        rows="3"
      ></textarea>
      <button @click="submitComment" :disabled="!newComment.trim()">Envoyer</button>
    </div>

    <div v-if="loading" class="loading">Chargement des commentaires...</div>
    <div v-else-if="commentStore.comments.length === 0" class="empty">Aucun commentaire.</div>

    <ul class="comment-list">
      <li v-for="comment in commentStore.comments" :key="comment.id" class="comment-item">
        <div class="content">{{ comment.content }}</div>
        <div class="meta">
          <span class="date">{{ formatDate(comment.created_at) }}</span>
          <button @click="deleteComment(comment.id)">🗑️</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCommentStore } from '@/store/useCommentStore'

const route = useRoute()
const bookId = Number(route.params.id)

const commentStore = useCommentStore()
const newComment = ref('')
const loading = ref(false)

const submitComment = async () => {
  if (!newComment.value.trim()) return
  await commentStore.createComment({
    book_id: bookId,
    content: newComment.value.trim(),
  })
  newComment.value = ''
}

const deleteComment = async (id: number) => {
  await commentStore.deleteComment(id)
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
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

textarea {
  width: 100%;
  resize: vertical;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  align-self: flex-end;
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.comment-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.comment-item {
  border-bottom: 1px solid #eee;
  padding: 0.75rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #666;
}

.loading,
.empty {
  font-style: italic;
  color: #888;
  margin-top: 1rem;
}
</style>
