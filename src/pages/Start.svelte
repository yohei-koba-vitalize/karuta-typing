<script>
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import Button from "../components/atoms/Button.svelte";
  import { gameStatus, name } from "../lib/store.js";
  const dispatch = createEventDispatcher();

  onMount(() => {
    if ($name == "") {
      $name = null;
    }
    window.addEventListener("keydown", enterToStart);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", enterToStart);
  })

  function startGame() {
    dispatch("playCardSound");
    $gameStatus = "PLAYING";
  }

  function enterToStart(event) {
    if ($name) {
      event.key == "Enter" && event.keyCode == 13 ? startGame() : "";
    }
  }
</script>

<div class="app-start">
  <input
    bind:value={$name}
    class="app-form"
    placeholder="ニックネームを入力して、スタート！"
  />
</div>
{#if !$name}
  <Button class="app-button disabled"
    ><i class="fa-solid fa-play" />スタート！</Button
  >
{:else}
  <Button class="app-button" on:click={startGame}
    ><i class="fa-solid fa-play" />スタート！</Button
  >
{/if}

<style>
  div {
    align-items: center;
  }
  .app-start {
    margin-top: 20%;
  }
</style>
