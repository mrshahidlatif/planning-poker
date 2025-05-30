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
          <Icon 
            :name="isShared ? 'material-symbols:check-circle-outline' : 'material-symbols:share'" 
            size="22"
            class="transform transition-all duration-300 ease-in-out"
            :class="{ 'scale-110': isShared }"
          />
        </button>
      </span>
    </header>

    <main class="flex-1 bg-blue-50">
      <slot />
    </main>

    <footer
      class="fixed bottom-0 w-full py-2 text-right pr-4 text-gray-500 text-xs tracking-widest font-light"
    >
      <a href="mailto:support@ukkaab.com" class="text-blue-600 hover:text-blue-700">
        support@ukkaab.com
      </a>
    </footer>
  </div>
</template>

<script setup lang="ts">
import AppIcon from "~/components/AppIcon.vue";

const route = useRoute();

const isShared = ref(false);

const copyRoomUrl = async () => {
  await navigator.clipboard.writeText(window.location.href);
  isShared.value = true;
  setTimeout(() => {
    isShared.value = false;
  }, 1500);
};
</script>
