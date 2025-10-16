<script lang="ts">
  import ScoreLeftSVG from "$lib/assets/score-left.svg";
  import ScoreRightSVG from "$lib/assets/score-right.svg";
  import { twMerge } from "tailwind-merge";

  interface Props {
    name: string | undefined;
    score: number | undefined;
    variant: "left" | "right";
  }

  const { name, score, variant }: Props = $props();
</script>

<div class="relative w-fit">
  <img
    src={variant === "left" ? ScoreLeftSVG : ScoreRightSVG}
    class="w-64 drop-shadow-lg"
    role="presentation"
    alt="background for score"
  />
  <div class="font-pixel absolute inset-0 px-4">
    <div
      class="mb-3 h-9 w-32 truncate text-3xl text-gray-400"
      class:ml-auto={variant === "right"}
      class:text-end={variant === "right"}
    >
      {name}
    </div>
    <div class="flex items-center justify-around">
      <div class="bg-be-mine-gray/20 size-16 rounded-full"></div>
      <span class={twMerge("text-5xl", score === undefined && "text-be-mine-gray/50")}>
        {score !== undefined ? score.toString().padStart(4, "0") : "????"}
      </span>
    </div>
  </div>
</div>
