import type { WordPackItem } from '../types';

const defaultWords: WordPackItem[] = [
    { id: '1', word: 'Pizza', category: 'Food', language: 'en', difficulty: 'easy' },
    { id: '2', word: 'Sushi', category: 'Food', language: 'en', difficulty: 'easy' },
    { id: '3', word: 'Taco', category: 'Food', language: 'en', difficulty: 'easy' },
    { id: '4', word: 'Burger', category: 'Food', language: 'en', difficulty: 'easy' },
    { id: '5', word: 'Elephant', category: 'Animals', language: 'en', difficulty: 'easy' },
    { id: '6', word: 'Giraffe', category: 'Animals', language: 'en', difficulty: 'easy' },
    { id: '7', word: 'Penguin', category: 'Animals', language: 'en', difficulty: 'medium' },
    { id: '8', word: 'Kangaroo', category: 'Animals', language: 'en', difficulty: 'medium' },
    { id: '9', word: 'Doctor', category: 'Jobs', language: 'en', difficulty: 'easy' },
    { id: '10', word: 'Teacher', category: 'Jobs', language: 'en', difficulty: 'easy' },
    // A few Spanish ones for testing
    { id: '11', word: 'Pizza', category: 'Comida', language: 'es', difficulty: 'easy' },
    { id: '12', word: 'Perro', category: 'Animales', language: 'es', difficulty: 'easy' },
    { id: '13', word: 'Gato', category: 'Animales', language: 'es', difficulty: 'easy' },
];

export function getRandomWord(language: 'en' | 'es'): string {
    const langWords = defaultWords.filter(w => w.language === language);
    if (langWords.length === 0) return 'Word';
    const randomIndex = Math.floor(Math.random() * langWords.length);
    return langWords[randomIndex].word;
}
