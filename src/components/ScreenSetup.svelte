<script lang="ts">
  import { game } from '../stores/game';
  import { fade, slide } from 'svelte/transition';

  const { players, settings } = game;
  let newPlayerName = '';
  let showRules = false;

  $: maxImpostors = Math.max(1, Math.floor($players.length / 3));
  $: if ($settings.impostorCount > maxImpostors) {
    game.updateSettings({ impostorCount: maxImpostors });
  }

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
    <p class="text-slate-400">Mai pierde EDITION</p>
    <button
      onclick={() => showRules = true}
      class="text-xs text-purple-400 hover:text-purple-300 underline mt-2"
    >
      ¿Cómo jugar?
    </button>
  </div>

  {#if showRules}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" transition:fade>
      <div class="glass max-w-md w-full p-6 rounded-2xl shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto" transition:slide>
        <div class="flex justify-between items-center sticky top-0 bg-transparent">
          <h2 class="text-2xl font-bold text-white">Reglas del Juego</h2>
          <button onclick={() => showRules = false} class="text-slate-400 hover:text-white p-2 text-xl">✕</button>
        </div>

        <div class="space-y-4 text-slate-300 text-sm leading-relaxed">
          <section>
            <h3 class="font-bold text-purple-400 mb-1">1. Preparación</h3>
            <p>Se juega en ronda. Uno (o más) va a ser el <span class="text-red-400 font-bold">Impostor</span>. El resto son <span class="text-blue-400 font-bold">Civiles</span>.</p>
          </section>

          <section>
            <h3 class="font-bold text-purple-400 mb-1">2. La Palabra Secreta</h3>
            <p>Todos los Civiles ven la misma palabra secreta. El Impostor ve solamente "SOS EL IMPOSTOR".</p>
          </section>

          <section>
            <h3 class="font-bold text-purple-400 mb-1">3. El Juego</h3>
            <p>Por turnos, cada uno tiene que decir una palabra o frase corta relacionada con la palabra secreta. <br/><em class="text-slate-500">Ejemplo: Si la palabra es "Playa", podrías tirar "Arena" o "Calor".</em></p>
            <p class="mt-2 text-xs bg-white/5 p-2 rounded">⚠️ <strong>Ojo:</strong> Si sos muy obvio, el Impostor la va a sacar al toque. Si sos muy vago, van a pensar que el Impostor sos vos. Si te llamás Maia tenés más probabilidades de perder.</p>
          </section>

          <section>
            <h3 class="font-bold text-purple-400 mb-1">4. Objetivo</h3>
            <ul class="list-disc list-inside space-y-1 ml-1">
              <li><span class="text-blue-400">Civiles:</span> Descubrir quién es el Impostor y votarlo para eliminarlo.</li>
              <li><span class="text-red-400">Impostor:</span> Pasar desapercibido, caretearla que sabés la palabra, o adivinar cuál es la palabra secreta.</li>
            </ul>
          </section>
        </div>

        <button
          onclick={() => showRules = false}
          class="w-full mt-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all"
        >
          Al toke!
        </button>
      </div>
    </div>
  {/if}

  <!-- Player List -->
  <div class="glass rounded-xl p-4 space-y-4">
    <h2 class="text-lg font-bold text-slate-200">Jugadores ({$players.length})</h2>

    <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
      {#each $players as player (player.id)}
        <div class="flex justify-between items-center bg-white/5 p-3 rounded-lg" transition:slide|local>
          <span class="font-medium">{player.name}</span>
          <button
            onclick={() => removePlayer(player.id)}
            class="text-red-400 hover:text-red-300 p-1"
            aria-label="Eliminar jugador"
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
        placeholder="Nombre"
        class="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-600"
      />
      <button
        onclick={addPlayer}
        class="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold transition-all active:scale-95"
      >
        Agregar
      </button>
    </div>
  </div>

  <!-- Settings -->
  <div class="glass rounded-xl p-4 space-y-4">
    <h2 class="text-lg font-bold text-slate-200">Configuración</h2>

    <div class="flex justify-between items-center">
      <label for="impostors" class="text-slate-300">Impostores</label>
      <div class="flex items-center gap-3">
        <button
            onclick={() => game.updateSettings({ impostorCount: Math.max(1, $settings.impostorCount - 1) })}
            class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-xl font-bold"
        >-</button>
        <span class="w-4 text-center">{$settings.impostorCount}</span>
        <button
            onclick={() => {
                const max = Math.max(1, Math.floor($players.length / 3));
                game.updateSettings({ impostorCount: Math.min(max, $settings.impostorCount + 1) });
            }}
            class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-xl font-bold"
        >+</button>
      </div>
    </div>

    <div class="flex justify-between items-center">
        <label for="lang" class="text-slate-300">Idioma</label>
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
    Arrancar
  </button>
</div>
