import { reactive } from 'vue'
import axios from 'axios'

export const auth = reactive({
  loggedIn: false,
  userId: null
})

export async function checkAuth() {
  try {
    const res = await axios.get('http://localhost:3000/me', {
      withCredentials: true
    })

    auth.loggedIn = true
    auth.userId = res.data.userId
  } catch (err) {
    auth.loggedIn = false
    auth.userId = null
  }
}