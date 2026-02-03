export type Player = {
    id: string;
    name: string;
    color: string;
    score: number;
    order: number;
}

export type GameState = {
    players: Player[];
}

export type GameAction =
    | { type: 'ADD_PLAYER'; payload: { name: string } }
    | { type: 'REMOVE_PLAYER'; payload: { id: string } }
    | { type: 'EDIT_PLAYER'; payload: { id: string; name: string } }
    | { type: 'ADD_POINTS'; payload: { id: string; points: number } }
    | { type: 'RESET_ALL' }
    | { type: 'NEW_GAME' }
    | { type: 'LOAD_GAME'; payload: { players: Player[] } };