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
    <h2 class="text-3xl font-bold bg-gradient-to-r from-nord-13 to-nord-12 bg-clip-text text-transparent">
        Ronda de Pistas
    </h2>
    <p class="text-nord-4">Debatan y encuentren al impostor!</p>
  </div>

  {#if $settings.timerSeconds > 0}
      <div class="text-center space-y-4">
        <div class="text-6xl font-black tabular-nums tracking-widest text-nord-6">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
        <button
            onclick={toggleTimer}
            class="bg-nord-2 hover:bg-nord-3 text-nord-6 px-6 py-2 rounded-full font-bold transition-all border border-nord-3"
        >
            {timerActive ? 'Pausar' : 'Iniciar Temporizador'}
        </button>
      </div>
  {/if}

  <div class="w-full max-w-sm bg-nord-1 border border-nord-2 rounded-xl p-4 shadow-lg">
    <h3 class="text-sm font-bold text-nord-4 uppercase tracking-wider mb-4">Jugadores Vivos</h3>
    <div class="flex flex-wrap gap-2">
        {#each $players.filter(p => !p.isEliminated) as player}
            <div class="bg-nord-2 text-nord-5 px-3 py-1 rounded-lg text-sm font-medium border border-nord-3">
                {player.name}
            </div>
        {/each}
    </div>
  </div>

  <button
    onclick={startVoting}
    class="w-full max-w-sm bg-gradient-to-r from-nord-11 to-nord-12 hover:from-nord-12 hover:to-nord-13 text-nord-1 font-bold py-4 rounded-xl text-xl shadow-lg shadow-nord-11/20 transition-all"
  >
    Votar Ahora
  </button>
</div>
