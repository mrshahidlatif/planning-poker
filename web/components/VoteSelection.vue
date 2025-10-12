<template>
  <div class="text-center">
    <p class="text-md mb-2 text-gray-700">Pick your estimate:</p>
    <div class="flex flex-wrap justify-center gap-3">
      <button
        v-for="option in options"
        :key="option"
        :class="[
          'px-5 py-3 rounded-full text-lg font-semibold transition',
          {
            'bg-blue-600 text-white': selectedVote === option,
            'bg-gray-200 text-gray-800 hover:bg-gray-300':
              selectedVote !== option,
            'opacity-50 cursor-not-allowed': disabled,
          },
        ]"
        :disabled="disabled"
        @click="onVote(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { options, selectedVote, disabled } = defineProps<{
  options: (number | string)[];
  selectedVote: number | string | null;
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: "vote", vote: number | string): void;
}>();

const onVote = (vote: number | string) => {
  if (disabled) return;
  emit("vote", vote);
};
</script>
