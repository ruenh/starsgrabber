import { Component, createSignal, onMount, Show } from "solid-js";
import { adminApi } from "@/services/api.js";

interface Stats {
  totalUsers: number;
  totalTasks: number;
  totalStars: number;
  pendingWithdrawals: number;
}

export const StatsPanel: Component = () => {
  const [stats, setStats] = createSignal<Stats | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminApi.getStats();
      setStats(response);
    } catch (err: any) {
      console.error("Failed to load stats:", err);
      setError(err.message || "Ошибка загрузки статистики");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    loadStats();
  });

  return (
    <div class="stats-panel">
      <div class="stats-panel-header">
        <h2 class="stats-panel-title">Статистика системы</h2>
        <button class="btn btn-secondary" onClick={loadStats}>
          🔄 Обновить
        </button>
      </div>

      <Show when={error()}>
        <div class="stats-panel-error">
          <p class="text-red">{error()}</p>
          <button class="btn btn-secondary" onClick={() => setError(null)}>
            Закрыть
          </button>
        </div>
      </Show>

      <Show when={isLoading()}>
        <div class="stats-panel-loading">
          <p class="text-secondary">Загрузка статистики...</p>
        </div>
      </Show>

      <Show when={!isLoading() && stats()}>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card-icon">👥</div>
            <div class="stat-card-content">
              <p class="stat-card-label text-secondary">Всего пользователей</p>
              <p class="stat-card-value">{stats()!.totalUsers}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card-icon">✅</div>
            <div class="stat-card-content">
              <p class="stat-card-label text-secondary">Выполнено заданий</p>
              <p class="stat-card-value">{stats()!.totalTasks}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card-icon">⭐</div>
            <div class="stat-card-content">
              <p class="stat-card-label text-secondary">Распределено звезд</p>
              <p class="stat-card-value">{stats()!.totalStars}</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-card-icon">💰</div>
            <div class="stat-card-content">
              <p class="stat-card-label text-secondary">Ожидают вывода</p>
              <p class="stat-card-value">{stats()!.pendingWithdrawals}</p>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};
