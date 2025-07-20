<template>
  <div class="editor">
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
        <p class="saved-indicator" v-if="saved">✅ Sauvegardé</p>
      </div>

      <aside class="right" v-if="showNotes">
        <div class="notes">
          <h3>🗒️ Notes</h3>
          <ul>
            <li v-for="note in notes" :key="note.id">
              <input v-model="note.content" @blur="updateNote(note)" />
              <button @click="deleteNote(note.id)">🗑️</button>
            </li>
          </ul>
          <button @click="createNote">➕ Ajouter une note</button>
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

const chapterStore = useChapterStore()
const noteStore = useNoteStore()

const saved = ref(false)
const showNotes = ref(true)
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
      saved.value = true
      setTimeout(() => (saved.value = false), 1500)
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

.saved-indicator {
  margin-top: 0.5rem;
  color: green;
  font-size: 0.9rem;
}

.no-selection {
  text-align: center;
  color: #888;
  margin-top: 4rem;
}

.notes {
  display: flex;
  flex-direction: column;
}

.notes ul {
  list-style: none;
  padding: 0;
}

.notes li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.notes input {
  flex: 1;
  padding: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.notes button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
}
</style>
