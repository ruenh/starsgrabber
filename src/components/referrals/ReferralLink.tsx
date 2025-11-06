import { Component, createSignal } from "solid-js";
import { user } from "@/stores/userStore.js";

export const ReferralLink: Component = () => {
  const [copied, setCopied] = createSignal(false);

  const getReferralLink = () => {
    const currentUser = user();
    if (!currentUser) return "";

    // Generate referral link with user's telegram ID
    const botUsername = import.meta.env.VITE_BOT_USERNAME || "YourBotUsername";
    return `https://t.me/${botUsername}?start=ref_${currentUser.telegramId}`;
  };

  const copyToClipboard = async () => {
    const link = getReferralLink();

    try {
      // Try using standard clipboard API
      await navigator.clipboard.writeText(link);

      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);

      // Fallback: create temporary input element
      const input = document.createElement("input");
      input.value = link;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);

      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div class="referral-link-card card">
      <div class="referral-link-content">
        <div class="referral-link-header">
          <h3 class="referral-link-title">Ваша реферальная ссылка</h3>
          <p class="referral-link-description text-secondary">
            Приглашайте друзей и получайте 5% от их заработка
          </p>
        </div>

        <div class="referral-link-box">
          <input
            type="text"
            class="referral-link-input"
            value={getReferralLink()}
            readonly
          />
        </div>

        <button
          class={`btn ${
            copied() ? "btn-success" : "btn-primary"
          } referral-copy-btn`}
          onClick={copyToClipboard}
        >
          {copied() ? "✓ Скопировано!" : "📋 Копировать ссылку"}
        </button>
      </div>
    </div>
  );
};
