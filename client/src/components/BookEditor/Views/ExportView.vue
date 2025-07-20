<template>
  <div class="export-view">
    <h1>📤 Exporter le livre</h1>

    <button @click="exportToPDF">📄 Télécharger en PDF</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import html2pdf from 'html2pdf.js'

import { useBookStore } from '@/store/useBookStore'
import { useChapterStore } from '@/store/useChapterStore'

const route = useRoute()
const bookId = Number(route.params.id)

const bookStore = useBookStore()
const chapterStore = useChapterStore()

// 📄 Fonction d’export en PDF
const exportToPDF = async () => {
  const book = bookStore.selectedBook
  const chapters = [...chapterStore.chapters].sort((a, b) => a.order_index - b.order_index)

  if (!book || chapters.length === 0) {
    alert("Livre ou chapitres introuvables.")
    return
  }

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
  html2pdf().set({
    margin: 0.5,
    filename: `${book.title}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  }).from(wrapper).save()
}

onMounted(async () => {
  await bookStore.fetchBookById(bookId)
  await chapterStore.fetchChapters(bookId)
})
</script>

<style scoped>
.export-view {
  max-width: 700px;
  margin: 3rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #ddd;
  text-align: center;
}

button {
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
