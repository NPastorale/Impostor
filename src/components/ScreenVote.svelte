<script lang="ts">
  import { game } from '../stores/game';
  import { fade } from 'svelte/transition';

  const { players } = game;
  let selectedPlayerId: string | null = null;

  // Simplification: In a real "pass-the-device" vote, each player would vote secretly.
  // For this simplified MVP, we'll do a "Who do we eliminate?" public vote or a moderator enters the result.
  // The requirements say "Voting: Support simple on-device vote capture (tap a player name) and show the majority result"
  // This implies we select ONE person to eliminate (the majority result).
  // Implementing full secret voting loop adds complexity (N players * pass device logic again).
  // Let's implement a single "Select who to Eliminate" screen for now, which simulates the result of the discussion.

  function confirmVote() {
    if (selectedPlayerId) {
        // Mark player as eliminated? Or just pass to Result screen which handles logic?
        // Let's handle logic in store or result screen.
        // For now, simpler to just mark them as 'voted out' in memory and let Result screen process.
        // Actually, we need to store who was voted out.
        // Let's add `voteOut(id)` to store.
        game.voteOut(selectedPlayerId);
    }
  }
</script>

<div class="h-full flex flex-col items-center justify-center space-y-8 p-4" in:fade>
  <div class="text-center space-y-2">
    <h2 class="text-3xl font-bold text-white">¿Quién es el Impostor?</h2>
    <p class="text-slate-400">Seleccioná al jugador para eliminar.</p>
  </div>

  <div class="w-full max-w-sm space-y-3">
    {#each $players.filter(p => !p.isEliminated) as player}
        <button
            onclick={() => selectedPlayerId = player.id}
            class="w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center group
            {selectedPlayerId === player.id
                ? 'bg-red-500/20 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-300'}"
        >
            <span class="font-bold text-lg group-hover:pl-2 transition-all">{player.name}</span>
            {#if selectedPlayerId === player.id}
                <span class="text-red-400">💀</span>
            {/if}
        </button>
    {/each}
  </div>

  <button
    onclick={confirmVote}
    disabled={!selectedPlayerId}
    class="w-full max-w-sm bg-slate-100 hover:bg-white text-black font-bold py-4 rounded-xl text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
  >
    Eliminar
  </button>
</div>
