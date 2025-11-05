<script lang="ts">
  import BlindSVG from "$lib/assets/blind.svg";
  import ZenSVG from "$lib/assets/zen.svg";
  import BombSVG from "$lib/assets/bomb.svg";
  import MiniSVG from "$lib/assets/mini.svg";

  import Button from "$lib/components/Button.svelte";
  import { twMerge } from "tailwind-merge";
  import { socketContext } from "$lib/context";

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

  let selectedMode = $state<string | undefined>();

  let canProceed = $derived(selectedMode !== undefined);

  const socket = socketContext.getOr(null);

  function handleJoin() {
    if (!canProceed) return;
    if (socket === null) return;

    console.log(socket);

    socket.emit("create", selectedMode);
  }
</script>

{#snippet gameType(mode: Mode)}
  <label
    class={twMerge(
      "dark:bg-dark dark:text-be-mine-body-dark dark:hover:bg-dark flex h-64 w-64 flex-col items-center justify-center gap-5 rounded-2xl border-2 border-gray-300 p-8 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all hover:bg-gray-100 dark:border-gray-600 dark:hover:brightness-110",
      selectedMode === mode.id
        ? "bg-be-mine-light-blue hover:bg-be-mine-light-blue border-4 border-blue-500 dark:border-gray-400 dark:brightness-125 dark:hover:brightness-125"
        : "bg-white",
    )}
  >
    <input type="radio" name="mode" class="hidden" value={mode.id} bind:group={selectedMode} />
    <img
      src={mode.icon}
      alt=""
      class="relative h-32 w-32"
      class:dark:invert={mode.id === "blind"}
    />
    <div class="justify-start self-stretch text-center text-4xl font-normal">
      {mode.name}
    </div>
  </label>
{/snippet}

<div class="inline-flex min-h-dvh w-full flex-col items-center justify-center gap-12">
  <div
    class="dark:text-be-mine-body-dark h-12 justify-start self-stretch text-center text-5xl font-normal text-neutral-700"
  >
    Choose Game Mode
  </div>
  <fieldset data-property-1="Default" class="inline-flex items-center justify-start gap-20">
    {#each modes as mode}
      {@render gameType(mode)}
    {/each}
  </fieldset>
  <div class="w-md flex items-center justify-center gap-4">
    <Button disabled={!canProceed} onclick={handleJoin}>Create Game</Button>
  </div>
</div>
