<script lang="ts">
  import BlindSVG from "$lib/assets/blind.svg";
  import ZenSVG from "$lib/assets/zen.svg";
  import BombSVG from "$lib/assets/bomb.svg";
  import Button from "$lib/components/Button.svelte";
  import { twMerge } from "tailwind-merge";

  const Modes = ["General", "Zen", "Blind"] as const;
  const ModeIcons = [BombSVG, ZenSVG, BlindSVG];

  let selectGameIdx = $state<number | null>(null);

  function selectMode(index: number) {
    selectGameIdx = index;
  }

  function canProceed() {
    return selectGameIdx !== null;
  }

  function handleJoin() {
    if (!canProceed()) return;
    // todo: join game
  }
</script>

{#snippet gameType(name: string, icon: string, isSelected: boolean, onclick: () => void)}
  <button
    class={twMerge(
      "w-64 h-64 p-8 rounded-2xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline-1 outline-offset-[-1px] outline-slate-300 flex flex-col justify-center items-center gap-5 hover:ring-blue-500 hover:border-blue-500 hover:ring-4",
      isSelected === true
        ? "border-blue-500 ring-4 ring-blue-500 bg-be-mine-light-blue"
        : "bg-white border-black/10 hover:brightness-105",
    )}
    {onclick}
  >
    <img src={icon} alt="" class="w-32 h-32 relative" />
    <div class="self-stretch text-center justify-start text-black text-4xl font-normal">
      {name}
    </div>
  </button>
{/snippet}

<div class="w-full min-h-dvh inline-flex flex-col items-center gap-12 justify-center">
  <div class="self-stretch h-12 text-center justify-start text-neutral-700 text-5xl font-normal">
    Choose Game Mode
  </div>
  <div data-property-1="Default" class="inline-flex justify-start items-center gap-20">
    {#each Modes as gameMode, i}
      {@render gameType(gameMode, ModeIcons[i], selectGameIdx === i, () => (selectGameIdx = i))}
    {/each}
  </div>
  <div class="w-md flex gap-4 justify-center items-center">
    <Button disabled={!canProceed()} onclick={handleJoin}>Create Game</Button>
  </div>
</div>



