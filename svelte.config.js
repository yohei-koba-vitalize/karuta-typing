import sveltePreprocess from 'svelte-preprocess';

export default {
  preprocess: sveltePreprocess({
    // JSDocコメントを保持するように設定
    preserve: ['ld+json'],
  })
};
