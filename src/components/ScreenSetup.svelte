<script lang="ts">
  import { game } from '../stores/game';
  import { fade, slide } from 'svelte/transition';

  const { players, settings } = game;
  let newPlayerName = '';

  function addPlayer() {
    if (newPlayerName.trim()) {
      game.addPlayer(newPlayerName.trim());
      newPlayerName = '';
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') addPlayer();
  }

  function removePlayer(id: string) {
    game.removePlayer(id);
  }

  function startGame() {
    game.startGame();
  }
</script>

<div class="space-y-6" in:fade>
  <div class="text-center space-y-2">
    <h1 class="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
      IMPOSTOR
    </h1>
    <p class="text-slate-400">Mai es siempre la impostora EDITION</p>
  </div>

  <!-- Player List -->
  <div class="glass rounded-xl p-4 space-y-4">
    <h2 class="text-lg font-bold text-slate-200">Players ({$players.length})</h2>

    <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
      {#each $players as player (player.id)}
        <div class="flex justify-between items-center bg-white/5 p-3 rounded-lg" transition:slide|local>
          <span class="font-medium">{player.name}</span>
          <button
            onclick={() => removePlayer(player.id)}
            class="text-red-400 hover:text-red-300 p-1"
            aria-label="Remove player"
          >
            ✕
          </button>
        </div>
      {/each}
    </div>

    <div class="flex gap-2">
      <input
        type="text"
        bind:value={newPlayerName}
        onkeydown={handleKeydown}
        placeholder="Enter player name"
        class="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-600"
      />
      <button
        onclick={addPlayer}
        class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold transition-all active:scale-95"
      >
        Add
      </button>
    </div>
  </div>

  <!-- Settings -->
  <div class="glass rounded-xl p-4 space-y-4">
    <h2 class="text-lg font-bold text-slate-200">Settings</h2>

    <div class="flex justify-between items-center">
      <label for="impostors" class="text-slate-300">Impostors</label>
      <div class="flex items-center gap-3">
        <button
            onclick={() => game.updateSettings({ impostorCount: Math.max(1, $settings.impostorCount - 1) })}
            class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-xl font-bold"
        >-</button>
        <span class="w-4 text-center">{$settings.impostorCount}</span>
        <button
            onclick={() => game.updateSettings({ impostorCount: Math.min($players.length - 1 || 1, $settings.impostorCount + 1) })}
            class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-xl font-bold"
        >+</button>
      </div>
    </div>

    <div class="flex justify-between items-center">
        <label for="lang" class="text-slate-300">Language</label>
        <select
            id="lang"
            bind:value={$settings.language}
            onchange={() => game.updateSettings({ language: $settings.language })}
            class="bg-black/20 border border-white/10 rounded-lg px-2 py-1 focus:outline-none"
        >
            <option value="en">English</option>
            <option value="es">Español</option>
        </select>
    </div>
  </div>

  <button
    onclick={startGame}
    disabled={$players.length < 3}
    class="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl text-xl shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
  >
    Start Game
  </button>
</div>
