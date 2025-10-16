<script lang="ts">
  import { browser } from "$app/environment";
  import Button from "$lib/components/Button.svelte";
  import { io } from "socket.io-client";

  let connectedClients = $state<number | undefined>();

  if (browser) {
    const socket = io("https://bemine-backend.ideal.sh/admin");

    socket.on("clients", (clients) => {
      connectedClients = clients;
    });
  }
</script>

<div class="flex min-h-dvh flex-col items-center justify-center">
  <div
    class="min-w-md border-light-gray flex flex-col items-center rounded-2xl border bg-white p-8"
  >
    <h1 class="mb-6 text-2xl">Admin view</h1>
    <p class="text-6xl">{connectedClients}</p>
    <p class="text-xl">Connected clients</p>
    <Button class="mt-4 w-fit px-5 py-3 text-xl">Reset</Button>
  </div>
</div>
