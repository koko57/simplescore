import { ACTION_TYPES } from '@/constants/actionTypes';

export type Player = {
    id: string;
    name: string;
    color: string;
    score: number;
    order: number;
};

export type GameState = {
    players: Player[];
};

export type GameAction =
    | { type: typeof ACTION_TYPES.ADD_PLAYER; payload: { name: string } }
    | { type: typeof ACTION_TYPES.REMOVE_PLAYER; payload: { id: string } }
    | {
          type: typeof ACTION_TYPES.EDIT_PLAYER;
          payload: { id: string; name: string };
      }
    | {
          type: typeof ACTION_TYPES.ADD_POINTS;
          payload: { id: string; points: number };
      }
    | { type: typeof ACTION_TYPES.RESET_ALL }
    | { type: typeof ACTION_TYPES.NEW_GAME }
    | { type: typeof ACTION_TYPES.LOAD_GAME; payload: { players: Player[] } };
