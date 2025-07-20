<template>
    <div class="book-card" @click="handleCardClick" :title="book.description || 'Aucune description'">
        <div class="book-cover">
            <img :src="bookImage" :alt="book.title" />
        </div>

        <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-genre">{{ book.genre || 'Genre non défini' }}</p>
            <small class="book-date">Dernière modification : {{ formatDate(book.updated_at || book.created_at)
                }}</small>
        </div>

        <div class="book-actions" @click.stop>
            <button @click="$emit('edit-book')" class="action-btn edit-btn" title="Éditer le livre">
                <img src="@/assets/icons/edit-ico.svg" alt="Éditer" />
            </button>
            <button @click="$emit('edit-details')" class="action-btn settings-btn" title="Modifier les détails">
                <img src="@/assets/icons/param-ico.svg" alt="Paramètres" />
            </button>
            <button @click="$emit('delete-book')" class="action-btn delete-btn" title="Supprimer">
                <img src="@/assets/icons/trash-ico.svg" alt="Supprimer" />
            </button>
        </div>

        <div class="status-badge" :class="book.status">
            {{ book.status }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Book {
    id: number
    title: string
    genre?: string
    description?: string
    status: string
    created_at: string
    updated_at?: string
}

const props = defineProps<{
    book: Book
}>()

const emit = defineEmits(['edit-book', 'edit-details', 'delete-book', 'open-book'])

const bookImage = computed(() => {
    // You can customize this to use different images based on genre or other properties
    return '/src/assets/icons/book.png'
})

const handleCardClick = () => {
    emit('open-book')
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
}
</script>

<style scoped>
.book-card {
    background: #E9E7E8;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    box-shadow: 0 4px 15px rgba(60, 104, 194, 0.1);
    width: 240px;
    height: 345px;
    display: flex;
    flex-direction: column;
}

.book-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(60, 104, 194, 0.2);
    border-color: #004687;
}

.book-cover {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 1rem;
}

.book-cover img {
    width: 120px;
    height: 160px;
    object-fit: cover;
    border-radius: 4px;
}

.book-info {
    text-align: center;
    padding: 1rem;
    flex-shrink: 0;
}

.book-title {
    color: #3C68C2;
    font-size: 1.1rem;
    font-weight: bold;
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
}

.book-genre {
    color: #004687;
    font-size: 0.9rem;
    margin: 0 0 0.5rem 0;
}

.book-date {
    color: #004687;
    opacity: 0.8;
    font-size: 0.8rem;
}

.book-actions {
    display: flex;
    justify-content: center;
    gap: 0.8rem;
    padding: 1rem;
    flex-shrink: 0;
}

.action-btn {
    background: transparent;
    border: none;
    border-radius: 6px;
    padding: 0.3rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn:hover {
    transform: scale(1.2);
}

.action-btn img {
    width: 20px;
    height: 20px;
}

.edit-btn img {
    filter: invert(26%) sepia(88%) saturate(1695%) hue-rotate(208deg) brightness(94%) contrast(96%);
}

.settings-btn img {
    filter: invert(26%) sepia(88%) saturate(1695%) hue-rotate(208deg) brightness(94%) contrast(96%);
}

.delete-btn img {
    filter: invert(19%) sepia(95%) saturate(5102%) hue-rotate(347deg) brightness(90%) contrast(88%);
}

.status-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 0.7rem;
    padding: 0.3rem 0.6rem;
    border-radius: 15px;
    font-weight: bold;
    color: #FCF8ED;
    text-transform: uppercase;
}

.status-badge.en\ cours {
    background-color: #28a745;
}

.status-badge.en\ pause {
    background-color: #ffc107;
    color: #004687;
}

.status-badge.terminé {
    background-color: #004687;
}

.status-badge.abandonné {
    background-color: #dc3545;
}

.status-badge.brouillon {
    background-color: #6c757d;
}
</style>
