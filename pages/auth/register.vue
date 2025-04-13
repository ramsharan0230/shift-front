<script lang="ts" setup>
const { $api } = useNuxtApp();
const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const isLoading = ref(false);

interface ApiResponse {
    success: boolean;
    data?: User;
    message?: string;
}

const clearMessages = () => {
    setTimeout(() => {
        successMessage.value="";
        errorMessage.value="";
    }, 5000);
}

const handleCreateNewUser = async(e: Event) => {
    e.preventDefault();
    isLoading.value = true;
    try {
        const response = await $api.post<ApiResponse>('/auth/register', {
            name: name.value,
            email: email.value,
            password: password.value
        });

        successMessage.value = response.message;
        if(response.data){
            const user = response.data?.user;
            localStorage.setItem('user', JSON.stringify(user));
        }
        clearMessages();
        setTimeout(() => {
            navigateTo('/auth/login');
        }, 5000);
    } catch (error) {
        isLoading.value = false;
        const errors = error.response?.data?.data;
        if(errors){
            errorMessage.value = Object.values(errors).flat().join(', ');
        } else {
            errorMessage.value = 'Something went wrong. Please try again.';
        }
        clearMessages();

    } finally {
        isLoading.value = false;
    }
}


</script>

<template>
    <div
      class="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700"
    >
      <form @submit.prevent="handleCreateNewUser">
        <h5 class="text-xl font-medium text-gray-900 dark:text-white mb-3 text-center">
          Sign Up to Shift Board
        </h5>

        <div v-if="errorMessage" class="text-red-500 text-sm mb-4">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="text-green-500 text-sm mb-4">
          {{ successMessage }}
        </div>
        
        <div v-if="isLoading" class="text-center mb-4">
          Processing ...
        </div>

        <div class="mb-1">
          <label
            for="name"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Name</label
          >
          <input
            type="text"
            name="name"
            id="name"
            v-model="name"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="John doe"
            required
          />
        </div>

        <div class="mb-1">
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Email</label
          >
          <input
            type="email"
            name="email"
            id="email"
            v-model="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="name@company.com"
            required
          />
        </div>
        <div class="mb-3">
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Password</label
          >
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
          Have already an account?
          <nuxt-link to="/auth/login" class="text-blue-700 hover:underline dark:text-blue-500">Sign In</nuxt-link>
        </div>
      </form>
    </div>
  </template>
  