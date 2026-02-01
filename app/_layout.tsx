import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '../src/context/GameContext';
import { theme } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <GameProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            fontWeight: '700',
            color: theme.colors.text,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
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
            headerShown: false,
          }}
        />
      </Stack>
    </GameProvider>
  );
}
