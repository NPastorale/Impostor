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
    <h1 class="text-4xl font-black bg-gradient-to-r from-nord-15 to-nord-10 bg-clip-text text-transparent">
      IMPOSTOR
    </h1>
    <p class="text-nord-4">Mai pierde EDITION</p>
    <button
      onclick={() => showRules = true}
      class="text-xs text-nord-8 hover:text-nord-9 underline mt-2"
    >
      ¿Cómo jugar?
    </button>
  </div>

  {#if showRules}
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nord-0/80 backdrop-blur-sm" transition:fade>
      <div class="bg-nord-1 max-w-md w-full p-6 rounded-2xl shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto border border-nord-2" transition:slide>
        <div class="flex justify-between items-center sticky top-0 bg-transparent">
          <h2 class="text-2xl font-bold text-nord-6">Reglas del Juego</h2>
          <button onclick={() => showRules = false} class="text-nord-4 hover:text-nord-6 p-2 text-xl">✕</button>
        </div>

        <div class="space-y-4 text-nord-4 text-sm leading-relaxed">
          <section>
            <h3 class="font-bold text-nord-8 mb-1">1. Preparación</h3>
            <p>Se juega en ronda. Uno (o más) va a ser el <span class="text-nord-11 font-bold">Impostor</span>. El resto son <span class="text-nord-14 font-bold">Civiles</span>.</p>
          </section>

          <section>
            <h3 class="font-bold text-nord-8 mb-1">2. La Palabra Secreta</h3>
            <p>Todos los Civiles ven la misma palabra secreta. El Impostor ve solamente "SOS EL IMPOSTOR".</p>
          </section>

          <section>
            <h3 class="font-bold text-nord-8 mb-1">3. El Juego</h3>
            <p>Por turnos, cada uno tiene que decir una palabra o frase corta relacionada con la palabra secreta. <br/><em class="text-nord-14">Ejemplo: Si la palabra es "Playa", podrías tirar "Arena" o "Calor".</em></p>
            <p class="mt-2 text-xs bg-nord-2 p-2 rounded">⚠️ <strong>Ojo:</strong> Si sos muy obvio, el Impostor la va a sacar al toque. Si sos muy vago, van a pensar que el Impostor sos vos. Si te llamás Maia tenés más probabilidades de perder.</p>
          </section>

          <section>
            <h3 class="font-bold text-nord-8 mb-1">4. Objetivo</h3>
            <ul class="list-disc list-inside space-y-1 ml-1">
              <li><span class="text-nord-14">Civiles:</span> Descubrir quién es el Impostor y votarlo para eliminarlo.</li>
              <li><span class="text-nord-11">Impostor:</span> Pasar desapercibido, caretearla que sabés la palabra, o adivinar cuál es la palabra secreta.</li>
            </ul>
          </section>
        </div>

        <button
          onclick={() => showRules = false}
          class="w-full mt-4 bg-nord-10 hover:bg-nord-9 text-nord-6 font-bold py-3 rounded-xl transition-all"
        >
          Al toke!
        </button>
      </div>
    </div>
  {/if}

  <!-- Player List -->
  <div class="bg-nord-1 rounded-xl p-4 space-y-4 border border-nord-2 shadow-lg">
    <h2 class="text-lg font-bold text-nord-6">Jugadores ({$players.length})</h2>

    <div class="space-y-2 max-h-60 overflow-y-auto pr-1">
      {#each $players as player (player.id)}
        <div class="flex justify-between items-center bg-nord-2 p-3 rounded-lg" transition:slide|local>
          <span class="font-medium text-nord-5">{player.name}</span>
          <button
            onclick={() => removePlayer(player.id)}
            class="text-nord-11 hover:text-nord-12 p-1"
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
        class="flex-1 bg-nord-0 border border-nord-2 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-nord-10 transition-all placeholder:text-nord-3 text-nord-6"
      />
      <button
        onclick={addPlayer}
        class="bg-nord-10 hover:bg-nord-9 text-nord-6 px-4 py-2 rounded-lg font-bold transition-all active:scale-95"
      >
        Agregar
      </button>
    </div>
  </div>

  <!-- Settings -->
  <div class="bg-nord-1 rounded-xl p-4 space-y-4 border border-nord-2 shadow-lg">
    <h2 class="text-lg font-bold text-nord-6">Configuración</h2>

    <div class="flex justify-between items-center">
      <label for="impostors" class="text-nord-4">Impostores</label>
      <div class="flex items-center gap-3">
        <button
            onclick={() => game.updateSettings({ impostorCount: Math.max(1, $settings.impostorCount - 1) })}
            class="w-8 h-8 rounded-full bg-nord-2 flex items-center justify-center hover:bg-nord-3 text-xl font-bold text-nord-6"
        >-</button>
        <span class="w-4 text-center text-nord-6">{$settings.impostorCount}</span>
        <button
            onclick={() => {
                const max = Math.max(1, Math.floor($players.length / 3));
                game.updateSettings({ impostorCount: Math.min(max, $settings.impostorCount + 1) });
            }}
            class="w-8 h-8 rounded-full bg-nord-2 flex items-center justify-center hover:bg-nord-3 text-xl font-bold text-nord-6"
        >+</button>
      </div>
    </div>

    <div class="flex justify-between items-center">
        <label for="lang" class="text-nord-4">Idioma</label>
        <select
            id="lang"
            bind:value={$settings.language}
            onchange={() => game.updateSettings({ language: $settings.language })}
            class="bg-nord-0 border border-nord-2 rounded-lg px-2 py-1 focus:outline-none text-nord-6"
        >
            <option value="en">English</option>
            <option value="es">Español</option>
        </select>
    </div>
  </div>

  <button
    onclick={startGame}
    disabled={$players.length < 3}
    class="w-full bg-gradient-to-r from-nord-10 to-nord-9 hover:from-nord-9 hover:to-nord-8 text-nord-1 font-bold py-4 rounded-xl text-xl shadow-lg shadow-nord-0/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
  >
    Arrancar
  </button>
</div>
