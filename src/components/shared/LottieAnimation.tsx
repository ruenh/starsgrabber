import { onMount, onCleanup } from "solid-js";
import lottie from "lottie-web";

interface LottieAnimationProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  width?: string;
  height?: string;
  onComplete?: () => void;
}

export function LottieAnimation(props: LottieAnimationProps) {
  let containerRef: HTMLDivElement | undefined;
  let animationInstance: any = null;

  onMount(() => {
    if (containerRef) {
      // @ts-ignore - lottie-web types issue
      animationInstance = lottie.loadAnimation({
        container: containerRef,
        renderer: "svg",
        loop: props.loop ?? false,
        autoplay: props.autoplay ?? true,
        animationData: props.animationData,
      });

      if (props.onComplete && animationInstance) {
        animationInstance.addEventListener("complete", props.onComplete);
      }
    }
  });

  onCleanup(() => {
    if (animationInstance) {
      animationInstance.destroy();
    }
  });

  return (
    <div
      ref={containerRef}
      style={{
        width: props.width || "200px",
        height: props.height || "200px",
      }}
    />
  );
}
