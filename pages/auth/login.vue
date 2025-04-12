<script lang="ts" setup>
import { ref } from 'vue';
const authStore = useAuthStore();

const email = ref('rahul@manandhar.com');
const password = ref('password01');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

const clearMessages = () => {
  setTimeout(() => {
    successMessage.value = '';
    errorMessage.value = '';
  }, 5000);
};

const handleLogin = async (e: Event) => {
  e.preventDefault();
  isLoading.value = true;

  try {
    const response = await authStore.login(email.value, password.value);
    
    successMessage.value = response.message;
    navigateTo("/board"); 
    clearMessages();
  } catch (error) {
    errorMessage.value = 'Something went wrong. Please try again.';
    clearMessages();
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  
});
definePageMeta({
  middleware: 'guest',
});
</script>

<template>
  <div class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
    <form @submit.prevent="handleLogin">
      <h5 class="text-xl font-medium text-gray-900 dark:text-white mb-3 text-center">
        Sign in to Shift
      </h5>

      <div v-if="errorMessage" class="text-red-500 text-sm mb-4">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="text-green-500 text-sm mb-4">
        {{ successMessage }}
      </div>

      <div v-if="isLoading" class="text-center mb-4">
        Logging in...
      </div>

      <div class="mb-1">
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          v-model="email"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          placeholder="Enter email address..."
          required
        />
      </div>

      <div class="mb-3">
        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          v-model="password"
          placeholder="••••••••"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          required
        />
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>

      <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
        Don't have an account? <nuxt-link to="/auth/register" class="text-blue-700 hover:underline dark:text-blue-500">Register</nuxt-link>
      </div>
    </form>
  </div>
</template>
