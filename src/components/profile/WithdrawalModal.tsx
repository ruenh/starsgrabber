import { Component, createSignal, Show } from "solid-js";
import { Modal } from "@/components/shared/index.js";
import { createWithdrawal } from "@/services/api.js";
import type { User } from "@/types/index.js";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  balance: number;
  onSuccess: () => void;
}

export const WithdrawalModal: Component<WithdrawalModalProps> = (props) => {
  const [amount, setAmount] = createSignal("");
  const [error, setError] = createSignal("");
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const handleClose = () => {
    setAmount("");
    setError("");
    props.onClose();
  };

  const validateAmount = (): boolean => {
    const numAmount = parseInt(amount());

    if (!amount() || isNaN(numAmount)) {
      setError("Введите корректную сумму");
      return false;
    }

    if (numAmount < 100) {
      setError("Минимальная сумма вывода: 100 звезд");
      return false;
    }

    if (numAmount > props.balance) {
      setError("Недостаточно средств на балансе");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError("");

    if (!validateAmount()) {
      return;
    }

    // Check if user has username
    if (!props.user.username) {
      setError(
        "Для вывода необходимо установить username в настройках Telegram"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await createWithdrawal(parseInt(amount()));
      handleClose();
      props.onSuccess();
    } catch (err: any) {
      setError(err.message || "Ошибка при создании заявки на вывод");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value.replace(/\D/g, ""); // Only digits
    setAmount(value);
    setError("");
  };

  return (
    <Modal isOpen={props.isOpen} onClose={handleClose}>
      <div class="withdrawal-modal">
        <h2 class="withdrawal-modal-title">Вывод звезд</h2>

        <div class="withdrawal-modal-content">
          <div class="withdrawal-balance">
            <p class="text-secondary">Доступно для вывода:</p>
            <p class="withdrawal-balance-amount">⭐ {props.balance}</p>
          </div>

          <div class="withdrawal-input-group">
            <label class="withdrawal-label">Сумма вывода</label>
            <input
              type="text"
              inputmode="numeric"
              class="input"
              classList={{ "input-error": !!error() }}
              placeholder="Минимум 100 звезд"
              value={amount()}
              onInput={handleAmountChange}
              disabled={isSubmitting()}
            />
            <Show when={error()}>
              <p class="withdrawal-error text-red">{error()}</p>
            </Show>
          </div>

          <div class="withdrawal-info">
            <p class="text-secondary">
              ℹ️ Заявка будет обработана администратором в течение 24 часов
            </p>
          </div>

          <div class="withdrawal-actions">
            <button
              class="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting()}
            >
              {isSubmitting() ? "Отправка..." : "Отправить заявку"}
            </button>
            <button
              class="btn btn-secondary"
              onClick={handleClose}
              disabled={isSubmitting()}
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
