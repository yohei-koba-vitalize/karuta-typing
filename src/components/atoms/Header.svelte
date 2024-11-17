<script>
  import { gameStatus, playTimeText, result } from "../../lib/store.ts";

  function toRanking() {
    $gameStatus = "RANKING";
  }

  function toTop() {
    $gameStatus = "START";
  }
</script>

<header class="site-header">
  <div class="wrapper site-header__wrapper">
    <div class="site-header__start">
      <a
        href="https://www.kingofjmk.jp/%E4%B8%8A%E6%AF%9B%E3%81%8B%E3%82%8B%E3%81%9F%E5%85%A8%E6%9C%AD%E4%B8%80%E8%A6%A7/"
        class="brand"
      >
        <img class="app-icon" src={"/logos/karuta.png"} alt="jomokaruta" />
        <p class="app-title"> DE タイピング！</p>
      </a>
    </div>
    <div class="site-header__middle">
      <nav class="nav">
        <ul class="nav__wrapper">
          {#if $gameStatus == "PLAYING"}
            <li>
              {$result}枚 GET!
            </li>
          {:else}
            <a href="https://www.vitalize.co.jp">
              <img class="app-vitalize-icon" src={"/logos/vitalize_logo.png"} alt="vitalize" />
            </a>
          {/if}
        </ul>
      </nav>
    </div>
    {#if $gameStatus == "PLAYING"}
      <div class="site-header__end math-font">
        <i class="fa-solid fa-clock" />
        {$playTimeText}
      </div>
    {:else if $gameStatus == "RANKING" || $gameStatus == "RESULT"}
      <div class="site-header__end">
        <button on:click={toTop}
        ><i class="fa-solid fa-house" />スタート画面
        </button>
      </div>
    {:else if $gameStatus == "START"}
      <div class="site-header__end">
        <button on:click={toRanking}
        ><i class="fa-solid fa-ranking-star" />ランキングを見る
        </button>
      </div>
    {:else}
      <div class="site-header__end">
        <a href="https://www.igoo.info/events/event/1726/">
          <img class="sowfest" src={"/logos/sowfest.png"} alt="sowfest" />
        </a>
      </div>
    {/if}
  </div>
</header>

<style>
  /*
** The Header Media Queries **
** Tweak as per your needs **
*/
  .brand {
    font-weight: bold;
    display: flex;
    justify-content: center;
  }

  .site-header {
    position: relative;
  }

  .math-font {
    font-family: "Courier New", Courier, monospace;
  }

  .site-header__wrapper {
    font-weight: bold;
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    height: 90px;
  }

  @media (min-width: 660px) {
    .site-header__wrapper {
      padding-top: 0;
      padding-bottom: 0;
    }
    .site-header__wrapper > * {
      flex: 1;
    }
  }
  @media (min-width: 660px) {
    .site-header__start {
      text-align: center;
    }
  }

  @media (min-width: 660px) {
    .site-header__middle {
      order: -1;
    }
  }

  @media (min-width: 660px) {
    .site-header__end {
      display: flex;
      justify-content: flex-end;
      /* Better for LTR/RTL support */
    }
  }

  @media (max-width: 659px) {
    .site-header__end {
      padding-right: 4rem;
    }
  }

  @media (min-width: 660px) {
    .nav__wrapper {
      display: flex;
    }
  }

  @media (max-width: 659px) {
    .nav__wrapper {
      position: absolute;
      top: 100%;
      right: 0;
      left: 0;
      z-index: -1;
      background-color: #d9f0f7;
      visibility: hidden;
      opacity: 0;
      transform: translateY(-100%);
      transition: transform 0.3s ease-out, opacity 0.3s ease-out;
    }
  }

  img.app-icon {
    height: 80px;
  }
  img.app-vitalize-icon {
    width: 140px;
  }
  .app-title {
    margin-top: 27px;
  }


  .sowfest {
    height: 50px;
  }
</style>
