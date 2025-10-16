<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import BombSVG from "$lib/assets/bomb.svg";
  import BombAvatar from "$lib/assets/bomb-avatar.svg";
  import BoomAvatar from "$lib/assets/boom-avatar.svg";
  import CatAvatar from "$lib/assets/cat-avatar.svg";
  import GhostAvatar from "$lib/assets/ghost-avatar.svg";
  import RobotAvatar from "$lib/assets/robot-avatar.svg";
  import Button from "$lib/components/Button.svelte";
  import { goto } from "$app/navigation";

  import { setupState } from "$lib/state.svelte";

  const avatars = [BombAvatar, BoomAvatar, GhostAvatar, RobotAvatar, CatAvatar] as const;

  function selectAvatar(index: number) {
    setupState.avatar = index;
  }

  function canProceed() {
    return setupState.avatar !== undefined && setupState.name.trim().length > 0;
  }

  function handleCreate() {
    if (!canProceed()) return;

    goto("/create-game");
  }

  function handleJoin() {
    if (!canProceed()) return;

    goto("/join-game");
  }
</script>

<div class="relative z-10 mx-auto h-dvh max-w-4xl p-4">
  <div class="flex h-full flex-col items-center justify-center gap-2">
    <div class="flex flex-col items-start gap-0">
      <div class="animate-floating flex items-center gap-3">
        <div>
          <h1
            class="font-pixel bg-gradient-to-r from-[#202436] via-[#2e3552] to-[#6e7d97] bg-clip-text text-center text-8xl font-normal text-transparent"
          >
            BE MINE
          </h1>
          <p
            class="text-be-mine-dark-gray justify-start self-stretch text-center text-4xl font-normal"
          >
            Bomb Finding Adventure
          </p>
        </div>

        <img src={BombSVG} alt="bomb" class="h-[140px] w-[140px] pl-1" draggable="false" />
      </div>
    </div>

    <div class="mt-6 w-full rounded-3xl border border-black/10 bg-white p-8 shadow-md">
      <div class="grid gap-6">
        <div class="flex flex-col items-center gap-4">
          <div class="font-pixel text-be-mine-gray justify-start self-stretch text-3xl font-normal">
            Choose Your Avatar
            <div class="mt-[40px] flex flex-wrap items-center justify-center gap-[80px]">
              {#each avatars as avatar, i}
                <button
                  type="button"
                  class={twMerge(
                    "grid h-16 w-16 place-items-center rounded-xl border-2 bg-white p-2 shadow-sm transition",
                    setupState.avatar === i
                      ? "bg-be-mine-light-blue border-blue-500 ring-4 ring-blue-100"
                      : "border-black/10 hover:brightness-105",
                  )}
                  onclick={() => selectAvatar(i)}
                >
                  <img src={avatar} alt="avatar" class="h-10 w-10" draggable="false" />
                </button>
              {/each}
            </div>
          </div>
        </div>

        <div class="mt-4 grid gap-3">
          <div class="text-be-mine-gray justify-start self-stretch text-3xl font-normal">
            Your Nickname
          </div>
          <input
            placeholder="Enter your nickname..."
            bind:value={setupState.name}
            class="text-be-mine-light-gray w-full justify-start rounded-2xl border border-black/10 bg-white px-4 py-3 text-2xl font-normal shadow-inner outline-none"
          />
        </div>
      </div>
    </div>
    <div class="mt-8 grid w-full grid-cols-2 items-center gap-4">
      <Button disabled={!canProceed()} onclick={handleCreate}>Create Game</Button>
      <Button disabled={!canProceed()} onclick={handleJoin}>Join Game</Button>
    </div>
  </div>
</div>

<style>
  @keyframes fade-grid {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  .animate-fade-grid {
    animation: fade-grid 0.2s ease-in-out 1s forwards;
  }
</style>
