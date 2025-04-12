<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    
    <main class="flex-1 pt-16">
      <div class="max-w-screen-xl mx-auto p-4">
        <slot />
      </div>
    </main>

    <Footer class="fixed bottom-0 w-full" />
  </div>
</template>
  
  <script setup lang="ts">
  import Header from '~/components/Header.vue'
  import Footer from '~/components/Footer.vue'
  </script>
  