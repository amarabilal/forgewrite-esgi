<template>
  <div class="export-view">
    <!-- Toast notification -->
    <div :class="['toast', { 'toast-visible': showToast }]">
      <div class="toast-content">
        <img :src="saveIcon" alt="Succès" class="toast-icon" />
        <span>{{ toastMessage }}</span>
      </div>
    </div>

    <div class="export-header">
      <img :src="exportIcon" alt="Exporter" class="header-icon" />
      <h1>Exporter le livre</h1>
    </div>

    <div class="export-content">
      <div class="export-card">
        <div class="export-info">
          <h3>Téléchargement PDF</h3>
          <p>Exportez votre livre au format PDF avec une mise en page professionnelle incluant la couverture, le sommaire et tous les chapitres.</p>
        </div>
        
        <button @click="exportToPDF" :disabled="isExporting" class="export-button">
          <img :src="pdfIcon" alt="PDF" class="button-icon" />
          {{ isExporting ? 'Génération en cours...' : 'Télécharger en PDF' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import html2pdf from 'html2pdf.js'

import { useBookStore } from '@/store/useBookStore'
import { useChapterStore } from '@/store/useChapterStore'

// Import SVG icons
import exportIcon from '@/assets/icons/export2-ico.svg?url'
import pdfIcon from '@/assets/icons/pdf-ico.svg?url'
import saveIcon from '@/assets/icons/save-ico.svg?url'

const route = useRoute()
const bookId = Number(route.params.id)

const bookStore = useBookStore()
const chapterStore = useChapterStore()

const isExporting = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const showToastMessage = (message: string) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// 📄 Fonction d’export en PDF
const exportToPDF = async () => {
  const book = bookStore.selectedBook
  const chapters = [...chapterStore.chapters].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))

  if (!book || chapters.length === 0) {
    showToastMessage("Livre ou chapitres introuvables.")
    return
  }

  isExporting.value = true
  showToastMessage("Génération du PDF en cours...")

  try {
    const wrapper = document.createElement('div')
    wrapper.style.padding = '2rem'
    wrapper.style.fontFamily = 'Arial, sans-serif'

    // Couverture
    const titlePage = document.createElement('div')
    titlePage.innerHTML = `<h1 style="text-align:center;">${book.title}</h1>`
    titlePage.style.pageBreakAfter = 'always'
    wrapper.appendChild(titlePage)

    // Sommaire
    const toc = document.createElement('div')
    toc.innerHTML = `<h2>Sommaire</h2><ul>${chapters.map(c => `<li>${c.title}</li>`).join('')}</ul>`
    toc.style.pageBreakAfter = 'always'
    wrapper.appendChild(toc)

    // Chapitres
    for (const chapter of chapters) {
      await chapterStore.selectChapter(chapter.id)
      const content = chapterStore.selectedChapterContent

      const chapEl = document.createElement('div')
      chapEl.innerHTML = `<h2>${chapter.title}</h2><div>${content}</div>`
      chapEl.style.pageBreakAfter = 'always'
      wrapper.appendChild(chapEl)
    }

    // Générer le PDF
    await html2pdf().set({
      margin: 0.5,
      filename: `${book.title}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }).from(wrapper).save()

    showToastMessage(`PDF "${book.title}" généré avec succès!`)
  } catch (error) {
    showToastMessage("Erreur lors de la génération du PDF.")
    console.error('Export PDF error:', error)
  } finally {
    isExporting.value = false
  }
}

onMounted(async () => {
  await bookStore.fetchBookById(bookId)
  await chapterStore.fetchChapters(bookId)
})
</script>

<style scoped>
.export-view {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
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

.export-header {
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

.export-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.export-content {
  padding: 1rem 0;
}

.export-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e9ecef;
  text-align: center;
}

.export-info {
  margin-bottom: 2rem;
}

.export-info h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
}

.export-info p {
  margin: 0;
  color: #6c757d;
  font-size: 1rem;
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
}

.export-button {
  background: #3C68C2;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 16px rgba(60, 104, 194, 0.3);
}

.export-button:hover:not(:disabled) {
  background-color: #2558B8;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(60, 104, 194, 0.4);
}

.export-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
}
</style>
