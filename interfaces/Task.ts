import { TaskStatus } from "~/enums/TaskStatus";

export interface Task {
    title: string;
    status: TaskStatus;
    createdAt: Date;
  }