<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import BombSVG from "$lib/assets/bomb.svg";
  import BombAvatar from "$lib/assets/bomb-avatar.svg";
  import BoomAvatar from "$lib/assets/boom-avatar.svg";
  import CatAvatar from "$lib/assets/cat-avatar.svg";
  import GhostAvatar from "$lib/assets/ghost-avatar.svg";
  import RobotAvatar from "$lib/assets/robot-avatar.svg";
  import Button from "$lib/components/Button.svelte";
  import { onMount } from "svelte";

  const avatars = [BombAvatar, BoomAvatar, GhostAvatar, RobotAvatar, CatAvatar] as const;
  let selectedAvatarIdx = $state<number | null>(null);
  let nickname = $state("");

  let showIntro = $state(true);
  onMount(() => {
    const t = setTimeout(() => {
      showIntro = false;
    }, 1200);
    return () => clearTimeout(t);
  });

  function selectAvatar(index: number) {
    selectedAvatarIdx = index;
  }

  function canProceed() {
    return selectedAvatarIdx !== null && nickname.trim().length > 0;
  }

  function handleCreate() {
    if (!canProceed()) return;
    // todo: create game
  }

  function handleJoin() {
    if (!canProceed()) return;
    // todo: join game
  }
</script>

{#if showIntro}
  <div class="fixed inset-0 z-0 animate-fade-grid bg-grid"></div>
{/if}

<div class="relative z-10 mx-auto h-dvh max-w-4xl p-4">
  <div class="flex h-full flex-col items-center justify-center gap-2">
    <div class="flex flex-col items-start gap-0">
      <div class="flex items-center gap-3 animate-floating">
        <div>
          <h1
            class="font-pixel text-center text-8xl font-normal bg-gradient-to-r from-[#202436] via-[#2e3552] to-[#6e7d97] bg-clip-text text-transparent"
          >
            BE MINE
          </h1>
          <p
            class="self-stretch text-center justify-start text-be-mine-dark-gray text-4xl font-normal"
          >
            Bomb Finding Adventure
          </p>
        </div>

        <img src={BombSVG} alt="bomb" class="h-[140px] w-[140px] pl-1" draggable="false" />
      </div>
    </div>

    <div class="w-full rounded-3xl border border-black/10 bg-white mt-6 shadow-md p-8">
      <div class="grid gap-6">
        <div class="flex flex-col gap-4 items-center">
          <div class="font-pixel self-stretch justify-start text-3xl font-normal text-be-mine-gray">
            Choose Your Avatar
            <div class="flex flex-wrap items-center justify-center gap-[80px] mt-[40px]">
              {#each avatars as avatar, i}
                <button
                  type="button"
                  class={twMerge(
                    "grid h-16 w-16 place-items-center rounded-xl border-2 bg-white p-2 shadow-sm transition",
                    selectedAvatarIdx === i
                      ? "border-blue-500 ring-4 ring-blue-100"
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

        <div class="grid gap-3 mt-4">
          <div class="self-stretch justify-start text-3xl font-normal text-be-mine-gray">
            Your Nickname
          </div>
          <input
            placeholder="Enter your nickname..."
            bind:value={nickname}
            class="justify-start text-be-mine-light-gray text-2xl font-normal w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none shadow-inner"
          />
        </div>
      </div>
    </div>
    <div class="w-full mt-8 grid grid-cols-2 gap-4 items-center">
      <Button disabled={!canProceed()} onclick={handleCreate}>Create Game</Button>
      <Button disabled={!canProceed()} onclick={handleCreate}>Join Game</Button>
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
