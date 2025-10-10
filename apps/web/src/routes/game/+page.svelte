<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import Score from "$lib/components/Score.svelte";

  import TileSVG from "$lib/assets/tile.svg";
  import TileGreenSVG from "$lib/assets/tile-green.svg";
  import TileEmptySVG from "$lib/assets/tile-empty.svg";
  import TileRedSVG from "$lib/assets/tile-red.svg";
  import BombSVG from "$lib/assets/bomb.svg";
  import TimerBar from "$lib/components/TimerBar.svelte";

  type Tile = {
    state: "hidden" | "revealed";
    bomb: boolean | undefined;
    revealer: "Player1" | "Player2" | null;
  };

  let board: Tile[][] = $state(
    Array.from({ length: 6 }, () =>
      Array.from(
        { length: 6 },

        () =>
          ({
            state: "hidden",
            bomb: undefined,
            revealer: null,
          }) satisfies Tile,
      ),
    ),
  );

  let startTime1 = $state(100);
  let endTime1 = $state(200);
  let startTime2 = $state(100);
  let endTime2 = $state(200);

  function randomizeState() {
    board = Array.from({ length: 6 }, () =>
      Array.from({ length: 6 }, (): Tile => {
        const isHidden = Math.random() < 0.5 ? true : false;

        if (isHidden) {
          return {
            state: "hidden",
            bomb: undefined,
            revealer: null,
          };
        } else {
          return {
            state: "revealed",
            bomb: Math.random() < 0.5,
            revealer: Math.random() < 0.5 ? "Player1" : "Player2",
          };
        }
      }),
    );
  }

  function testTimer() {
    const now = Date.now();

    startTime1 = now;
    endTime1 = now + 5000;
  }

  function testTimer2() {
    const now = Date.now();

    startTime2 = now;
    endTime2 = now + 5000;
  }
</script>

<div class="absolute bottom-8 right-8">
  <button
    class="hover:brightness-120 rounded bg-red-500 px-4 py-3 text-white hover:cursor-pointer"
    onclick={randomizeState}
  >
    Random
  </button>
  <button
    class="hover:brightness-120 rounded bg-blue-500 px-4 py-3 text-white hover:cursor-pointer"
    onclick={testTimer}
  >
    Timer 1
  </button>
  <button
    class="hover:brightness-120 rounded bg-blue-500 px-4 py-3 text-white hover:cursor-pointer"
    onclick={testTimer2}
  >
    Timer 2
  </button>
</div>

{#snippet tile(x: number, y: number, state: Tile)}
  {@const hasBomb = state.state === "revealed" && state.bomb === true}
  {@const tileSVGVariant = (() => {
    if (hasBomb) {
      switch (state.revealer) {
        case "Player1":
          return TileGreenSVG;
        case "Player2":
          return TileRedSVG;
      }
    } else {
      if (state.state === "revealed") return TileEmptySVG;
      return TileSVG;
    }
  })()}
  <div class="relative select-none drop-shadow-md">
    <img
      src={tileSVGVariant}
      alt=""
      class={twMerge(
        "h-full w-full shadow-inner",
        state.state === "hidden" && "hover:cursor-pointer",
      )}
      draggable="false"
    />
    {#if state.state === "revealed" && state.bomb === true}
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
      <TimerBar start={startTime1} end={endTime1} variant="green" />
    </div>
    <div class="col-span-1 col-start-3 row-start-1 shrink-0 space-y-6">
      <Score name="Player 2" score={10} variant="right" />
      <TimerBar start={startTime2} end={endTime2} variant="red" />
    </div>
    <div
      class="col-span-full row-start-2 place-self-stretch xl:col-span-1 xl:row-span-full xl:row-start-1"
    >
      <div class="flex h-full w-full flex-col items-center xl:flex-row">
        <div
          class="bg-be-mine-gray grid aspect-square h-full max-h-full w-auto max-w-full grid-cols-6 place-items-stretch gap-1 p-3 xl:h-auto xl:w-full"
        >
          {#each Array.from(new Array(6), (_, i) => i) as y}
            {#each Array.from(new Array(6), (_, i) => i) as x}
              {@const state = board[y][x]}
              {@render tile(x, y, state)}
            {/each}
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
