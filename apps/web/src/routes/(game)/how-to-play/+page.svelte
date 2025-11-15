<script lang="ts">
  import BlindSVG from "$lib/assets/blind.svg";
  import ZenSVG from "$lib/assets/zen.svg";
  import BombSVG from "$lib/assets/bomb.svg";
  import MiniSVG from "$lib/assets/mini.svg";

  import HowtoPlay1 from "$lib/assets/how-to-play-1.svg";
  import HowtoPlay1Zen from "$lib/assets/how-to-play-1-zen.svg";
  import HowtoPlay1Mini from "$lib/assets/how-to-play-1-mini.svg";
  import HowtoPlay2 from "$lib/assets/how-to-play-2.svg";
  import HowtoPlay3 from "$lib/assets/how-to-play-3.svg";
  import HowtoPlay3Mini from "$lib/assets/how-to-play-3-mini.svg";
  import HowtoPlay3Blind from "$lib/assets/how-to-play-3-blind.svg";
  import HowtoPlay4 from "$lib/assets/how-to-play-4.svg";
  import HowtoPlay4Mini from "$lib/assets/how-to-play-4-mini.svg";

  import { twMerge } from "tailwind-merge";

  interface Mode {
    id: string;
    name: string;
    icon: string;
  }

  const modes: Mode[] = [
    { id: "general", name: "General", icon: BombSVG },
    { id: "zen", name: "Zen", icon: ZenSVG },
    { id: "blind", name: "Blind", icon: BlindSVG },
    { id: "mini", name: "Mini", icon: MiniSVG },
  ];

  interface HowtoPlay {
    id: string;
    picture: string[];
    description: string[];
  }

  const howToPlays: HowtoPlay[] = [
    {
      id: "general",
      picture: [HowtoPlay1, HowtoPlay2, HowtoPlay3, HowtoPlay4],
      description: [
        "There are 11 bombs hidden on the board. On your turn, you have 10 seconds to select one grid slot.",
        "If your pick contains a bomb, you score points and that bomb is revealed.",
        "If time runs out or you pick an empty slot, you score 0 for that turn.",
        "The game ends when all 11 bombs are found. Highest total points wins.",
      ],
    },
    {
      id: "zen",
      picture: [HowtoPlay1Zen, HowtoPlay2, HowtoPlay3, HowtoPlay4],
      description: [
        "There are 11 bombs hidden on the board. On your turn, pick one tile. No timer on this mode.",
        "If your pick contains a bomb, you score points and that bomb is revealed.",
        "If you pick an empty slot, you score 0 for that turn.",
        "The game ends when all 11 bombs are found. Highest total points wins.",
      ],
    },
    {
      id: "blind",
      picture: [HowtoPlay1, HowtoPlay2, HowtoPlay3Blind, HowtoPlay4],
      description: [
        "There are 11 bombs hidden  on the board. On your turn, you have 10 seconds to select one grid slot.",
        "If your pick contains a bomb, you score points and that bomb is revealed.",
        "After each pick, both players see the result, then the slot resets and hides again next turn.",
        "The game ends when all 11 bombs are found. Highest total points wins.",
      ],
    },
    {
      id: "mini",
      picture: [HowtoPlay1Mini, HowtoPlay2, HowtoPlay3Mini, HowtoPlay4Mini],
      description: [
        "There are 5 bombs hidden on the 4x4 board. On your turn, you have 10 seconds to select one grid slot.",
        "If your pick contains a bomb, you score points and that bomb is revealed.",
        "If time runs out or you pick an empty slot, you score 0 for that turn.",
        "The game ends when all 5 bombs are found. Highest total points wins.",
      ],
    },
  ];

  let selectedMode = $state<string | undefined>(modes[0].id);
</script>

{#snippet gameType(mode: Mode)}
  <label>
    <input type="radio" name="mode" class="hidden" value={mode.id} bind:group={selectedMode} />
    <div
      class={twMerge(
        "rounded-4xl dark:bg-dark dark:text-be-mine-body-dark inline-flex h-14 w-60 cursor-pointer items-center justify-center overflow-hidden bg-white px-10 py-2.5 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline-2 outline-offset-[-2px] outline-gray-300 dark:outline-gray-600",
        selectedMode === mode.id
          ? "bg-be-mine-light-blue outline-blue-500 dark:bg-gray-700 dark:outline-gray-400"
          : "hover:brightness-95",
      )}
    >
      <div class="flex items-center">
        <img
          src={mode.icon}
          alt=""
          class="mr-1 h-10 w-10"
          class:dark:invert={mode.id === "blind"}
        />
        <span class="text-center text-4xl font-normal">
          {mode.name}
        </span>
      </div>
    </div>
  </label>
{/snippet}

{#snippet howToPlayContent()}
  {@const currentMode = howToPlays.find((mode) => mode.id === selectedMode)}
  {#if currentMode}
    <div class="mt-12 flex flex-row flex-wrap justify-center gap-4">
      {#each currentMode.description as description, i}
        <div
          class="dark:bg-dark dark:text-be-mine-body-dark flex w-64 flex-col overflow-hidden rounded-3xl bg-white p-6 outline-1 outline-gray-300 dark:outline-gray-600"
        >
          <div class="mb-4 flex h-64 items-center justify-center">
            <img src={currentMode.picture[i]} alt="" class="h-auto max-h-full w-auto" />
          </div>
          <p class="text-lg font-normal">{description}</p>
        </div>
      {/each}
    </div>
  {/if}
{/snippet}

<div class="min-h-screen p-12">
  <button
    class="dark:bg-dark dark:text-be-mine-body-dark cursor-pointer rounded-full border-2 border-gray-300 bg-white px-8 py-2 text-3xl shadow-md hover:brightness-95 dark:border-gray-600"
    onclick={() => history.back()}
  >
    &lt; Back
  </button>
  <h1 class="text-be-mine-light-gray dark:text-be-mine-body-dark text-center text-5xl font-bold">
    HOW TO PLAY
  </h1>
  <div class="mt-12 flex flex-wrap justify-center gap-2.5">
    {#each modes as mode}
      {@render gameType(mode)}
    {/each}
    {@render howToPlayContent()}
  </div>
</div>
