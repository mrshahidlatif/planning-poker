<template>
  <img
    src="/favicon.ico"
    alt="Logo"
    :class="[
      sizeClasses[size],
      color === 'blue'
        ? '[filter:brightness(0)_saturate(100%)_invert(37%)_sepia(98%)_saturate(1032%)_hue-rotate(202deg)_brightness(97%)_contrast(101%)]'
        : '',
    ]"
  />
</template>

<script setup lang="ts">
const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
} as const;

defineProps<{
  size?: "sm" | "md" | "lg";
  color?: "blue" | "default";
}>();
</script>
