<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import "@fontsource-variable/jaro";
  import "@fontsource/jersey-25";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
