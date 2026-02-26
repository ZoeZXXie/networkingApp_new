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
    <h2>Friends Directory</h2>

    <div v-for="user in users" :key="user.id" class="user-row">
      <span class="name">{{ user.username }}</span>

      <button
        :class="user.relation === 'friends' ? 'remove' : 'add'"
        @click="toggleFriend(user)"
      >
        {{ user.relation === 'friends' ? 'Remove Friend' : 'Add Friend' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.page {
  max-width: 600px;
  margin: auto;
}

.directory {
  max-width: 500px;
  margin: auto;
}

.user-row {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.name {
  font-weight: 500;
}

button {
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.add {
  background: #4caf50;
  color: white;
  border: none;
}

.remove {
  background: #f44336;
  color: white;
  border: none;
}
</style>