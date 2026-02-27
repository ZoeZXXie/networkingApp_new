<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const users = ref([])

async function loadUsers() {
  const res = await axios.get('http://localhost:3000/api/friends/all', 
  { withCredentials: true }
) 
  users.value = res.data
}

async function toggleFriend(user) {
  if (user.relation === 'friends') {
    await axios.delete(`http://localhost:3000/api/friends/${user.id}`,
      { withCredentials: true }
    )
    user.relation = 'none'
  } else {
    await axios.post(`http://localhost:3000/api/friends/${user.id}`, {},
      { withCredentials: true }
    )
    user.relation = 'friends'
  }
}

onMounted(loadUsers)
</script>

<template>
  <div class="page">
    <div class="card">
      <div class="header">
        <button class="back-btn" @click="$router.back()">← Back</button>
        <h2>Friends Directory</h2>
      </div>

      <div
        v-for="user in users"
        :key="user.id"
        class="user-row"
      >
        <span class="name">{{ user.username }}</span>

        <button
          :class="user.relation === 'friends' ? 'remove' : 'add'"
          @click="toggleFriend(user)"
        >
          {{ user.relation === 'friends' ? 'Remove Friend' : 'Add Friend' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(to right, #f5f7fa, #e4ecf7);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.card {
  background: white;
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  padding: 25px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
}

h2 {
  margin: 0;
  font-weight: 600;
  color: #333;
}

.back-btn {
  background: #e0e0e0;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.back-btn:hover {
  background: #cfcfcf;
}

.user-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.user-row:last-child {
  border-bottom: none;
}

.name {
  font-weight: 500;
  color: #444;
}

button {
  padding: 7px 14px;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.add {
  background: #4caf50;
  color: white;
}

.add:hover {
  background: #43a047;
  transform: scale(1.05);
}

.remove {
  background: #f44336;
  color: white;
}

.remove:hover {
  background: #e53935;
  transform: scale(1.05);
}
</style>