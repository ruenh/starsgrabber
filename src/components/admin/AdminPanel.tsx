import { Component, createSignal, Show } from "solid-js";
import { TaskManager } from "./TaskManager.js";
import { WithdrawalManager } from "./WithdrawalManager.js";
import { StatsPanel } from "./StatsPanel.js";
import { ReferralTree } from "./ReferralTree.js";

type AdminSection = "tasks" | "withdrawals" | "stats" | "referrals";

interface AdminPanelProps {
  initialSection?: AdminSection;
}

export const AdminPanel: Component<AdminPanelProps> = (props) => {
  const [activeSection, setActiveSection] = createSignal<AdminSection>(
    props.initialSection || "stats"
  );

  return (
    <div class="admin-panel">
      <div class="admin-panel-header">
        <h1 class="admin-panel-title">Админ панель</h1>
      </div>

      <div class="admin-panel-nav">
        <button
          class="admin-nav-button"
          classList={{ active: activeSection() === "stats" }}
          onClick={() => setActiveSection("stats")}
        >
          📊 Статистика
        </button>
        <button
          class="admin-nav-button"
          classList={{ active: activeSection() === "tasks" }}
          onClick={() => setActiveSection("tasks")}
        >
          📝 Задания
        </button>
        <button
          class="admin-nav-button"
          classList={{ active: activeSection() === "withdrawals" }}
          onClick={() => setActiveSection("withdrawals")}
        >
          💰 Выводы
        </button>
        <button
          class="admin-nav-button"
          classList={{ active: activeSection() === "referrals" }}
          onClick={() => setActiveSection("referrals")}
        >
          🌳 Рефералы
        </button>
      </div>

      <div class="admin-panel-content">
        <Show when={activeSection() === "stats"}>
          <div class="admin-section">
            <StatsPanel />
          </div>
        </Show>

        <Show when={activeSection() === "tasks"}>
          <div class="admin-section">
            <TaskManager />
          </div>
        </Show>

        <Show when={activeSection() === "withdrawals"}>
          <div class="admin-section">
            <WithdrawalManager />
          </div>
        </Show>

        <Show when={activeSection() === "referrals"}>
          <div class="admin-section">
            <ReferralTree />
          </div>
        </Show>
      </div>
    </div>
  );
};
