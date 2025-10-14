<script lang="ts">
  let roomCode = $state("12345");
  let mode = $state("Zen");
</script>

<div class="relative z-10 mx-auto h-dvh max-w-5xl p-6">
  <div class="flex h-full flex-col items-center justify-center">
    <div class="w-full max-w-3xl rounded-3xl border border-black/10 bg-white shadow-md p-9">
      <div class="flex flex-col items-center gap-6 text-center">
        <div class="space-y-4">
          <p class="text-3xl font-normal text-be-mine-gray">Room Code: {roomCode}</p>
          <p class="text-3xl font-normal text-be-mine-gray">Mode: {mode}</p>
        </div>
        
        <div class="flex gap-8 my-4">
          <div class="w-9 h-9 rounded-full animate-dot-1"></div>
          <div class="w-9 h-9 rounded-full animate-dot-2"></div>
          <div class="w-9 h-9 rounded-full animate-dot-3"></div>
        </div>
        
        <p class="text-3xl font-normal text-be-mine-gray">Waiting for Other Players...</p>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes dotAnimation {
    0%, 100% { 
      background-color: var(--be-mine-dot, #D1D5DB);
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

