<script lang="ts">
  import { io, Socket } from "socket.io-client";
  import { onMount } from "svelte";

  let text = $state("");

  let connections: number | undefined = $state();

  let socket: Socket | undefined = undefined;

  onMount(() => {
    socket = io(":3000");

    socket.on("connect", () => {
      text += "Connected\n";
    });

    socket.on("activeConnections", (count) => {
      connections = count;
    });

    socket.on("message", (name, message) => {
      text += `${name}: ${message}\n`;
    });
  });

  let message = $state();
  let name = $state("abcd");

  function sendMessage() {
    if (!socket) return;
    socket.emit("message", name, message);
    message = "";
  }
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<p>Active connections: {connections}</p>
<p>
  Your name:
  <input
    type="text"
    class="rounded border border-neutral-400 bg-neutral-100 px-3 py-1"
    bind:value={name}
  />
</p>

<div class="m-4">
  <pre>{text}</pre>
  <form class="contents">
    <span>Send a message:</span>
    <input
      type="text"
      class="rounded border border-neutral-400 bg-neutral-100 px-3 py-1"
      onkeydown={({ key }) => {
        if (key === "Enter") {
          sendMessage();
        }
      }}
      bind:value={message}
    />
  </form>
</div>
