<template>
  <div
    class="flex flex-1 flex-col items-center justify-center text-center px-4 min-h-[calc(100vh-100px)]"
  >
    <h1 class="text-3xl font-semibold text-gray-800 mb-4">
      Estimate stories with your team
    </h1>
    <p class="text-gray-600 max-w-md mb-8">
      Create a room and invite others to vote using Fibonacci cards. Results are
      revealed only by the admin.
    </p>
    <button
      @click="createRoom"
      class="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 transition"
    >
      Create Room
    </button>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

const generateRoomName = () => {
  const adjectives = ["Witty", "Cheesy", "Speedy", "Fuzzy", "Cranky"];
  const animals = ["Unicorn", "Koala", "Llama", "Tiger", "Penguin"];
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

  return `${randomAdjective}${randomAnimal}${Math.floor(Math.random() * 1000)}`;
};

const createRoom = (): void => {
  const roomName = generateRoomName();
  router.push(`/room/${roomName}`);
};
</script>
