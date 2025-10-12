<script lang="ts">
  import { linear } from "svelte/easing";
  import { Tween } from "svelte/motion";

  interface Props {
    start: number;
    end: number;
    variant: "green" | "red";
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

<div class="h-6 w-full overflow-hidden rounded-lg bg-gray-300">
  <div
    class="h-full"
    class:bg-be-mine-green={variant === "green"}
    class:bg-be-mine-red={variant === "red"}
    style:width={tween.current <= 1 ? (1 - tween.current) * 100 + "%" : "0%"}
  ></div>
</div>
