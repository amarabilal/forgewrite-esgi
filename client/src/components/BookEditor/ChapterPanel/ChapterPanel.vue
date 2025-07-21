<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useChapterStore } from '@/store/useChapterStore'
import api from '@/services/api'

// Import icons
import editIcon from '@/assets/icons/edit-ico.svg?url'
import addIcon from '@/assets/icons/add-ico.svg?url'
import copyIcon from '@/assets/icons/copy-ico.svg?url'
import trashIcon from '@/assets/icons/trash-ico.svg?url'

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
    <ul class="chapter-list">
      <li
        v-for="(chapter, index) in chapterStore.chapters"
        :key="chapter.id"
        :class="{ active: chapterStore.selectedChapterId === chapter.id }"
        class="chapter-item"
        @click="chapterStore.selectChapter(chapter.id)"
        @dblclick="startRenaming(chapter)"
        draggable="true"
        @dragstart="startDrag(chapter)"
        @dragover.prevent
        @drop="onDrop(chapter)"
      >
        <img :src="editIcon" :alt="chapter.title" class="chapter-icon" />
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
          <button @click.stop="duplicateChapter(chapter)" title="Dupliquer le chapitre">
            <img :src="copyIcon" alt="Dupliquer" class="action-icon" />
          </button>
          <button @click.stop="deleteChapter(chapter.id)" title="Supprimer le chapitre">
            <img :src="trashIcon" alt="Supprimer" class="action-icon" />
          </button>
        </div>
      </li>
      
      <!-- Add chapter button -->
      <li class="add-chapter-item" @click="createChapter">
        <img :src="addIcon" alt="Ajouter un chapitre" class="add-icon" />
        <span class="add-text">Ajouter un chapitre</span>
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

.chapter-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.chapter-item {
  padding: 0.75rem 1rem;
  margin: 0.25rem 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #3C68C2;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
}

.chapter-item:hover {
  background-color: #e8f0ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(60, 104, 194, 0.1);
}

.chapter-item.active {
  background-color: #3C68C2;
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(60, 104, 194, 0.3);
}

.chapter-icon {
  width: 18px;
  height: 18px;
  margin-right: 0.75rem;
  filter: invert(27%) sepia(55%) saturate(2341%) hue-rotate(211deg) brightness(89%) contrast(89%);
  transition: all 0.3s ease;
}

.chapter-item.active .chapter-icon {
  filter: brightness(0) invert(1);
}

.add-chapter-item {
  padding: 0.75rem 1rem;
  margin: 0.25rem 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #3C68C2;
  background-color: transparent;
  border: 2px dashed #3C68C2;
}

.add-chapter-item:hover {
  background-color: rgba(60, 104, 194, 0.05);
  transform: translateY(-1px);
}

.add-icon {
  width: 18px;
  height: 18px;
  margin-right: 0.75rem;
}

.add-text {
  font-size: 0.95rem;
  white-space: nowrap;
}

.title-zone {
  flex: 1;
  cursor: grab;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rename-input {
  width: 100%;
  font-size: 0.95rem;
  padding: 0.2rem 0.5rem;
  border: none;
  border-radius: 4px;
  background-color: white;
  color: #333;
}

.actions {
  display: flex;
  gap: 0.3rem;
  visibility: hidden;
}

.chapter-item:hover .actions {
  visibility: visible;
}

.actions button {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.actions button:hover {
  opacity: 1;
  background-color: rgba(60, 104, 194, 0.1);
}

.action-icon {
  width: 14px;
  height: 14px;
  filter: invert(27%) sepia(55%) saturate(2341%) hue-rotate(211deg) brightness(89%) contrast(89%);
}

.chapter-item.active .actions button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.chapter-item.active .action-icon {
  filter: brightness(0) invert(1);
}
</style>
