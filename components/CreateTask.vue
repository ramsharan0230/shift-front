<script setup lang="ts">
const { $api } = useNuxtApp();
const isLoading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const authStore = useAuthStore();
const title = ref("");
const status = ref("");
const description = ref("");

const emit = defineEmits(["task-created", "task-updated"]);

const props = defineProps<{
  task?: Task | null;
}>();

const handleCreateTask = async (e: Event) => {
  e.preventDefault();
  isLoading.value = true;
  const authToken = authStore.token;
  try {
    if (props.task?.id) {
      const response = await $api.patch(
        `/tasks/${props.task.id}`,
        {
          title: title.value,
          description: description.value,
          status: status.value,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      emit("task-updated", response.data);
      successMessage.value = "Task updated successfully.";
    } else {
      const response = await $api.post(
        "/tasks",
        {
          title: title.value,
          status: status.value,
          description: description.value,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      emit("task-created", response.data);
      successMessage.value = "Task created successfully.";
    }

    clearMessages();
    resetForm();
  } catch (error) {
    const errors = error.response?.data?.data;
    errorMessage.value = errors
      ? Object.values(errors).flat().join(", ")
      : "Something went wrong.";
    clearMessages();
  } finally {
    isLoading.value = false;
  }
};

const resetForm = () => {
  title.value = "";
  description.value = "";
  status.value = "";
};

const clearMessages = () => {
  setTimeout(() => {
    successMessage.value = "";
    errorMessage.value = "";
  }, 5000);
};

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      title.value = newTask.title;
      description.value = newTask.description;
      status.value = newTask.status.toUpperCase();
    }
  },
  { immediate: true }
);
</script>

<template>
  <form class="w-full" @submit.prevent="handleCreateTask">
    <!-- Status Messages -->
    <div class="mb-4">
      <div v-if="errorMessage" class="text-red-500 text-sm">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="text-green-500 text-sm">
        {{ successMessage }}
      </div>
      <div v-if="isLoading" class="text-center">Logging in...</div>
    </div>

    <div class="flex flex-wrap gap-4 items-end">
      <div class="flex-1 min-w-[200px]">
        <label
          for="title"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Title</label
        >
        <input
          type="text"
          id="title"
          v-model="title"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter task's title"
        />
      </div>

      <div class="flex-1 min-w-[200px]">
        <label
          for="status"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Select status</label
        >
        <select
          id="status"
          v-model="status"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="TODO">Todo</option>
          <option value="INPROGRESS">In Progress</option>
          <option value="QA">QA</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <div class="flex-1 min-w-[300px]">
        <label
          for="message"
          class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Description</label
        >
        <textarea
          id="message"
          rows="1"
          v-model="description"
          class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Task description..."
        ></textarea>
      </div>

      <button
        type="submit"
        :disabled="isLoading"
        class="h-[42px] min-w-[100px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Submit
      </button>
    </div>
  </form>
</template>
