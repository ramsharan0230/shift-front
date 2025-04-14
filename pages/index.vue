<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});
useHead({
  title: 'Home | Shift Board'
});
</script>

<template>
    <div>
        <h3>Welcome to Shift Board</h3>
    </div>
</template>
