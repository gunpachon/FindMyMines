<script lang="ts">
  interface Props {
    iconSource: string;
    topText?: string;
    bottomText?: string;
  }

  const { iconSource, topText, bottomText }: Props = $props();
</script>

<div
  class="border-light-gray rounded-4xl mx-auto flex flex-col items-center gap-7 border bg-white/80 p-12 shadow-md"
>
  {#if topText}
    <p class="text-be-mine-gray text-4xl">{topText}</p>
  {/if}
  <img src={iconSource} alt="" srcset="" />
  {#if bottomText}
    <p class="text-be-mine-gray text-4xl">{bottomText}</p>
  {/if}
</div>
