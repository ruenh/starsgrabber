import { Component } from "solid-js";
import type { Task } from "@/types/index.js";

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

export const TaskCard: Component<TaskCardProps> = (props) => {
  return (
    <div
      class="task-card card card-interactive"
      onClick={() => props.onTaskClick(props.task)}
    >
      <div class="task-card-content">
        <div class="task-info">
          <h3 class="task-title">{props.task.title}</h3>
          <p class="task-reward text-green">+{props.task.reward} ⭐</p>
        </div>
        <button class="task-action-btn btn btn-primary">
          {props.task.type === "channel" ? "Подписаться" : "Активировать"}
        </button>
      </div>
    </div>
  );
};
