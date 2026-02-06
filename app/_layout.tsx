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
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="index"
                    options={{
                        contentStyle: {
                            backgroundColor: theme.colors.background,
                        },
                    }}
                />
                <Stack.Screen name="add-players" />
                <Stack.Screen
                    name="board"
                    options={{
                        gestureEnabled: false,
                    }}
                />
            </Stack>
        </GameProvider>
    );
};

export default RootLayout;
