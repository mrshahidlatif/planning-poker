import { defineStore } from "pinia";
import { useWebSocketStore } from "./useWebSocketStore";
import { useUserStore } from "./useUserStore";
import { useSessionStore } from "./useSessionStore";
import type { Vote } from "~/types";

export interface VoteStats {
  min?: { value: string; count: number };
  max?: { value: string; count: number };
  mostFrequent: { value: string; times: number };
  questionVote?: { value: string; count: number };
}

export const useVotingStore = defineStore("voting", () => {
  const websocketStore = useWebSocketStore();
  const { socket } = websocketStore;
  const userStore = useUserStore();
  const sessionStore = useSessionStore();

  const votesRevealed = ref(false);
  const selectedVote = ref<Vote>(null);

  const voteSummary = computed(() => {
    const countMap: Record<string, number> = {};

    for (const user of Object.values(userStore.users)) {
      const vote = user.vote ?? "No vote";
      countMap[vote] = (countMap[vote] || 0) + 1;
    }

    return Object.entries(countMap).map(([value, count]) => ({
      value,
      count,
    }));
  });

  const voteStats = computed((): VoteStats | null => {
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

    const mostFrequent = { value: vote || "", times };

    return {
      min: minVote,
      max: maxVote,
      mostFrequent,
      questionVote,
    };
  });

  const vote = (vote: string | number) => {
    if (votesRevealed.value || !userStore.userId || !sessionStore.roomId)
      return;

    selectedVote.value = vote as Vote;
    socket.emit("vote", {
      roomId: sessionStore.roomId,
      userId: userStore.userId,
      vote,
    });
  };

  const reveal = () => {
    if (!userStore.userId || !sessionStore.roomId) return;

    socket.emit("reveal", {
      roomId: sessionStore.roomId,
      userId: userStore.userId,
    });
  };

  const reset = () => {
    if (!userStore.userId || !sessionStore.roomId) return;

    selectedVote.value = null;
    socket.emit("reset", {
      roomId: sessionStore.roomId,
      userId: userStore.userId,
    });
  };

  const handleVotesRevealed = (revealed: boolean) => {
    votesRevealed.value = revealed;
  };

  const handleUserVote = (userId: string, vote: Vote) => {
    userStore.updateUserVote(userId, vote);
  };

  const resetState = () => {
    votesRevealed.value = false;
    selectedVote.value = null;
  };

  return {
    votesRevealed,
    selectedVote,
    voteSummary,
    voteStats,
    vote,
    reveal,
    reset,
    handleVotesRevealed,
    handleUserVote,
    resetState,
  };
});
