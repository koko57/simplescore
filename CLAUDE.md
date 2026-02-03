# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ScoreBoard is a React Native mobile app for tracking player scores during games. This is an Expo rewrite of an older React Native CLI project, created to learn Expo features and try EAS (Expo Application Services) for app distribution.

## Development Commands

```bash
npm start          # Start Expo dev server
npm run ios        # Start on iOS simulator
npm run android    # Start on Android emulator
npm run web        # Start web version
```

## Architecture

### Tech Stack

- **Expo SDK 54** with expo-router for file-based navigation
- **React 19.1** / **React Native 0.81.5**
- **TypeScript** with strict mode
- **New Architecture enabled** (React Native's new rendering system)

### State Management

Uses React Context API + useReducer pattern (not Redux):

- `src/context/GameContext.tsx` - GameProvider wraps the app, provides `state` and `dispatch`
- `src/types/index.ts` - Defines `Player`, `GameState`, and `GameAction` types

**State shape:**

```typescript
interface GameState {
    players: Player[];
    gameStarted: boolean;
    gameEnded: boolean;
    isAddingPlayer: boolean;
}
```

**Key actions:** `ADD_PLAYER`, `REMOVE_PLAYER`, `EDIT_PLAYER`, `ADD_POINTS`, `RESET_SCORE`, `RESET_ALL`, `NEW_GAME`, `LOAD_GAME`, `END_GAME`, `QUIT_GAME`, `START_GAME`

### Navigation (expo-router)

File-based routing in `app/` directory:

- `app/_layout.tsx` - Root layout with Stack navigator and GameProvider
- `app/index.tsx` - Home screen (new game / load game)
- `app/add-players.tsx` - Player setup before game starts
- `app/board.tsx` - Main game screen with score tracking

### Persistence

- Uses `@react-native-async-storage/async-storage`
- Storage key: `@scoreboard_game`
- Stores `players` array as JSON string

### Key Libraries

- `react-native-gesture-handler` - Swipe-to-delete on player cards
- `expo-router` - File-based navigation
- `react-native-safe-area-context` - Safe area handling

## Project Structure

```
app/                    # Expo Router screens (file-based routing)
src/
  context/GameContext.tsx   # State management (useReducer + Context)
  types/index.ts            # TypeScript types (Player, GameState, GameAction)
  constants/colors.ts       # 12 player colors, MAX_PLAYERS constant
```

## Game Logic Notes

- Maximum 12 players (colors cycle if exceeded)
- Players assigned colors based on order index
- When game ends, player with highest score gets `winner: true`
- "Reset All" restores scores to 0 and clears `gameEnded` state
- Players can be edited/deleted via swipe gestures on add-players screen
