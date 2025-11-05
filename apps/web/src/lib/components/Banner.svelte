<script lang="ts">
  import { twMerge } from "tailwind-merge";

  interface Props {
    iconSource: string;
    topText?: string;
    bottomText?: string;
    class?: string;
  }

  const { iconSource, topText, bottomText, class: classes }: Props = $props();
</script>

<div
  class={twMerge(
    "mx-auto flex flex-col items-center gap-7 rounded-4xl border border-light-gray bg-white/80 p-12 shadow-md",
    classes,
  )}
>
  {#if topText}
    <p class="text-4xl text-be-mine-gray">{topText}</p>
  {/if}
  <img src={iconSource} alt="" srcset="" />
  {#if bottomText}
    <p class="text-4xl text-be-mine-gray">{bottomText}</p>
  {/if}
</div>
