import { miniApp, backButton, mainButton } from "@tma.js/sdk-solid";

/**
 * Open URL in Telegram browser
 */
export function openTelegramLink(url: string): void {
  try {
    window.open(url, "_blank");
  } catch (error) {
    console.error("Failed to open Telegram link:", error);
  }
}

/**
 * Open external link in browser
 */
export function openLink(url: string): void {
  try {
    window.open(url, "_blank");
  } catch (error) {
    console.error("Failed to open link:", error);
  }
}

/**
 * Show popup alert
 */
export async function showAlert(title: string, message: string): Promise<void> {
  try {
    alert(`${title}\n\n${message}`);
  } catch (error) {
    console.error("Failed to show popup:", error);
  }
}

/**
 * Show confirmation popup
 */
export async function showConfirm(
  title: string,
  message: string
): Promise<boolean> {
  try {
    return confirm(`${title}\n\n${message}`);
  } catch (error) {
    console.error("Failed to show confirm:", error);
    return false;
  }
}

/**
 * Show/hide back button
 */
export function showBackButton(onClick: () => void): void {
  try {
    if (backButton.mount.isAvailable()) {
      backButton.show();
      backButton.onClick(onClick);
    }
  } catch (error) {
    console.error("Failed to show back button:", error);
  }
}

export function hideBackButton(): void {
  try {
    if (backButton.mount.isAvailable()) {
      backButton.hide();
    }
  } catch (error) {
    console.error("Failed to hide back button:", error);
  }
}

/**
 * Configure main button
 */
export function showMainButton(text: string, onClick: () => void): void {
  try {
    if (mainButton.mount.isAvailable()) {
      mainButton.setText(text);
      mainButton.show();
      mainButton.onClick(onClick);
    }
  } catch (error) {
    console.error("Failed to show main button:", error);
  }
}

export function hideMainButton(): void {
  try {
    if (mainButton.mount.isAvailable()) {
      mainButton.hide();
    }
  } catch (error) {
    console.error("Failed to hide main button:", error);
  }
}

/**
 * Enable/disable main button
 */
export function enableMainButton(): void {
  try {
    if (mainButton.mount.isAvailable()) {
      mainButton.enable();
    }
  } catch (error) {
    console.error("Failed to enable main button:", error);
  }
}

export function disableMainButton(): void {
  try {
    if (mainButton.mount.isAvailable()) {
      mainButton.disable();
    }
  } catch (error) {
    console.error("Failed to disable main button:", error);
  }
}

/**
 * Show loading on main button
 */
export function showMainButtonLoader(): void {
  try {
    if (mainButton.mount.isAvailable()) {
      mainButton.showLoader();
    }
  } catch (error) {
    console.error("Failed to show main button loader:", error);
  }
}

export function hideMainButtonLoader(): void {
  try {
    if (mainButton.mount.isAvailable()) {
      mainButton.hideLoader();
    }
  } catch (error) {
    console.error("Failed to hide main button loader:", error);
  }
}

/**
 * Haptic feedback
 */
export function hapticFeedback(
  type: "light" | "medium" | "heavy" | "success" | "warning" | "error" = "light"
): void {
  try {
    // Telegram haptic feedback would go here
    // For now, we'll use the vibration API as fallback
    if ("vibrate" in navigator) {
      const patterns: Record<string, number | number[]> = {
        light: 10,
        medium: 20,
        heavy: 30,
        success: [10, 50, 10],
        warning: [20, 100, 20],
        error: [30, 100, 30, 100, 30],
      };
      navigator.vibrate(patterns[type] || 10);
    }
  } catch (error) {
    console.error("Failed to trigger haptic feedback:", error);
  }
}

/**
 * Close Mini App
 */
export function closeMiniApp(): void {
  try {
    if (miniApp.mount.isAvailable()) {
      miniApp.close();
    }
  } catch (error) {
    console.error("Failed to close mini app:", error);
  }
}

/**
 * Get start parameter from launch params
 */
export function getStartParam(): string | null {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("tgWebAppStartParam");
  } catch (error) {
    console.error("Failed to get start param:", error);
    return null;
  }
}

/**
 * Generate referral link
 */
export function generateReferralLink(
  botUsername: string,
  userId: number
): string {
  return `https://t.me/${botUsername}?start=ref_${userId}`;
}
