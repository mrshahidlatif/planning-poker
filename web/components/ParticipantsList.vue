<template>
  <div>
    <h4 class="text-lg font-semibold mb-4 text-gray-800">Participants</h4>

    <!-- Error State -->
    <div
      v-if="error"
      class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-2 text-red-600"
    >
      <Icon name="material-symbols:error-outline-rounded" size="22" />
      <span>{{ error }}</span>
    </div>

    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <!-- Loading State -->
      <template v-if="isLoading">
        <ParticipantSkeleton v-for="i in 4" :key="i" />
      </template>

      <!-- Actual Participants -->
      <template v-else>
        <div
          v-for="(user, userId) in users"
          :key="userId"
          :class="[
            'bg-white rounded-lg shadow-sm p-3 flex flex-col justify-between h-20',
            { '!bg-red-50': votesRevealed && user.vote === null },
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="text-gray-700 font-medium truncate tracking-wide">
              {{ user.userName }}
            </span>

            <div class="flex items-center gap-2">
              <span
                v-if="isUserAdmin(userId)"
                class="text-xs text-green-600 font-medium"
              >
                Admin
              </span>
              <button
                v-else-if="isCurrentUserAdmin"
                class="text-xs cursor-pointer text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                @click="makeAdmin(userId)"
              >
                Make Admin
              </button>
            </div>
          </div>
          <div class="mt-2">
            <span v-if="votesRevealed" class="text-xl font-bold text-gray-600">
              <p v-if="user.vote !== null">{{ user.vote }}</p>
              <Icon
                v-else
                name="material-symbols:cancel-outline-rounded"
                class="text-red-400"
                size="22"
              />
            </span>
            <span v-else-if="user.vote !== null">
              <Icon
                name="material-symbols:check-circle"
                class="text-green-500"
                size="22"
              />
            </span>
            <div v-else class="flex items-center">
              <Spinner size="md" />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import Spinner from "./Spinner.vue";
import ParticipantSkeleton from "./ParticipantSkeleton.vue";
import type { User } from "~/types";
import { useUserStore } from "~/stores/useUserStore";

const { userId } = useUserStore();

const { adminUserId } = defineProps<{
  users: Record<string, User>;
  votesRevealed: boolean;
  adminUserId?: string;
  currentUserName: string;
}>();

const { isLoading } = storeToRefs(useSessionStore());
const { error } = storeToRefs(useWebSocketStore());

// Check if current user is admin
const isCurrentUserAdmin = computed(() => {
  return adminUserId && userId === adminUserId;
});

// Check if a specific user is admin
const isUserAdmin = (userId: string) => {
  return adminUserId && userId === adminUserId;
};

// Emit event for making a user admin
const emit = defineEmits<{
  makeAdmin: [userId: string];
}>();

const makeAdmin = (userId: string) => {
  emit("makeAdmin", userId);
};
</script>
