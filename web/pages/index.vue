<template>
    <div class="flex items-center justify-center h-screen bg-gray-100">
      <button
        @click="createRoom"
        class="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 transition"
      >
        Create Room
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  const router = useRouter()
  
  const generateRoomName = () => {
    const adjectives = ['Witty', 'Cheesy', 'Speedy', 'Fuzzy', 'Cranky']
    const animals = ['Unicorn', 'Koala', 'Llama', 'Tiger', 'Penguin']
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const randomAnimal = animals[Math.floor(Math.random() * animals.length)]
    return `${randomAdjective}${randomAnimal}${Math.floor(Math.random() * 1000)}`
  }
  
  const createRoom = (): void => {
    const roomName = generateRoomName()
    router.push(`/room/${roomName}`)
  }
  </script>
  