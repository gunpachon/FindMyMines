<script lang="ts">
  import { twMerge } from "tailwind-merge";

  interface Props {
    disabled?: boolean;
    class?: string;
    onclick?: () => void;
    children?: import("svelte").Snippet;
  }

  let {
    disabled = false,
    class: className = "",
    onclick,
    children,
    ...restProps
  }: Props = $props();

  const baseClasses =
    "w-full px-12 py-4 bg-be-mine-gray rounded-[32px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-gray-400/50 inline-flex justify-center items-center gap-2.5 overflow-hidden text-white text-4xl font-normal transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-80";

  const classes = twMerge(baseClasses, className);
</script>

<button type="button" {disabled} class={classes} {onclick} {...restProps}>
  {@render children?.()}
</button>
