import { writable, get } from 'svelte/store';
import type { Player, GameSettings, GamePhase } from '../types';
import { GameStateMachine } from '../lib/fsm';
import { getRandomWord } from '../lib/words';

function createGameStore() {
  const fsm = new GameStateMachine();

  const state = writable<GamePhase>(fsm.current);
  const players = writable<Player[]>([]);
  const settings = writable<GameSettings>({
    impostorCount: 1,
    rounds: 1,
    language: 'es',
    timerSeconds: 0,
    impostorMode: 'no-word'
  });
  const currentSecretWord = writable<string | undefined>(undefined);
  const currentPlayerIndex = writable<number>(0); // For reveal loop
  const roundNumber = writable<number>(1);

  return {
    state,
    players,
    settings,
    currentSecretWord,
    currentPlayerIndex,
    roundNumber,

    // Actions
    addPlayer: (name: string) => {
      players.update(p => [
        ...p,
        {
          id: crypto.randomUUID(),
          name,
          role: 'civilian',
          isEliminated: false,
          voteCount: 0
        }
      ]);
    },
    removePlayer: (id: string) => {
      players.update(p => p.filter(pl => pl.id !== id));
    },
    updateSettings: (newSettings: Partial<GameSettings>) => {
      settings.update(s => ({ ...s, ...newSettings }));
    },
    transition: (event: string) => {
      const newState = fsm.transition(event);
      state.set(newState);
    },
    reset: () => {
        const newState = fsm.transition('RESET');
        state.set(newState);
        currentPlayerIndex.set(0);
        roundNumber.set(1);
        currentSecretWord.set(undefined);
    },
    startGame: () => {
        const currentPlayers = get(players);
        const currentSettings = get(settings);

        if (currentPlayers.length < 3) {
            alert('Need at least 3 players!');
            return;
        }

        // 1. Select Word
        const word = getRandomWord(currentSettings.language);
        currentSecretWord.set(word);

        // 2. Assign Roles
        // Use crypto.getRandomValues for the shuffle
        const randomBuffer = new Uint32Array(currentPlayers.length);
        crypto.getRandomValues(randomBuffer);

        // Map original index to random value, sort by random value, then extract original index
        const indicesV2 = currentPlayers.map((_, i) => i)
            .map(i => ({ i, sort: randomBuffer[i] }))
            .sort((a, b) => a.sort - b.sort) // This sorts based on the random 32-bit integers
            .map(({ i }) => i);

        const impostorIndices = new Set(indicesV2.slice(0, currentSettings.impostorCount));

        players.update(all => all.map((p, idx) => ({
            ...p,
            role: impostorIndices.has(idx) ? 'impostor' : 'civilian',
            word: impostorIndices.has(idx)
                ? (currentSettings.impostorMode === 'different-word' ? 'FakeWord' : undefined)
                : word,
            isEliminated: false,
            voteCount: 0
        })));

        // 3. Transition to DEAL (Start loop)
        currentPlayerIndex.set(0);
        const newState = fsm.transition('START');
        state.set(newState);
    },
    nextReveal: () => {
        const currentIdx = get(currentPlayerIndex);
        const currentPlayers = get(players);

        if (currentIdx + 1 < currentPlayers.length) {
            currentPlayerIndex.update(n => n + 1);
            const newState = fsm.transition('NEXT');
            state.set(newState);
        } else {
            const newState = fsm.transition('DONE');
            state.set(newState);
        }
    },
    voteOut: (playerIds: string[]) => {
        players.update(all => all.map(p =>
            playerIds.includes(p.id) ? { ...p, isEliminated: true } : p
        ));
        const nextState = fsm.transition('TALLY');
        state.set(nextState);
    }
  };
}

export const game = createGameStore();
