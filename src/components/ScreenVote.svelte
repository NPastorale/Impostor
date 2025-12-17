<script lang="ts">
  import { game } from '../stores/game';
  import { fade } from 'svelte/transition';

  const { players, settings } = game;
  let selectedPlayerIds: string[] = [];

  $: maxVotes = $settings.impostorCount; // We eliminate as many as there are impostors

  function toggleSelection(id: string) {
    if (selectedPlayerIds.includes(id)) {
        selectedPlayerIds = selectedPlayerIds.filter(pid => pid !== id);
    } else {
        if (selectedPlayerIds.length < maxVotes) {
            selectedPlayerIds = [...selectedPlayerIds, id];
        }
    }
  }

  function confirmVote() {
    if (selectedPlayerIds.length > 0) {
        game.voteOut(selectedPlayerIds);
    }
  }
</script>

<div class="h-full flex flex-col items-center justify-center space-y-8 p-4" in:fade>
  <div class="text-center space-y-2">
    <h2 class="text-3xl font-bold text-nord-6">¿Quién es el Impostor?</h2>
    {#if maxVotes > 1}
        <p class="text-nord-4">Seleccioná {maxVotes} jugadores para eliminar.</p>
    {:else}
        <p class="text-nord-4">Seleccioná al jugador para eliminar.</p>
    {/if}
  </div>

  <div class="w-full max-w-sm space-y-3">
    {#each $players.filter(p => !p.isEliminated) as player}
        <button
            onclick={() => toggleSelection(player.id)}
            class="w-full text-left p-4 rounded-xl border transition-all flex justify-between items-center group
            {selectedPlayerIds.includes(player.id)
                ? 'bg-nord-11/20 border-nord-11 text-nord-6 shadow-[0_0_15px_rgba(191,97,106,0.3)]'
                : 'bg-nord-1 border-nord-1 hover:bg-nord-2 text-nord-4'}"
        >
            <span class="font-bold text-lg group-hover:pl-2 transition-all">{player.name}</span>
            {#if selectedPlayerIds.includes(player.id)}
                <span class="text-nord-11">💀</span>
            {/if}
        </button>
    {/each}
  </div>

  <button
    onclick={confirmVote}
    disabled={selectedPlayerIds.length !== maxVotes}
    class="w-full max-w-sm bg-nord-6 hover:bg-nord-4 text-nord-0 font-bold py-4 rounded-xl text-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
  >
    Eliminar
  </button>
</div>
