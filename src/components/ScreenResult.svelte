<script lang="ts">
  import { game } from '../stores/game';
  import { fade, scale } from 'svelte/transition';

  const { players, state, currentSecretWord } = game;

  // Determine winner
  const eliminatedPlayer = $players.find(p => p.isEliminated && !p.role); // Wait, logic needed:
  // In `voteOut` we set `isEliminated`. To show "Who WON", we check if the eliminated person was impostor.

  // We need to know WHO was just eliminated to show their card.
  // Actually, let's filter the MOST RECENTLY eliminated player?
  // or just check the game state.
  // Let's assume `game.voteOut` sets the state and we can calculate from `players`.
  // BUT `voteOut` marks them eliminated.

  let winner: 'civilians' | 'impostor' | null = null;
  let recentVictim = $players.find(p => p.isEliminated); // This is weak if multiple rounds.
  // We need a better way to track "Latest Victim".
  // For MVP with 1 round, this is fine.

  if (recentVictim) {
      if (recentVictim.role === 'impostor') {
          winner = 'civilians';
      } else {
          winner = 'impostor'; // Simplified: If civilian dies, Impostor wins immediately (or gets to guess - not implemented for MVP speed)
      }
  }

  function playAgain() {
    game.reset();
  }
</script>

<div class="h-full flex flex-col items-center justify-center space-y-8 p-4 text-center" in:fade>

  <div class="space-y-4">
      <h3 class="text-slate-400 uppercase tracking-widest text-sm">Terminó la partida</h3>
      {#if winner === 'civilians'}
        <h1 class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400" in:scale>
            GANARON LOS CIVILES!
        </h1>
        <p class="text-xl text-slate-300">El impostor fue atrapado.</p>
      {:else}
        <h1 class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500" in:scale>
            GANÓ EL IMPOSTOR!
        </h1>
        <p class="text-xl text-slate-300">Un civil inocente fue eliminado.</p>
      {/if}
  </div>

  <div class="glass p-8 rounded-2xl max-w-sm w-full space-y-6">
    <div class="space-y-2">
        <p class="text-slate-400 text-sm">La palabra secreta era</p>
        <p class="text-3xl font-bold text-white">{$currentSecretWord}</p>
    </div>

    <div class="h-px bg-white/10 w-full"></div>

    <div class="space-y-3">
        <p class="text-slate-400 text-sm">Roles</p>
        {#each $players as player}
            <div class="flex justify-between items-center text-left">
                <span class="font-bold {player.isEliminated ? 'line-through decoration-red-500 decoration-2 text-slate-500' : 'text-slate-200'}">
                    {player.name}
                </span>
                <span class="text-sm {player.role === 'impostor' ? 'text-red-400 font-bold' : 'text-slate-400'}">
                    {player.role === 'impostor' ? 'Impostor' : 'Civil'}
                </span>
            </div>
        {/each}
    </div>
  </div>

  <button
    onclick={playAgain}
    class="w-full max-w-sm bg-white hover:bg-slate-200 text-black font-bold py-4 rounded-xl text-xl shadow-lg transition-all"
  >
    Jugar de nuevo
  </button>
</div>
