<template>
  <div
    class="flex flex-col items-center justify-start min-h-[calc(100vh-100px)] p-6 bg-gray-50"
  >
    <JoinRoomForm
      v-if="!userStore.nameSubmitted"
      @submit="sessionStore.createSession"
    />

    <!-- Game Interface -->
    <div v-else class="w-full max-w-4xl space-y-5 mt-2">
      <!-- Notification -->
      <div
        v-if="userStore.notification"
        class="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-2 text-blue-600"
      >
        <Icon name="material-symbols:info-outline-rounded" size="22" />
        <span>{{ userStore.notification }}</span>
      </div>

      <RoomHeader
        :user-name="userStore.userName"
        :room-id="sessionStore.roomId"
        :is-admin="userStore.isAdmin"
      />

      <VoteSelection
        :options
        :selected-vote="votingStore.selectedVote"
        :disabled="votingStore.votesRevealed"
        @vote="votingStore.vote"
      />

      <AdminControls
        v-if="userStore.isAdmin"
        @reveal="votingStore.reveal"
        @reset="votingStore.reset"
      />

      <VoteResults v-if="voteStatsForDisplay" :stats="voteStatsForDisplay" />

      <ParticipantsList
        :users="userStore.users"
        :votes-revealed="votingStore.votesRevealed"
        :admin-user-id="adminUserId"
        :current-user-name="userStore.userName"
        :is-loading="sessionStore.isLoadingParticipants"
        :error="sessionStore.error"
        @make-admin="handleMakeAdmin"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessionStore } from "~/stores/useSessionStore";
import { useUserStore } from "~/stores/useUserStore";
import { useVotingStore } from "~/stores/voting";
import { useWebSocketStore } from "~/stores/useWebSocketStore";

const options = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, "?"];

const route = useRoute();
const sessionStore = useSessionStore();
const userStore = useUserStore();
const votingStore = useVotingStore();
const websocketStore = useWebSocketStore();
const adminUserId = ref<string>();

const roomId = computed(() => String(route.params.roomId));

const voteStatsForDisplay = computed(() =>
  votingStore.votesRevealed && votingStore.voteStats
    ? votingStore.voteStats
    : null
);

const setupWebSocketListeners = () => {
  websocketStore.init();

  websocketStore.socket.on("room-state", (data) => {
    sessionStore.handleRoomState(data);
    userStore.handleRoomState(data);
    votingStore.handleVotesRevealed(data.votesRevealed);

    adminUserId.value = data.adminUserId;

    const currentUser = data.users[userStore.userId];
    if (currentUser) {
      votingStore.handleUserVote(userStore.userId, currentUser.vote);
    }
  });

  websocketStore.socket.on("error", (error) => {
    sessionStore.handleError(error);
  });
};

const cleanupWebSocketListeners = () => {
  websocketStore.clear();
  websocketStore.socket.off("room-state");
  websocketStore.socket.off("error");
};

const handleMakeAdmin = (userId: string) => {
  websocketStore.socket.emit("make-admin", {
    roomId: sessionStore.roomId,
    adminUserId: userStore.userId,
    newAdminUserId: userId,
  });
};

onMounted(() => {
  userStore.initialize();
  sessionStore.initialize(roomId.value);
  setupWebSocketListeners();
});

onUnmounted(() => {
  cleanupWebSocketListeners();
  sessionStore.destroy();
  userStore.reset();
  votingStore.resetState();
});
</script>
