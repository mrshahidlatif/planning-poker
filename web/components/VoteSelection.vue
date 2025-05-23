<template>
  <div class="text-center">
    <p class="text-md mb-2 text-gray-700">
      Pick your estimate:
    </p>
    <div class="flex flex-wrap justify-center gap-3">
      <button
        v-for="number in numbers"
        :key="number"
        :class="[
          'px-5 py-3 rounded-full text-lg font-semibold transition',
          {
            'bg-blue-600 text-white': selectedVote === number,
            'bg-gray-200 text-gray-800 hover:bg-gray-300':
              selectedVote !== number,
            'opacity-50 cursor-not-allowed': disabled,
          },
        ]"
        :disabled="disabled"
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
