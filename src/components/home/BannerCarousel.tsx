import { Component, createSignal, onMount, For, Show } from "solid-js";
import type { Banner } from "@/types/index.js";
import { getBanners } from "@/services/api.js";
import { openTelegramLink } from "@/services/telegram.js";

export const BannerCarousel: Component = () => {
  const [banners, setBanners] = createSignal<Banner[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(async () => {
    try {
      const data = await getBanners();
      setBanners(data);
    } catch (error) {
      console.error("Failed to load banners:", error);
    } finally {
      setIsLoading(false);
    }
  });

  const handleBannerClick = (link: string) => {
    openTelegramLink(link);
  };

  return (
    <Show when={!isLoading() && banners().length > 0}>
      <div class="banner-carousel">
        <div class="banner-scroll">
          <For each={banners()}>
            {(banner) => (
              <div
                class="banner-item"
                onClick={() => handleBannerClick(banner.link)}
              >
                <img
                  src={banner.imageUrl}
                  alt="Banner"
                  class="banner-image"
                  loading="lazy"
                />
              </div>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};
