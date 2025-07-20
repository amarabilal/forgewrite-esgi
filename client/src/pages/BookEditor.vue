<template>
  <div class="book-editor">
    <Sidebar @select="setActiveView" />

    <div class="workspace">
      <HeaderBar />

      <div class="content">
        <template v-if="activeView === 'Écrire' && isReady">
          <ChapterPanel />
          <ChapterEditor />
        </template>

        <CharacterView v-if="activeView === 'Personnages'" />
        <GoalsView v-if="activeView === 'Objectifs'" />
        <MindMapView v-if="activeView === 'Carte mentale'" />
        <LexiconView v-if="activeView === 'Trouver des mots'" />
        <AssistantView v-if="activeView === 'Assistant d’écriture'" />
        <CommentView v-if="activeView === 'Commentaires'" />
        <ExportView v-if="activeView === 'Exporter en PDF'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useChapterStore } from '@/store/useChapterStore'

import Sidebar from '@/components/BookEditor/Sidebar/Sidebar.vue'
import HeaderBar from '@/components/BookEditor/HeaderBar.vue'
import ChapterPanel from '@/components/BookEditor/ChapterPanel/ChapterPanel.vue'
import ChapterEditor from '@/components/BookEditor/ChapterEditor.vue'

import CharacterView from '@/components/BookEditor/Views/CharacterView.vue'
import GoalsView from '@/components/BookEditor/Views/GoalsView.vue'
import MindMapView from '@/components/BookEditor/Views/MindMapView.vue'
import LexiconView from '@/components/BookEditor/Views/LexiconView.vue'
import AssistantView from '@/components/BookEditor/Views/AssistantView.vue'
import CommentView from '@/components/BookEditor/Views/CommentView.vue'
import ExportView from '@/components/BookEditor/Views/ExportView.vue'

const activeView = ref('Écrire')
const isReady = ref(false)
const route = useRoute()
const chapterStore = useChapterStore()

function setActiveView(view: string) {
  activeView.value = view
}

const loadEditorData = async (bookId: string) => {
  isReady.value = false
  try {
    await chapterStore.fetchChapters(Number(bookId))
    isReady.value = true
  } catch (error) {
    console.error('Erreur de chargement du livre :', error)
  }
}

onMounted(() => {
  if (route.params.id) {
    loadEditorData(route.params.id as string)
  }
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) loadEditorData(newId as string)
  }
)
</script>

<style scoped>
.book-editor {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: #fff;
}
</style>
