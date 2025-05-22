<template>
  <div class="text-center">
    <h3 class="text-lg font-semibold mb-3 text-gray-700">
      Pick your estimate:
    </h3>
    <div class="flex flex-wrap justify-center gap-3">
      <button
        v-for="number in numbers"
        :key="number"
        :disabled="disabled"
        :class="[
          'px-5 py-3 rounded-full text-lg font-semibold transition',
          selectedVote === number
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
        @click="onVote(number)"
      >
        {{ number }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  numbers: (number | string)[];
  selectedVote: number | string | null;
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: "vote", vote: number | string): void;
}>();

const onVote = (vote: number | string) => {
  if (props.disabled) return;
  emit("vote", vote);
};
</script>
