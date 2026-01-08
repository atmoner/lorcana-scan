<template>
  <div
    class="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900"
  >
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <AppFooter />
  </div>
</template>

<style>
  html,
  body {
    @apply bg-indigo-950;
  }

  /* Safe area support for mobile devices */
  .safe-area-container {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }

  .pt-safe {
    padding-top: max(0.5rem, env(safe-area-inset-top));
  }

  .pb-safe {
    padding-bottom: max(0.5rem, env(safe-area-inset-bottom));
  }
</style>
