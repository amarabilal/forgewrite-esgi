  <template>
    <aside class="sidebar">
        <h2>📌 Ajouter un lieu</h2>

        <select v-model="newItem.type">
          <option value="city">🏙️ Ville</option>
          <option value="place">📍 Lieu</option>
          <option value="route">🛣️ Route</option>
        </select>

        <input v-model="newItem.name" placeholder="Nom" />
        <textarea v-model="newItem.description" placeholder="Description (optionnelle)" />

        <button @click="addMapItem">➕ Ajouter</button>

        <div v-if="selected" class="detail">
          <h3>Détail</h3>
          <p><strong>Type :</strong> {{ selected.type }}</p>
          <p><strong>Nom :</strong> {{ selected.name }}</p>
          <p><strong>Description :</strong> {{ selected.description || '—' }}</p>
          <p><strong>Position :</strong> X {{ selected.x }}%, Y {{ selected.y }}%</p>
          <button @click="deleteItem">❌ Supprimer</button>
        </div>
      </aside>
      <div class="mindmap" ref="canvasRef" @click="handleMapClick">
        <div
          v-for="item in mapStore.mapItems"
          :key="item.id"
          class="map-item"
          :style="{ left: item.x + '%', top: item.y + '%' }"
          @mousedown.prevent="startDrag(item, $event)"
          @click.stop="select(item)"
        >
          <span class="icon">{{ getIcon(item.type) }}</span>
          <span class="label">{{ item.name }}</span>
        </div>
      </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useMapStore } from '@/store/useMapStore'
  import type { MapItem } from '@/store/useMapStore'

  const route = useRoute()
  const bookId = Number(route.params.id)
  const mapStore = useMapStore()

  const selected = ref<MapItem | null>(null)
  const canvasRef = ref<HTMLElement | null>(null)

  const newItem = ref<Omit<MapItem, 'id'>>({
    book_id: bookId,
    type: 'place',
    name: '',
    description: '',
    x: 50,
    y: 50,
  })

  const getIcon = (type: string) => {
    return type === 'city' ? '🏙️' : type === 'place' ? '📍' : '🛣️'
  }

  const addMapItem = async () => {
    if (!newItem.value.name.trim()) return
    await mapStore.createMapItem(newItem.value)
    newItem.value.name = ''
    newItem.value.description = ''
    await mapStore.fetchMapItems(bookId)
  }

  const select = (item: MapItem) => {
    selected.value = item
  }

  const deleteItem = async () => {
    if (selected.value?.id) {
      await mapStore.deleteMapItem(selected.value.id)
      selected.value = null
      await mapStore.fetchMapItems(bookId)
    }
  }

  const handleMapClick = (event: MouseEvent) => {
    if (!canvasRef.value) return
    const rect = canvasRef.value.getBoundingClientRect()

    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    newItem.value.x = Math.round(x / 2) * 2
    newItem.value.y = Math.round(y / 2) * 2
  }

  let draggingItem: MapItem | null = null

  const startDrag = (item: MapItem, event: MouseEvent) => {
    draggingItem = item
    window.addEventListener('mousemove', onDrag)
    window.addEventListener('mouseup', stopDrag)
  }

  const onDrag = (event: MouseEvent) => {
    if (!draggingItem || !canvasRef.value) return
    const rect = canvasRef.value.getBoundingClientRect()

    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    draggingItem.x = Math.round(Math.max(0, Math.min(100, x)) / 2) * 2
    draggingItem.y = Math.round(Math.max(0, Math.min(100, y)) / 2) * 2
  }

  const stopDrag = async () => {
    if (draggingItem) {
      await mapStore.updateMapItem(draggingItem)
      draggingItem = null
    }
    window.removeEventListener('mousemove', onDrag)
    window.removeEventListener('mouseup', stopDrag)
  }

  onMounted(() => {
    mapStore.fetchMapItems(bookId)
  })
  </script>

  <style scoped>

  .sidebar {
    width: 320px;
    background: #fafafa;
    padding: 1.5rem;
    border-right: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .sidebar input,
  .sidebar textarea,
  .sidebar select {
    width: 100%;
    padding: 0.5rem;
    font-size: 0.9rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .sidebar button {
    padding: 0.5rem;
    font-weight: bold;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .detail {
    background: #fff;
    border: 1px solid #ddd;
    padding: 0.75rem;
    border-radius: 4px;
  }

  .mindmap {
    flex: 1;
    position: relative;
    background: #f5f5f5;
    background-image:
      linear-gradient(to right, #ddd 1px, transparent 1px),
      linear-gradient(to bottom, #ddd 1px, transparent 1px);
    background-size: 20px 20px;
    overflow: hidden;
    cursor: crosshair;
  }

  .map-item {
    position: absolute;
    transform: translate(-50%, -50%);
    background: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.9rem;
    border: 1px solid #999;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    user-select: none;
    cursor: grab;
  }

  .map-item:active {
    cursor: grabbing;
  }

  .icon {
    font-size: 1.1rem;
    margin-right: 0.3rem;
  }
  </style>
