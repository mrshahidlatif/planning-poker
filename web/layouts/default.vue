<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <header
      class="w-full bg-blue-100 shadow px-6 py-4 flex items-center justify-between"
    >
      <div class="flex items-center space-x-2">
        <NuxtLink to="/" class="text-xl text-blue-600 tracking-widest">
          🎲 Free Planning Poker
        </NuxtLink>
      </div>

      <div class="text-sm text-red-700 tracking-tight">
        ⚠️ Admin: Don’t refresh or you'll lose control!
      </div>
    </header>

    <main class="flex-1 bg-blue-50">
      <slot />
    </main>
  </div>
</template>
