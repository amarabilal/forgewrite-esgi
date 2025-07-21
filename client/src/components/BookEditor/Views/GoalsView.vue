<template>
  <div class="goals-view" v-if="statStore.stat">
    <!-- Toast notification -->
    <div :class="['toast', { 'toast-visible': showToast }]">
      <div class="toast-content">
        <img :src="saveIcon" alt="Sauvegardé" class="toast-icon" />
        <span>Objectifs sauvegardés avec succès!</span>
      </div>
    </div>

    <div class="goals-container">
      <div class="header">
        <img :src="goalIcon" alt="Objectifs" class="header-icon" />
        <h2>Objectifs d'écriture</h2>
      </div>

      <div class="content-grid">
        <div class="goals-section">
          <div class="mode-toggle">
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" id="words" v-model="mode" value="words" />
                <label for="words">
                  <img :src="wordIcon" alt="Mots" class="mode-icon" />
                  Mots
                </label>
              </div>
              <div class="radio-option">
                <input type="radio" id="letters" v-model="mode" value="letters" />
                <label for="letters">
                  <img :src="letterIcon" alt="Caractères" class="mode-icon" />
                  Caractères
                </label>
              </div>
            </div>
          </div>

          <div class="input-group">
            <div class="form-field">
              <label>
                <img :src="bookIcon" alt="Livre" class="field-icon" />
                Objectif du livre
              </label>
              <input type="number" v-model.number="goalTotal" placeholder="Ex: 50000" />
            </div>

            <div class="form-field">
              <label>
                <img :src="weekIcon" alt="Semaine" class="field-icon" />
                Objectif hebdomadaire
              </label>
              <input type="number" v-model.number="goalWeekly" placeholder="Ex: 7000" />
            </div>

            <div class="form-field">
              <label>
                <img :src="calendarIcon" alt="Deadline" class="field-icon" />
                Date limite
              </label>
              <input type="date" v-model="deadline" />
              <div v-if="daysLeft !== null" class="days-left">
                <img :src="clockIcon" alt="Temps restant" class="days-icon" />
                {{ daysLeft }} jours restants
              </div>
            </div>
          </div>

          <button @click="save" class="save-button">
            <img :src="saveIcon" alt="Sauvegarder" class="save-button-icon" />
            Sauvegarder les objectifs
          </button>
        </div>

        <div class="progress-section">
          <h3>
            <img :src="chartIcon" alt="Progression" class="section-icon" />
            Progression actuelle
          </h3>
          
          <div class="progress-cards">
            <div class="progress-card">
              <img :src="wordIcon" alt="Mots" class="progress-icon" />
              <div class="progress-content">
                <div class="progress-label">Mots écrits</div>
                <div class="progress-value">{{ totalWords.toLocaleString() }}</div>
              </div>
            </div>
            
            <div class="progress-card">
              <img :src="letterIcon" alt="Lettres" class="progress-icon" />
              <div class="progress-content">
                <div class="progress-label">Caractères écrits</div>
                <div class="progress-value">{{ totalLetters.toLocaleString() }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useStatStore } from '@/store/useStatStore'
import { useChapterStore } from '@/store/useChapterStore'

// Import icons
import saveIcon from '@/assets/icons/save-ico.svg?url'
import goalIcon from '@/assets/icons/goal-ico.svg?url'
import bookIcon from '@/assets/icons/book.png'
import wordIcon from '@/assets/icons/word-ico.svg?url'
import letterIcon from '@/assets/icons/char-ico.svg?url'
import weekIcon from '@/assets/icons/add-ico.svg?url'
import calendarIcon from '@/assets/icons/calendar-ico.svg?url'
import clockIcon from '@/assets/icons/param-ico.svg?url'
import chartIcon from '@/assets/icons/graph-ico.svg?url'

const statStore = useStatStore()
const chapterStore = useChapterStore()
const route = useRoute()
const bookId = Number(route.params.id)

const mode = ref<'words' | 'letters'>('words')
const saved = ref(false)
const showToast = ref(false)

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
  
  // Show toast notification
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

onMounted(() => {
  statStore.fetchStat(bookId)
})
</script>


<style scoped>
.goals-view {
  padding: 2rem;
  background-color: #f0f0f0;
  min-height: 100%;
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

.toast-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
}

.goals-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #3C68C2, #2558B8);
  color: white;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  width: 32px;
  height: 32px;
  filter: brightness(0) invert(1);
}

.header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  padding: 2rem;
}

.goals-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.mode-toggle {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
}

.radio-group {
  display: flex;
  gap: 1.5rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radio-option input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #3C68C2;
}

.radio-option label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #555;
  cursor: pointer;
}

.mode-icon {
  width: 16px;
  height: 16px;
  filter: invert(27%) sepia(55%) saturate(2341%) hue-rotate(211deg) brightness(89%) contrast(89%);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.field-icon {
  width: 18px;
  height: 18px;
  filter: invert(27%) sepia(55%) saturate(2341%) hue-rotate(211deg) brightness(89%) contrast(89%);
}

.form-field input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: #fafafa;
}

.form-field input:focus {
  outline: none;
  border-color: #3C68C2;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(60, 104, 194, 0.1);
}

.days-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.days-icon {
  width: 14px;
  height: 14px;
  filter: invert(45%);
}

.save-button {
  background: #3C68C2;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
  box-shadow: 0 2px 8px rgba(60, 104, 194, 0.3);
}

.save-button:hover {
  background-color: #2558B8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(60, 104, 194, 0.4);
}

.save-button-icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
}

.progress-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  height: fit-content;
}

.progress-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.section-icon {
  width: 20px;
  height: 20px;
  filter: invert(27%) sepia(55%) saturate(2341%) hue-rotate(211deg) brightness(89%) contrast(89%);
}

.progress-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.progress-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.progress-card:hover {
  transform: translateY(-1px);
}

.progress-icon {
  width: 24px;
  height: 24px;
  filter: invert(27%) sepia(55%) saturate(2341%) hue-rotate(211deg) brightness(89%) contrast(89%);
}

.progress-content {
  flex: 1;
}

.progress-label {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.progress-value {
  color: #333;
  font-size: 1.25rem;
  font-weight: 700;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1rem;
  }
  
  .header {
    padding: 1.5rem;
  }
  
  .radio-group {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
