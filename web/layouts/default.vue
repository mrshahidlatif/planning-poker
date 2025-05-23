<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <header
      class="w-full bg-blue-100 shadow px-8 py-4 flex items-center justify-between"
    >
      <NuxtLink
        to="/"
        class="text-xl text-blue-600 tracking-widest flex items-center gap-2"
      >
        <AppIcon size="md" color="blue" />
        Agile Work Estimation Poker
      </NuxtLink>
      <span
        v-if="route.params.roomId"
        class="text-gray-600 flex items-center gap-2"
      >
        Room:
        <span class="font-mono text-blue-600">{{ route.params.roomId }}</span>
        <button
          class="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors cursor-pointer flex items-center justify-center"
          title="Share room url with your team"
          @click="copyRoomUrl"
        >
          <Icon name="material-symbols:share" size="22" />
        </button>
      </span>
    </header>

    <main class="flex-1 bg-blue-50">
      <slot />
    </main>

    <footer
      class="fixed bottom-0 w-full py-2 text-right pr-4 text-gray-500 text-xs tracking-[0.15rem] font-light"
    >
      Shahid Latif &#x2022; slatif@dataguard.de &#x2022; 2025
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppIcon from "~/components/AppIcon.vue";

const route = useRoute();

const copyRoomUrl = async () => {
  await navigator.clipboard.writeText(window.location.href);
};
</script>
