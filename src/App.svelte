<script>
  import { onMount } from "svelte";
	import Header from "./components/atoms/Header.svelte";
	import { isLogin, name, gameStatus } from "./lib/store.js";
	import Game from "./pages/Game.svelte";
	import Ranking from "./pages/Ranking.svelte";
	import Result from "./pages/Result.svelte";
	import Start from "./pages/Start.svelte";
	import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

	let keyStrokeSound;
	let getCardSound;
	let failSound;
	let whistleSound;

	function playSound(sound) {
		sound.currentTime = 0;
		sound.play();
	}

	onMount(() => {
		if (!$isLogin) {
			const provider = new GoogleAuthProvider();
			const auth = getAuth()
			signInWithPopup(auth, provider).then((result) => {
				$isLogin = true;
				$name = result?.user?.displayName
			}).catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				const email = error.email;
				const credential = error.credential;
				console.log(error+" ", errorCode+" ", errorMessage+" ", email+" ", credential);
			});
		}
	})
</script>

<!-- 画面描画 -->
<Header />

<main on:keydown={playSound(keyStrokeSound)}>
	{#if !$isLogin}
		<img class="google-logo" src={"/logos/google-logo.gif"} alt="please login" />
	{:else if $gameStatus === "START"}
		<Start on:playCardSound={playSound(getCardSound)} />
	{:else if $gameStatus === "PLAYING"}
		<Game
			on:playKeyStrokeSound={playSound(keyStrokeSound)}
			on:playGetCardSound={playSound(getCardSound)}
			on:playFailSound={playSound(failSound)}
			on:playWhistleSound={playSound(whistleSound)}
		/>
	{:else if $gameStatus === "RESULT"}
		<Result />
	{:else if $gameStatus === "RANKING"}
		<Ranking />
	{/if}
	<a href="https://www.instagram.com/legrobeats_yohei_vitalize/">
		<img class="qr-code" src={"/yohei_vitalize.png"} alt="instagram_yohei" />
	</a>
</main>

<audio src="/sounds/keyStroke.mp3" bind:this={keyStrokeSound} preload="auto" />
<audio src="/sounds/getCard.mp3" bind:this={getCardSound} preload="auto" />
<audio src="/sounds/failed.mp3" bind:this={failSound} preload="auto" />
<audio src="/sounds/whistle.mp3" bind:this={whistleSound} preload="auto" />

<!-- CSS -->
<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
			height: calc(100% - 2rem - 90px);
		}
	}

	.google-logo {
		width: 250px;
		margin-top: 27vh;
	}
</style>
