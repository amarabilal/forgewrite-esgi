<template>
  <div class="stats-view" v-if="statStore.stat">
    <div class="section">
      <h3>🎯 Objectifs</h3>

      <div class="mode-toggle">
        <label><input type="radio" v-model="mode" value="words" /> Mots</label>
        <label><input type="radio" v-model="mode" value="letters" /> Caractères</label>
      </div>

      <label>Livre
        <input type="number" v-model.number="goalTotal" />
      </label>

      <label>Semaine
        <input type="number" v-model.number="goalWeekly" />
      </label>

      <label>Deadline
        <input type="date" v-model="deadline" />
        <small v-if="daysLeft !== null">📅 Reste {{ daysLeft }} jours</small>
      </label>

      <button @click="save" class="save-btn">💾 Sauvegarder</button>
      <p v-if="saved" class="saved-msg">✅ Objectifs mis à jour</p>
    </div>

    <div class="current-progress">
      <p><strong>Mots écrits :</strong> {{ totalWords }}</p>
      <p><strong>Lettres écrites :</strong> {{ totalLetters }}</p>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStatStore } from '@/store/useStatStore'
import { useChapterStore } from '@/store/useChapterStore'

const statStore = useStatStore()
const chapterStore = useChapterStore()
const route = useRoute()
const bookId = Number(route.params.id)

const mode = ref<'words' | 'letters'>('words')
const saved = ref(false)

const totalWords = computed(() => {
  return chapterStore.chapters.reduce((sum, chapter) => {
    const text = chapter.content?.replace(/<[^>]*>/g, '') || ''
    return sum + text.trim().split(/\s+/).filter(Boolean).length
  }, 0)
})

const totalLetters = computed(() => {
  return chapterStore.chapters.reduce((sum, chapter) => {
    const text = chapter.content?.replace(/<[^>]*>/g, '') || ''
    return sum + text.replace(/\s+/g, '').length
  }, 0)
})

const goalTotal = computed({
  get: () => statStore.stat?.total_goal ?? 0,
  set: (val) => {
    if (statStore.stat) statStore.stat.total_goal = val
  }
})

const goalWeekly = computed({
  get: () => statStore.stat?.weekly_goal ?? 0,
  set: (val) => {
    if (statStore.stat) statStore.stat.weekly_goal = val
  }
})

const deadline = computed({
  get: () => statStore.stat?.deadline?.split('T')[0] ?? '',
  set: (val) => {
    if (statStore.stat) statStore.stat.deadline = val
  }
})

const daysLeft = computed(() => {
  const d = statStore.stat?.deadline
  if (!d) return null
  const today = new Date()
  const end = new Date(d)
  const diff = end.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
})

const save = async () => {
  if (statStore.stat) {
    statStore.stat.word_count = totalWords.value
    statStore.stat.letter_count = totalLetters.value
  }
  await statStore.updateStat()
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}

onMounted(() => {
  statStore.fetchStat(bookId)
})
</script>


<style scoped>
.stats-view {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h3 {
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
}

input {
  margin-top: 0.25rem;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.mode-toggle {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.save-btn {
  margin-top: 1rem;
  align-self: flex-end;
  padding: 0.5rem 1.2rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.saved-msg {
  margin-top: 0.5rem;
  color: green;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: right;
}
</style>
