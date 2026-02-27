<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import axios from 'axios'

const user = ref(null)
const loading = ref(true)
const router = useRouter()

const editing = ref(false)
const form = ref({
  username: '',
  bio: '',
  avatar: null
})

onMounted(async () => {
  try {
    const res = await axios.get(
      'http://localhost:3000/api/users/me',
      { withCredentials: true }
    )
    user.value = res.data
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
})

function goFriends() {
  router.push(`/friends/${user.value.id}`) 
}

function goMessages() {
  router.push('/messages') 
}

function openEdit() {
  form.value.username = user.value.username
  form.value.bio = user.value.bio
  editing.value = true
}

function handleFile(e) {
  form.value.avatar = e.target.files[0]
}

async function saveProfile() {
  try {
    const formData = new FormData()
    formData.append('username', form.value.username)
    formData.append('bio', form.value.bio)

    if (form.value.avatar) {
      formData.append('avatar', form.value.avatar)
    }

    const res = await axios.put(
      'http://localhost:3000/api/users/update',
      formData,
      { withCredentials: true }
    )

    user.value = res.data
    editing.value = false

  } catch (err) {
    console.log(err)
  }
}

</script>

<template>
    <div v-if="loading">Loading...</div>
    <div v-else class="profile-page">

    <!-- Profile Header -->
    <div class="profile-header">
      <img :src="user.avatar ? `http://localhost:3000${user.avatar}`: 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random&color=fff&size=150`"
      class="avatar"
      /> 

      <div class="user-info">
        <h2>{{ user.username }}</h2>
        <p class="bio">{{ user.bio || 'No bio yet.' }}</p>

        <button class="edit-btn" @click="openEdit">Edit Profile</button>
      </div>
    </div>

    <div v-if="editing" class="modal">
      <div class="modal-content">
        <h3>Edit Profile</h3>

        <input v-model="form.username" placeholder="Username" />
        <textarea v-model="form.bio" placeholder="Bio"></textarea>

        <input type="file" @change="handleFile" />

        <div class="modal-actions">
          <button @click="saveProfile">Save</button>
          <button @click="editing = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats">
        <div class="stat clickable" @click="goFriends">
            <strong>{{ user.friends }}</strong>
            <span>Friends</span>
        </div>

      <div class="stat clickable" @click="goMessages">
        <strong>{{ user.posts }}</strong>
        <span>Messages</span>
      </div>
    </div>

  </div>
</template>

<style scoped>
.profile-page {
  width: 800px;
  max-width: 95%;
}

/* HEADER */
.profile-header {
  background: white;
  padding: 30px;
  border-radius: 16px;
  display: flex;
  gap: 30px;
  align-items: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info h2 {
  margin: 0;
}

.bio {
  color: gray;
  margin: 10px 0 15px 0;
}

.edit-btn {
  background: #4f46e5;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

/* STATS */
.stats {
  margin-top: 20px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.stat {
  text-align: center;
}

.stat strong {
  font-size: 20px;
  display: block;
}

.stat.clickable {
  cursor: pointer;
  transition: 0.2s;
}

.stat.clickable:hover {
  color: #4f46e5;
}
/* modal */

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 400px;
}

.modal-actions {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}
</style>