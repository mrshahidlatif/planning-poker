<template>
  <div class="text-center font-normal text-neutral-500">
    <p class="tracking-widest text-xl mb-6">Votes revealed</p>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-end justify-center">
      <!-- Min vote -->
      <div v-if="stats.min" class="space-y-2">
        <p class="text-9xl font-extrabold">{{ stats.min.value }}</p>
        <p class="text-gray-700 text-sm">
          {{ stats.min.count }} vote{{ stats.min.count > 1 ? "s" : "" }}
        </p>
        <p class="text-sm text-gray-500">Min</p>
      </div>

      <!-- Most frequent vote -->
      <div class="space-y-2">
        <p class="text-9xl font-extrabold">
          {{ stats.mostFrequent.value }}
        </p>
        <p class="text-gray-700 text-sm">
          {{ stats.mostFrequent.times }} vote{{
            stats.mostFrequent.times > 1 ? "s" : ""
          }}
        </p>
        <p class="text-sm text-gray-500">Most Frequent</p>
      </div>

      <!-- Max vote -->
      <div v-if="stats.max" class="space-y-2">
        <p class="text-9xl font-extrabold">{{ stats.max.value }}</p>
        <p class="text-gray-700 text-sm">
          {{ stats.max.count }} vote{{ stats.max.count > 1 ? "s" : "" }}
        </p>
        <p class="text-sm text-gray-500">Max</p>
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
