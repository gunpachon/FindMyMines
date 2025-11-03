<script lang="ts">
  import ScoreLeftSVG from "$lib/assets/score-left.svg";
  import ScoreRightSVG from "$lib/assets/score-right.svg";
  import reactionCelebrate from "$lib/assets/reaction-celebrate.svg";
  import reactionFire from "$lib/assets/reaction-fire.svg";
  import reactionHeart from "$lib/assets/reaction-heart.svg";
  import { twMerge } from "tailwind-merge";
  import { scale } from "svelte/transition";
  import { backOut } from "svelte/easing";

  interface Props {
    name: string | undefined;
    score: number | undefined;
    variant: "left" | "right";
    reaction?: "celebrate" | "fire" | "heart" | null;
  }

  const { name, score, variant, reaction = null }: Props = $props();

  const reactionIcons = {
    celebrate: reactionCelebrate,
    fire: reactionFire,
    heart: reactionHeart
  };
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
  
  {#if reaction}
    <div 
      class="absolute z-10 {variant === 'left' ? '-right-4' : '-left-4'} -top-4"
      in:scale={{ duration: 300, easing: backOut, start: 0 }}
      out:scale={{ duration: 200, start: 0 }}
    >
      <div class="bg-white rounded-full p-2 shadow-lg ring-2 {variant === 'left' ? 'ring-be-mine-green' : 'ring-be-mine-red'}">
        <img 
          src={reactionIcons[reaction]} 
          alt={`${reaction} reaction`}
          class="w-14 h-14 object-contain"
        />
      </div>
    </div>
  {/if}
</div>
