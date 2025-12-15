import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { game } from './game';

describe('Game Store', () => {
    beforeEach(() => {
        // Full reset of store state
        game.reset();
        game.players.set([]); // Manually clear players as reset() allows 'Play Again'
    });

    it('should add players correctly', () => {
        game.addPlayer('Alice');
        game.addPlayer('Bob');
        const players = get(game.players);
        expect(players.length).toBe(2);
        expect(players[0].name).toBe('Alice');
    });

    it('should require 3 players to start', () => {
        // Mock alert
        global.alert = vi.fn();

        game.addPlayer('A');
        game.addPlayer('B');
        game.startGame();

        expect(get(game.state)).toBe('SETUP'); // Should not start
        expect(global.alert).toHaveBeenCalled();
    });

    it('should assign roles and transition to DEAL', () => {
        game.addPlayer('A');
        game.addPlayer('B');
        game.addPlayer('C');

        game.startGame();

        expect(get(game.state)).toBe('DEAL');

        const players = get(game.players);
        const impostors = players.filter(p => p.role === 'impostor');
        const civilians = players.filter(p => p.role === 'civilian');

        expect(impostors.length).toBe(1);
        expect(civilians.length).toBe(2);
        expect(get(game.currentSecretWord)).toBeDefined();

        // Check words
        expect(impostors[0].word).toBeUndefined(); // Assuming default 'no-word' mode
        expect(civilians[0].word).toBe(get(game.currentSecretWord));
    });

    it('should handle loop correctly using nextReveal', () => {
        game.addPlayer('A');
        game.addPlayer('B');
        game.addPlayer('C');
        game.startGame(); // DEAL (Player 0)

        const initialIdx = get(game.currentPlayerIndex);
        expect(initialIdx).toBe(0);

        // Move to REVEAL (simulating confirming identity A)
        game.transition('READY');
        expect(get(game.state)).toBe('REVEAL');

        // Move to next player (DEAL Player 1)
        game.nextReveal();
        expect(get(game.state)).toBe('DEAL');
        expect(get(game.currentPlayerIndex)).toBe(1);

        // REVEAL B
        game.transition('READY');
        game.nextReveal(); // DEAL Player 2
        expect(get(game.currentPlayerIndex)).toBe(2);

        // REVEAL C
        game.transition('READY');
        game.nextReveal(); // CLUE (Done)

        expect(get(game.state)).toBe('CLUE');
    });
});
