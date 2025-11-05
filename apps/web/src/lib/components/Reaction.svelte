<script lang="ts">
  import { twMerge } from "../twMerge";

  import reactionCelebrate from "../assets/reaction-celebrate.svg";
  import reactionFire from "../assets/reaction-fire.svg";
  import reactionHeart from "../assets/reaction-heart.svg";

  interface Props {
    type: "celebrate" | "fire" | "heart";
    disabled?: boolean;
    class?: string;
    onclick?: () => void;
  }

  let { type, disabled = false, class: className = "", onclick, ...restProps }: Props = $props();

  const reactionIcons = {
    celebrate: reactionCelebrate,
    fire: reactionFire,
    heart: reactionHeart,
  };

  const baseClasses =
    "w-20 h-16 p-2 rounded-xl inline-flex justify-center items-center transition hover:brightness-110 hover:scale-120 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";

  const classes = twMerge(baseClasses, className);
</script>

<button type="button" {disabled} class={classes} {onclick} {...restProps}>
  <img src={reactionIcons[type]} alt={`${type} reaction`} class="h-20 w-20 object-contain" />
</button>
