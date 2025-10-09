<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import Score from "$lib/components/Score.svelte";

  import TileSVG from "$lib/assets/tile.svg";
  import TileGreenSVG from "$lib/assets/tile-green.svg";
  import TileRedSVG from "$lib/assets/tile-red.svg";
  import BombSVG from "$lib/assets/bomb.svg";

  type TileState = "found:team1" | "found:team2" | "empty" | "unrevealed";

  let boardState = Array.from({ length: 36 }, () => "unrevealed") as TileState[];

  function randomizeState() {
    boardState = Array.from(
      { length: 36 },
      () =>
        (["found:team1", "found:team2", "empty", "unrevealed"] as const)[
          Math.floor(Math.random() * 4)
        ],
    );
  }
</script>

<button
  class="hover:brightness-120 absolute bottom-8 right-8 rounded bg-red-500 px-4 py-3 text-white hover:cursor-pointer"
  onclick={randomizeState}
>
  Random
</button>

{#snippet tile(x: number, y: number, state: TileState)}
  {@const interactible = state === "unrevealed"}
  <div class="relative select-none drop-shadow-md">
    <img
      src={state === "found:team1" ? TileGreenSVG : state === "found:team2" ? TileRedSVG : TileSVG}
      alt=""
      class={twMerge(
        "h-full w-full",
        state === "empty" && "brightness-50",
        interactible && "hover:cursor-pointer",
      )}
      draggable="false"
    />
    {#if state === "found:team1" || state === "found:team2"}
      <img
        src={BombSVG}
        class="absolute inset-0 z-10"
        draggable="false"
        alt="Pixel art representing a bomb"
      />
    {/if}
  </div>
{/snippet}

<div class="mx-auto h-dvh max-w-screen-xl p-4">
  <div
    class="grid h-full w-full grid-cols-[max-content_1fr_max-content] grid-rows-[auto_1fr] gap-x-12 gap-y-6"
  >
    <div class="col-span-1 col-start-1 row-start-1 shrink-0 space-y-6">
      <Score name="Player 1" score={10} variant="left" />
      <div class="h-6 w-full overflow-hidden rounded-lg bg-gray-300">
        <div class="bg-be-mine-green h-full w-[60%]"></div>
      </div>
    </div>
    <div class="col-span-1 col-start-3 row-start-1 shrink-0">
      <Score name="Player 2" score={10} variant="right" />
    </div>
    <div
      class="col-span-full row-start-2 place-self-stretch xl:col-span-1 xl:row-span-full xl:row-start-1"
    >
      <div class="flex h-full w-full flex-col items-center xl:flex-row">
        <div
          class="bg-be-mine-gray grid aspect-square h-full max-h-full w-auto max-w-full grid-cols-6 place-items-stretch p-3 xl:h-auto xl:w-full"
        >
          {#each Array.from(new Array(6), (_, i) => i) as y}
            {#each Array.from(new Array(6), (_, i) => i) as x}
              {@const state = boardState[y * 6 + x]}
              {@render tile(x, y, state)}
            {/each}
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
