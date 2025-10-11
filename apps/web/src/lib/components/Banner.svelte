<script lang="ts">
  import { backIn, backOut } from "svelte/easing";
  import { fly } from "svelte/transition";

  interface Props {
    iconSource: string;
    topText?: string;
    bottomText?: string;
  }

  const { iconSource, topText, bottomText }: Props = $props();
</script>

<div class="absolute inset-0 z-20 m-auto h-fit w-full p-4">
  <div
    class="border-light-gray rounded-4xl mx-auto flex w-full max-w-6xl flex-col items-center gap-7 border bg-white/80 p-12 shadow-md"
    in:fly={{ y: 200, duration: 300, easing: backOut }}
    out:fly={{ y: -200, duration: 300, easing: backIn }}
  >
    {#if topText}
      <p class="text-be-mine-gray text-4xl">{topText}</p>
    {/if}
    <img src={iconSource} alt="" srcset="" />
    {#if bottomText}
      <p class="text-be-mine-gray text-4xl">{bottomText}</p>
    {/if}
  </div>
</div>
