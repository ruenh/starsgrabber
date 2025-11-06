import { Component, createSignal } from "solid-js";
import type { Task } from "@/types/index.js";
import { Header } from "@/components/layout/Header.js";
import { BannerCarousel } from "@/components/home/BannerCarousel.js";
import { TaskList } from "@/components/home/TaskList.js";
import { TaskModal } from "@/components/home/TaskModal.js";
import { isAdmin } from "@/stores/userStore.js";

export const HomePage: Component = () => {
  const [selectedTask, setSelectedTask] = createSignal<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = createSignal(false);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const [refreshKey, setRefreshKey] = createSignal(0);

  const handleTaskCompleted = () => {
    // Trigger task list refresh without full page reload
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div class="page">
      <Header showAdminButton={isAdmin()} />
      <BannerCarousel />
      <TaskList key={refreshKey()} onTaskClick={handleTaskClick} />
      <TaskModal
        task={selectedTask()}
        isOpen={isModalOpen()}
        onClose={handleCloseModal}
        onTaskCompleted={handleTaskCompleted}
      />
    </div>
  );
};
