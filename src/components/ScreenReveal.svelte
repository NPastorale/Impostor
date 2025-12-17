<script lang="ts">
  import { game } from '../stores/game';
  import { fade, scale } from 'svelte/transition';

  const { players, currentPlayerIndex, state } = game;

  $: currentPlayer = $players[$currentPlayerIndex];
  $: nextPlayer = $players[$currentPlayerIndex + 1];

  let isRevealed = false;

  function hide() {
    isRevealed = false;
    if (navigator.vibrate) navigator.vibrate(20);
  }

  function reveal(e: Event) {
    if (e.type === 'keydown' && (e as KeyboardEvent).key !== ' ' && (e as KeyboardEvent).key !== 'Enter') return;
    e.preventDefault();
    if (!isRevealed) {
        isRevealed = true;
        if (navigator.vibrate) navigator.vibrate(50);
    }
  }

  function handleNext() {
    isRevealed = false;
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
      <h1 class="text-3xl font-bold text-white max-w-full truncate px-4">{currentPlayer.name}</h1>

      <div class="glass p-8 rounded-2xl min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden select-none">

        {#if isRevealed}
            <div in:scale={{duration: 200, start: 0.9}} class="text-center space-y-4 z-10">
                {#if currentPlayer.role === 'impostor'}
                    <h2 class="text-4xl font-black text-red-500">IMPOSTOR</h2>
                    <p class="text-slate-300">Mantené la cara. Asumí que todos los demás saben la palabra.</p>
                {:else}
                    <h2 class="text-4xl font-black text-emerald-400">{currentPlayer.word}</h2>
                    <p class="text-slate-300">Esta es la palabra secreta.</p>
                {/if}
            </div>
        {:else}
             <div class="absolute inset-0 bg-slate-800 flex items-center justify-center z-20 cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                  role="button"
                  tabindex="0"
                  onmousedown={reveal}
                  ontouchstart={reveal}
                  onkeydown={reveal}
             >
                <div class="text-center space-y-4">
                    <span class="text-6xl">👆</span>
                    <p class="font-bold text-xl text-slate-300">Mantené para ver</p>
                </div>
             </div>
        {/if}
      </div>

      <p class="text-slate-500 text-sm">
        Soltá para ocultar. Pasale al siguiente.
      </p>

      <button
        onclick={handleNext}
        class="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl text-lg transition-all"
      >
        {nextPlayer ? `Pasale a ${nextPlayer.name}` : 'Arrancar'}
      </button>
    </div>

</div>
