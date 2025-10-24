<script lang="ts">
  import BlindSVG from "$lib/assets/blind.svg";
  import ZenSVG from "$lib/assets/zen.svg";
  import BombSVG from "$lib/assets/bomb.svg";
  import MiniSVG from "$lib/assets/mini.svg";

  import HowtoPlay1 from "$lib/assets/how-to-play-1-timer.svg";
  import HowtoPlay1NoTimer from "$lib/assets/how-to-play-1-no-timer.svg";
  import HowtoPlay1Big from "$lib/assets/how-to-play-1-big.svg";
  import HowtoPlay2 from "$lib/assets/how-to-play-2.svg";
  import HowtoPlay3 from "$lib/assets/how-to-play-3.svg";
  import HowtoPlay3Big from "$lib/assets/how-to-play-3-big.svg";
  import HowtoPlay4 from "$lib/assets/how-to-play-4.svg";

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
      picture: [HowtoPlay1Big, HowtoPlay2, HowtoPlay3Big, HowtoPlay4],
      description: [
        "There are 11 bombs hidden on the board. On your turn, you have 10 seconds to select one grid slot.",
        "If your pick contains a bomb, you score points and that bomb is revealed.",
        "If time runs out or you pick an empty slot, you score 0 for that turn.",
        "The game ends when all 11 bombs are found. Highest total points wins.",
      ],
    },
    {
      id: "zen",
      picture: [HowtoPlay1NoTimer, HowtoPlay2, HowtoPlay3, HowtoPlay4],
      description: [
        "There are 11 bombs hidden on the board. On your turn, pick one tile. No timer on this mode.",
        "If your pick contains a bomb, you score points and that bomb is revealed.",
        "If time runs out or you pick an empty slot, you score 0 for that turn.",
        "The game ends when all 11 bombs are found. Highest total points wins.",
      ],
    },
    {
      id: "blind",
      picture: [HowtoPlay1, HowtoPlay2, HowtoPlay3, HowtoPlay4],
      description: [
        "There are 11 bombs hidden on the board. On your turn, pick one tile. No timer on this mode.",
        "If your pick contains a bomb, you score points and that bomb is revealed.",
        "If time runs out or you pick an empty slot, you score 0 for that turn.",
        "The game ends when all 11 bombs are found. Highest total points wins.",
      ],
    },
    {
      id: "mini",
      picture: [HowtoPlay1, HowtoPlay2, HowtoPlay3, HowtoPlay4],
      description: [
        "There are 6 bombs hidden on a smaller board. On your turn, you have 10 seconds to select one grid slot.",
        "If your pick contains a bomb, you score points and that bomb is revealed.",
        "If time runs out or you pick an empty slot, you score 0 for that turn.",
        "The game ends when all 6 bombs are found. Highest total points wins.",
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
        "w-60 h-14 px-10 py-2.5 bg-white rounded-4xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline-2 outline-offset-[-2px] outline-zinc-300 inline-flex justify-center items-center overflow-hidden cursor-pointer",
        selectedMode === mode.id
          ? "bg-be-mine-light-blue outline-blue-500 ring-1 ring-blue-500"
          : "hover:brightness-95",
      )}
    >
      <div class="flex items-center">
        <img src={mode.icon} alt="" class="h-10 w-10" />
        <span class="text-center text-black text-4xl font-normal">
          {mode.name}
        </span>
      </div>
    </div>
  </label>
{/snippet}

{#snippet howToPlayContent()}
  {@const currentMode = howToPlays.find((mode) => mode.id === selectedMode)}
  {#if currentMode}
    <div class="flex flex-row flex-wrap gap-4 mt-12 justify-center">
      {#each currentMode.description as description, i}
        <div
          class="overflow-hidden rounded-3xl bg-white p-6 w-64 h-96 flex flex-col outline-1 outline-offset-[-1px] outline-slate-300"
        >
          <img src={currentMode.picture[i]} alt="" class="w-full h-auto mb-4" />
          <p class="text-black text-xl font-normal">{description}</p>
        </div>
      {/each}
    </div>
  {/if}
{/snippet}

<div class="min-h-screen bg-white p-12">
  <h1 class="text-center text-5xl font-bold text-be-mine-light-gray">HOW TO PLAY</h1>
  <div class="mt-9 flex flex-wrap justify-center gap-2.5">
    {#each modes as mode}
      {@render gameType(mode)}
    {/each}
  </div>
  {@render howToPlayContent()}
</div>
