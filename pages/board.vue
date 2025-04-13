<script setup lang="ts">
import draggable from "vuedraggable";
import CreateTask from "~/components/CreateTask.vue";
const showModal = ref(false);
const selectedTask = ref<Task | null>(null);


const toggleModal = () => {
  showModal.value = !showModal.value;
};

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

const handleTaskCreated = (newTask: Task) => {
  switch (newTask.status) {
    case TaskStatus.TODO:
      todo.value.push(newTask);
      break;
    case TaskStatus.IN_PROGRESS:
      inProgress.value.push(newTask);
      break;
    case TaskStatus.QA:
      qa.value.push(newTask);
      break;
    case TaskStatus.DONE:
      done.value.push(newTask);
      break;
    default:
      console.warn('Unknown status:', newTask.status);
  }
};

const deleteTask = async (task: Task) => {
  if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
    try {
      await $api.delete(`/tasks/${task.id}`);

      switch (task.status) {
        case TaskStatus.TODO:
          todo.value = todo.value.filter(t => t.id !== task.id);
          break;
        case TaskStatus.IN_PROGRESS:
          inProgress.value = inProgress.value.filter(t => t.id !== task.id);
          break;
        case TaskStatus.QA:
          qa.value = qa.value.filter(t => t.id !== task.id);
          break;
        case TaskStatus.DONE:
          done.value = done.value.filter(t => t.id !== task.id);
          break;
      }

      alert(`Task "${task.title}" deleted successfully.`);
    } catch (error) {
      console.error("Delete error:", error);
    }
  }
};


definePageMeta({
  middleware: 'auth',
  layout: 'default',
});

onMounted(async () => {
  await fetchAllTasks();
});
</script>

<template>
  <div class="container-fluid">
    <div class="" style="margin-bottom: 20px;">
      <CreateTask @task-created="handleTaskCreated"></CreateTask>
    </div>

    <div class="row">
      <div class="column-wrapper">
        <div class="column p-3">
          <h5>Todo</h5>
          <draggable v-model="todo" group="people" @change="(e) => onTaskDrop(e, TaskStatus.TODO)" @start="drag=true" @end="drag=false">
            <template #item="{ element }">
              <div class="relative">
                <a
                  href="#"
                  class="block max-w-sm p-4 pb-10 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                  <h5 class="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                    {{ element.title }}
                  </h5>
                  <p class="text-sm text-gray-700 dark:text-gray-400">
                    {{ element.description }}
                  </p>
                </a>

                <div class="absolute bottom-2 left-3 right-2">
                  <button @click="deleteTask(element)" 
                    class="h-[24px] min-w-[100px] text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-2 py-1 text-center cursor-pointer dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Delete</button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div class="column-wrapper">
        <div class="column p-3">
          <h5>In Progress</h5>
          <draggable v-model="inProgress" @change="(e) => onTaskDrop(e, TaskStatus.IN_PROGRESS)" group="people" @start="drag=true" @end="drag=false">
            <template #item="{ element }">
              <div class="relative">
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
                <div class="absolute bottom-2 left-3 right-2">
                  <button @click="deleteTask(element)" 
                    class="h-[24px] min-w-[100px] text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-2 py-1 text-center cursor-pointer dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Delete</button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div class="column-wrapper">
        <div class="column p-3">
          <h5>QA</h5>
          <draggable v-model="qa" group="people" @change="(e) => onTaskDrop(e, TaskStatus.QA)" @start="drag=true" @end="drag=false">
            <template #item="{ element }">
              <div class="relative">
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
                <div class="absolute bottom-2 left-3 right-2">
                  <button @click="deleteTask(element)" 
                    class="h-[24px] min-w-[100px] text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-2 py-1 text-center cursor-pointer dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Delete</button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <div class="column-wrapper">
        <div class="column p-3">
          <h5>Done</h5>
          <draggable v-model="done" group="people" @change="(e) => onTaskDrop(e, TaskStatus.DONE)" @start="drag=true" @end="drag=false">
            <template #item="{ element }">
              <div class="relative">
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
                <div class="absolute bottom-2 left-3 right-2">
                  <button @click="deleteTask(element)" 
                    class="h-[24px] min-w-[100px] text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-2 py-1 text-center cursor-pointer dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Delete</button>
                </div>
              </div>
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
  height: 100%;
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
  height: 100vh; 
}

.row {
  display: flex; 
  justify-content: space-between; 
  height: 100%; 
}

.column-wrapper {
  flex: 0 0 25%;
}
</style>
