<script lang="ts">
  import { game } from '../stores/game';
  import { fade, scale } from 'svelte/transition';

  const { players, state, currentSecretWord, settings } = game;

  // Determine winner
  // Determine winner
  // Logic:
  // If ALL impostors are eliminated -> Civilians WIN.
  // If ANY civilian is eliminated -> Impostor WINS (Simplification for MVP, usually game continues until ratio is met, but simpler here: if you vote wrong, you lose).

  const allImpostors = $players.filter(p => p.role === 'impostor');
  const eliminatedImpostors = allImpostors.filter(p => p.isEliminated);
  const remainingImpostors = allImpostors.length - eliminatedImpostors.length;

  const eliminatedCivilians = $players.filter(p => p.role === 'civilian' && p.isEliminated);

  let winner: 'civilians' | 'impostor' | null = null;

  if (remainingImpostors === 0) {
      winner = 'civilians';
  } else if (eliminatedCivilians.length > 0) {
      winner = 'impostor';
  } else {
      // This shouldn't happen in single-round vote-out MVP unless we skipped voting.
      // But if we support multiple rounds, game would continue.
      // For now, assume Game Over on any elimination.
      winner = 'impostor';
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
        {#if $settings.impostorCount > 1}
            <h1 class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500" in:scale>
                GANARON LOS IMPOSTORES!
            </h1>
        {:else}
            <h1 class="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500" in:scale>
                GANÓ EL IMPOSTOR!
            </h1>
        {/if}
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
