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
      <span v-if="route.params.roomId" class="text-gray-600">
        Room:
        <span class="font-mono text-blue-600">{{ route.params.roomId }}</span>
      </span>
    </header>

    <main class="flex-1 bg-blue-50">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppIcon from "~/components/AppIcon.vue";
const route = useRoute();
</script>
