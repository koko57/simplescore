import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGame } from '@/context/GameContext';
import { Player } from '@/types';
import { theme } from '@/constants/theme';
import { STORAGE_KEY } from '@/constants';
import { ACTION_TYPES } from '@/constants/actionTypes';
import { ROUTES } from '@/constants/routes';

const HomeScreen = () => {
    const router = useRouter();
    const { dispatch } = useGame();
    const [hasSavedGame, setHasSavedGame] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const checkSavedGame = async (): Promise<void> => {
                try {
                    const saved = await AsyncStorage.getItem(STORAGE_KEY);
                    setHasSavedGame(saved !== null);
                } catch {
                    setHasSavedGame(false);
                }
            };
            checkSavedGame();
        }, [])
    );

    const handleNewGame = (): void => {
        dispatch({ type: ACTION_TYPES.NEW_GAME });
        router.push(ROUTES.ADD_PLAYERS);
    };

    const handleLoadGame = async (): Promise<void> => {
        try {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved) {
                const players: Player[] = JSON.parse(saved);
                dispatch({ type: ACTION_TYPES.LOAD_GAME, payload: { players } });
                router.push(ROUTES.BOARD);
            }
        } catch {
            Alert.alert('Error', 'Failed to load saved game');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Decorative circles */}
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />
                <View style={styles.decorCircle3} />

                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>S</Text>
                </View>
                <Text style={styles.title}>ScoreBoard</Text>
                <Text style={styles.subtitle}>Let the games begin!</Text>

                <View style={styles.buttonContainer}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            styles.primaryButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handleNewGame}
                    >
                        <Text style={styles.primaryButtonText}>New Game</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            styles.secondaryButton,
                            pressed && styles.buttonPressed,
                            !hasSavedGame && styles.buttonDisabled,
                        ]}
                        onPress={handleLoadGame}
                        disabled={!hasSavedGame}
                    >
                        <Text
                            style={[
                                styles.secondaryButtonText,
                                !hasSavedGame && styles.textDisabled,
                            ]}
                        >
                            Continue
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    // Decorative background circles
    decorCircle1: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: theme.colors.accent,
        opacity: 0.3,
    },
    decorCircle2: {
        position: 'absolute',
        bottom: 100,
        left: -80,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: theme.colors.secondary,
        opacity: 0.4,
    },
    decorCircle3: {
        position: 'absolute',
        top: 150,
        left: 50,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary,
        opacity: 0.2,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: theme.borderRadius.xl,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        ...theme.shadows.card,
    },
    logoText: {
        fontSize: 52,
        fontWeight: '800',
        color: theme.colors.textOnPrimary,
    },
    title: {
        fontSize: 44,
        fontWeight: '800',
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        color: theme.colors.textLight,
        marginBottom: theme.spacing.xxl,
        fontWeight: '500',
    },
    buttonContainer: {
        width: '100%',
        gap: theme.spacing.md,
    },
    button: {
        paddingVertical: 20,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
    },
    buttonPressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.9,
    },
    primaryButton: {
        backgroundColor: theme.colors.primary,
        ...theme.shadows.button,
    },
    primaryButtonText: {
        color: theme.colors.textOnPrimary,
        fontSize: 20,
        fontWeight: '700',
    },
    secondaryButton: {
        backgroundColor: theme.colors.surface,
        borderWidth: 2,
        borderColor: theme.colors.border,
    },
    secondaryButtonText: {
        color: theme.colors.text,
        fontSize: 20,
        fontWeight: '700',
    },
    buttonDisabled: {
        backgroundColor: theme.colors.border,
        borderColor: theme.colors.border,
    },
    textDisabled: {
        color: theme.colors.textMuted,
    },
});

export default HomeScreen;
