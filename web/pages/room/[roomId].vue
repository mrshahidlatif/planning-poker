<template>
  <div
    class="flex flex-col items-center justify-start min-h-[calc(100vh-100px)] p-6 bg-gray-50"
  >
    <JoinNameForm v-if="!nameSubmitted" @submit="savedName" />

    <!-- Game Interface -->
    <div v-else class="w-full max-w-4xl space-y-5 mt-2">
      <RoomHeader :user-name="userName" :room-id="roomId" :is-admin="isAdmin" />

      <VoteSelection
        :numbers="fibNumbers"
        :selected-vote="selectedVote"
        :disabled="votesRevealed"
        @vote="vote"
      />

      <AdminControls v-if="isAdmin" @reveal="reveal" @reset="reset" />

      <VoteResults v-if="votesRevealed && voteStats" :stats="voteStats" />

      <ParticipantsList
        :users="users"
        :votes-revealed="votesRevealed"
        :is-admin="isAdmin"
        :current-user-name="userName"
        :is-loading="isLoadingParticipants"
        :error="participantsError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWebSocket } from "~/composables/useWebSocket";

type User = { name: string; vote: number | "?" | null };
type Vote = number | "?" | null;

const route = useRoute();

const userName = ref("");
const socketId = ref("");
const nameSubmitted = ref(false);
const selectedVote = ref<Vote>(null);
const votesRevealed = ref(false);
const isAdmin = ref(false);
const adminToken = ref("");
const isLoadingParticipants = ref(true);
const participantsError = ref<string | undefined>();

const users = ref<Record<string, User>>({});

const fibNumbers = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, "?"];

const socket = useWebSocket();

const roomId = computed(() => String(route.params.roomId));

const savedName = (name: string): void => {
  if (!name.trim()) return;

  isLoadingParticipants.value = true;
  // Check if this is a new room (no name stored for this room)
  const isNewRoom = !sessionStorage.getItem(`name:${roomId.value}`);

  if (isNewRoom) {
    // Generate and store admin token for new room
    adminToken.value = crypto.randomUUID();
    sessionStorage.setItem(`adminToken:${roomId.value}`, adminToken.value);
  } else {
    // Get existing admin token
    adminToken.value =
      sessionStorage.getItem(`adminToken:${roomId.value}`) || "";
  }

  sessionStorage.setItem(`name:${roomId.value}`, name);
  userName.value = name;
  nameSubmitted.value = true;

  socket.emit("join-room", {
    roomId: roomId.value,
    name: name,
    adminToken: adminToken.value,
  });
};

const vote = (vote: string | number): void => {
  if (votesRevealed.value) return;
  selectedVote.value = vote as Vote;
  socket.emit("vote", {
    roomId: roomId.value,
    name: userName.value,
    vote,
  });
};

const reveal = (): void => {
  socket.emit("reveal", {
    roomId: roomId.value,
    name: userName.value,
    adminToken: adminToken.value,
  });
};

const reset = (): void => {
  selectedVote.value = null;
  socket.emit("reset", {
    roomId: roomId.value,
    name: userName.value,
    adminToken: adminToken.value,
  });
};

const voteSummary = computed(() => {
  const countMap: Record<string, number> = {};

  for (const user of Object.values(users.value)) {
    const vote = user.vote ?? "No vote";
    countMap[vote] = (countMap[vote] || 0) + 1;
  }

  return Object.entries(countMap).map(([value, count]) => ({
    value,
    count,
  }));
});

const voteStats = computed(() => {
  if (!votesRevealed.value) return null;

  const votes = voteSummary.value.filter((v) => v.value !== "No vote");

  if (!votes.length) return null;

  // Sort numerically, treating "?" as special
  const numericVotes = votes.filter((v) => v.value !== "?");
  const questionVote = votes.find((v) => v.value === "?");

  numericVotes.sort((a, b) => Number(a.value) - Number(b.value));

  const minVote = numericVotes[0];
  const maxVote = numericVotes[numericVotes.length - 1];

  // Compute most frequent vote
  let times = 0;
  let vote: string | null = null;

  for (const { value, count } of votes) {
    if (count > times) {
      times = count;
      vote = value;
    }
  }

  const mostFrequent = { value: vote || '', times };

  return {
    min: minVote,
    max: maxVote,
    mostFrequent,
    questionVote,
  };
});

onMounted(() => {
  socket.on("connect", () => {
    if (!socket.id) return;
    socketId.value = socket.id;
  });

  socket.on("connect_error", () => {
    participantsError.value = "Failed to connect to server. Please try again later.";
    isLoadingParticipants.value = false;
  });

  const savedName = sessionStorage.getItem(`name:${roomId.value}`);
  const storedAdminToken = sessionStorage.getItem(`adminToken:${roomId.value}`);

  if (savedName) {
    userName.value = savedName;
    adminToken.value = storedAdminToken || "";
    nameSubmitted.value = true;
    isLoadingParticipants.value = true;
    participantsError.value = undefined;
    socket.emit("join-room", {
      roomId: roomId.value,
      name: savedName,
      adminToken: adminToken.value,
    });
  }

  socket.on("room-state", (data) => {
    participantsError.value = undefined;
    users.value = data.users;
    isAdmin.value = data.adminToken === adminToken.value;
    votesRevealed.value = data.votesRevealed;
    isLoadingParticipants.value = false;

    // Update selected vote based on the user's current vote in the room state
    const currentUser = data.users[userName.value];
    if (currentUser) {
      selectedVote.value = currentUser.vote;
    }
  });

  socket.on("error", (error) => {
    participantsError.value = error.message || "An error occurred while connecting to the room.";
    isLoadingParticipants.value = false;
  });
});
</script>
