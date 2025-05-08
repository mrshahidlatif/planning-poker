<template>
  <div
    class="flex flex-col items-center justify-start min-h-[calc(100vh-100px)] p-6 bg-gray-50"
  >
    <!-- Join Name Form -->
    <div v-if="!nameSubmitted" class="w-full max-w-sm space-y-4 mt-20">
      <h1 class="text-2xl font-bold text-center text-gray-800">
        Enter Your Name
      </h1>
      <input
        v-model="userName"
        type="text"
        placeholder="Your name"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        :disabled="!userName.trim()"
        class="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        @click="savedName"
      >
        Join Room
      </button>
    </div>

    <!-- Game Interface -->
    <div v-else class="w-full max-w-4xl space-y-8 mt-10">
      <!-- Header Info -->
      <div class="text-center">
        <h2 class="text-2xl font-semibold text-gray-800">
          Welcome, {{ userName }}!
        </h2>
        <p class="text-gray-600 mt-1">
          Room: <span class="font-mono text-blue-600">{{ roomId }}</span>
        </p>
        <p v-if="isAdmin" class="mt-1 text-sm font-semibold text-green-600">
          You are the admin
        </p>
      </div>

      <!-- Vote Selection -->
      <div class="text-center">
        <h3 class="text-lg font-semibold mb-3 text-gray-700">
          Pick your estimate:
        </h3>
        <div class="flex flex-wrap justify-center gap-3">
          <button
            v-for="number in fibNumbers"
            :key="number"
            :disabled="votesRevealed"
            :class="[
              'px-5 py-3 rounded-full text-lg font-semibold transition',
              selectedVote === number
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
              votesRevealed ? 'opacity-50 cursor-not-allowed' : '',
            ]"
            @click="vote(number)"
          >
            {{ number }}
          </button>
        </div>
      </div>

      <!-- Admin Controls -->
      <div v-if="isAdmin" class="flex justify-center gap-4">
        <button
          class="px-5 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
          @click="reveal"
        >
          Reveal
        </button>
        <button
          class="px-5 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
          @click="reset"
        >
          Reset
        </button>
      </div>

      <div v-if="votesRevealed && voteStats" class="text-center font-normal">
        <p class="tracking-widest text-xl mb-6">Votes revealed</p>

        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-8 items-end justify-center"
        >
          <!-- Min vote -->
          <div v-if="voteStats.min" class="space-y-2">
            <p class="text-9xl font-extrabold">{{ voteStats.min.value }}</p>
            <p class="text-gray-700 text-sm">
              {{ voteStats.min.count }} vote{{
                voteStats.min.count > 1 ? "s" : ""
              }}
            </p>
            <p class="text-sm text-gray-500">Min</p>
          </div>

          <!-- Most frequent vote -->
          <div class="space-y-2">
            <p class="text-9xl font-extrabold">
              {{ voteStats.mostFrequent.value }}
            </p>
            <p class="text-gray-700 text-sm">
              {{ voteStats.mostFrequent.times }} vote{{
                voteStats.mostFrequent.times > 1 ? "s" : ""
              }}
            </p>
            <p class="text-sm text-gray-500">Most Frequent</p>
          </div>

          <!-- Max vote -->
          <div v-if="voteStats.max" class="space-y-2">
            <p class="text-9xl font-extrabold">{{ voteStats.max.value }}</p>
            <p class="text-gray-700 text-sm">
              {{ voteStats.max.count }} vote{{
                voteStats.max.count > 1 ? "s" : ""
              }}
            </p>
            <p class="text-sm text-gray-500">Max</p>
          </div>
        </div>
      </div>

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
                <em class="text-gray-500">{{
                  user.vote ? "Voted" : "Waiting"
                }}</em>
              </span>
            </span>
          </li>
        </ul>
      </div>
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

const users = ref<Record<string, User>>({});

const fibNumbers = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, "?"];

const socket = useWebSocket();

const roomId = computed(() => route.params.roomId);

const savedName = (): void => {
  if (!userName.value.trim()) return;

  sessionStorage.setItem(`name:${roomId.value}`, userName.value);

  nameSubmitted.value = true;

  socket.emit("join-room", {
    roomId: roomId.value,
    name: userName.value,
  });
};

const vote = (vote: number | "?"): void => {
  if (votesRevealed.value) return;
  selectedVote.value = vote;
  socket.emit("vote", { roomId: roomId.value, vote });
};

const reveal = (): void => {
  socket.emit("reveal", roomId.value);
};

const reset = (): void => {
  socket.emit("reset", roomId.value);
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

  const mostFrequent = { value: vote, times };

  return {
    min: minVote,
    max: maxVote,
    mostFrequent,
    questionVote,
  };
});

onMounted(() => {
  socket.on("connect", () => {
    socketId.value = socket.id;
  });

  const savedName = sessionStorage.getItem(`name:${roomId.value}`);

  if (savedName) {
    userName.value = savedName;
    nameSubmitted.value = true;
    socket.emit("join-room", { roomId: roomId.value, name: savedName });
  }

  socket.on("room-state", (data) => {
    users.value = data.users;
    isAdmin.value = data.adminId === socket.id;
  });

  socket.on("reveal", () => {
    votesRevealed.value = true;
  });

  socket.on("reset", () => {
    selectedVote.value = null;
    votesRevealed.value = false;
  });
});
</script>
