import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '@/context/GameContext';
import { theme } from '@/constants/theme';

const RootLayout = () => {
    return (
        <GameProvider>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    headerTintColor: theme.colors.primary,
                    headerTitleStyle: {
                        fontWeight: '700',
                        color: theme.colors.text,
                    },
                    headerShadowVisible: false,
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'ScoreBoard',
                        headerShown: false,
                        contentStyle: {
                            backgroundColor: theme.colors.background,
                        },
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
};

export default RootLayout;
