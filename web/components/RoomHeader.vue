<template>
  <div class="text-center">
    <h2 class="text-2xl font-semibold text-gray-800">
      Welcome, {{ userName }}!
    </h2>
    <p v-if="isAdmin" class="mt-1 text-sm font-semibold text-green-600">
      You are the admin
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  userName: string;
  roomId: string;
  isAdmin: boolean;
}>();
</script>
