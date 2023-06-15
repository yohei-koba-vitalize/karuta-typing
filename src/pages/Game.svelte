<script>
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  import Button from "../components/atoms/Button.svelte";
  import { CHAR_TABLE } from "../constants/TypingData.js";
  import { getCards } from "../lib/api.js";
  import { gameStatus, playTimeText, result, subResult } from "../lib/store.js";
  const dispatch = createEventDispatcher();

  // 変数定義
  let cardList = [];
  let randomCardList = [];
  let listIndex = 0;
  let currentQuestion = {};
  let currentQuestionIndex = 0;
  let currentQuestionRome = "";
  let inputChar = "";
  let userInput = "";
  let startTime = 0;
  let limitTime = 0;
  let timerId = null;
  let isClear = false;
  let currentPicturePath = "";
  let cancelN = false;
  let viewIndex = 0;
  let viewIndexKana = 0;
  let scopeArray = [];
  let margin = 0;
  let offset = 0;

  // 最初の描画時に設問をセットする
  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    runTimer();
    setFirstQuestion();

    setTimeout(() => {
      // 問題を表示する
      const containerElement = document.getElementById("question");
      containerElement.style.visibility = "visible";
    }, 400);
  });

  // 描画終了時に解放
  onDestroy(() => {
    window.removeEventListener("keydown", handleKeydown);
    if (timerId) clearTimeout(timerId);
  });

  function toResult() {
    $gameStatus = "RESULT";
  }

  function toStart() {
    window.removeEventListener("keydown", handleKeydown);
    if (timerId) clearTimeout(timerId);
    $gameStatus = "START";
    $result = 0;
    $subResult = 0;
    $playTimeText = "";
  }

  /**
   * タイマー起動
   */
  function runTimer() {
    let _start = new Date();
    startTime = _start.getTime();
    limitTime = _start.setMinutes(_start.getMinutes() + 2);
    timerHandler();
    setTimeout(() => {
      isClear = true;
      clearTimeout(timerId);
      $playTimeText = "";
    }, 120000); // 制限時間：120秒
  }

  function timerHandler() {
    let _now = new Date().getTime();
    let _diff = new Date(limitTime - _now);
    let ms = ~~((_diff.getMilliseconds() / 1000) * 100) + "";
    let sec = _diff.getSeconds() + "";
    let min = _diff.getMinutes() + "";
    if (min == "0" && sec == "0") {
      playSound("playWhistleSound");
    }

    // 表示する時間を生成
    $playTimeText = `${("00" + min).slice(-2)}'${("00" + sec).slice(-2)}"${(
      "00" + ms
    ).slice(-2)}`;

    // 制限時間後に結果画面に遷移
    timerId = setTimeout(timerHandler, 10);
  }

  function handleKeydown(e) {
    playSound("playKeyStrokeSound");
    e.preventDefault();
    // 1. 入力された文字が正しいかの判定
    let _judged = jadgeInputChar(e.key);

    // 2. 設問の全ての文字を入力したら、次の設問をセットする
    if (_judged === 0) {
      success();
    }
  }

  /**
   * 入力された文字の判定
   */
  function jadgeInputChar(chr) {
    offset = 0;
    showGuide();
    if (cancelN) {
      cancelN = false;
      if (chr == "n") {
        inputChar += chr.toUpperCase();
        return;
      }
    }
    userInput += chr.toUpperCase();
    let margin = 1;
    // ゲーム中の未入力を判定
    if (isClear) {
      return;
    }
    let yomi = currentQuestion.yomi;
    let hiragana = yomi[currentQuestionIndex];
    if (yomi[currentQuestionIndex] == "っ" || checkSmallHira(yomi, currentQuestionIndex, margin)) {
      hiragana += yomi[currentQuestionIndex + margin];
      margin++;
      if (yomi[currentQuestionIndex] == "っ" && checkSmallHira(yomi, currentQuestionIndex, margin)) {
        hiragana += yomi[currentQuestionIndex + margin];
        margin++;
      }
    } else if (yomi[currentQuestionIndex] == "ん" && !checkAfterN(yomi, currentQuestionIndex)) {
      hiragana = "ン";
      cancelN = true;
    }
    let neededChars = CHAR_TABLE[hiragana];
    let isCorrect = neededChars.some(function (value) {
      if (value === userInput) {
        viewIndexKana += hiragana.length;
        return true;
      }

    });
    if (isCorrect) {
      offset = 1;
      showGuide();
      viewIndex ++;
      inputChar += userInput;
      currentQuestionIndex += margin;
      userInput = "";
      if (currentQuestionIndex >= currentQuestion.yomi.length) {
        offset = 0;
        return 0;
      }
    } else {
      let isMatch = neededChars.some((value) => value.startsWith(userInput));
      if (!isMatch) {
        playSound("playFailSound");
        $subResult++;
        userInput = "";
        return false;
      }
    }
    return;
  }

  /**
   * 現在の問題に正解したら発火する
   */
  function success() {
    playSound("playGetCardSound");
    // クリア数をカウント
    $result++;
    viewIndex = 0;
    viewIndexKana = 0;

    // 次の設問に移動するための変数をカウント
    listIndex++;

    // 入力文字をクリア
    inputChar = "";
    currentQuestionIndex = 0;

    // 次の設問をセット
    setQuestion();
  }

  /**
   * 問題をランダムで設定
   */
  const setFirstQuestion = async () => {
    // fireBaseから要素を取得し配列に格納
    const r = await getCards();
    r.forEach((doc) => {
      cardList.push(doc.data());
    });

    // cardListの順番をランダムにする
    randomCardList = shuffleList(cardList)

    // 設問と画像をセットする
    setQuestion()
  };

  // cardListの順番をランダムにする
  function shuffleList(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function setQuestion() {
    currentQuestionRome = "";
    // 配列から順番に設問をセットする
    currentQuestion = randomCardList[listIndex];
    currentPicturePath = "/cards/" + currentQuestion.picture_card;
    scopeArray = [];
    let makeHiragana;
    margin = 1;
    Array.from(currentQuestion.yomi).forEach((makeChar, i) => {
      if (margin == 2) {
        margin = 1;
        return
      }
      makeHiragana = makeChar;
      if (makeChar == "っ" || checkSmallHira(currentQuestion.yomi, i, margin)) {
        makeHiragana += currentQuestion.yomi[i+margin];
        margin++;
        if (makeChar == "っ" && checkSmallHira(currentQuestion.yomi, i, margin)) {
          makeHiragana += currentQuestion.yomi[i+margin];
          margin++;
        }
      } else if (makeChar == "ん" && !checkAfterN(currentQuestion.yomi, i)) {
        makeHiragana = "ン";
      }
      scopeArray.push(CHAR_TABLE[makeHiragana][0]);
    })
    showGuide()
    //画像を表示
    const imgElement = document.getElementById("img");
    imgElement.src = currentPicturePath;
  }

  function showGuide() {
    currentQuestionRome = scopeArray.slice(viewIndex+offset, scopeArray.length).join("");
  }

  function playSound(sound) {
    dispatch(sound);
  }

  function checkSmallHira(yomi, i, margin) {
    let index = i + margin;
    let checkYomi = yomi[index];
    return (
      checkYomi == "ぁ" ||
      checkYomi == "ぃ" ||
      checkYomi == "ぅ" ||
      checkYomi == "ぇ" ||
      checkYomi == "ぉ" ||
      checkYomi == "ゃ" ||
      checkYomi == "ゅ" ||
      checkYomi == "ょ"
    );
  }

  function checkAfterN(yomi, i) {
    let index = i + 1;
    let checkYomi = yomi[index];
    return (
      checkYomi == "あ" ||
      checkYomi == "い" ||
      checkYomi == "う" ||
      checkYomi == "え" ||
      checkYomi == "お" ||
      checkYomi == "な" ||
      checkYomi == "に" ||
      checkYomi == "ぬ" ||
      checkYomi == "ね" ||
      checkYomi == "の" ||
      checkYomi == "にゃ" ||
      checkYomi == "にゅ" ||
      checkYomi == "にょ" ||
      checkYomi == undefined
    );
  }
</script>

<div class="container">
  <!-- お題をセット後表示 -->
  {#if isClear}
    <Button class="app-button" on:click={toStart}
      ><i class="fa-solid fa-repeat" />リトライ</Button
    >
    <Button class="app-button" on:click={toResult}
      ><i class="fa-solid fa-square-poll-vertical" />結果を見る</Button
    >
  {:else}
    <div id="question" style="visibility:hidden">
      <div class="img-container game-karta">
        <div class="img-container omote"><img id="img" alt="画像" height="500px" /></div>
        <div class="img-container ura">{currentQuestion.comment}</div>
      </div>
      <div class="text-container">
        <div class="text">
          <h1>{currentQuestion.text}</h1>
          {#if currentQuestion.yomi}
            <h2>
              <span style="color:red">{currentQuestion.yomi.substring(0,viewIndexKana)}</span>{currentQuestion.yomi.substring(viewIndexKana)}
            </h2>
          {/if}
          <h2>
            <span style="color:red">{inputChar}{userInput}</span>{currentQuestionRome.substring(userInput.length)}
          </h2>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #question {
    display: flex;
    height: 100%;
    align-items: center;
  }

  #question .img-container {
    width: 40vw;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #question .text-container {
    width: 60vw;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #question .img-container #img {
    width: 60%;
    height: auto;
  }

  #question .text-container .text h1 {
    font-size: 3.5rem;
    margin-bottom: 0;
  }



.game-karta div{
  position: absolute;
  top: 0;
  left: 0;
  transition: .7s;
  backface-visibility: hidden;
}

.game-karta img{
  width: 100%;
}

.game-karta .ura{
  padding: 40px;
  white-space: pre-line;
  box-sizing: border-box;
  text-align: left;
  transform: rotateY(-180deg);
}

.game-karta:hover .omote{
  transform: rotateY(180deg);
}

.game-karta:hover .ura{
  transform: rotateY(0);
}
</style>
