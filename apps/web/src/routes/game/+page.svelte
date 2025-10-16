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
  import { gameState } from "$lib/state.svelte";
  import { socketContext } from "$lib/context";
  import type { Game } from "$lib/types";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";

  const fallbackBoard = Array.from({ length: 6 }, (_, i) =>
    Array.from({ length: 6 }, (_, j) => ({
      index: [i, j],
      state: "hidden",
      bomb: undefined,
      revealer: null,
    })),
  );

  const socket = socketContext.getOr(null);

  if (browser) {
    socket?.on("timeOut", () => showBanner("timeout"));

    socket?.on("win", () => showBanner("win"));
    socket?.on("lose", () => showBanner("lose"));
  }

  let isTurn = $derived(
    gameState.myIndex !== undefined && gameState.myIndex === gameState.state?.currentTurn,
  );

  $effect(() => {
    if (isTurn) {
      showBanner("turn");
    }
  });

  let myScore = $derived.by(() => {
    if (gameState.myIndex === undefined) return undefined;
    return gameState.state?.players.at(gameState.myIndex)?.score;
  });

  let player1 = $derived(gameState.state?.players.at(0));
  let player2 = $derived(gameState.state?.players.at(1));

  function getTurnTimes(playerIndex: number, state: Game | undefined) {
    if (state?.currentTurn !== playerIndex) return { start: null, end: null };

    return {
      start: state.turnStartTime,
      end: state.turnEndTime,
    };
  }

  let player1TurnTimes = $derived(getTurnTimes(0, gameState.state));
  let player2TurnTimes = $derived(getTurnTimes(1, gameState.state));

  function onTileClick(x: number, y: number) {
    showTurnBanner = false;
    socket?.emit("click", [y, x]);
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

<svelte:head>
  <link rel="preload" href={TileGreenSVG} as="image" type="image/svg+xml" />
  <link rel="preload" href={TileRedSVG} as="image" type="image/svg+xml" />
  <link rel="preload" href={TileEmptySVG} as="image" type="image/svg+xml" />
  <link rel="preload" href={TileSVG} as="image" type="image/svg+xml" />
</svelte:head>

<div class="absolute bottom-8 right-8">
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

{#if showTimeoutBanner}
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class="absolute inset-0 z-20 m-auto h-fit w-full p-4"
    in:fly={{ y: 200, duration: 300, easing: backOut }}
    out:fly={{ y: -200, duration: 300, easing: backIn }}
    onclick={() => (showTimeoutBanner = false)}
    role="alert"
    aria-live="polite"
  >
    <div class="mx-auto w-full max-w-6xl">
      <Banner iconSource={AlarmSVG} bottomText="Time out!" />
    </div>
  </div>
{/if}
{#if showTurnBanner}
  <div
    class="pointer-events-none absolute inset-0 z-20 m-auto h-fit w-full p-4"
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
      <Banner iconSource={TrophySVG} topText="You win!" bottomText="Points: {myScore}" />
      <div class="flex w-full gap-6">
        <Button>Play again</Button>
        <Button onclick={() => goto("/")}>Return home</Button>
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
      <Banner iconSource={CryingFaceSVG} topText="You lose" bottomText="Points: {myScore}" />
      <div class="flex w-full gap-6">
        <Button>Play again</Button>
        <Button onclick={() => goto("/")}>Return home</Button>
      </div>
    </div>
  </div>
{/if}

<div class="mx-auto h-dvh max-w-screen-xl p-4">
  <div
    class="grid h-full w-full grid-cols-[max-content_1fr_max-content] grid-rows-[auto_1fr] gap-x-12 gap-y-6"
  >
    <div class="col-span-1 col-start-1 row-start-1 shrink-0 space-y-6">
      <Score name={player1?.name ?? "Lorem ipsu"} score={player1?.score ?? 0} variant="left" />
      <TimerBar start={player1TurnTimes.start} end={player1TurnTimes.end} variant="left" />
    </div>
    <div class="col-span-1 col-start-3 row-start-1 shrink-0 space-y-6">
      <Score name={player2?.name ?? "Dolor sit a"} score={player2?.score ?? 0} variant="right" />
      <TimerBar start={player2TurnTimes.start} end={player2TurnTimes.end} variant="right" />
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
              {@const board = gameState.state?.board ?? fallbackBoard}
              {@const state = board[y][x]}
              {@const hasBomb = state.state === "revealed" && state.bomb === true}
              {@const tileSVGVariant = (() => {
                if (hasBomb) {
                  switch (state.revealer) {
                    case 0:
                      return TileGreenSVG;
                    case 1:
                      return TileRedSVG;
                    default:
                      return TileSVG;
                  }
                } else {
                  if (state.state === "revealed") return TileEmptySVG;
                  return TileSVG;
                }
              })()}

              <button
                class="relative select-none drop-shadow-md"
                onclick={() => onTileClick(x, y)}
                disabled={!isTurn}
              >
                <img
                  src={tileSVGVariant}
                  alt=""
                  class={twMerge(
                    "h-full w-full",
                    isTurn &&
                      state.state === "hidden" &&
                      "hover:cursor-pointer hover:brightness-110",
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
              </button>
            {/each}
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
