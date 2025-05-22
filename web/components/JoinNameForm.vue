<template>
  <div class="w-full max-w-sm space-y-4 mt-20">
    <h1 class="text-2xl font-bold text-center text-gray-800">
      Enter Your Name
    </h1>
    <input
      v-model="name"
      type="text"
      placeholder="Your name"
      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      :disabled="!name.trim()"
      class="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
      @click="onSubmit"
    >
      Join Room
    </button>
  </div>
</template>

<script setup lang="ts">
const name = ref("");

const emit = defineEmits<{
  (e: "submit", name: string): void;
}>();

const onSubmit = () => {
  if (!name.value.trim()) return;
  emit("submit", name.value);
};
</script>
