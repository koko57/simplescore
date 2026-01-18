import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '../src/context/GameContext';

export default function RootLayout() {
  return (
    <GameProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f5f5f5',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: '#fff',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'ScoreBoard',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add-players"
          options={{
            title: 'Add Players',
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="board"
          options={{
            title: 'Game Board',
            headerBackVisible: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </GameProvider>
  );
}
