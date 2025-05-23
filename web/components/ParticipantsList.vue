<template>
  <div>
    <h4 class="text-lg font-semibold mb-4 text-gray-800">Participants</h4>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <div
        v-for="(user, socketId) in users"
        :key="socketId"
        :class="[
          'bg-white rounded-lg shadow-sm p-3 flex flex-col justify-between h-20',
          { '!bg-red-50': votesRevealed && user.vote === null },
        ]"
      >
        <div class="flex items-center justify-between">
          <span class="text-gray-700 font-medium truncate tracking-wide">
            {{ user.name }}
          </span>
          <span
            v-if="isAdmin && user.name === currentUserName"
            class="text-xs text-green-600 font-medium"
            >Admin</span
          >
        </div>
        <div class="mt-1">
          <span v-if="votesRevealed" class="text-xl font-bold text-gray-600">
            {{ user.vote ?? "😢" }}
          </span>
          <span
            v-else-if="user.vote"
            class="text-sm text-green-600 font-medium"
          >
            Voted
          </span>
          <div v-else class="flex items-center">
            <Spinner size="sm" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Spinner from "./Spinner.vue";

type User = { name: string; vote: number | "?" | null };

defineProps<{
  users: Record<string, User>;
  votesRevealed: boolean;
  isAdmin?: boolean;
  currentUserName: string;
}>();
</script>
