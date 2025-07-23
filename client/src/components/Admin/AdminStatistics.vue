<template>
  <div class="admin-statistics">
    <h2>System Statistics</h2>
    
    <!-- User Statistics -->
    <div class="stats-section">
      <h3>User Statistics</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ userStats.total }}</div>
          <div class="stat-label">Total Users</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ userStats.admins }}</div>
          <div class="stat-label">Admin Users</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ userStats.members }}</div>
          <div class="stat-label">Member Users</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ userStats.recentlyCreated }}</div>
          <div class="stat-label">New Users (30 days)</div>
        </div>
      </div>
    </div>

    <!-- Content Statistics -->
    <div class="stats-section">
      <h3>Content Statistics</h3>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ contentStats.totalBooks }}</div>
          <div class="stat-label">Total Books</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ contentStats.totalChapters }}</div>
          <div class="stat-label">Total Chapters</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ contentStats.totalCharacters }}</div>
          <div class="stat-label">Total Characters</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ contentStats.totalComments }}</div>
          <div class="stat-label">Total Comments</div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="stats-section">
      <h3>Recent Activity</h3>
      <div class="activity-list">
        <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
          <div class="activity-icon" :class="activity.type">
            {{ getActivityIcon(activity.type) }}
          </div>
          <div class="activity-content">
            <div class="activity-text">{{ activity.description }}</div>
            <div class="activity-date">{{ formatDate(activity.date) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Refresh Button -->
    <div class="actions">
      <button @click="fetchAllStats" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Loading...' : 'Refresh Statistics' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '@/services/api'

export default {
  name: 'AdminStatistics',
  setup() {
    const loading = ref(false)
    const userStats = ref({
      total: 0,
      admins: 0,
      members: 0,
      recentlyCreated: 0
    })
    const contentStats = ref({
      totalBooks: 0,
      totalChapters: 0,
      totalCharacters: 0,
      totalComments: 0
    })
    const recentActivities = ref([])

    const fetchUserStats = async () => {
      try {
        const response = await api.get('/admin/users/stats')
        userStats.value = response.data.data
      } catch (error) {
        console.error('Error fetching user stats:', error)
      }
    }

    const fetchContentStats = async () => {
      try {
        // Fetch books count
        const booksResponse = await api.get('/admin/books')
        contentStats.value.totalBooks = booksResponse.data.data.length

        // Fetch chapters count
        const chaptersResponse = await api.get('/admin/chapters')
        contentStats.value.totalChapters = chaptersResponse.data.data.length

        // Fetch characters count
        const charactersResponse = await api.get('/admin/characters')
        contentStats.value.totalCharacters = charactersResponse.data.data.length

        // Fetch comments count
        const commentsResponse = await api.get('/admin/comments')
        contentStats.value.totalComments = commentsResponse.data.data.length
      } catch (error) {
        console.error('Error fetching content stats:', error)
      }
    }

    const fetchRecentActivities = async () => {
      try {
        // Since we don't have a specific activity log, we'll create mock recent activities
        // based on the most recent books and users
        const [usersResponse, booksResponse] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/books')
        ])

        const activities = []
        
        // Add recent users
        const recentUsers = usersResponse.data.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3)
        
        recentUsers.forEach(user => {
          activities.push({
            id: `user-${user.id}`,
            type: 'user',
            description: `New user registered: ${user.email}`,
            date: user.created_at
          })
        })

        // Add recent books
        const recentBooks = booksResponse.data.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3)
        
        recentBooks.forEach(book => {
          activities.push({
            id: `book-${book.id}`,
            type: 'book',
            description: `New book created: "${book.title}"`,
            date: book.created_at
          })
        })

        // Sort activities by date and take the most recent 6
        recentActivities.value = activities
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 6)
      } catch (error) {
        console.error('Error fetching recent activities:', error)
      }
    }

    const fetchAllStats = async () => {
      loading.value = true
      try {
        await Promise.all([
          fetchUserStats(),
          fetchContentStats(),
          fetchRecentActivities()
        ])
      } finally {
        loading.value = false
      }
    }

    const getActivityIcon = (type) => {
      switch (type) {
        case 'user': return '👤'
        case 'book': return '📚'
        case 'chapter': return '📄'
        case 'comment': return '💬'
        default: return '📝'
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
      
      if (diffInHours < 1) return 'Just now'
      if (diffInHours < 24) return `${diffInHours} hours ago`
      if (diffInHours < 48) return 'Yesterday'
      return date.toLocaleDateString()
    }

    onMounted(() => {
      fetchAllStats()
    })

    return {
      loading,
      userStats,
      contentStats,
      recentActivities,
      fetchAllStats,
      getActivityIcon,
      formatDate
    }
  }
}
</script>

<style scoped>
.admin-statistics {
  max-width: 100%;
}

.admin-statistics h2 {
  margin: 0 0 30px 0;
  color: #333;
}

.stats-section {
  margin-bottom: 30px;
}

.stats-section h3 {
  margin: 0 0 15px 0;
  color: #555;
  font-size: 18px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #007bff;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.activity-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 15px;
}

.activity-icon.user {
  background: #e3f2fd;
}

.activity-icon.book {
  background: #f3e5f5;
}

.activity-icon.chapter {
  background: #e8f5e8;
}

.activity-icon.comment {
  background: #fff3e0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.activity-date {
  font-size: 12px;
  color: #666;
}

.actions {
  margin-top: 30px;
  text-align: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
