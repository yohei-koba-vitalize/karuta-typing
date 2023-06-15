<script>
  import { onDestroy, onMount } from "svelte";
  import Button from "../components/atoms/Button.svelte";
  import { addResult, getRank, setFeeling, deleteDocuments } from "../lib/api.js";
  import {
    gameStatus,
    name,
    playTimeText,
    result,
    subResult,
  } from "../lib/store.js";

  let userId = "";
  let rank = 0;
  let total = 0;
  let loading = true;
  let posted = false;
  let feeling = "";
  let drumRollSound;
  let congratulationSound1;
  let congratulationSound2;

  onMount(() => {
    playSound(drumRollSound);
    (async () => {
      if ($result > 0) {
        userId = await addResult($name, $result, $subResult);
      }
      let rankingInfo = await getRank(userId);
      rank = rankingInfo[0];
      total = rankingInfo[1];
      // 以下は、不要なresultsを削除する際に使用する。イベント直前に準備
      // deleteDocuments("event_results", "result", ">", -1);
    })();
    setTimeout(() => {
      loading = false;
      rank == 1
        ? playSound(congratulationSound1)
        : playSound(congratulationSound2);
      window.addEventListener("keydown", enterToPost);
    }, 1500);
  });

  onDestroy(() => {
    $name = "";
    $result = 0;
    $subResult = 0;
    $playTimeText = "";
  });

  function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
  }

  function enterToPost(event) {
    event.key == "Enter" && event.keyCode == 13 ? postFeeling() : "";
  }

  function postFeeling() {
    posted = true;
    setFeeling(userId, feeling);
    window.removeEventListener("keydown", enterToPost);
  }

  function goToRanking() {
    $gameStatus = "RANKING";
  }
  function goToStart() {
    $gameStatus = "START";
  }
</script>

<dev class="container">
  <div class="result-window result-name">
    {$name}さんの結果
  </div>
  <div class="result-window result-result">
    GETした札 … {$result}枚
  </div>
  <div class="result-window result-sub-result">
    お手つきした数 … {$subResult}回
  </div>

  {#if loading}
    <div class="fulfilling-square-spinner">
      <div class="spinner-inner" />
    </div>
  {/if}
  {#if !loading}
    <div class="result-window result-rank">
      {total}人中
      <span class="result-strong"> {rank}位 </span>!
    </div>
    {#if posted}
      <Button class="app-button" on:click={goToRanking}
        ><i class="fa-solid fa-ranking-star" />ランキングを見る</Button
      >
      <Button class="app-button" on:click={goToStart}
        ><i class="fa-solid fa-play" />スタート画面に戻る</Button
      >
    {:else}
      <div class="result-form">
        <input
          bind:value={feeling}
          class="app-form"
          placeholder="感想を一言お願いします！"
        />
      </div>
      <Button class="app-button" on:click={postFeeling}
        ><i class="fa-solid fa-paper-plane" />送信</Button
      >
    {/if}
  {/if}
</dev>

<audio src="/sounds/roll.mp3" bind:this={drumRollSound} preload="auto" />
<audio
  src="/sounds/congratulation1.mp3"
  bind:this={congratulationSound1}
  preload="auto"
/>
<audio
  src="/sounds/congratulation2.mp3"
  bind:this={congratulationSound2}
  preload="auto"
/>

<style>
  .result-window {
    font-size: 40px;
  }

  .result-name,
  .result-sub-result,
  .result-rank {
    margin-bottom: 25px;
  }

  .result-strong {
    font-size: 80px;
  }

  .fulfilling-square-spinner,
  .fulfilling-square-spinner * {
    box-sizing: border-box;
  }

  .fulfilling-square-spinner {
    top: 50px;
    left: calc(50% - 35px);
    height: 70px;
    width: 70px;
    position: relative;
    border: 4px solid black;
    animation: fulfilling-square-spinner-animation 3s infinite ease;
  }

  .fulfilling-square-spinner .spinner-inner {
    vertical-align: top;
    display: inline-block;
    background-color: black;
    width: 100%;
    opacity: 1;
    animation: fulfilling-square-spinner-inner-animation 3s infinite ease-in;
  }

  @keyframes fulfilling-square-spinner-animation {
    0% {
      transform: rotate(0deg);
    }

    25% {
      transform: rotate(180deg);
    }

    50% {
      transform: rotate(180deg);
    }

    75% {
      transform: rotate(360deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes fulfilling-square-spinner-inner-animation {
    0% {
      height: 0%;
    }

    25% {
      height: 0%;
    }

    50% {
      height: 100%;
    }

    75% {
      height: 100%;
    }

    100% {
      height: 0%;
    }
  }
</style>
