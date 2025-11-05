<script lang="ts">
  import { io } from "socket.io-client";
  import { browser } from "$app/environment";
  import { socketContext } from "$lib/context";
  import { setupState, gameState } from "$lib/state.svelte";
  import type { Game } from "$lib/types";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import { env } from "$env/dynamic/public";

  import NotesPNG from "$lib/assets/notes.png";
  import RedLinePNG from "$lib/assets/red-line.png";
  import { twMerge } from "tailwind-merge";

  let { children } = $props();

  function gotoIfNotAt(route: string) {
    if (page.route.id !== route) {
      goto(route, {
        replaceState: page.route.id !== "/(game)",
      });
    }
  }

  if (browser) {
    if (!gameState.state) {
      gotoIfNotAt("/");
    }

    const socket = io(env.PUBLIC_BACKEND_HOST ?? ":3000");

    socketContext.set(socket);

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("created", (code) => {
      const avatarValue = setupState.avatar !== undefined ? String(setupState.avatar) : "0";
      socket.emit("join", setupState.name, code, avatarValue);
    });

    socket.on("gameState", (state: Game) => {
      gameState.state = state;
      gameState.myIndex = gameState.state.players.findIndex(
        (player) => player.socketID === socket.id,
      );

      if (gameState.myIndex === -1) {
        gameState.myIndex = undefined;
      }

      if (state.status === "waiting") {
        gotoIfNotAt("/waiting");
      } else {
        gotoIfNotAt("/game");
      }
    });

    socket.on("reset", () => {
      gameState.state = undefined;
      goto("/", { replaceState: true });
    });
  }

  let musicPaused = $state(true);
</script>

<audio autoplay bind:paused={musicPaused} volume={0.08}>
  <source src="/the-world-of-8-bit-games-trimmed.mp3" />
</audio>

<div>
  <button
    onclick={() => (musicPaused = !musicPaused)}
    class="fixed bottom-8 right-16 z-20 grid h-14 w-14 place-items-center rounded-full bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline-2 outline-zinc-300 transition-transform hover:brightness-90 active:scale-90"
  >
    <div class="relative">
      <img src={NotesPNG} alt="" class={twMerge("size-10")} />
      {#if !musicPaused}
        <img src={RedLinePNG} alt="" class="absolute inset-0 m-auto size-9" />
      {/if}
    </div>
  </button>
</div>
{@render children?.()}
