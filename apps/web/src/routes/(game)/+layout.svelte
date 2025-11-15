<script lang="ts">
  import { io } from "socket.io-client";
  import { browser } from "$app/environment";
  import { socketContext, statusContext } from "$lib/context";
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

  let statusObject = $state({ connected: false });

  if (browser) {
    if (!gameState.state) {
      gotoIfNotAt("/");
    }

    const socket = io(env.PUBLIC_BACKEND_HOST ?? ":3000");

    socketContext.set(socket);
    statusContext.set(statusObject);

    socket.on("connect", () => {
      statusObject.connected = true;
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

    socket.on("disconnect", () => {
      statusObject.connected = false;
    });
  }

  let musicPaused = $state(true);
  let darkMode = $state(false);
</script>

<audio autoplay loop bind:paused={musicPaused} volume={0.08}>
  <source src="/the-world-of-8-bit-games-trimmed.mp3" />
</audio>

<div class="contents" class:dark={darkMode}>
  <div class="fixed bottom-8 right-8 z-20 flex gap-2.5">
    <button
      onclick={() => (musicPaused = !musicPaused)}
      class="dark:bg-dark dark:text-be-mine-body-dark hover:dark:brightness-120 grid size-16 place-items-center rounded-full border-2 border-gray-300 bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-transform hover:brightness-90 active:scale-90 dark:border-gray-600"
    >
      <div class="relative">
        <img src={NotesPNG} alt="" class="size-10 dark:invert" />
        {#if musicPaused}
          <img src={RedLinePNG} alt="" class="absolute inset-0 m-auto size-9" />
        {/if}
      </div>
    </button>
    <div
      class="dark:bg-dark dark:text-be-mine-body-dark flex w-fit items-center gap-2 rounded-full border-2 border-gray-300 bg-white px-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] dark:border-gray-600"
    >
      <button
        onclick={() => (darkMode = false)}
        class={twMerge(
          "color-be-mine-gray hover:dark:brightness-120 dark:bg-dark hover:dark:brightness-120 flex aspect-square size-12 items-center justify-center rounded-full bg-white hover:brightness-90",
          !darkMode && "bg-be-mine-gray",
        )}
      >
        <svg
          width="39"
          height="39"
          viewBox="0 0 39 39"
          class={twMerge(
            "fill-be-mine-dark-gray dark:fill-be-mine-body-dark size-7",
            !darkMode && "fill-white",
          )}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.5 30.1364C13.6257 30.1364 8.86364 25.3743 8.86364 19.5C8.86364 13.6257 13.6257 8.86364 19.5 8.86364C25.3743 8.86364 30.1364 13.6257 30.1364 19.5C30.1364 25.3743 25.3743 30.1364 19.5 30.1364ZM19.5 26.5909C23.4161 26.5909 26.5909 23.4161 26.5909 19.5C26.5909 15.5838 23.4161 12.4091 19.5 12.4091C15.5838 12.4091 12.4091 15.5838 12.4091 19.5C12.4091 23.4161 15.5838 26.5909 19.5 26.5909ZM17.7273 0H21.2727V5.31818H17.7273V0ZM17.7273 33.6818H21.2727V39H17.7273V33.6818ZM4.45791 6.96492L6.96492 4.45791L10.7254 8.21844L8.21844 10.7254L4.45791 6.96492ZM28.2745 30.7816L30.7816 28.2745L34.5421 32.0351L32.0351 34.5421L28.2745 30.7816ZM32.0351 4.45791L34.5421 6.96492L30.7816 10.7254L28.2745 8.21844L32.0351 4.45791ZM8.21844 28.2745L10.7254 30.7816L6.96492 34.5421L4.45791 32.0351L8.21844 28.2745ZM39 17.7273V21.2727H33.6818V17.7273H39ZM5.31818 17.7273V21.2727H0V17.7273H5.31818Z"
          />
        </svg>
      </button>
      <button
        onclick={() => (darkMode = true)}
        class={twMerge(
          "color-be-mine-gray hover:dark:brightness-120 flex aspect-square size-12 items-center justify-center rounded-full bg-white hover:brightness-90",
          darkMode && "bg-be-mine-gray",
        )}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          class={twMerge(
            "fill-be-mine-dark-gray dark:fill-be-mine-body-dark size-7",
            darkMode && "fill-white",
          )}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.0631 9.6729C13.0631 16.7959 18.9116 22.5701 26.1261 22.5701C28.4752 22.5701 30.6794 21.958 32.584 20.8864C31.7984 29.0674 24.8206 35.4673 16.3288 35.4673C7.31066 35.4673 0 28.2494 0 19.3458C0 10.9618 6.48222 4.07255 14.7684 3.29696C13.6831 5.17745 13.0631 7.35369 13.0631 9.6729ZM3.26577 19.3458C3.26577 26.4688 9.1143 32.243 16.3288 32.243C21.171 32.243 25.4333 29.6294 27.689 25.7212C27.1723 25.7699 26.6509 25.7944 26.1261 25.7944C17.108 25.7944 9.7973 18.5765 9.7973 9.6729C9.7973 9.1548 9.82218 8.64004 9.87136 8.12996C5.91298 10.3569 3.26577 14.5651 3.26577 19.3458ZM26.3942 3.6935L27.759 4.03037V5.64252L26.3942 5.9794C25.2241 6.2682 24.3105 7.1702 24.0181 8.32541L23.6768 9.6729H22.0439L21.7026 8.32541C21.4102 7.1702 20.4966 6.2682 19.3265 5.9794L17.9617 5.64252V4.03037L19.3265 3.6935C20.4966 3.4047 21.4102 2.5027 21.7026 1.34748L22.0439 0H23.6768L24.0181 1.34748C24.3105 2.5027 25.2241 3.4047 26.3942 3.6935ZM34.5587 11.7542L35.9234 12.0911V13.7033L34.5587 14.0401C33.3885 14.3289 32.4749 15.2309 32.1825 16.3862L31.8412 17.7336H30.2083L29.8671 16.3862C29.5746 15.2309 28.661 14.3289 27.4909 14.0401L26.1261 13.7033V12.0911L27.4909 11.7542C28.661 11.4654 29.5746 10.5634 29.8671 9.40823L30.2083 8.06075H31.8412L32.1825 9.40823C32.4749 10.5634 33.3885 11.4654 34.5587 11.7542Z"
          />
        </svg>
      </button>
    </div>
    <button
      onclick={() => goto("/how-to-play")}
      class="dark:bg-dark hover:dark:brightness-120 dark:text-be-mine-body-dark grid size-16 place-items-center rounded-full border-2 border-gray-300 bg-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] hover:brightness-90 dark:border-gray-600"
    >
      <span class="text-be-mine-dark-gray dark:text-be-mine-body-dark text-5xl font-normal">?</span>
    </button>
  </div>

  <div class="bg-grid dark:bg-[#161d24]">
    {@render children?.()}
  </div>
</div>
