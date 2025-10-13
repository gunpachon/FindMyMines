<script lang="ts">
  import Button from "$lib/components/Button.svelte";

  let roomCode = $state("");

  function canProceed() {
    return roomCode.trim().length > 0;
  }

  function handleJoin() {
    if (!canProceed()) return;
    // todo: join game
  }
</script>

<div class="relative z-10 mx-auto h-dvh max-w-4xl p-6">
  <div class="flex h-full flex-col items-center justify-center gap-2">
    <div class="w-full rounded-3xl border border-black/10 bg-white shadow-md p-9">
      <div class="grid gap-6">
        <div class="flex flex-col gap-4 items-center">
          <div class="font-pixel self-stretch justify-start text-3xl font-normal text-be-mine-gray">
            Room Code
          </div>
        </div>
        <div class="grid gap-3 mt-3">
          <input
            placeholder="Enter Code..."
            bind:value={roomCode}
            class="justify-start text-be-mine-light-gray text-2xl font-normal w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none shadow-inner"
          />
        </div>
      </div>
    </div>
    <div class="w-[400px] mt-6 gap-4 items-center">
      <Button disabled={!canProceed()} onclick={handleJoin}>Join Game</Button>
    </div>
  </div>
</div>

