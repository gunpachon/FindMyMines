<script lang="ts">
  import { linear } from "svelte/easing";
  import { Tween } from "svelte/motion";
  import { twMerge } from "tailwind-merge";

  interface Props {
    start: number | null;
    end: number | null;
    variant: "left" | "right";
  }

  let { start, end, variant }: Props = $props();

  const UPDATE_FREQUENCY = 200;

  const tween = new Tween(1, {
    easing: linear,
    duration: UPDATE_FREQUENCY,
  });

  $effect(() => {
    const startTime = start;
    const endTime = end;

    if (startTime === null || endTime === null) {
      tween.set(1, { duration: 0 });
      return;
    }

    tween.set((Date.now() - startTime) / (endTime - startTime), {
      duration: 0,
    });

    let interval: ReturnType<typeof setInterval> | undefined = undefined;
    const updateTarget = () => {
      const now = Date.now();
      tween.target = (now - startTime + UPDATE_FREQUENCY) / (endTime - startTime);

      if (now > endTime) clearInterval(interval);
    };

    updateTarget();

    interval = setInterval(updateTarget, UPDATE_FREQUENCY);

    return () => clearInterval(interval);
  });
</script>

<div
  class="dark:bg-be-mine-dark-gray h-6 w-full overflow-hidden rounded-lg border border-gray-400 bg-gray-300 dark:border-gray-600"
>
  <div
    class={twMerge(
      "dark:brightness-85 h-full rounded-md",
      variant === "right" && "bg-be-mine-red ml-auto",
      variant === "left" && "bg-be-mine-green",
    )}
    style:width={Math.max(0, 1 - tween.current) * 100 + "%"}
  ></div>
</div>
