import { Component, For, Show, createSignal } from "solid-js";
import type { Transaction, Withdrawal } from "@/types/index.js";
import { Modal } from "@/components/shared/index.js";

interface HistoryListProps {
  transactions: Transaction[];
  withdrawals: Withdrawal[];
}

export const HistoryList: Component<HistoryListProps> = (props) => {
  const [showStatusModal, setShowStatusModal] = createSignal(false);
  const [selectedWithdrawal, setSelectedWithdrawal] =
    createSignal<Withdrawal | null>(null);

  // Combine and sort transactions and withdrawals by date
  const getHistoryItems = () => {
    const items: Array<{
      id: string;
      type: "transaction" | "withdrawal";
      date: string;
      amount: number;
      status?: string;
      withdrawal?: Withdrawal;
    }> = [];

    // Add transactions
    props.transactions.forEach((tx) => {
      items.push({
        id: `tx-${tx.id}`,
        type: "transaction",
        date: tx.createdAt,
        amount: tx.amount,
      });
    });

    // Add withdrawals
    props.withdrawals.forEach((wd) => {
      items.push({
        id: `wd-${wd.id}`,
        type: "withdrawal",
        date: wd.createdAt,
        amount: -wd.amount,
        status: wd.status,
        withdrawal: wd,
      });
    });

    // Sort by date descending
    return items.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      default:
        return "";
    }
  };

  const getTransactionLabel = (item: ReturnType<typeof getHistoryItems>[0]) => {
    if (item.type === "withdrawal") {
      return "Вывод";
    }
    return "Задание";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleInfoClick = (withdrawal: Withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowStatusModal(true);
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending":
        return "Ваша заявка на вывод находится в обработке. Пожалуйста, подождите.";
      case "approved":
        return "Ваша заявка на вывод одобрена. Звезды будут отправлены в ближайшее время.";
      case "rejected":
        return `Ваша заявка на вывод отклонена. ${
          selectedWithdrawal()?.rejectionReason || "Причина не указана."
        }`;
      default:
        return "";
    }
  };

  return (
    <>
      <div class="history-list">
        <Show
          when={getHistoryItems().length > 0}
          fallback={
            <div class="history-empty">
              <p class="text-secondary">История операций пуста</p>
            </div>
          }
        >
          <div class="history-items">
            <For each={getHistoryItems()}>
              {(item) => (
                <div class="history-item card">
                  <div class="history-item-content">
                    <div class="history-item-info">
                      <p class="history-item-label">
                        {getTransactionLabel(item)}
                      </p>
                      <p class="history-item-date text-secondary">
                        {formatDate(item.date)}
                      </p>
                    </div>
                    <div class="history-item-right">
                      <p
                        class="history-item-amount"
                        classList={{
                          "text-green": item.amount > 0,
                          "text-red": item.amount < 0,
                        }}
                      >
                        {item.amount > 0 ? "+" : ""}
                        {item.amount} ⭐
                      </p>
                      <Show when={item.type === "withdrawal" && item.status}>
                        <div class="history-item-status">
                          <span class="status-icon">
                            {getStatusIcon(item.status)}
                          </span>
                          <button
                            class="info-button"
                            onClick={() =>
                              item.withdrawal &&
                              handleInfoClick(item.withdrawal)
                            }
                          >
                            ℹ️
                          </button>
                        </div>
                      </Show>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>

      <Modal
        isOpen={showStatusModal()}
        onClose={() => setShowStatusModal(false)}
      >
        <div class="status-modal">
          <h3 class="status-modal-title">Статус вывода</h3>
          <Show when={selectedWithdrawal()}>
            <div class="status-modal-content">
              <div class="status-modal-icon">
                {getStatusIcon(selectedWithdrawal()!.status)}
              </div>
              <p class="status-modal-description">
                {getStatusDescription(selectedWithdrawal()!.status)}
              </p>
              <Show when={selectedWithdrawal()!.status === "approved"}>
                <p class="status-modal-date text-secondary">
                  Обработано:{" "}
                  {selectedWithdrawal()!.processedAt &&
                    formatDate(selectedWithdrawal()!.processedAt!)}
                </p>
              </Show>
            </div>
          </Show>
          <button
            class="btn btn-primary"
            onClick={() => setShowStatusModal(false)}
          >
            Закрыть
          </button>
        </div>
      </Modal>
    </>
  );
};
