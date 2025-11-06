import {
  Component,
  createSignal,
  createEffect,
  onMount,
  For,
  Show,
} from "solid-js";
import type { Task } from "@/types/index.js";
import { getTasks } from "@/services/api.js";
import { TaskCard } from "./TaskCard.js";

interface TaskListProps {
  onTaskClick: (task: Task) => void;
  refreshTrigger?: number;
}

export const TaskList: Component<TaskListProps> = (props) => {
  const [tasks, setTasks] = createSignal<Task[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getTasks();
      // Filter out completed tasks
      const activeTasks = response.tasks.filter((task) => !task.completed);
      setTasks(activeTasks);
    } catch (err: any) {
      console.error("Failed to load tasks:", err);
      setError(err.message || "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    loadTasks();
  });

  // Reload tasks when refreshTrigger changes
  createEffect(() => {
    if (props.refreshTrigger !== undefined && props.refreshTrigger > 0) {
      loadTasks();
    }
  });

  return (
    <div class="task-list">
      <Show when={isLoading()}>
        <div class="task-list-loading">
          <p class="text-secondary">Загрузка заданий...</p>
        </div>
      </Show>

      <Show when={error()}>
        <div class="task-list-error">
          <p class="text-red">{error()}</p>
          <button class="btn btn-secondary mt-sm" onClick={loadTasks}>
            Повторить
          </button>
        </div>
      </Show>

      <Show when={!isLoading() && !error()}>
        <Show
          when={tasks().length > 0}
          fallback={
            <div class="task-list-empty">
              <p class="text-secondary">Нет доступных заданий</p>
            </div>
          }
        >
          <div class="task-list-grid">
            <For each={tasks()}>
              {(task) => (
                <TaskCard task={task} onTaskClick={props.onTaskClick} />
              )}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
};
