<script lang="ts">
  import { game } from '../stores/game';
  import { fade, scale } from 'svelte/transition';

  const { players, currentPlayerIndex, state } = game;

  $: currentPlayer = $players[$currentPlayerIndex];
  $: nextPlayer = $players[$currentPlayerIndex + 1];

  let isRevealed = false;
  let hasRevealedOnce = false;

  function hide() {
    isRevealed = false;
    if (navigator.vibrate) navigator.vibrate(20);
  }

  function reveal(e: Event) {
    if (e.type === 'keydown' && (e as KeyboardEvent).key !== ' ' && (e as KeyboardEvent).key !== 'Enter') return;
    e.preventDefault();
    if (!isRevealed) {
        isRevealed = true;
        hasRevealedOnce = true;
        if (navigator.vibrate) navigator.vibrate(50);
    }
  }

  function handleNext() {
    isRevealed = false;
    hasRevealedOnce = false; // Reset for next player
    game.nextReveal();
  }

  // Auto-skip DEAL state: REVEAL -> NEXT -> DEAL -> (Auto) -> REVEAL
  $: if ($state === 'DEAL') {
    game.transition('READY');
  }
</script>

<svelte:window
  onmouseup={hide}
  ontouchend={hide}
  ontouchcancel={hide}
  onblur={hide}
/>

<div class="h-full flex flex-col items-center justify-center space-y-8" in:fade>

    <!-- Reveal UI -->
    <div class="text-center space-y-8 w-full max-w-sm">
      <h1 class="text-3xl font-bold text-nord-6 max-w-full truncate px-4">{currentPlayer.name}</h1>

      <div class="bg-nord-1 border border-nord-2 p-8 rounded-2xl min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden select-none shadow-xl">

        {#if isRevealed}
            <div in:scale={{duration: 200, start: 0.9}} class="text-center space-y-4 z-10">
                {#if currentPlayer.role === 'impostor'}
                    <h2 class="text-4xl font-black text-nord-11">IMPOSTOR</h2>
                    <p class="text-nord-4">Mantené la cara. Asumí que todos los demás saben la palabra.</p>
                {:else}
                    <h2 class="text-4xl font-black text-nord-14">{currentPlayer.word}</h2>
                    <p class="text-nord-4">Esta es la palabra secreta.</p>
                {/if}
            </div>
        {:else}
             <div class="absolute inset-0 bg-nord-1 flex items-center justify-center z-20 cursor-pointer focus:outline-none focus:ring-4 focus:ring-nord-10/50"
                  role="button"
                  tabindex="0"
                  onmousedown={reveal}
                  ontouchstart={reveal}
                  onkeydown={reveal}
             >
                <div class="text-center space-y-4">
                    <span class="text-6xl">👆</span>
                    <p class="font-bold text-xl text-nord-4">Mantené para ver</p>
                </div>
             </div>
        {/if}
      </div>

      <button
        onclick={handleNext}
        disabled={!hasRevealedOnce}
        class="w-full bg-nord-3 hover:bg-nord-2 text-nord-6 font-bold py-4 rounded-xl text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-nord-2"
      >
        {nextPlayer ? `Pasar a ${nextPlayer.name}` : 'Arrancar'}
      </button>
    </div>

</div>
