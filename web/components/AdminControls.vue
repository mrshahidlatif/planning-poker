<template>
  <div class="flex justify-center gap-8">
    <button
      class="px-5 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 transition"
      @click="onReveal"
    >
      Reveal
    </button>
    <button
      class="px-5 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-700 transition"
      @click="onReset"
    >
      Reset
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "reveal"): void;
  (e: "reset"): void;
}>();

const onReveal = () => emit("reveal");
const onReset = () => emit("reset");
</script>
