import type { GamePhase } from '../types';

export class GameStateMachine {
  private state: GamePhase;

  constructor(initialState: GamePhase = 'SETUP') {
    this.state = initialState;
  }

  get current() {
    return this.state;
  }

  transition(event: string): GamePhase {
    switch (this.state) {
      case 'SETUP':
        if (event === 'START') return (this.state = 'DEAL');
        if (event === 'RESET') return (this.state = 'SETUP'); // Allow re-reset
        break;
      case 'DEAL':
        if (event === 'READY') return (this.state = 'REVEAL');
        if (event === 'RESET') return (this.state = 'SETUP');
        break;
      case 'REVEAL':
        if (event === 'NEXT') return (this.state = 'DEAL'); // Loop back for next player
        if (event === 'DONE') return (this.state = 'CLUE'); // All players done
        if (event === 'RESET') return (this.state = 'SETUP');
        break;
      case 'CLUE':
        // Time up or manual vote trigger
        if (event === 'VOTE') return (this.state = 'VOTE');
        if (event === 'RESET') return (this.state = 'SETUP');
        break;
      case 'VOTE':
        if (event === 'TALLY') return (this.state = 'RESULT');
        if (event === 'RESET') return (this.state = 'SETUP');
        break;
      case 'RESULT':
        if (event === 'NEXT_ROUND') return (this.state = 'CLUE');
        if (event === 'GAME_OVER') return (this.state = 'END');
        // If we want to allow 'Play Again' from RESULT directly (simplification for MVP):
        if (event === 'RESET') return (this.state = 'SETUP');
        break;
      case 'END':
        if (event === 'RESET') return (this.state = 'SETUP');
        break;
    }
    console.warn(`Invalid transition: ${this.state} -> ${event}`);
    return this.state;
  }
}
