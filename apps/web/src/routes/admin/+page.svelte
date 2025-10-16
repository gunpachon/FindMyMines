<script lang="ts">
  import { browser } from "$app/environment";
  import { env } from "$env/dynamic/public";
  import Button from "$lib/components/Button.svelte";
  import { io } from "socket.io-client";

  let connectedClients = $state<number | undefined>();

  const socket = browser
    ? io(new URL("/admin", env.PUBLIC_BACKEND_HOST ?? "http://localhost:3000").toString())
    : null;

  if (browser) {
    socket?.on("clients", (clients) => {
      connectedClients = clients;
    });
  }
</script>

<div class="flex min-h-dvh flex-col items-center justify-center">
  <div
    class="min-w-md border-light-gray flex flex-col items-center rounded-2xl border bg-white p-8"
  >
    <h1 class="mb-6 text-2xl">Admin view</h1>
    <p class="text-6xl">{connectedClients ?? "…"}</p>
    <p class="text-xl">Connected clients</p>
    <Button
      class="mt-4 w-fit px-5 py-3 text-xl"
      onclick={() => {
        socket?.emit("reset");
      }}>Reset</Button
    >
  </div>
</div>
