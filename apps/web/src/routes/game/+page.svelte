<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import Score from "$lib/components/Score.svelte";

  import { backIn, backOut } from "svelte/easing";
  import { fly } from "svelte/transition";

  import TileSVG from "$lib/assets/tile.svg";
  import TileGreenSVG from "$lib/assets/tile-green.svg";
  import TileEmptySVG from "$lib/assets/tile-empty.svg";
  import TileRedSVG from "$lib/assets/tile-red.svg";

  import AlarmSVG from "$lib/assets/icons/alarm.svg";
  import TurnOnSVG from "$lib/assets/icons/turn-on.svg";
  import TrophySVG from "$lib/assets/icons/trophy.svg";
  import CryingFaceSVG from "$lib/assets/icons/crying-face.svg";

  import BombSVG from "$lib/assets/bomb.svg";
  import TimerBar from "$lib/components/TimerBar.svelte";
  import Banner from "$lib/components/Banner.svelte";
  import Button from "$lib/components/Button.svelte";

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

  let showTimeoutBanner = $state(false);
  let showTurnBanner = $state(false);
  let showWinBanner = $state(false);
  let showLoseBanner = $state(false);

  let timeoutBannerTimeout: ReturnType<typeof setTimeout> | undefined = undefined;
  let turnBannerTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

  function showBanner(variant: "timeout" | "turn" | "win" | "lose") {
    const duration = 1000;

    switch (variant) {
      case "timeout":
        showTimeoutBanner = true;
        clearTimeout(timeoutBannerTimeout);
        timeoutBannerTimeout = setTimeout(() => (showTimeoutBanner = false), duration);
        break;
      case "turn":
        showTurnBanner = true;
        clearTimeout(turnBannerTimeout);
        turnBannerTimeout = setTimeout(() => (showTurnBanner = false), duration);
        break;
      case "win":
        showWinBanner = !showWinBanner;
        break;
      case "lose":
        showLoseBanner = !showLoseBanner;
        break;
    }
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
  <br />
  <button
    class="hover:brightness-120 rounded bg-green-500 px-4 py-3 text-white hover:cursor-pointer"
    onclick={() => showBanner("timeout")}
  >
    Timeout
  </button>
  <button
    class="hover:brightness-120 rounded bg-green-500 px-4 py-3 text-white hover:cursor-pointer"
    onclick={() => showBanner("turn")}
  >
    Turn banner
  </button>
  <button
    class="hover:brightness-120 rounded bg-green-500 px-4 py-3 text-white hover:cursor-pointer"
    class:bg-green-700={showWinBanner}
    onclick={() => showBanner("win")}
  >
    Win
  </button>
  <button
    class="hover:brightness-120 rounded bg-green-500 px-4 py-3 text-white hover:cursor-pointer"
    class:bg-green-700={showLoseBanner}
    onclick={() => showBanner("lose")}
  >
    Lose
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
        "h-full w-full",
        state.state === "hidden" && "hover:cursor-pointer hover:brightness-110",
      )}
      draggable="false"
    />
    {#if state.state === "revealed" && state.bomb === true}
      <img
        src={BombSVG}
        class="absolute inset-0 z-10 ml-1"
        draggable="false"
        alt="Pixel art representing a bomb"
      />
    {/if}
  </div>
{/snippet}

{#if showTimeoutBanner}
  <div
    class="absolute inset-0 z-20 m-auto h-fit w-full p-4"
    in:fly={{ y: 200, duration: 300, easing: backOut }}
    out:fly={{ y: -200, duration: 300, easing: backIn }}
  >
    <div class="mx-auto w-full max-w-6xl">
      <Banner iconSource={AlarmSVG} bottomText="Time out!" />
    </div>
  </div>
{/if}
{#if showTurnBanner}
  <div
    class="absolute inset-0 z-20 m-auto h-fit w-full p-4"
    in:fly={{ y: 200, duration: 300, easing: backOut }}
    out:fly={{ y: -200, duration: 300, easing: backIn }}
  >
    <div class="mx-auto w-full max-w-6xl">
      <Banner iconSource={TurnOnSVG} bottomText="Your turn!" />
    </div>
  </div>
{/if}
{#if showWinBanner}
  <div
    class="absolute inset-0 z-20 m-auto h-fit w-full p-4"
    in:fly={{ y: 200, duration: 500, easing: backOut }}
    out:fly={{ y: -200, duration: 500, easing: backIn }}
  >
    <div class="mx-auto w-full max-w-6xl space-y-12">
      <Banner iconSource={TrophySVG} topText="You win!" bottomText="Points: 12345" />
      <div class="flex w-full gap-6">
        <Button>Play again</Button>
        <Button>Return home</Button>
      </div>
    </div>
  </div>
{/if}
{#if showLoseBanner}
  <div
    class="absolute inset-0 z-20 m-auto h-fit w-full p-4"
    in:fly={{ y: 200, duration: 500, easing: backOut }}
    out:fly={{ y: -200, duration: 500, easing: backIn }}
  >
    <div class="mx-auto w-full max-w-6xl space-y-12">
      <Banner iconSource={CryingFaceSVG} topText="You lose" bottomText="Points: 12345" />
      <div class="flex w-full gap-6">
        <Button>Play again</Button>
        <Button>Return home</Button>
      </div>
    </div>
  </div>
{/if}

<div class="mx-auto h-dvh max-w-screen-xl p-4">
  <div
    class="grid h-full w-full grid-cols-[max-content_1fr_max-content] grid-rows-[auto_1fr] gap-x-12 gap-y-6"
  >
    <div class="col-span-1 col-start-1 row-start-1 shrink-0 space-y-6">
      <Score name="Player 1" score={10} variant="left" />
      <TimerBar start={startTime1} end={endTime1} variant="left" />
    </div>
    <div class="col-span-1 col-start-3 row-start-1 shrink-0 space-y-6">
      <Score name="Player 2" score={10} variant="right" />
      <TimerBar start={startTime2} end={endTime2} variant="right" />
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
