<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import { socketContext } from "$lib/context";
  import { setupState } from "$lib/state.svelte";

  let roomCode = $state("");

  function canProceed() {
    return roomCode.trim().length > 0;
  }

  const socket = socketContext.getOr(null);

  function handleJoin() {
    if (!canProceed()) return;

    const avatarValue = setupState.avatar !== undefined ? String(setupState.avatar) : "0";

    socket?.emit("join", setupState.name, roomCode, avatarValue);
  }
</script>

<div class="relative z-10 mx-auto h-dvh max-w-4xl p-6">
  <div class="flex h-full flex-col items-center justify-center gap-2">
    <div class="w-full rounded-3xl border border-black/10 bg-white p-9 shadow-md">
      <div class="grid gap-6">
        <div class="flex flex-col items-center gap-4">
          <div class="justify-start self-stretch font-pixel text-3xl font-normal text-be-mine-gray">
            Room Code
          </div>
        </div>
        <div class="mt-3 grid gap-3">
          <input
            placeholder="Enter Code..."
            bind:value={roomCode}
            class="w-full justify-start rounded-2xl border border-black/10 bg-white px-4 py-3 text-2xl font-normal text-be-mine-light-gray shadow-inner outline-none"
          />
        </div>
      </div>
    </div>
    <div class="mt-6 w-[400px] items-center gap-4">
      <Button disabled={!canProceed()} onclick={handleJoin}>Join Game</Button>
    </div>
  </div>
</div>
