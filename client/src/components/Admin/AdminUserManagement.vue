<template>
  <div class="user-management">
    <div class="header">
      <h2>User Management</h2>
      <button @click="showCreateModal = true" class="btn btn-primary">
        <i class="icon">+</i> Add User
      </button>
    </div>

    <!-- Users Table -->
    <div class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Books</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['role-badge', user.role]">
                {{ user.role }}
              </span>
            </td>
            <td>{{ user._count.books }}</td>
            <td>{{ formatDate(user.created_at) }}</td>
            <td>
              <div class="actions">
                <button @click="viewUser(user)" class="btn btn-sm btn-info">View</button>
                <button @click="editUser(user)" class="btn btn-sm btn-warning">Edit</button>
                <button 
                  @click="deleteUser(user)" 
                  class="btn btn-sm btn-danger"
                  :disabled="user.role === 'admin' && user.id === currentUserId"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create User Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Create New User</h3>
          <button @click="showCreateModal = false" class="close-btn">&times;</button>
        </div>
        <form @submit.prevent="createUser" class="modal-body">
          <div class="form-group">
            <label>Email:</label>
            <input 
              v-model="newUser.email" 
              type="email" 
              required 
              class="form-control"
            >
          </div>
          <div class="form-group">
            <label>Password:</label>
            <input 
              v-model="newUser.password" 
              type="password" 
              required 
              minlength="6"
              class="form-control"
            >
          </div>
          <div class="form-group">
            <label>Role:</label>
            <select v-model="newUser.role" class="form-control">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" @click="showCreateModal = false" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Create User</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Edit User</h3>
          <button @click="showEditModal = false" class="close-btn">&times;</button>
        </div>
        <form @submit.prevent="updateUser" class="modal-body">
          <div class="form-group">
            <label>Email:</label>
            <input 
              v-model="editingUser.email" 
              type="email" 
              required 
              class="form-control"
            >
          </div>
          <div class="form-group">
            <label>Role:</label>
            <select v-model="editingUser.role" class="form-control">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div class="form-group">
            <label>New Password (optional):</label>
            <input 
              v-model="editingUser.password" 
              type="password" 
              minlength="6"
              class="form-control"
              placeholder="Leave empty to keep current password"
            >
          </div>
          <div class="modal-footer">
            <button type="button" @click="showEditModal = false" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Update User</button>
          </div>
        </form>
      </div>
    </div>

    <!-- View User Modal -->
    <div v-if="showViewModal" class="modal-overlay" @click="showViewModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>User Details</h3>
          <button @click="showViewModal = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body" v-if="viewingUser">
          <div class="user-details">
            <p><strong>ID:</strong> {{ viewingUser.id }}</p>
            <p><strong>Email:</strong> {{ viewingUser.email }}</p>
            <p><strong>Role:</strong> {{ viewingUser.role }}</p>
            <p><strong>Books:</strong> {{ viewingUser._count.books }}</p>
            <p><strong>Created:</strong> {{ formatDate(viewingUser.created_at) }}</p>
            <p><strong>Updated:</strong> {{ formatDate(viewingUser.updated_at) }}</p>
          </div>
          <div v-if="viewingUser.books && viewingUser.books.length > 0" class="user-books">
            <h4>User's Books:</h4>
            <div class="books-list">
              <div v-for="book in viewingUser.books" :key="book.id" class="book-item">
                <h5>{{ book.title }}</h5>
                <p>Genre: {{ book.genre || 'N/A' }}</p>
                <p>Status: {{ book.status || 'N/A' }}</p>
                <p>Created: {{ formatDate(book.created_at) }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="showViewModal = false" class="btn btn-secondary">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/store/authStore'
import api from '@/services/api'

export default {
  name: 'AdminUserManagement',
  setup() {
    const authStore = useAuthStore()
    const users = ref([])
    const showCreateModal = ref(false)
    const showEditModal = ref(false)
    const showViewModal = ref(false)
    const viewingUser = ref(null)
    
    const newUser = ref({
      email: '',
      password: '',
      role: 'member'
    })
    
    const editingUser = ref({
      id: null,
      email: '',
      role: '',
      password: ''
    })

    const currentUserId = computed(() => authStore.user?.userId)

    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users')
        users.value = response.data.data
      } catch (error) {
        console.error('Error fetching users:', error)
        alert('Error fetching users')
      }
    }

    const createUser = async () => {
      try {
        await api.post('/admin/users', newUser.value)
        showCreateModal.value = false
        newUser.value = { email: '', password: '', role: 'member' }
        await fetchUsers()
        alert('User created successfully')
      } catch (error) {
        console.error('Error creating user:', error)
        alert(error.response?.data?.message || 'Error creating user')
      }
    }

    const editUser = (user) => {
      editingUser.value = {
        id: user.id,
        email: user.email,
        role: user.role,
        password: ''
      }
      showEditModal.value = true
    }

    const updateUser = async () => {
      try {
        const updateData = {
          email: editingUser.value.email,
          role: editingUser.value.role
        }
        if (editingUser.value.password) {
          updateData.password = editingUser.value.password
        }
        
        await api.put(`/admin/users/${editingUser.value.id}`, updateData)
        showEditModal.value = false
        await fetchUsers()
        alert('User updated successfully')
      } catch (error) {
        console.error('Error updating user:', error)
        alert(error.response?.data?.message || 'Error updating user')
      }
    }

    const viewUser = async (user) => {
      try {
        const response = await api.get(`/admin/users/${user.id}`)
        viewingUser.value = response.data.data
        showViewModal.value = true
      } catch (error) {
        console.error('Error fetching user details:', error)
        alert('Error fetching user details')
      }
    }

    const deleteUser = async (user) => {
      if (user.role === 'admin' && user.id === currentUserId.value) {
        alert('Cannot delete your own admin account')
        return
      }
      
      if (confirm(`Are you sure you want to delete user "${user.email}"? This will delete all their data permanently.`)) {
        try {
          await api.delete(`/admin/users/${user.id}`)
          await fetchUsers()
          alert('User deleted successfully')
        } catch (error) {
          console.error('Error deleting user:', error)
          alert(error.response?.data?.message || 'Error deleting user')
        }
      }
    }

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString()
    }

    onMounted(() => {
      fetchUsers()
    })

    return {
      users,
      showCreateModal,
      showEditModal,
      showViewModal,
      newUser,
      editingUser,
      viewingUser,
      currentUserId,
      fetchUsers,
      createUser,
      editUser,
      updateUser,
      viewUser,
      deleteUser,
      formatDate
    }
  }
}
</script>

<style scoped>
.user-management {
  max-width: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #333;
}

.btn {
  padding: 8px 16px;
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

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
}

.btn-warning:hover {
  background: #e0a800;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #c82333;
}

.btn-danger:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-info:hover {
  background: #138496;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.icon {
  font-size: 16px;
  margin-right: 4px;
}

.table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.users-table th,
.users-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.users-table th {
  background: #f8f9fa;
  font-weight: 600;
}

.users-table tr:hover {
  background: #f5f5f5;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #dc3545;
  color: white;
}

.role-badge.member {
  background: #28a745;
  color: white;
}

.actions {
  display: flex;
  gap: 4px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
}

.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.user-details p {
  margin: 8px 0;
}

.user-books {
  margin-top: 20px;
}

.user-books h4 {
  margin-bottom: 10px;
  color: #333;
}

.books-list {
  display: grid;
  gap: 10px;
}

.book-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f8f9fa;
}

.book-item h5 {
  margin: 0 0 5px 0;
  color: #007bff;
}

.book-item p {
  margin: 2px 0;
  font-size: 12px;
  color: #666;
}
</style>
