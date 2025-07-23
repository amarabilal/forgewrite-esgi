<template>
  <div class="admin-dashboard">
    <div class="admin-header">
      <h1>Admin Dashboard</h1>
      <div class="admin-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="{ active: activeTab === tab.key }"
          class="nav-btn"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- User Management Tab -->
    <div v-if="activeTab === 'users'" class="tab-content">
      <AdminUserManagement />
    </div>

    <!-- Books Management Tab -->
    <div v-if="activeTab === 'books'" class="tab-content">
      <AdminBookManagement />
    </div>

    <!-- Statistics Tab -->
    <div v-if="activeTab === 'stats'" class="tab-content">
      <AdminStatistics />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'vue-router'
import AdminUserManagement from '@/components/Admin/AdminUserManagement.vue'
import AdminBookManagement from '@/components/Admin/AdminBookManagement.vue'
import AdminStatistics from '@/components/Admin/AdminStatistics.vue'

export default {
  name: 'AdminDashboard',
  components: {
    AdminUserManagement,
    AdminBookManagement,
    AdminStatistics
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const activeTab = ref('users')

    const tabs = [
      { key: 'users', label: 'User Management' },
      { key: 'books', label: 'Book Management' },
      { key: 'stats', label: 'Statistics' }
    ]

    onMounted(() => {
      // Check if user is admin
      if (!authStore.user || authStore.user.role !== 'admin') {
        router.push('/login')
      }
    })

    return {
      activeTab,
      tabs
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.admin-header {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-header h1 {
  margin: 0 0 20px 0;
  color: #333;
}

.admin-nav {
  display: flex;
  gap: 10px;
}

.nav-btn {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-btn:hover {
  border-color: #007bff;
  color: #007bff;
}

.nav-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.tab-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
