<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { checkAuth, auth } from '@/store/auth'
import axios from 'axios'

const router = useRouter()

async function logout() {
  await axios.post(
    'http://localhost:3000/logout',
    {},
    { withCredentials: true }
  )
  await checkAuth()
  router.push('/login')
}

onMounted(() => {
  checkAuth()
})
</script>

<template>
  <div class="app">
    <header class="navbar">
        <div class="left">
            <router-link to="/home" class="logo">
              ConnectHub
            </router-link>
        </div>

        <div class="right">
            <button v-if="auth.loggedIn" @click="router.push('/profile')">
            Profile
            </button>

            <button v-if="auth.loggedIn" @click="logout">
            Logout
            </button>

            <button v-if="!auth.loggedIn" @click="router.push('/login')">
            Login
            </button>
        </div>
    </header>

    <!-- Page Content -->
     <main>
        <router-view />
     </main>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #4f46e5, #3b82f6);
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.navbar {
  background: white;
  padding: 15px 30px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);

  display: flex;
  justify-content: space-between;
  align-items: center;  
}
.left {
  font-weight: bold;
  color: #4f46e5;
}

.logo {
  text-decoration: none;
  font-size: 22px;
  font-weight: bold;
  color: #4f46e5;
  transition: 0.2s;
}

.logo:hover {
  color: #4338ca;
}

.right {
  display: flex;
  gap: 12px;  /* space between buttons */
}

.right button {
  background: #4f46e5;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
}

.right button:hover {
  background: #4338ca;
}

</style>