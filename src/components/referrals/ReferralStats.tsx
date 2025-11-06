import { Component, createSignal, onMount, Show, For } from "solid-js";
import { getReferrals } from "@/services/api.js";
import type { ReferralStats as ReferralStatsType } from "@/types/index.js";

export const ReferralStats: Component = () => {
  const [stats, setStats] = createSignal<ReferralStatsType | null>(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);

  const loadReferralStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReferrals();
      setStats(data);
    } catch (err: any) {
      console.error("Failed to load referral stats:", err);
      setError(err.message || "Не удалось загрузить статистику");
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    loadReferralStats();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getAvatarUrl = (user: any) => {
    return (
      user.avatarUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user.firstName
      )}&background=1a1a1a&color=ffffff&size=80`
    );
  };

  const getDisplayName = (user: any) => {
    if (user.username) {
      return `@${user.username}`;
    }
    return user.firstName + (user.lastName ? ` ${user.lastName}` : "");
  };

  return (
    <div class="referral-stats-card card">
      <div class="referral-stats-content">
        <div class="referral-stats-header">
          <h3 class="referral-stats-title">Статистика рефералов</h3>
        </div>

        <Show when={loading()}>
          <div class="referral-list-empty">
            <p class="text-secondary">Загрузка...</p>
          </div>
        </Show>

        <Show when={error()}>
          <div class="referral-list-empty">
            <p class="text-red">{error()}</p>
          </div>
        </Show>

        <Show when={!loading() && !error() && stats()}>
          <div class="referral-stats-grid">
            <div class="referral-stat-item">
              <p class="referral-stat-label text-secondary">Всего рефералов</p>
              <p class="referral-stat-value">{stats()?.totalReferrals || 0}</p>
            </div>

            <div class="referral-stat-item">
              <p class="referral-stat-label text-secondary">Заработано</p>
              <p class="referral-stat-value text-green">
                ⭐ {stats()?.totalEarnings || 0}
              </p>
            </div>
          </div>

          <div class="referral-list">
            <h4 class="referral-list-title">Ваши рефералы</h4>

            <Show
              when={stats()?.referrals && stats()!.referrals.length > 0}
              fallback={
                <div class="referral-list-empty">
                  <p class="text-secondary">
                    У вас пока нет рефералов. Поделитесь своей ссылкой, чтобы
                    начать зарабатывать!
                  </p>
                </div>
              }
            >
              <div class="referral-items">
                <For each={stats()?.referrals}>
                  {(referral) => (
                    <div class="referral-item">
                      <img
                        src={getAvatarUrl(referral)}
                        alt={referral.firstName}
                        class="referral-item-avatar"
                      />
                      <div class="referral-item-info">
                        <p class="referral-item-name">
                          {getDisplayName(referral)}
                        </p>
                        <p class="referral-item-date text-secondary">
                          Присоединился {formatDate(referral.createdAt)}
                        </p>
                      </div>
                      <div class="referral-item-balance">
                        ⭐ {referral.balance}
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
};
