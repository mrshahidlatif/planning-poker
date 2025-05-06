<template>
    <div class="flex items-center justify-center h-screen bg-white p-4">
      <div v-if="!nameSubmitted" class="w-full max-w-sm space-y-4">
        <h1 class="text-2xl font-semibold text-center">Enter Your Name</h1>
        <input
          v-model="userName"
          type="text"
          placeholder="Your name"
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          @click="submitName"
          :disabled="!userName.trim()"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          Join Room
        </button>
      </div>
  
      <div v-else class="text-center space-y-6 w-full max-w-2xl">
        <div>
          <h2 class="text-xl font-medium">Welcome, {{ userName }}!</h2>
          <p class="text-gray-600">Room: <strong>{{ roomId }}</strong></p>
          <p v-if="isAdmin" class="text-green-600 font-semibold">You are the admin</p>
        </div>
  
        <div>
          <h3 class="mb-2 text-lg">Pick your estimate:</h3>
          <div class="flex flex-wrap justify-center gap-3">
            <button
              v-for="number in fibonacciNumbers"
              :key="number"
              @click="selectVote(number)"
              :disabled="votesRevealed"
              :class="[
                'px-5 py-3 rounded-full text-lg font-medium transition',
                selectedVote === number
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                votesRevealed ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              {{ number }}
            </button>
          </div>
  
          <div v-if="selectedVote !== null" class="mt-4 text-green-600 font-semibold">
            You selected: {{ selectedVote }}
          </div>
        </div>
  
        <div v-if="isAdmin" class="flex justify-center gap-4 mt-6">
          <button
            @click="revealVotes"
            class="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            Reveal Votes
          </button>
          <button
            @click="resetVotes"
            class="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Reset Votes
          </button>
        </div>
  
        <div v-if="votesRevealed" class="mt-6 text-blue-800 font-semibold">
          ✅ Votes revealed
        </div>
  
        <div class="mt-8">
          <h4 class="text-lg font-semibold mb-2">Participants:</h4>
          <ul class="space-y-1">
            <li
              v-for="(user, socketId) in participants"
              :key="socketId"
              class="text-gray-700"
            >
              {{ user.name }} -
              <span v-if="votesRevealed">
                <strong>{{ user.vote ?? 'No vote' }}</strong>
              </span>
              <span v-else>
                <em>{{ user.vote ? 'Voted' : 'Waiting' }}</em>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useSocket } from '~/composables/useSocket'
  
  const route = useRoute()
  const roomId = computed(() => route.params.roomId as string)
  
  const userName = ref('')
  const nameSubmitted = ref(false)
  const selectedVote = ref<number | '?' | null>(null)
  const votesRevealed = ref(false)
  const isAdmin = ref(false)
  const participants = ref<Record<string, { name: string; vote: number | '?' | null }>>({})
  
  const fibonacciNumbers = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, '?']
  
  const socket = useSocket()
  

const socketId = ref('')


onMounted(() => {
  socket.on('connect', () => {
    socketId.value = socket.id
  })

  const savedName = sessionStorage.getItem(`name:${roomId.value}`)
  if (savedName) {
    userName.value = savedName
    nameSubmitted.value = true
    socket.emit('join-room', { roomId: roomId.value, name: savedName })
  }

  socket.on('room-state', (data) => {
    participants.value = data.users
    isAdmin.value = data.adminId === socket.id
  })

  socket.on('reveal-votes', () => {
    votesRevealed.value = true
  })

  socket.on('reset-votes', () => {
    selectedVote.value = null
    votesRevealed.value = false
  })
})

  
  const submitName = (): void => {
    if (!userName.value.trim()) return
  
    sessionStorage.setItem(`name:${roomId.value}`, userName.value)
  
    nameSubmitted.value = true
  
    socket.emit('join-room', {
      roomId: roomId.value,
      name: userName.value,
    })
  }
  
  const selectVote = (vote: number | '?'): void => {
    if (votesRevealed.value) return
    selectedVote.value = vote
    socket.emit('vote', { roomId: roomId.value, vote })
  }
  
  const revealVotes = (): void => {
    socket.emit('reveal', roomId.value)
  }
  
  const resetVotes = (): void => {
    socket.emit('reset', roomId.value)
  }
  </script>
  