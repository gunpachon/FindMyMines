<script lang="ts">
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

    const socket = io("https://bemine-backend.ideal.sh/");

    socketContext.set(socket);

    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("created", (code) => {
      socket.emit("join", setupState.name, code);
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
        gotoIfNotAt("/game", true);
      }
    });
  }
</script>

{@render children?.()}
