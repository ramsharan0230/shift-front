<script setup lang="ts">
import draggable from "vuedraggable";

const { $api } = useNuxtApp();

enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "inprogress",
    QA = "qa",
    DONE = "done",
  }

interface Task {
  id: number;
  title: string;
  description: string;
  created_by: {
    id: number;
    name: string;
    email: string;
    created_at: string;
  };
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

const todo = ref<Task[]>([]);
const inProgress = ref<Task[]>([]);
const qa = ref<Task[]>([]);
const done = ref<Task[]>([]);


const fetchAllTasks = async () => {
  try {
    const response = await $api.get('/tasks');
    console.log("tasks: ", response.data);
    const tasks: Task[] = response.data;

    todo.value = tasks.filter(task => task.status === TaskStatus.TODO);
    inProgress.value = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS);
    console.log(inProgress.value)
    qa.value = tasks.filter(task => task.status === TaskStatus.QA);
    done.value = tasks.filter(task => task.status === TaskStatus.DONE);

    console.log("Todo tasks: ", todo.value);
    console.log("In Progress tasks: ", inProgress.value);
    console.log("QA tasks: ", qa.value);
    console.log("Done tasks: ", done.value);

  } catch (error) {
    console.error("Fetch error:", error);
  }
};

const onTaskDrop = (event: any, newStatus: TaskStatus) => {
  if (event.added && event.added.element) {
    const task: Task = event.added.element;
    updateTaskStatus(task, newStatus);
  }
};

const updateTaskStatus = async (task, status) => {
  console.log("tss: ", task)
  console.log("tskSt: ", status)

  try {
    const response = await $api.patch(`/tasks/${task.id}`, {
      status: status?.toUpperCase()
    });
    console.log("resss: ", response);

  } catch (error) {
    console.error("Fetch error:", error);
  }
}

definePageMeta({
  middleware: 'auth',
  layout: 'default',
});

onMounted(async () => {
  await fetchAllTasks();
});
</script>

<template>
  <div class="container">
    <div class="row">
      <!-- Todo Column -->
      <div class="column-wrapper">
        <div class="column p-3">
          <h5>Todo</h5>
          <draggable v-model="todo" group="people" @change="(e) => onTaskDrop(e, TaskStatus.TODO)" @start="drag=true" @end="drag=false">
            <template #item="{ element }">
                <a
                  href="#"
                  class="block max-w-sm p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <h5 class="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                    {{ element.title }}
                  </h5>
                  <p class="text-sm text-gray-700 dark:text-gray-400">
                    {{ element.description }}
                  </p>
                </a>
            </template>
          </draggable>
        </div>
      </div>

      <!-- In Progress Column -->
      <div class="column-wrapper">
        <div class="column p-3">
          <h5>In Progress</h5>
          <draggable v-model="inProgress" @change="(e) => onTaskDrop(e, TaskStatus.IN_PROGRESS)" group="people" @start="drag=true" @end="drag=false">
            <template #item="{ element }">
                <a
                  href="#"
                  class="block max-w-sm p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <h5 class="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                    {{ element.title }}
                  </h5>
                  <p class="text-sm text-gray-700 dark:text-gray-400">
                    {{ element.description }}
                  </p>
                </a>
            </template>
          </draggable>
        </div>
      </div>

      <!-- QA Column -->
      <div class="column-wrapper">
        <div class="column p-3">
          <h5>QA</h5>
          <draggable v-model="qa" group="people" @change="(e) => onTaskDrop(e, TaskStatus.QA)" @start="drag=true" @end="drag=false">
            <template #item="{ element }">
                <a
                  href="#"
                  class="block max-w-sm p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <h5 class="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                    {{ element.title }}
                  </h5>
                  <p class="text-sm text-gray-700 dark:text-gray-400">
                    {{ element.description }}
                  </p>
                </a>
            </template>
          </draggable>
        </div>
      </div>

      <!-- Done Column -->
      <div class="column-wrapper">
        <div class="column p-3">
          <h5>Done</h5>
          <draggable v-model="done" group="people" @change="(e) => onTaskDrop(e, TaskStatus.DONE)" @start="drag=true" @end="drag=false">
            <template #item="{ element }">
                <a
                  href="#"
                  class="block max-w-sm p-4 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <h5 class="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                    {{ element.title }}
                  </h5>
                  <p class="text-sm text-gray-700 dark:text-gray-400">
                    {{ element.description }}
                  </p>
                </a>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.draggable-container {
  min-height: 300px;
}

.card {
  cursor: grab;
}

.card-body {
  padding: 0.75rem;
}

.card.mb-2 {
  margin-bottom: 1rem;
}

.column {
  display: flex;
  flex-direction: column;
  height: 100%; /* Ensure it takes full vertical space */
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa;
  padding: 15px;
}

.column h5 {
  font-weight: bold;
  margin-bottom: 20px;
}

.column .card {
  margin-bottom: 10px;
}

.container-fluid {
  height: 100vh; /* Set container to full height of the viewport */
}

.row {
  display: flex; /* Enable Flexbox */
  justify-content: space-between; /* Space columns evenly */
  height: 100%; /* Ensure the row takes full height */
}

.column-wrapper {
  flex: 0 0 25%; /* Ensure each column takes up 25% of the width */
}
</style>
