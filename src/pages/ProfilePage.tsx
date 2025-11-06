import { Component, createSignal, onMount, Show } from "solid-js";
import { user } from "@/stores/userStore.js";
import { getProfile, getHistory, getWithdrawals } from "@/services/api.js";
import type { Transaction, Withdrawal } from "@/types/index.js";
import {
  ProfileHeader,
  BalanceCard,
  HistoryList,
  WithdrawalModal,
} from "@/components/profile/index.js";

export const ProfilePage: Component = () => {
  const [balance, setBalance] = createSignal(0);
  const [transactions, setTransactions] = createSignal<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = createSignal<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [activeTab, setActiveTab] = createSignal<"balance" | "history">(
    "balance"
  );
  const [showWithdrawalModal, setShowWithdrawalModal] = createSignal(false);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      const [profileData, historyData, withdrawalsData] = await Promise.all([
        getProfile(),
        getHistory(),
        getWithdrawals(),
      ]);

      setBalance(profileData.balance);
      setTransactions(historyData.transactions);
      setWithdrawals(withdrawalsData.withdrawals);
    } catch (error) {
      console.error("Failed to load profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    loadProfileData();
  });

  const handleWithdrawSuccess = () => {
    loadProfileData();
  };

  return (
    <div class="page profile-page">
      <Show when={user()} fallback={<div>Loading...</div>}>
        <ProfileHeader user={user()!} />

        <div class="profile-tabs">
          <button
            class="tab-button"
            classList={{ active: activeTab() === "balance" }}
            onClick={() => setActiveTab("balance")}
          >
            Баланс
          </button>
          <button
            class="tab-button"
            classList={{ active: activeTab() === "history" }}
            onClick={() => setActiveTab("history")}
          >
            История
          </button>
        </div>

        <div class="profile-content">
          <Show when={!isLoading()} fallback={<div>Загрузка...</div>}>
            <Show when={activeTab() === "balance"}>
              <BalanceCard
                balance={balance()}
                onWithdraw={() => setShowWithdrawalModal(true)}
              />
            </Show>

            <Show when={activeTab() === "history"}>
              <HistoryList
                transactions={transactions()}
                withdrawals={withdrawals()}
              />
            </Show>
          </Show>
        </div>

        <WithdrawalModal
          isOpen={showWithdrawalModal()}
          onClose={() => setShowWithdrawalModal(false)}
          user={user()!}
          balance={balance()}
          onSuccess={handleWithdrawSuccess}
        />
      </Show>
    </div>
  );
};
