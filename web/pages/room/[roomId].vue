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
        @click="submitName"
        :disabled="!userName.trim()"
        class="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
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
            v-for="number in fibonacciNumbers"
            :key="number"
            @click="selectVote(number)"
            :disabled="votesRevealed"
            :class="[
              'px-5 py-3 rounded-full text-lg font-semibold transition',
              selectedVote === number
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
              votesRevealed ? 'opacity-50 cursor-not-allowed' : '',
            ]"
          >
            {{ number }}
          </button>
        </div>
      </div>

      <!-- Admin Controls -->
      <div v-if="isAdmin" class="flex justify-center gap-4">
        <button
          @click="revealVotes"
          class="px-5 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
        >
          Reveal
        </button>
        <button
          @click="resetVotes"
          class="px-5 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
        >
          Reset
        </button>
      </div>

      <div v-if="votesRevealed" class="text-center font-normal">
        <p class="tracking-widest text-xl">Votes revealed</p>

        <div
          v-if="
            (len(participants) > 2 && mostFrequentVote.times > 1) ||
            mostFrequentVote.times === len(participants)
          "
        >
          <p class="text-9xl font-extrabold">{{ mostFrequentVote.value }}</p>
          {{ `${mostFrequentVote.times} out of ${len(participants)}` }} votes
        </div>
      </div>

      <div>
        <h4 class="text-lg font-semibold mb-2 text-gray-800">Participants</h4>
        <ul class="space-y-2">
          <li
            v-for="(user, socketId) in participants"
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
import { useSocket } from "~/composables/useSocket";

const route = useRoute();
const roomId = computed(() => route.params.roomId as string);

const userName = ref("");
const nameSubmitted = ref(false);
const selectedVote = ref<number | "?" | null>(null);
const votesRevealed = ref(false);
const isAdmin = ref(false);
const participants = ref<
  Record<string, { name: string; vote: number | "?" | null }>
>({});

const fibonacciNumbers = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, "?"];

const socket = useSocket();

const socketId = ref("");

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
    participants.value = data.users;
    isAdmin.value = data.adminId === socket.id;
  });

  socket.on("reveal-votes", () => {
    votesRevealed.value = true;
  });

  socket.on("reset-votes", () => {
    selectedVote.value = null;
    votesRevealed.value = false;
  });
});

const submitName = (): void => {
  if (!userName.value.trim()) return;

  sessionStorage.setItem(`name:${roomId.value}`, userName.value);

  nameSubmitted.value = true;

  socket.emit("join-room", {
    roomId: roomId.value,
    name: userName.value,
  });
};

const selectVote = (vote: number | "?"): void => {
  if (votesRevealed.value) return;
  selectedVote.value = vote;
  socket.emit("vote", { roomId: roomId.value, vote });
};

const revealVotes = (): void => {
  socket.emit("reveal", roomId.value);
};

const resetVotes = (): void => {
  socket.emit("reset", roomId.value);
};

const voteSummary = computed(() => {
  const countMap: Record<string, number> = {};

  for (const user of Object.values(participants.value)) {
    const vote = user.vote ?? "No vote";
    countMap[vote] = (countMap[vote] || 0) + 1;
  }

  return Object.entries(countMap).map(([value, count]) => ({
    value,
    count,
  }));
});

const mostFrequentVote = computed(() => {
  if (!votesRevealed.value) return null;

  let times = 0;
  let vote: string | null = null;

  for (const { value, count } of voteSummary.value) {
    if (count > times && value !== "No vote") {
      times = count;
      vote = value;
    }
  }

  return { value: vote, times: times };
});

const len = (obj: Object) => {
  return Object.keys(obj).length;
};
</script>
