import { describe, it, expect, beforeEach } from 'vitest';
import { GameStateMachine } from './fsm';

describe('GameStateMachine', () => {
    let fsm: GameStateMachine;

    beforeEach(() => {
        fsm = new GameStateMachine();
    });

    it('should start in SETUP state', () => {
        expect(fsm.current).toBe('SETUP');
    });

    it('should transition from SETUP to DEAL on START', () => {
        fsm.transition('START');
        expect(fsm.current).toBe('DEAL');
    });

    it('should transition from DEAL to REVEAL on READY', () => {
        fsm.transition('START');
        fsm.transition('READY');
        expect(fsm.current).toBe('REVEAL');
    });

    it('should loop between DEAL and REVEAL on NEXT', () => {
        fsm.transition('START'); // DEAL
        fsm.transition('READY'); // REVEAL
        fsm.transition('NEXT');  // DEAL
        expect(fsm.current).toBe('DEAL');
        fsm.transition('READY'); // REVEAL
        expect(fsm.current).toBe('REVEAL');
    });

    it('should transition to CLUE on DONE', () => {
        fsm.transition('START');
        fsm.transition('READY');
        fsm.transition('DONE');
        expect(fsm.current).toBe('CLUE');
    });

    it('should transition to RESET from RESULT', () => {
        // Fast forward to RESULT
        fsm.transition('START');
        fsm.transition('READY');
        fsm.transition('DONE'); // CLUE
        fsm.transition('VOTE'); // VOTE
        fsm.transition('TALLY'); // RESULT
        expect(fsm.current).toBe('RESULT');

        fsm.transition('RESET');
        expect(fsm.current).toBe('SETUP');
    });
});
