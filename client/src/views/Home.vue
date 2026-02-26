<script setup>
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

async function logout() {
  await axios.post('http://localhost:3000/logout', {}, { withCredentials: true })
  router.push('/login')
}
</script>

<template>
  <div class="feed">
    <div class="post-box">
      <input placeholder="What's on your mind?" />
      <button>Post</button>
    </div>

</template>

<style scoped>
.feed {
  width: 600px;
}

.post-box {
  background: white;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.post-box input {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.post-box button {
  background: #4f46e5;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
}

.post {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}
</style>