<template>
  <header
    class="bg-black/30 backdrop-blur-sm border-b border-white/10 px-4 py-3 pt-safe"
  >
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-bold text-white flex items-center gap-2">
        <span class="text-2xl">✨</span>
        Lorcana-scan
      </h1>
      <button
        v-if="showCloseButton"
        @click="$emit('close')"
        class="text-white/70 hover:text-white transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
  interface Props {
    showCloseButton?: boolean
  }

  defineProps<Props>()
  defineEmits<{
    close: []
  }>()
</script>
