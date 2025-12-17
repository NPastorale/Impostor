<script lang="ts">
  import { game } from './stores/game';
  import ScreenSetup from './components/ScreenSetup.svelte';
  import ScreenReveal from './components/ScreenReveal.svelte';
  import ScreenClue from './components/ScreenClue.svelte';
  import ScreenVote from './components/ScreenVote.svelte';
  import ScreenResult from './components/ScreenResult.svelte';

  const { state, players, currentSecretWord } = game;
  const debug = new URLSearchParams(window.location.search).get('debug') === '1';
</script>

<main class="min-h-screen bg-nord-0 text-nord-6 flex flex-col items-center justify-center p-4 selection:bg-nord-9 relative">
  <div class="w-full max-w-md">
    {#if $state === 'SETUP'}
      <ScreenSetup />
    {:else if $state === 'DEAL' || $state === 'REVEAL'}
      <ScreenReveal />
    {:else if $state === 'CLUE'}
      <ScreenClue />
    {:else if $state === 'VOTE'}
      <ScreenVote />
    {:else if $state === 'RESULT' || $state === 'END'}
      <ScreenResult />
    {/if}
  </div>

  {#if debug}
      <div class="fixed top-0 left-0 bg-black/80 p-2 text-xs text-green-400 font-mono pointer-events-none z-50">
        <p>State: {$state}</p>
        <p>Word: {$currentSecretWord}</p>
        <ul>
            {#each $players as p}
                <li>{p.name}: {p.role} {p.isEliminated ? '(DEAD)' : ''}</li>
            {/each}
        </ul>
      </div>
  {/if}
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', sans-serif;
  }
</style>
