  <template>
    <aside class="sidebar">
        <div class="sidebar-header">
          <img :src="pinIcon" alt="Pin" class="header-icon" />
          <h2>Ajouter un lieu</h2>
        </div>

        <div class="form-section">
          <select v-model="newItem.type" class="form-select">
            <option value="city">Ville</option>
            <option value="place">Lieu</option>
            <option value="route">Route</option>
          </select>

          <input v-model="newItem.name" placeholder="Nom du lieu" class="form-input" />
          <textarea v-model="newItem.description" placeholder="Description (optionnelle)" class="form-textarea" />

          <button @click="addMapItem" class="add-button">
            <img :src="addIcon" alt="Ajouter" class="button-icon" />
            Ajouter
          </button>
        </div>

        <div v-if="selected" class="detail">
          <h3>Détails du lieu</h3>
          <div class="detail-item">
            <strong>Type :</strong> {{ selected.type }}
          </div>
          <div class="detail-item">
            <strong>Nom :</strong> {{ selected.name }}
          </div>
          <div class="detail-item">
            <strong>Description :</strong> {{ selected.description || '—' }}
          </div>
          <div class="detail-item">
            <strong>Position :</strong> X {{ selected.x }}%, Y {{ selected.y }}%
          </div>
          <button @click="deleteItem" class="delete-button">
            <img :src="deleteIcon" alt="Supprimer" class="button-icon" />
            Supprimer
          </button>
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
          <img :src="getIcon(item.type)" alt="Type" class="map-icon" />
          <span class="label">{{ item.name }}</span>
        </div>
      </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted, getCurrentInstance } from 'vue'
  import { useRoute } from 'vue-router'
  import { useMapStore } from '@/store/useMapStore'
  import type { MapItem } from '@/store/useMapStore'

  // Import SVG icons
  import pinIcon from '@/assets/icons/pin-ico.svg?url'
  import placeIcon from '@/assets/icons/place-ico.svg?url'
  import cityIcon from '@/assets/icons/city-ico.svg?url'
  import routeIcon from '@/assets/icons/route-ico.svg?url'
  import addIcon from '@/assets/icons/add-ico.svg?url'
  import deleteIcon from '@/assets/icons/trash-ico.svg?url'

  const route = useRoute()
  const bookId = Number(route.params.id)
  const mapStore = useMapStore()

  const { proxy } = getCurrentInstance()!
  const matomo = proxy?.$matomo

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
    switch (type) {
      case 'city': return cityIcon
      case 'place': return placeIcon
      case 'route': return routeIcon
      default: return placeIcon
    }
  }

  const addMapItem = async () => {
    if (!newItem.value.name.trim()) return
    await mapStore.createMapItem(newItem.value)
    newItem.value.name = ''
    newItem.value.description = ''
    await mapStore.fetchMapItems(bookId)
    matomo?.trackEvent('map', 'used')
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
    width: 350px;
    background: white;
    border-right: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
  }

  .sidebar-header {
    background: linear-gradient(135deg, #3C68C2, #2558B8);
    color: white;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .header-icon {
    width: 24px;
    height: 24px;
    filter: brightness(0) invert(1);
  }

  .sidebar-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .form-section {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .form-select,
  .form-input,
  .form-textarea {
    padding: 0.75rem;
    font-size: 0.95rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    transition: all 0.2s ease;
    background-color: #fafafa;
  }

  .form-select:focus,
  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #3C68C2;
    background-color: white;
    box-shadow: 0 0 0 3px rgba(60, 104, 194, 0.1);
  }

  .form-textarea {
    min-height: 80px;
    resize: vertical;
  }

  .add-button {
    padding: 0.75rem 1rem;
    font-weight: 600;
    background: #3C68C2;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(60, 104, 194, 0.3);
  }

  .add-button:hover {
    background-color: #2558B8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(60, 104, 194, 0.4);
  }

  .button-icon {
    width: 16px;
    height: 16px;
    filter: brightness(0) invert(1);
  }

  .detail {
    background: #f8f9fa;
    border-top: 1px solid #e0e0e0;
    padding: 1.5rem;
  }

  .detail h3 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .detail-item {
    margin-bottom: 0.75rem;
    color: #555;
    font-size: 0.95rem;
  }

  .detail-item strong {
    color: #333;
    font-weight: 600;
  }

  .delete-button {
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1rem;
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
  }

  .delete-button:hover {
    background-color: #c82333;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
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

  .map-icon {
    width: 18px;
    height: 18px;
    margin-right: 0.5rem;
    filter: invert(27%) sepia(55%) saturate(2341%) hue-rotate(211deg) brightness(89%) contrast(89%);
  }

  .label {
    font-weight: 600;
  }
  </style>
