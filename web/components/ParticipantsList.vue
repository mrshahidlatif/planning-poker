<template>
  <div>
    <h4 class="text-lg font-semibold mb-2 text-gray-800">Participants</h4>
    <ul class="space-y-2">
      <li
        v-for="(user, socketId) in users"
        :key="socketId"
        class="flex justify-between items-center px-4 py-2 bg-white rounded-md shadow-sm"
      >
        <span class="text-gray-700 font-medium">{{ user.name }}</span>
        <span class="text-sm">
          <span v-if="votesRevealed">
            <strong>{{ user.vote ?? "No vote" }}</strong>
          </span>
          <span v-else>
            <em class="text-gray-500">{{ user.vote ? "Voted" : "Waiting" }}</em>
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
type User = { name: string; vote: number | "?" | null };

defineProps<{
  users: Record<string, User>;
  votesRevealed: boolean;
}>();
</script>
