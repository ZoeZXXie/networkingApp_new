<script setup>
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'

const friends = ref([])
const messages = ref([])
const newMessage = ref('')
const loading = ref(false)

const activeFriend = ref(null)

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
})


async function loadFriends() {
  const res = await api.get('/api/friends/all')
  friends.value = res.data
}

async function openChat(friend) {
  activeFriend.value = friend
  await loadMessages()
}

async function loadMessages() {
  if (!activeFriend.value) return

  const res = await api.get(`/api/messages/chat/${activeFriend.value.id}`)
  messages.value = res.data

  scrollBottom()
}

async function sendMessage() {
  if (!newMessage.value.trim()) return

  await api.post(`/api/messages/send/${activeFriend.value.id}`, {
    content: newMessage.value
  })

  newMessage.value = ''
  await loadMessages()
}

/* Scroll chat to bottom */
async function scrollBottom() {
  await nextTick()
  const box = document.querySelector('.messages-box')
  if (box) box.scrollTop = box.scrollHeight
}

onMounted(loadFriends)
</script>

<template>
  <div class="chat-page">

    <div class="friends">
      <h3>Friends</h3>

      <div
        v-for="f in friends"
        :key="f.id"
        class="friend"
        :class="{ active: activeFriend?.id === f.id }"
        @click="openChat(f)"
      >
        {{ f.username }}
      </div>
    </div>

    <!-- RIGHT: CHAT -->
    <div class="chat" v-if="activeFriend">
      <div class="chat-header">
        <button class="back-btn" @click="$router.back()">← Back</button>
        <div class="chat-title">
          Chat with {{ activeFriend.username }}
        </div>
      </div>

      <!-- Messages -->
      <div class="messages-box">
        <div
          v-for="m in messages"
          :key="m.id"
          :class="['msg', m.sender_id === activeFriend.id ? 'them' : 'me']"
        >
          {{ m.content }}
        </div>
      </div>

      <!-- Input -->
      <div class="input">
        <input
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="Type message..."
        />
        <button @click="sendMessage">Send</button>
      </div>
    </div>

    <div v-else class="empty">
      Select a friend to start chatting
    </div>

  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  height: 90vh;
  max-width: 1100px;
  margin: 30px auto;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 15px 40px rgba(0,0,0,0.08);
}

/* LEFT PANEL */
.friends {
  width: 200px;
  border-right: 1px solid #eee;
  padding: 20px;
  background: #fafafa;
}

.friends h3 {
  margin-bottom: 20px;
}

.friend {
  padding: 12px;
  cursor: pointer;
  border-radius: 10px;
  transition: 0.2s;
}

.friend:hover {
  background: #e5e7eb;
}

.friend.active {
  background: #6366f1;
  color: white;
}

/* RIGHT CHAT AREA */
.chat {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* HEADER */
.chat-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  background: #ffffff;
}

.back-btn {
  border: none;
  background: #f3f4f6;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 15px;
  transition: 0.2s;
}

.back-btn:hover {
  background: #e5e7eb;
}

.chat-title {
  font-weight: 600;
}

/* MESSAGE AREA */
.messages-box {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
}

/* MESSAGE BUBBLES */
.msg {
  max-width: 65%;
  padding: 10px 14px;
  border-radius: 14px;
  margin: 6px 0;
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.me {
  align-self: flex-end;
  background: #6366f1;
  color: white;
  border-bottom-right-radius: 4px;
}

.them {
  align-self: flex-start;
  background: #e5e7eb;
  border-bottom-left-radius: 4px;
}

/* INPUT AREA */
.input {
  display: flex;
  padding: 15px;
  border-top: 1px solid #eee;
  background: white;
}

.input input {
  flex: 1;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #ddd;
  outline: none;
  transition: 0.2s;
}

.input input:focus {
  border-color: #6366f1;
}

.input button {
  margin-left: 10px;
  padding: 10px 18px;
  border-radius: 10px;
  border: none;
  background: #6366f1;
  color: white;
  cursor: pointer;
  transition: 0.2s;
}

.input button:hover {
  background: #4f46e5;
}

/* EMPTY STATE */
.empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 14px;
}
</style>