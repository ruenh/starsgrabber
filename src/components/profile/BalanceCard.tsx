import { Component } from "solid-js";

interface BalanceCardProps {
  balance: number;
  onWithdraw: () => void;
}

export const BalanceCard: Component<BalanceCardProps> = (props) => {
  return (
    <div class="balance-card card">
      <div class="balance-card-content">
        <div class="balance-info">
          <p class="balance-label text-secondary">Баланс</p>
          <h1 class="balance-amount">⭐ {props.balance}</h1>
        </div>
        <button class="btn btn-primary withdraw-btn" onClick={props.onWithdraw}>
          Вывести
        </button>
      </div>
    </div>
  );
};
