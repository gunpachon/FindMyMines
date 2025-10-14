<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";

  import { io } from "socket.io-client";
  import { browser } from "$app/environment";
  import { socketContext } from "$lib/context";
  import { setupState, gameState } from "$lib/state.svelte";
  import type { Game } from "$lib/types";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";

  let { children } = $props();

  function gotoIfNotAt(route: string, replace = false) {
    if (page.route.id !== route) {
      goto(route, {
        replaceState: replace,
      });
    }
  }

  if (browser) {
    if (!gameState.state) {
      gotoIfNotAt("/");
    }

    const socket = io(":3000");

    socketContext.set(socket);

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("created", (code) => {
      socket.emit("join", setupState.name, code);
    });

    socket.on("gameState", (state: Game) => {
      gameState.state = state;

      if (state.status === "waiting") {
        gotoIfNotAt("/waiting");
      } else {
        gotoIfNotAt("/game", true);
      }
    });
  }
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
