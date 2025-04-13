<script setup lang="ts">
import draggable from "vuedraggable";
import CreateTask from "~/components/CreateTask.vue";
const showModal = ref(false);
const selectedTask = ref<Task | null>(null);

const openCreateTaskModal = () => {
  selectedTask.value = null;
  showModal.value = true;
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
    const tasks: Task[] = response.data;

    todo.value = tasks.filter(task => task.status === TaskStatus.TODO);
    inProgress.value = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS);
    qa.value = tasks.filter(task => task.status === TaskStatus.QA);
    done.value = tasks.filter(task => task.status === TaskStatus.DONE);

  } catch (error) {
    console.error("Fetch error:", error);
  }
};

const onTaskDrop = (event: any, newStatus: TaskStatus) => {
  if (event.added?.element) {
    const task: Task = event.added.element;
    updateTaskStatus(task, newStatus);
  }
};

const updateTaskStatus = async (task: Task, status: TaskStatus) => {
  try {
    await $api.patch(`/tasks/${task.id}`, {
      status: status.toUpperCase()
    });
  } catch (error) {
    console.error("Update error:", error);
  }
};

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
  }
};

const deleteTask = async (task: Task) => {
  if (confirm(`Are you sure you want to delete task "${task.title}"?`)) {
    try {
      await $api.delete(`/tasks/${task.id}`);

      const list = {
        [TaskStatus.TODO]: todo,
        [TaskStatus.IN_PROGRESS]: inProgress,
        [TaskStatus.QA]: qa,
        [TaskStatus.DONE]: done,
      }[task.status];

      list.value = list.value.filter(t => t.id !== task.id);
    } catch (error) {
      console.error("Delete error:", error);
    }
  }
};

const handleEditTask = (task: Task) => {
  selectedTask.value = task;
  showModal.value = true;
};

definePageMeta({
  middleware: 'auth',
  layout: 'default',
});

onMounted(fetchAllTasks);
</script>

<template>
  <div class="container-fluid">
    <div class="mb-4">
      <button @click="openCreateTaskModal"
        class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        + New Task
      </button>
      <CreateTask 
        v-if="showModal"
        :task="selectedTask" 
        @task-created="handleTaskCreated" 
        @task-updated="fetchAllTasks"
        @close="showModal = false"
      />
    </div>

    <div class="row">
      <div v-for="(tasks, status) in {
        Todo: todo,
        'In Progress': inProgress,
        QA: qa,
        Done: done
      }" :key="status" class="column-wrapper">
        <div class="column p-3">
          <h5>{{ status }}</h5>
          <draggable
            :list="tasks"
            group="people"
            @change="(e) => onTaskDrop(e, TaskStatus[status.replace(' ', '_').toUpperCase()])"
          >
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

                <div class="absolute bottom-2 left-3 right-2 flex justify-between">
                  <button @click="deleteTask(element)" 
                    class="h-[24px] min-w-[100px] text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-xs px-2 py-1 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                    Delete
                  </button>

                  <button @click="handleEditTask(element)"
                    class="ml-2 h-[24px] min-w-[100px] text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs px-2 py-1 text-center dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-yellow-800">
                    Edit
                  </button>
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

.column {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.column h5 {
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
