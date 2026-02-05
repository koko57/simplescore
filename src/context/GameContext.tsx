import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameAction, Player } from '@/types';
import { PLAYER_COLORS } from '@/constants/colors';

const initialState: GameState = {
    players: [],
};

const generateId = (): string =>
    Date.now().toString(36) + Math.random().toString(36).substring(2);

const gameReducer = (state: GameState, action: GameAction): GameState => {
    switch (action.type) {
        case 'ADD_PLAYER': {
            const newPlayer: Player = {
                id: generateId(),
                name: action.payload.name,
                color: PLAYER_COLORS[
                    state.players.length % PLAYER_COLORS.length
                ],
                score: 0,
                order: state.players.length,
            };
            return {
                players: [...state.players, newPlayer],
            };
        }

        case 'REMOVE_PLAYER': {
            const filtered = state.players.filter(
                (p) => p.id !== action.payload.id
            );
            // Reassign colors and order after removal
            const updated = filtered.map((player, index) => ({
                ...player,
                color: PLAYER_COLORS[index % PLAYER_COLORS.length],
                order: index,
            }));
            return { players: updated };
        }

        case 'EDIT_PLAYER': {
            return {
                players: state.players.map((player) =>
                    player.id === action.payload.id
                        ? { ...player, name: action.payload.name }
                        : player
                ),
            };
        }

        case 'ADD_POINTS': {
            return {
                players: state.players.map((player) =>
                    player.id === action.payload.id
                        ? {
                              ...player,
                              score: player.score + action.payload.points,
                          }
                        : player
                ),
            };
        }

        case 'RESET_ALL': {
            return {
                players: state.players.map((player) => ({
                    ...player,
                    score: 0,
                })),
            };
        }

        case 'NEW_GAME': {
            return {
                ...initialState,
            };
        }

        case 'LOAD_GAME': {
            return {
                players: action.payload.players,
            };
        }

        default:
            return state;
    }
};

interface GameContextType {
    state: GameState;
    dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
    children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = (): GameContextType => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
