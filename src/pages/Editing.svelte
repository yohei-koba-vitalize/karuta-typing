<script lang="ts">
  import Button from "../components/atoms/Button.svelte";
  import { updateResult, deleteResult } from "../lib/api.js";
  import { editingData, gameStatus } from "../lib/store.ts";
  import { onMount } from "svelte";

  onMount(() => {
    console.log($editingData);
  });

  function sendEditedData() {
    // console.log(name, result, subResult);
    updateResult(
      $editingData.id,
      $editingData.name,
      $editingData.result,
      $editingData.sub_result
    );
    $gameStatus = "RANKING";
  }

  function deteteData() {
    deleteResult($editingData.id);
    $gameStatus = "RANKING";
  }

  function cancel() {
    $gameStatus = "RANKING";
  }
</script>

<div id="container">
  <div id="form">
    <input
      bind:value={$editingData.name}
      id="edit-name"
      placeholder="ニックネーム"
    />
    <input
      bind:value={$editingData.result}
      id="edit-result"
      placeholder="GETした札"
    />
    <input
      bind:value={$editingData.sub_result}
      id="edit-sub-result"
      placeholder="お手つきした数"
    />
  </div>

  <div id="btns">
    <Button on:click={sendEditedData}>完了</Button>
    <Button on:click={deteteData}>削除</Button>
    <Button on:click={cancel}>キャンセル</Button>
  </div>
</div>

<style>
  #btns {
    display: flex;
    justify-content: space-around;
    width: 100%;
    gap: 20px;
  }

  #form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #form input {
    display: block;
    width: 70%;
    height: 80px;
    font-size: 30px;
    padding: 10px 20px;
    margin: 20px;
  }
</style>
