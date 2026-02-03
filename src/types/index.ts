export interface Player {
    id: string;
    name: string;
    color: string;
    points: number;
    order: number;
    winner?: boolean;
}

export interface GameState {
    players: Player[];
    gameStarted: boolean;
    gameEnded: boolean;
    isAddingPlayer: boolean;
}

export type GameAction =
    | { type: 'ADD_PLAYER'; payload: { name: string } }
    | { type: 'REMOVE_PLAYER'; payload: { id: string } }
    | { type: 'EDIT_PLAYER'; payload: { id: string; name: string } }
    | { type: 'ADD_POINTS'; payload: { id: string; points: number } }
    | { type: 'RESET_SCORE'; payload: { id: string } }
    | { type: 'RESET_ALL' }
    | { type: 'NEW_GAME' }
    | { type: 'LOAD_GAME'; payload: { players: Player[] } }
    | { type: 'END_GAME' }
    | { type: 'QUIT_GAME' }
    | { type: 'START_GAME' }
    | { type: 'TOGGLE_ADD_PLAYER_MODE' };
