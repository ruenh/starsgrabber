import { Component, createSignal, onMount, For, Show } from "solid-js";
import type { Task } from "@/types/index.js";
import { adminApi, getTasks } from "@/services/api.js";
import { Modal } from "@/components/shared/index.js";

export const TaskManager: Component = () => {
  const [tasks, setTasks] = createSignal<Task[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = createSignal(false);
  const [isEditModalOpen, setIsEditModalOpen] = createSignal(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = createSignal(false);
  const [selectedTask, setSelectedTask] = createSignal<Task | null>(null);

  // Form states
  const [formData, setFormData] = createSignal({
    type: "channel" as "channel" | "bot",
    title: "",
    description: "",
    reward: "",
    target: "",
    avatarUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getTasks();
      setTasks(response.tasks);
    } catch (err: any) {
      console.error("Failed to load tasks:", err);
      setError(err.message || "Ошибка загрузки заданий");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    loadTasks();
  });

  const resetForm = () => {
    setFormData({
      type: "channel",
      title: "",
      description: "",
      reward: "",
      target: "",
      avatarUrl: "",
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      type: task.type,
      title: task.title,
      description: task.description || "",
      reward: task.reward.toString(),
      target: task.target,
      avatarUrl: task.avatarUrl || "",
    });
    setIsEditModalOpen(true);
  };

  const openCloseModal = (task: Task) => {
    setSelectedTask(task);
    setIsCloseModalOpen(true);
  };

  const handleCreateTask = async () => {
    const data = formData();
    if (!data.title || !data.reward || !data.target) {
      setError("Заполните все обязательные поля");
      return;
    }

    setIsSubmitting(true);
    try {
      await adminApi.createTask({
        type: data.type,
        title: data.title,
        description: data.description || undefined,
        reward: parseInt(data.reward),
        target: data.target,
        avatarUrl: data.avatarUrl || undefined,
      });
      setIsCreateModalOpen(false);
      resetForm();
      await loadTasks();
    } catch (err: any) {
      setError(err.message || "Ошибка создания задания");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async () => {
    const task = selectedTask();
    if (!task) return;

    const data = formData();
    if (!data.title || !data.reward || !data.target) {
      setError("Заполните все обязательные поля");
      return;
    }

    setIsSubmitting(true);
    try {
      await adminApi.updateTask(task.id, {
        type: data.type,
        title: data.title,
        description: data.description || undefined,
        reward: parseInt(data.reward),
        target: data.target,
        avatarUrl: data.avatarUrl || undefined,
      });
      setIsEditModalOpen(false);
      setSelectedTask(null);
      resetForm();
      await loadTasks();
    } catch (err: any) {
      setError(err.message || "Ошибка обновления задания");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseTask = async () => {
    const task = selectedTask();
    if (!task) return;

    setIsSubmitting(true);
    try {
      await adminApi.closeTask(task.id);
      setIsCloseModalOpen(false);
      setSelectedTask(null);
      await loadTasks();
    } catch (err: any) {
      setError(err.message || "Ошибка закрытия задания");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class="task-manager">
      <div class="task-manager-header">
        <h2 class="task-manager-title">Управление заданиями</h2>
        <button class="btn btn-primary" onClick={openCreateModal}>
          + Создать задание
        </button>
      </div>

      <Show when={error()}>
        <div class="task-manager-error">
          <p class="text-red">{error()}</p>
          <button class="btn btn-secondary" onClick={() => setError(null)}>
            Закрыть
          </button>
        </div>
      </Show>

      <Show when={isLoading()}>
        <div class="task-manager-loading">
          <p class="text-secondary">Загрузка заданий...</p>
        </div>
      </Show>

      <Show when={!isLoading()}>
        <div class="task-manager-list">
          <For
            each={tasks()}
            fallback={
              <div class="task-manager-empty">
                <p class="text-secondary">Нет заданий</p>
              </div>
            }
          >
            {(task) => (
              <div class="task-manager-item card">
                <div class="task-manager-item-header">
                  <div class="task-manager-item-info">
                    <h3 class="task-manager-item-title">{task.title}</h3>
                    <p class="task-manager-item-meta text-secondary">
                      {task.type === "channel" ? "📢 Канал" : "🤖 Бот"} •{" "}
                      {task.reward} ⭐ •{" "}
                      {task.status === "active" ? "✅ Активно" : "❌ Закрыто"}
                    </p>
                    <p class="task-manager-item-target text-secondary">
                      {task.target}
                    </p>
                  </div>
                </div>
                <div class="task-manager-item-actions">
                  <button
                    class="btn btn-secondary btn-sm"
                    onClick={() => openEditModal(task)}
                  >
                    ✏️ Редактировать
                  </button>
                  <Show when={task.status === "active"}>
                    <button
                      class="btn btn-danger btn-sm"
                      onClick={() => openCloseModal(task)}
                    >
                      🚫 Закрыть
                    </button>
                  </Show>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen()}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <div class="task-form-modal">
          <h2 class="task-form-title">Создать задание</h2>
          <div class="task-form">
            <div class="form-group">
              <label class="form-label">Тип задания</label>
              <select
                class="input"
                value={formData().type}
                onChange={(e) =>
                  setFormData({
                    ...formData(),
                    type: e.target.value as "channel" | "bot",
                  })
                }
              >
                <option value="channel">Подписка на канал</option>
                <option value="bot">Активация бота</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Название *</label>
              <input
                type="text"
                class="input"
                placeholder="Название задания"
                value={formData().title}
                onInput={(e) =>
                  setFormData({ ...formData(), title: e.target.value })
                }
              />
            </div>

            <div class="form-group">
              <label class="form-label">Описание</label>
              <textarea
                class="input"
                placeholder="Описание задания"
                value={formData().description}
                onInput={(e) =>
                  setFormData({ ...formData(), description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div class="form-group">
              <label class="form-label">Награда (звезды) *</label>
              <input
                type="number"
                class="input"
                placeholder="10"
                value={formData().reward}
                onInput={(e) =>
                  setFormData({ ...formData(), reward: e.target.value })
                }
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                {formData().type === "channel"
                  ? "Username канала *"
                  : "Ссылка на бота *"}
              </label>
              <input
                type="text"
                class="input"
                placeholder={
                  formData().type === "channel"
                    ? "@channel_name"
                    : "https://t.me/bot_name"
                }
                value={formData().target}
                onInput={(e) =>
                  setFormData({ ...formData(), target: e.target.value })
                }
              />
            </div>

            <div class="form-group">
              <label class="form-label">URL аватара</label>
              <input
                type="text"
                class="input"
                placeholder="https://..."
                value={formData().avatarUrl}
                onInput={(e) =>
                  setFormData({ ...formData(), avatarUrl: e.target.value })
                }
              />
            </div>

            <div class="task-form-actions">
              <button
                class="btn btn-primary"
                onClick={handleCreateTask}
                disabled={isSubmitting()}
              >
                {isSubmitting() ? "Создание..." : "Создать"}
              </button>
              <button
                class="btn btn-secondary"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isSubmitting()}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen()}
        onClose={() => setIsEditModalOpen(false)}
      >
        <div class="task-form-modal">
          <h2 class="task-form-title">Редактировать задание</h2>
          <div class="task-form">
            <div class="form-group">
              <label class="form-label">Тип задания</label>
              <select
                class="input"
                value={formData().type}
                onChange={(e) =>
                  setFormData({
                    ...formData(),
                    type: e.target.value as "channel" | "bot",
                  })
                }
              >
                <option value="channel">Подписка на канал</option>
                <option value="bot">Активация бота</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Название *</label>
              <input
                type="text"
                class="input"
                placeholder="Название задания"
                value={formData().title}
                onInput={(e) =>
                  setFormData({ ...formData(), title: e.target.value })
                }
              />
            </div>

            <div class="form-group">
              <label class="form-label">Описание</label>
              <textarea
                class="input"
                placeholder="Описание задания"
                value={formData().description}
                onInput={(e) =>
                  setFormData({ ...formData(), description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div class="form-group">
              <label class="form-label">Награда (звезды) *</label>
              <input
                type="number"
                class="input"
                placeholder="10"
                value={formData().reward}
                onInput={(e) =>
                  setFormData({ ...formData(), reward: e.target.value })
                }
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                {formData().type === "channel"
                  ? "Username канала *"
                  : "Ссылка на бота *"}
              </label>
              <input
                type="text"
                class="input"
                placeholder={
                  formData().type === "channel"
                    ? "@channel_name"
                    : "https://t.me/bot_name"
                }
                value={formData().target}
                onInput={(e) =>
                  setFormData({ ...formData(), target: e.target.value })
                }
              />
            </div>

            <div class="form-group">
              <label class="form-label">URL аватара</label>
              <input
                type="text"
                class="input"
                placeholder="https://..."
                value={formData().avatarUrl}
                onInput={(e) =>
                  setFormData({ ...formData(), avatarUrl: e.target.value })
                }
              />
            </div>

            <div class="task-form-actions">
              <button
                class="btn btn-primary"
                onClick={handleUpdateTask}
                disabled={isSubmitting()}
              >
                {isSubmitting() ? "Сохранение..." : "Сохранить"}
              </button>
              <button
                class="btn btn-secondary"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSubmitting()}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Close Task Confirmation Modal */}
      <Modal
        isOpen={isCloseModalOpen()}
        onClose={() => setIsCloseModalOpen(false)}
      >
        <div class="task-close-modal">
          <h2 class="task-close-title">Закрыть задание?</h2>
          <p class="task-close-description text-secondary">
            Задание "{selectedTask()?.title}" будет закрыто и больше не будет
            отображаться пользователям.
          </p>
          <div class="task-close-actions">
            <button
              class="btn btn-danger"
              onClick={handleCloseTask}
              disabled={isSubmitting()}
            >
              {isSubmitting() ? "Закрытие..." : "Закрыть задание"}
            </button>
            <button
              class="btn btn-secondary"
              onClick={() => setIsCloseModalOpen(false)}
              disabled={isSubmitting()}
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
