import { Component, createSignal, Show, onMount } from "solid-js";
import type { Task } from "@/types/index.js";
import { Modal } from "@/components/shared/Modal.js";
import { LottieAnimation } from "@/components/shared/LottieAnimation.js";
import { verifyTask } from "@/services/api.js";
import { openTelegramLink } from "@/services/telegram.js";

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskCompleted: () => void;
}

type VerificationState = "initial" | "verifying" | "success" | "error";

export const TaskModal: Component<TaskModalProps> = (props) => {
  const [verificationState, setVerificationState] =
    createSignal<VerificationState>("initial");
  const [hasOpenedLink, setHasOpenedLink] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal("");
  const [starsRewardAnimation, setStarsRewardAnimation] =
    createSignal<any>(null);

  onMount(async () => {
    // Load animation dynamically
    try {
      const response = await fetch("/animations/stars-reward.json");
      const data = await response.json();
      setStarsRewardAnimation(data);
    } catch (error) {
      console.error("Failed to load animation:", error);
    }
  });

  const handleOpenLink = () => {
    if (!props.task) return;

    const link =
      props.task.type === "channel"
        ? `https://t.me/${props.task.target}`
        : props.task.target;

    openTelegramLink(link);
    setHasOpenedLink(true);
  };

  const handleVerify = async () => {
    if (!props.task) return;

    // Prevent multiple simultaneous verifications
    if (verificationState() === "verifying") {
      return;
    }

    try {
      setVerificationState("verifying");
      setErrorMessage("");

      const result = await verifyTask(props.task.id);

      if (result.success) {
        setVerificationState("success");
        // Wait for animation to complete before closing
        setTimeout(() => {
          props.onTaskCompleted();
          handleClose();
        }, 2500);
      } else {
        setVerificationState("error");
        setErrorMessage("Попробуйте снова");
      }
    } catch (error: any) {
      console.error("Verification failed:", error);
      setVerificationState("error");
      setErrorMessage(error.message || "Попробуйте снова");
    }
  };

  const handleClose = () => {
    setVerificationState("initial");
    setHasOpenedLink(false);
    setErrorMessage("");
    props.onClose();
  };

  const handleRetry = () => {
    setVerificationState("initial");
    setErrorMessage("");
    handleOpenLink();
  };

  return (
    <Modal isOpen={props.isOpen} onClose={handleClose}>
      <Show when={props.task}>
        {(task) => (
          <div class="task-modal">
            <Show
              when={verificationState() !== "success"}
              fallback={
                <div class="task-modal-success">
                  <Show when={starsRewardAnimation()}>
                    <LottieAnimation
                      animationData={starsRewardAnimation()}
                      loop={false}
                      autoplay={true}
                      width="200px"
                      height="200px"
                    />
                  </Show>
                  <h2 class="task-modal-success-title">+{task().reward} ⭐</h2>
                  <p class="task-modal-success-text">Задание выполнено!</p>
                </div>
              }
            >
              <div class="task-modal-header">
                <Show when={task().avatarUrl}>
                  <img
                    src={task().avatarUrl}
                    alt={task().title}
                    class="task-modal-avatar"
                  />
                </Show>
                <h2 class="task-modal-title">{task().title}</h2>
                <Show when={task().description}>
                  <p class="task-modal-description text-secondary">
                    {task().description}
                  </p>
                </Show>
                <p class="task-modal-reward text-green">
                  Награда: +{task().reward} ⭐
                </p>
              </div>

              <div class="task-modal-actions">
                <Show
                  when={!hasOpenedLink()}
                  fallback={
                    <>
                      <button
                        class={`btn btn-primary ${
                          verificationState() === "error" ? "btn-error" : ""
                        }`}
                        onClick={handleVerify}
                        disabled={verificationState() === "verifying"}
                      >
                        {verificationState() === "verifying"
                          ? "Проверка..."
                          : "Проверить"}
                      </button>
                      <Show when={verificationState() === "error"}>
                        <p class="task-modal-error text-red">
                          {errorMessage()}
                        </p>
                        <button
                          class="btn btn-secondary mt-sm"
                          onClick={handleRetry}
                        >
                          Открыть снова
                        </button>
                      </Show>
                    </>
                  }
                >
                  <button class="btn btn-primary" onClick={handleOpenLink}>
                    {task().type === "channel" ? "Подписаться" : "Активировать"}
                  </button>
                </Show>

                <button class="btn btn-secondary mt-sm" onClick={handleClose}>
                  Закрыть
                </button>
              </div>
            </Show>
          </div>
        )}
      </Show>
    </Modal>
  );
};
