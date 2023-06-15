<script>
  import { collection, onSnapshot } from "firebase/firestore";
  import { onDestroy, onMount } from "svelte";
  import { mainConfig } from "../constants/config.const.js";
  import { getResults } from "../lib/api";
  import { db } from "../lib/firebase";

  const pageSize = mainConfig.rankingPageSize;
  const root = document.documentElement;
  root.style.setProperty("--tr-height", pageSize);
  let ranking = [];
  let currentPageData = [];
  let currentPage = 1;
  let totalData = 0;
  let unsubscribe;

  onMount(async () => {
    unsubscribe = await getRealtimeResults();
  });

  onDestroy(() => {
    // ランキング監視のデタッチ
    unsubscribe();
  });

  function paginateData(page) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPageData = ranking.slice(startIndex, endIndex);
    return currentPageData;
  }

  function nextPage() {
    if (currentPage < Math.ceil(totalData / pageSize)) {
      currentPage++;
      currentPageData = paginateData(currentPage);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      currentPageData = paginateData(currentPage);
    }
  }

  const getRealtimeResults = async () => {
    const unsubscribe = onSnapshot(
      collection(db, "event_results"),
      async () => {
        const realtimeResults = await getResults();
        // 配列の変更を検知できるように入れ直す
        ranking = realtimeResults;
        totalData = ranking.length;
        currentPageData = paginateData(currentPage);
      },
      (error) => {
        console.log(error);
      }
    );
    return unsubscribe;
  };
</script>

<dev class="container">
  <table class="ranking-table">
    <thead>
      <tr>
        <th><i class="fa-solid fa-crown" />順位</th>
        <th><i class="fa-solid fa-user" />ニックネーム</th>
        <th><i class="fa-solid fa-check" />札の数</th>
        <th><i class="fa-solid fa-xmark" />お手つき</th>
      </tr>
    </thead>
    <tbody>
      {#each currentPageData as data, index}
        <tr>
          <td class="ranking-crown-col">{(currentPage - 1) * pageSize + index + 1} <span class="ranking-small"> 位</span></td>
          <td class="ranking-name-col">{data.name} <span class="ranking-small"> さん</span></td>
          <td class="ranking-result-col">{data.result} <span class="ranking-small"> 枚</span></td>
          <td class="ranking-sub-result-col">{data.sub_result} <span class="ranking-small"> 回</span></td>
        </tr>
      {/each}
      {#each Array.from({ length: pageSize - currentPageData.length }) as _}
        <tr>
          <td />
          <td />
          <td />
          <td />
        </tr>
      {/each}
    </tbody>
  </table>
  <div>
    <button on:click={prevPage}><i class="bi bi-caret-left-fill" /></button>
    <button on:click={nextPage}><i class="bi bi-caret-right-fill" /></button>
  </div>
</dev>

<style>
  .ranking-table {
    margin: 0 auto;
    border-collapse: collapse;
    /* 枠線を非表示にするために必要 */
    width: 80%;
    height: 80vh;
    font-size: 24px;
  }

  .ranking-table th,
  .ranking-table td {
    border: none;
    /* セルの枠線を非表示にする */
    padding: 8px;
    /* セル内の余白を指定 */
    text-align: center;
    /* セル内のテキストを中央寄せ */
    table-layout: fixed;
  }

  .ranking-table th {
    background-color: #f2f2f2;
    /* ヘッダー行の背景色を指定 */
  }

  .ranking-table tr {
    height: calc(100% / var(--tr-height));
  }

  .ranking-table td:first-child {
    font-weight: bold;
    /* 順位セルのテキストを太字にする */
  }

  .ranking-small {
    font-size: smaller;
  }

  .ranking-crown-col {
    width: 11%;
  }

  .ranking-result-col, .ranking-sub-result-col {
    width: 17%
  }
  .ranking-name-col {
    width: 55%;
  }
</style>
