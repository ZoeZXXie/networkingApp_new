<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

async function signup() {
  try {
    await axios.post(
      'http://localhost:3000/signup',
      {
        username: username.value,
        email: email.value,
        password: password.value
      },
      { withCredentials: true }
    )

    router.push('/login')
  } catch (err) {
    error.value = err.response?.data?.message || "Signup failed"
  }
}
</script>

<template>
  <div class="auth-card">
    <h1>Sign Up</h1>

    <input v-model="username" placeholder="Username" />
    <input v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />

    <button @click="signup">Create Account</button>

    <p style="color:red">{{ error }}</p>

    <p>
      Already have an account?
      <router-link to="/login">Login</router-link>
    </p>
  </div>
</template>

<style scoped>
.auth-card {
  background: white;
  padding: 40px;
  width: 350px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  text-align: center;
}

.auth-card h2 {
  margin-bottom: 5px;
}

.subtitle {
  font-size: 14px;
  color: gray;
  margin-bottom: 25px;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  transition: 0.2s;
}

input:focus {
  border-color: #4f46e5;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #4f46e5;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  background: #4338ca;
}

.error {
  color: red;
  font-size: 13px;
  margin-top: 10px;
}

.switch {
  margin-top: 20px;
  font-size: 14px;
}

.switch a {
  color: #4f46e5;
  font-weight: bold;
  text-decoration: none;
}
</style>