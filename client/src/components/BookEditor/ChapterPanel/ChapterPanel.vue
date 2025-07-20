<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useChapterStore } from '@/store/useChapterStore'
import api from '@/services/api'

const chapterStore = useChapterStore()
const route = useRoute()
const bookId = Number(route.params.id)

const editingId = ref<number | null>(null)
const editingTitle = ref('')
const draggingChapter = ref<any | null>(null)

const createChapter = async () => {
  const nextNumber = chapterStore.chapters.length + 1
  await chapterStore.createChapter(bookId, `Chapitre ${nextNumber}`)
}

const deleteChapter = async (chapterId: number) => {
  try {
    await api.delete(`/chapters/${chapterId}`)
    await chapterStore.fetchChapters(bookId)
  } catch (err) {
    console.error('Erreur suppression chapitre :', err)
  }
}

const startRenaming = (chapter: { id: number; title: string }) => {
  editingId.value = chapter.id
  editingTitle.value = chapter.title
}

const confirmRename = async (chapter: { id: number; title: string }) => {
  if (editingTitle.value.trim() && editingTitle.value !== chapter.title) {
    try {
      await api.put(`/chapters/${chapter.id}`, {
        title: editingTitle.value.trim()
      })
      await chapterStore.fetchChapters(bookId)
    } catch (err) {
      console.error('Erreur renommage chapitre :', err)
    }
  }
  editingId.value = null
  editingTitle.value = ''
}

const duplicateChapter = async (chapter: { id: number; title: string; content: string }) => {
  try {
    const res = await api.post('/chapters', {
      book_id: bookId,
      title: chapter.title + ' (copie)',
      content: chapter.content || ''
    })
    await chapterStore.fetchChapters(bookId)
    await chapterStore.selectChapter(res.data.data.id)
  } catch (err) {
    console.error('Erreur duplication chapitre :', err)
  }
}

// 🔀 Drag and drop
const startDrag = (chapter: any) => {
  draggingChapter.value = chapter
}

const onDrop = async (target: any) => {
  const fromIndex = chapterStore.chapters.findIndex(c => c.id === draggingChapter.value.id)
  const toIndex = chapterStore.chapters.findIndex(c => c.id === target.id)

  if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
    const moved = [...chapterStore.chapters]
    const [dragged] = moved.splice(fromIndex, 1)
    moved.splice(toIndex, 0, dragged)
    chapterStore.chapters = moved
    await chapterStore.saveChapterOrder()
  }

  draggingChapter.value = null
}
</script>

<template>
  <div class="chapter-panel">
    <div class="header">
      <h2>Chapitres</h2>
      <button @click="createChapter" class="add-btn" title="Ajouter un chapitre">➕</button>
    </div>

    <ul class="chapter-list">
      <li
        v-for="(chapter, index) in chapterStore.chapters"
        :key="chapter.id"
        :class="{ active: chapterStore.selectedChapterId === chapter.id }"
        @click="chapterStore.selectChapter(chapter.id)"
        @dblclick="startRenaming(chapter)"
        draggable="true"
        @dragstart="startDrag(chapter)"
        @dragover.prevent
        @drop="onDrop(chapter)"
      >
        <div class="title-zone">
          <template v-if="editingId === chapter.id">
            <input
              v-model="editingTitle"
              @blur="confirmRename(chapter)"
              @keyup.enter="confirmRename(chapter)"
              class="rename-input"
              autofocus
            />
          </template>
          <template v-else>
            {{ chapter.title }}
          </template>
        </div>

        <div class="actions">
          <button @click.stop="duplicateChapter(chapter)">📄</button>
          <button @click.stop="deleteChapter(chapter.id)">🗑️</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.chapter-panel {
  padding: 1rem;
  background-color: #f5f5f5;
  height: 100%;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.add-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #333;
}

.chapter-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chapter-list li {
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.chapter-list li:hover {
  background-color: #eee;
}

.chapter-list li.active {
  background-color: #e3d6c6;
  font-weight: bold;
}

.rename-input {
  width: 100%;
  font-size: 1rem;
  padding: 0.2rem;
}

.actions {
  display: flex;
  gap: 0.3rem;
  visibility: hidden;
}

.chapter-list li:hover .actions {
  visibility: visible;
}

.actions button {
  background: none;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  color: #444;
}

.title-zone {
  flex: 1;
  cursor: grab;
}
</style>
