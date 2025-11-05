<script lang="ts">
  import { gameState } from "$lib/state.svelte";

  let roomCode = $derived(gameState.state?.code);
  let mode = $state(gameState.state?.mode);
</script>

<div class="relative z-10 mx-auto h-dvh max-w-5xl p-6">
  <div class="flex h-full flex-col items-center justify-center">
    <div class="w-full max-w-3xl rounded-3xl border border-black/10 bg-white p-9 shadow-md">
      <div class="flex flex-col items-center gap-6 text-center">
        <div class="space-y-4">
          <p class="text-3xl font-normal text-be-mine-gray">Room Code: {roomCode}</p>
          <p class="text-3xl font-normal text-be-mine-gray">Mode: {mode}</p>
        </div>

        <div class="my-4 flex gap-8">
          <div class="animate-dot-1 h-9 w-9 rounded-full"></div>
          <div class="animate-dot-2 h-9 w-9 rounded-full"></div>
          <div class="animate-dot-3 h-9 w-9 rounded-full"></div>
        </div>

        <p class="text-3xl font-normal text-be-mine-gray">Waiting for Other Players...</p>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes dotAnimation {
    0%,
    100% {
      background-color: var(--be-mine-dot, #d1d5db);
    }
    50% {
      background-color: var(--be-mine-dark-gray, #374151);
    }
  }

  .animate-dot-1 {
    animation: dotAnimation 1.5s infinite;
    animation-delay: 0s;
  }

  .animate-dot-2 {
    animation: dotAnimation 1.5s infinite;
    animation-delay: 0.5s;
  }

  .animate-dot-3 {
    animation: dotAnimation 1.5s infinite;
    animation-delay: 1s;
  }
</style>
