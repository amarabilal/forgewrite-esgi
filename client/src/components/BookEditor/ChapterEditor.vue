<template>
  <div class="editor">
    <!-- Toast notification -->
    <div :class="['toast', { 'toast-visible': showToast }]">
      <div class="toast-content">
        <span>✅</span>
        <span>Chapitre sauvegardé avec succès!</span>
      </div>
    </div>
    
    <div v-if="chapterStore.selectedChapterId" class="editor-layout">
      <div class="left">
        <div class="toolbar">
          <button @click="cmd('toggleBold')" :class="{ active: editor?.isActive('bold') }"><strong>B</strong></button>
          <button @click="cmd('toggleItalic')" :class="{ active: editor?.isActive('italic') }"><em>I</em></button>
          <button @click="cmd('toggleHeading', { level: 2 })" :class="{ active: editor?.isActive('heading', { level: 2 }) }">H2</button>
          <button @click="cmd('toggleBulletList')" :class="{ active: editor?.isActive('bulletList') }">• Liste</button>
          <button @click="cmd('undo')">↶</button>
          <button @click="cmd('redo')">↷</button>
          <button class="toggle-notes" @click="showNotes = !showNotes">
            {{ showNotes ? '➖ Masquer les notes' : '➕ Afficher les notes' }}
          </button>
        </div>

        <EditorContent :editor="editor" class="wysiwyg" />
      </div>

      <aside class="right" v-if="showNotes">
        <div class="notes">
          <div class="notes-header">
            <img :src="noteIcon" alt="Notes" class="notes-icon" />
            <h3>Notes</h3>
          </div>
          <ul class="notes-list">
            <li v-for="note in notes" :key="note.id" class="note-item">
              <input 
                v-model="note.content" 
                @blur="updateNote(note)" 
                class="note-input"
                placeholder="Tapez votre note ici..."
              />
              <button @click="deleteNote(note.id)" class="delete-btn" title="Supprimer la note">
                <img :src="trashIcon" alt="Supprimer" class="delete-icon" />
              </button>
            </li>
          </ul>
          <button @click="createNote" class="add-note-btn">
            <img :src="addIcon" alt="Ajouter" class="add-note-icon" />
            <span>Ajouter une note</span>
          </button>
        </div>
      </aside>
    </div>

    <div v-else class="no-selection">
      <p>Aucun chapitre sélectionné.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { useChapterStore } from '@/store/useChapterStore'
import { useNoteStore, type Note } from '@/store/useNoteStore'

// Import icons
import noteIcon from '@/assets/icons/note-ico.svg?url'
import addIcon from '@/assets/icons/add-ico.svg?url'
import trashIcon from '@/assets/icons/trash-ico.svg?url'

const chapterStore = useChapterStore()
const noteStore = useNoteStore()

const saved = ref(false)
const showNotes = ref(true)
const showToast = ref(false)
const DEFAULT_CONTENT = '<p>Écrivez votre chapitre ici...</p>'

const notes = ref<Note[]>([])

const editor = useEditor({
  extensions: [StarterKit],
  content: DEFAULT_CONTENT,
  autofocus: true,
  onBlur: async ({ editor }) => {
    const html = editor.getHTML().trim()
    const original = chapterStore.selectedChapterContent.trim()

    if (html !== original) {
      await chapterStore.updateChapterContent(html)
      // Show toast notification
      showToast.value = true
      setTimeout(() => {
        showToast.value = false
      }, 3000)
    }
  }
})

const cmd = (command: keyof typeof editor.value.commands, options = {}) => {
  if (!editor.value?.commands[command]) return
  editor.value.commands[command](options)
}

watch(
  () => chapterStore.selectedChapterId,
  async () => {
    await nextTick()
    if (editor.value) {
      const newContent = chapterStore.selectedChapterContent?.trim() || DEFAULT_CONTENT
      if (newContent !== editor.value.getHTML().trim()) {
        editor.value.commands.setContent(newContent, false)
      }
    }

    if (chapterStore.selectedChapterId) {
      await noteStore.fetchNotes(chapterStore.selectedChapterId)
      notes.value = [...noteStore.notes]
    }
  },
  { immediate: true }
)

const createNote = async () => {
  const chapterId = chapterStore.selectedChapterId
  if (!chapterId) return

  const newNote = await noteStore.createNote({
    chapter_id: chapterId,
    content: 'Nouvelle note',
  })

  if (newNote) notes.value.push(newNote)
}

const updateNote = async (note: Note) => {
  await noteStore.updateNote(note)
}

const deleteNote = async (id: number) => {
  await noteStore.deleteNote(id)
  notes.value = notes.value.filter(n => n.id !== id)
}
</script>

<style scoped>
.editor {
  flex: 1;
  padding: 2rem;
  background: #fff;
  height: 100%;
  overflow-y: auto;
  position: relative;
}

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  background: #28a745;
  color: white;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 20px rgba(40, 167, 69, 0.3);
  z-index: 1000;
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

.editor-layout {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin: auto;
}

.left {
  flex: 3;
  display: flex;
  flex-direction: column;
}

.right {
  flex: 1;
  max-height: 700px;
  overflow-y: auto;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
}

.toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
  flex-wrap: wrap;
}

.toolbar button {
  background: none;
  border: 1px solid transparent;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.toolbar button.active {
  border-color: #333;
  background: #f0f0f0;
}

.toggle-notes {
  margin-left: auto;
  font-size: 0.8rem;
  border: 1px solid #ccc;
  background: #eee;
  border-radius: 4px;
  padding: 0.3rem 0.6rem;
}

.wysiwyg {
  min-height: 600px;
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 4px;
}

.no-selection {
  text-align: center;
  color: #888;
  margin-top: 4rem;
}

.notes {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.notes-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e0e0e0;
}

.notes-icon {
  width: 20px;
  height: 20px;
  filter: invert(27%) sepia(55%) saturate(2341%) hue-rotate(211deg) brightness(89%) contrast(89%);
}

.notes-header h3 {
  margin: 0;
  color: #3C68C2;
  font-size: 1.1rem;
  font-weight: 600;
}

.notes-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
}

.note-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.note-item:hover {
  box-shadow: 0 2px 8px rgba(60, 104, 194, 0.1);
  transform: translateY(-1px);
}

.note-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
  background-color: #fafafa;
}

.note-input:focus {
  outline: none;
  border-color: #3C68C2;
  background-color: white;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.6;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  opacity: 1;
  background-color: rgba(220, 53, 69, 0.1);
}

.delete-icon {
  width: 14px;
  height: 14px;
  filter: invert(15%) sepia(94%) saturate(5588%) hue-rotate(355deg) brightness(91%) contrast(109%);
}

.add-note-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: transparent;
  border: 2px dashed #3C68C2;
  border-radius: 8px;
  cursor: pointer;
  color: #3C68C2;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.add-note-btn:hover {
  background-color: rgba(60, 104, 194, 0.05);
  transform: translateY(-1px);
}

.add-note-icon {
  width: 16px;
  height: 16px;
}
</style>
