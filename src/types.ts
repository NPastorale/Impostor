export type Role = 'civilian' | 'impostor';

export interface Player {
  id: string;
  name: string;
  role: Role;
  word?: string; // Civilians get the word, Impostor gets undefined (or different word)
  isEliminated: boolean;
  voteCount: number;
}

export type GamePhase =
  | 'SETUP'
  | 'DEAL'
  | 'REVEAL'
  | 'CLUE'
  | 'VOTE'
  | 'RESULT'
  | 'END';

export interface GameSettings {
  impostorCount: number;
  rounds: number;
  language: 'en' | 'es';
  timerSeconds: number; // 0 = unlimited
  impostorMode: 'no-word' | 'different-word';
}

export interface WordPackItem {
  id: string;
  word: string;
  category: string;
  language: 'en' | 'es';
  difficulty: 'easy' | 'medium' | 'hard';
}
