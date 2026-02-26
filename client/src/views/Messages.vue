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
        Chat with {{ activeFriend.username }}
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
  height: 100vh;
}

/* LEFT */
.friends {
  width: 260px;
  border-right: 1px solid #ddd;
  padding: 10px;
}

.friend {
  padding: 10px;
  cursor: pointer;
  border-radius: 6px;
}

.friend:hover {
  background: #f3f4f6;
}

.friend.active {
  background: #6366f1;
  color: white;
}

/* RIGHT */
.chat {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 12px;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.messages-box {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

/* Messages */
.msg {
  max-width: 60%;
  padding: 8px 12px;
  border-radius: 10px;
  margin: 5px 0;
}

.me {
  margin-left: auto;
  background: #6366f1;
  color: white;
}

.them {
  background: #e5e7eb;
}

/* Input */
.input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
}

.input input {
  flex: 1;
  padding: 8px;
}

.input button {
  margin-left: 8px;
  padding: 8px 12px;
}

/* Empty */
.empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
}
</style>