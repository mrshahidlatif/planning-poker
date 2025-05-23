<template>
  <div class="text-center text-neutral-500">
    <p class="tracking-widest text-lg pt-3">Votes Summary</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-end justify-center">
      <!-- Min vote -->
      <div v-if="stats.min" class="">
        <p class="text-5xl font-extrabold text-gray-600">
          {{ stats.min.value }}
        </p>
        <p class="text-gray-700 text-sm">
          {{ stats.min.count }} vote{{ stats.min.count > 1 ? "s" : "" }}
        </p>
        <p class="text-xs text-gray-500">Min</p>
      </div>

      <!-- Most frequent vote -->
      <div class="">
        <p class="text-5xl font-extrabold text-green-600">
          {{ stats.mostFrequent.value }}
        </p>
        <p class="text-gray-700 text-sm">
          {{ stats.mostFrequent.times }} vote{{
            stats.mostFrequent.times > 1 ? "s" : ""
          }}
        </p>
        <p class="text-xs text-gray-500">Most Frequent</p>
      </div>

      <!-- Max vote -->
      <div v-if="stats.max">
        <p class="text-5xl font-extrabold text-red-600">
          {{ stats.max.value }}
        </p>
        <p class="text-gray-700 text-sm">
          {{ stats.max.count }} vote{{ stats.max.count > 1 ? "s" : "" }}
        </p>
        <p class="text-xs text-gray-500">Max</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type VoteStats = {
  min?: { value: string; count: number };
  max?: { value: string; count: number };
  mostFrequent: { value: string; times: number };
  questionVote?: { value: string; count: number };
};

defineProps<{
  stats: VoteStats;
}>();
</script>
