import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', () => {
    const todo = ref([])
    const inProgress = ref([])
    const qa = ref([])
    const done = ref([])
  
    const setTasks = (tasks: any[]) => {
      todo.value = tasks.filter(t => t.status === 'todo')
      inProgress.value = tasks.filter(t => t.status === 'inprogress')
      qa.value = tasks.filter(t => t.status === 'qa')
      done.value = tasks.filter(t => t.status === 'done')
    }
  
    return {
      todo,
      inProgress,
      qa,
      done,
      setTasks
    }
  })