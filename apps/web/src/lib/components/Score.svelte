<script lang="ts">
  import ScoreLeftSVG from "$lib/assets/score-left.svg";
  import ScoreRightSVG from "$lib/assets/score-right.svg";

  interface Props {
    name: string;
    score: number;
    variant: "left" | "right";
  }

  const { name, score, variant }: Props = $props();
</script>

<div class="relative w-fit">
  <img src={variant === "left" ? ScoreLeftSVG : ScoreRightSVG} class="w-64 drop-shadow-lg" />
  <div class="font-pixel absolute inset-0 px-4">
    <div class="mb-3" class:text-end={variant === "right"}>
      <span class="text-3xl text-gray-400">{name}</span>
    </div>
    <div class="flex items-center justify-around">
      <div class="size-16 rounded-full bg-amber-400"></div>
      <span class="text-5xl">{score.toString().padStart(4, "0")}</span>
    </div>
  </div>
</div>
