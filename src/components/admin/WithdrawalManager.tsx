import { Component, createSignal, onMount, For, Show } from "solid-js";
import type { Withdrawal } from "@/types/index.js";
import { adminApi } from "@/services/api.js";
import { Modal } from "@/components/shared/index.js";

export const WithdrawalManager: Component = () => {
  const [withdrawals, setWithdrawals] = createSignal<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  // Modal states
  const [isRejectModalOpen, setIsRejectModalOpen] = createSignal(false);
  const [selectedWithdrawal, setSelectedWithdrawal] =
    createSignal<Withdrawal | null>(null);
  const [rejectionReason, setRejectionReason] = createSignal("");
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const loadWithdrawals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminApi.getWithdrawals();
      setWithdrawals(response.withdrawals);
    } catch (err: any) {
      console.error("Failed to load withdrawals:", err);
      setError(err.message || "Ошибка загрузки заявок");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    loadWithdrawals();
  });

  const handleApprove = async (withdrawal: Withdrawal) => {
    if (!confirm(`Одобрить вывод ${withdrawal.amount} звезд?`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await adminApi.approveWithdrawal(withdrawal.id);
      await loadWithdrawals();
    } catch (err: any) {
      setError(err.message || "Ошибка одобрения заявки");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openRejectModal = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  const handleReject = async () => {
    const withdrawal = selectedWithdrawal();
    if (!withdrawal) return;

    if (!rejectionReason().trim()) {
      setError("Укажите причину отклонения");
      return;
    }

    setIsSubmitting(true);
    try {
      await adminApi.rejectWithdrawal(withdrawal.id, rejectionReason());
      setIsRejectModalOpen(false);
      setSelectedWithdrawal(null);
      setRejectionReason("");
      await loadWithdrawals();
    } catch (err: any) {
      setError(err.message || "Ошибка отклонения заявки");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳ Ожидает";
      case "approved":
        return "✅ Одобрено";
      case "rejected":
        return "❌ Отклонено";
      default:
        return status;
    }
  };

  const pendingWithdrawals = () =>
    withdrawals().filter((w) => w.status === "pending");
  const processedWithdrawals = () =>
    withdrawals().filter((w) => w.status !== "pending");

  return (
    <div class="withdrawal-manager">
      <div class="withdrawal-manager-header">
        <h2 class="withdrawal-manager-title">Управление выводами</h2>
        <button class="btn btn-secondary" onClick={loadWithdrawals}>
          🔄 Обновить
        </button>
      </div>

      <Show when={error()}>
        <div class="withdrawal-manager-error">
          <p class="text-red">{error()}</p>
          <button class="btn btn-secondary" onClick={() => setError(null)}>
            Закрыть
          </button>
        </div>
      </Show>

      <Show when={isLoading()}>
        <div class="withdrawal-manager-loading">
          <p class="text-secondary">Загрузка заявок...</p>
        </div>
      </Show>

      <Show when={!isLoading()}>
        {/* Pending Withdrawals */}
        <div class="withdrawal-section">
          <h3 class="withdrawal-section-title">
            Ожидают обработки ({pendingWithdrawals().length})
          </h3>
          <div class="withdrawal-list">
            <For
              each={pendingWithdrawals()}
              fallback={
                <div class="withdrawal-empty">
                  <p class="text-secondary">Нет ожидающих заявок</p>
                </div>
              }
            >
              {(withdrawal) => (
                <div class="withdrawal-item card">
                  <div class="withdrawal-item-header">
                    <div class="withdrawal-item-info">
                      <p class="withdrawal-item-user">
                        👤 User ID: {withdrawal.userId}
                      </p>
                      <p class="withdrawal-item-amount">
                        ⭐ {withdrawal.amount} звезд
                      </p>
                      <p class="withdrawal-item-date text-secondary">
                        📅 {formatDate(withdrawal.createdAt)}
                      </p>
                    </div>
                    <div class="withdrawal-item-status">
                      <span class="status-badge status-pending">
                        {getStatusBadge(withdrawal.status)}
                      </span>
                    </div>
                  </div>
                  <div class="withdrawal-item-actions">
                    <button
                      class="btn btn-success btn-sm"
                      onClick={() => handleApprove(withdrawal)}
                      disabled={isSubmitting()}
                    >
                      ✅ Одобрить
                    </button>
                    <button
                      class="btn btn-danger btn-sm"
                      onClick={() => openRejectModal(withdrawal)}
                      disabled={isSubmitting()}
                    >
                      ❌ Отклонить
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>

        {/* Processed Withdrawals */}
        <div class="withdrawal-section">
          <h3 class="withdrawal-section-title">
            Обработанные ({processedWithdrawals().length})
          </h3>
          <div class="withdrawal-list">
            <For
              each={processedWithdrawals()}
              fallback={
                <div class="withdrawal-empty">
                  <p class="text-secondary">Нет обработанных заявок</p>
                </div>
              }
            >
              {(withdrawal) => (
                <div class="withdrawal-item card">
                  <div class="withdrawal-item-header">
                    <div class="withdrawal-item-info">
                      <p class="withdrawal-item-user">
                        👤 User ID: {withdrawal.userId}
                      </p>
                      <p class="withdrawal-item-amount">
                        ⭐ {withdrawal.amount} звезд
                      </p>
                      <p class="withdrawal-item-date text-secondary">
                        📅 {formatDate(withdrawal.createdAt)}
                      </p>
                      <Show when={withdrawal.processedAt}>
                        <p class="withdrawal-item-processed text-secondary">
                          ✓ Обработано: {formatDate(withdrawal.processedAt!)}
                        </p>
                      </Show>
                      <Show when={withdrawal.rejectionReason}>
                        <p class="withdrawal-item-reason text-red">
                          Причина: {withdrawal.rejectionReason}
                        </p>
                      </Show>
                    </div>
                    <div class="withdrawal-item-status">
                      <span
                        class="status-badge"
                        classList={{
                          "status-approved": withdrawal.status === "approved",
                          "status-rejected": withdrawal.status === "rejected",
                        }}
                      >
                        {getStatusBadge(withdrawal.status)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </Show>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen()}
        onClose={() => setIsRejectModalOpen(false)}
      >
        <div class="withdrawal-reject-modal">
          <h2 class="withdrawal-reject-title">Отклонить заявку</h2>
          <p class="withdrawal-reject-info text-secondary">
            Заявка на вывод {selectedWithdrawal()?.amount} звезд от пользователя{" "}
            {selectedWithdrawal()?.userId}
          </p>
          <div class="form-group">
            <label class="form-label">Причина отклонения *</label>
            <textarea
              class="input"
              placeholder="Укажите причину отклонения..."
              value={rejectionReason()}
              onInput={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <div class="withdrawal-reject-actions">
            <button
              class="btn btn-danger"
              onClick={handleReject}
              disabled={isSubmitting()}
            >
              {isSubmitting() ? "Отклонение..." : "Отклонить"}
            </button>
            <button
              class="btn btn-secondary"
              onClick={() => setIsRejectModalOpen(false)}
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
