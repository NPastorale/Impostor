<script lang="ts">
  import { game } from '../stores/game';
  import { fade, scale } from 'svelte/transition';
  import { onMount } from 'svelte';

  const { players, currentPlayerIndex, state } = game;

  $: currentPlayer = $players[$currentPlayerIndex];

  let isRevealed = false;
  let resetTimer: ReturnType<typeof setTimeout>;

  // Safety: If touch ends or mouse leaves, hide immediately
  function hide() {
    isRevealed = false;
    clearTimeout(resetTimer);
    if (navigator.vibrate) navigator.vibrate(20);
  }

  function reveal(e: Event) {
    if (e.type === 'keydown' && (e as KeyboardEvent).key !== ' ' && (e as KeyboardEvent).key !== 'Enter') return;
    e.preventDefault(); // Prevent context menu
    if (!isRevealed) {
        isRevealed = true;
        if (navigator.vibrate) navigator.vibrate(50);
    }
  }

  function handleNext() {
    if (isRevealed) {
        hide(); // Ensure hidden before switch
        game.nextReveal();
    }
  }

  // Confirm readiness (I am [Name])
  function confirmIdentity() {
    game.transition('READY'); // DEAL -> REVEAL
  }
</script>

<div class="h-full flex flex-col items-center justify-center space-y-8" in:fade>

  {#if $state === 'DEAL'}
    <!-- Pass the Device State -->
    <div class="text-center space-y-6">
      <div class="space-y-2">
        <h2 class="text-2xl text-slate-400">Pass the device to</h2>
        <h1 class="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {currentPlayer.name}
        </h1>
      </div>

      <div class="p-8">
        <div class="w-24 h-24 bg-white/5 rounded-full mx-auto animate-pulse flex items-center justify-center text-4xl">
            📱
        </div>
      </div>

      <button
        onclick={confirmIdentity}
        class="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all"
      >
        I am {currentPlayer.name}
      </button>
    </div>

  {:else}
    <!-- Reveal State -->
    <div class="text-center space-y-8 w-full max-w-sm">
      <div class="glass p-8 rounded-2xl min-h-[300px] flex flex-col items-center justify-center relative overflow-hidden select-none">

        {#if isRevealed}
            <div in:scale={{duration: 200, start: 0.9}} class="text-center space-y-4 z-10">
                <p class="text-sm text-slate-400 uppercase tracking-widest">Your Role</p>
                {#if currentPlayer.role === 'impostor'}
                    <h2 class="text-4xl font-black text-red-500">IMPOSTOR</h2>
                    <p class="text-slate-300">Blend in. You assume everyone else knows the secret word.</p>
                {:else}
                    <h2 class="text-4xl font-black text-emerald-400">{currentPlayer.word}</h2>
                    <p class="text-slate-300">This is the secret word.</p>
                {/if}
            </div>
            <!-- Covering overlay when NOT revealed -->
        {:else}
             <div class="absolute inset-0 bg-slate-800 flex items-center justify-center z-20 cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                  role="button"
                  tabindex="0"
                  onmousedown={reveal}
                  ontouchstart={reveal}
                  onkeydown={reveal}
                  onmouseup={hide}
                  onmouseleave={hide}
                  ontouchend={hide}
                  ontouchcancel={hide}
                  onkeyup={hide}
             >
                <div class="text-center space-y-4">
                    <span class="text-6xl">👆</span>
                    <p class="font-bold text-xl text-slate-300">Hold to Reveal</p>
                </div>
             </div>
        {/if}
      </div>

      <p class="text-slate-500 text-sm">
        Release to hide. Memorize your word.
      </p>

      <button
        onclick={handleNext}
        class="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl text-lg transition-all"
      >
        {isRevealed ? ($currentPlayerIndex < $players.length - 1 ? 'Next Player' : 'Start Game') : 'Confirm & Hide'}
      </button>
       <!-- Only let them proceed if they have revealed at least once?
            For now, simpler: Button is always there, but requires reveal?
            actually, standard flow is: Deal -> Reveal -> Confirm -> Next Deal.
            We can just show "Done" button below.
       -->
    </div>
  {/if}

</div>
