<script lang="ts">
  import { game } from '../stores/game';
  import { fade } from 'svelte/transition';

  const { players, settings } = game;

  let timeLeft = $settings.timerSeconds || 0;
  let timer: ReturnType<typeof setInterval>;
  let timerActive = false;

  function toggleTimer() {
    if (timerActive) {
        clearInterval(timer);
        timerActive = false;
    } else {
        if (timeLeft <= 0) timeLeft = $settings.timerSeconds || 60;
        timerActive = true;
        timer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(timer);
                timerActive = false;
                // Optional: Auto-sound or something?
            }
        }, 1000);
    }
  }

  function startVoting() {
    clearInterval(timer);
    game.transition('VOTE');
  }
</script>

<div class="h-full flex flex-col items-center justify-center space-y-8 p-4" in:fade>
  <div class="text-center space-y-2">
    <h2 class="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
        Clue Round
    </h2>
    <p class="text-slate-400">Discuss and find the impostor!</p>
  </div>

  {#if $settings.timerSeconds > 0}
      <div class="text-center space-y-4">
        <div class="text-6xl font-black tabular-nums tracking-widest text-slate-200">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
        <button
            onclick={toggleTimer}
            class="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-bold transition-all"
        >
            {timerActive ? 'Pause' : 'Start Timer'}
        </button>
      </div>
  {/if}

  <div class="w-full max-w-sm glass rounded-xl p-4">
    <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Alive Players</h3>
    <div class="flex flex-wrap gap-2">
        {#each $players.filter(p => !p.isEliminated) as player}
            <div class="bg-white/5 px-3 py-1 rounded-lg text-sm font-medium border border-white/5">
                {player.name}
            </div>
        {/each}
    </div>
  </div>

  <button
    onclick={startVoting}
    class="w-full max-w-sm bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-bold py-4 rounded-xl text-xl shadow-lg shadow-red-900/20 transition-all"
  >
    Vote Now
  </button>
</div>
