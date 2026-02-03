import { useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    FlatList,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGame } from '../src/context/GameContext';
import { Player } from '../src/types';
import { theme } from '../src/constants/theme';

const STORAGE_KEY = '@scoreboard_game';

const BoardScreen = () => {
    const router = useRouter();
    const { state, dispatch } = useGame();
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [pointsInput, setPointsInput] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [contentHeight, setContentHeight] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);

    const saveGame = async (): Promise<void> => {
        try {
            await AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(state.players)
            );
        } catch {
            Alert.alert('Error', 'Failed to save game');
        }
    };

    // Disable scroll when all content fits on screen
    useEffect(() => {
        if (contentHeight > 0 && containerHeight > 0) {
            setScrollEnabled(contentHeight > containerHeight);
        }
    }, [contentHeight, containerHeight]);

    const handlePlayerTap = (player: Player): void => {
        if (state.gameEnded) return;
        setSelectedPlayer(player);
        setPointsInput('');
    };

    const handleAddPoints = (subtract: boolean = false): void => {
        if (!selectedPlayer) return;

        const points = parseInt(pointsInput, 10);
        if (isNaN(points) || points === 0) {
            setSelectedPlayer(null);
            return;
        }

        dispatch({
            type: 'ADD_POINTS',
            payload: {
                id: selectedPlayer.id,
                points: subtract ? -points : points,
            },
        });
        setSelectedPlayer(null);
        setPointsInput('');
    };

    const handleResetPlayer = (): void => {
        if (!selectedPlayer) return;

        dispatch({ type: 'RESET_SCORE', payload: { id: selectedPlayer.id } });
        setSelectedPlayer(null);
    };

    const handleResetAll = (): void => {
        Alert.alert(
            'Reset All Scores',
            'Are you sure you want to reset all scores to 0?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => {
                        dispatch({ type: 'RESET_ALL' });
                        setShowMenu(false);
                    },
                },
            ]
        );
    };

    const handleEndGame = (): void => {
        dispatch({ type: 'END_GAME' });
        setShowMenu(false);
    };

    const handleQuit = (): void => {
        Alert.alert(
            'Quit Game',
            'Are you sure? Any unsaved progress will be lost.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Quit',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem(STORAGE_KEY);
                        dispatch({ type: 'QUIT_GAME' });
                        router.replace('/');
                    },
                },
            ]
        );
    };

    const handleNewGameFromEnd = async (): Promise<void> => {
        await AsyncStorage.removeItem(STORAGE_KEY);
        dispatch({ type: 'NEW_GAME' });
        router.replace('/add-players');
    };

    const handlePlayAgain = (): void => {
        dispatch({ type: 'RESET_ALL' });
    };

    const renderPlayer = ({ item }: { item: Player }) => {
        const isWinner = item.winner && state.gameEnded;

        return (
            <Pressable
                style={({ pressed }) => [
                    styles.playerCard,
                    {
                        backgroundColor: item.color + '20',
                        borderColor: item.color,
                    },
                    pressed && !state.gameEnded && styles.playerCardPressed,
                    isWinner && styles.winnerCard,
                ]}
                onPress={() => handlePlayerTap(item)}
                disabled={state.gameEnded}
            >
                <View style={styles.playerInfo}>
                    <View
                        style={[
                            styles.colorDot,
                            { backgroundColor: item.color },
                        ]}
                    />
                    <Text style={styles.playerName}>
                        {item.name}
                        {isWinner && ' (Winner)'}
                    </Text>
                </View>
                <Text style={[styles.playerScore, { color: item.color }]}>
                    {item.points}
                </Text>
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    {state.gameEnded ? 'Game Over!' : 'Scoreboard'}
                </Text>
                {!state.gameEnded && (
                    <Pressable
                        style={styles.menuButton}
                        onPress={() => setShowMenu(true)}
                    >
                        <Text style={styles.menuButtonText}>•••</Text>
                    </Pressable>
                )}
            </View>

            <View
                style={styles.listWrapper}
                onLayout={(e) =>
                    setContainerHeight(e.nativeEvent.layout.height)
                }
            >
                <FlatList
                    data={state.players}
                    keyExtractor={(item) => item.id}
                    renderItem={renderPlayer}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={scrollEnabled}
                    onContentSizeChange={(_, height) =>
                        setContentHeight(height)
                    }
                />
            </View>

            {/* Game Ended Actions */}
            {state.gameEnded && (
                <View style={styles.endedActions}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.endedButton,
                            styles.playAgainButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handlePlayAgain}
                    >
                        <Text style={styles.playAgainText}>Play Again</Text>
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [
                            styles.endedButton,
                            styles.newGameButton,
                            pressed && styles.buttonPressed,
                        ]}
                        onPress={handleNewGameFromEnd}
                    >
                        <Text style={styles.newGameText}>New Game</Text>
                    </Pressable>
                </View>
            )}

            <Modal
                visible={selectedPlayer !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedPlayer(null)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setSelectedPlayer(null)}
                >
                    <Pressable style={styles.modalContent} onPress={() => {}}>
                        <View
                            style={[
                                styles.modalPlayerDot,
                                { backgroundColor: selectedPlayer?.color },
                            ]}
                        />
                        <Text style={styles.modalTitle}>
                            {selectedPlayer?.name}
                        </Text>
                        <Text style={styles.modalSubtitle}>
                            Current score: {selectedPlayer?.points}
                        </Text>

                        <TextInput
                            style={styles.pointsInput}
                            placeholder="0"
                            placeholderTextColor={theme.colors.textMuted}
                            keyboardType="number-pad"
                            value={pointsInput}
                            onChangeText={setPointsInput}
                            autoFocus
                        />

                        <View style={styles.modalButtons}>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.modalButton,
                                    styles.subtractButton,
                                    pressed && styles.buttonPressed,
                                ]}
                                onPress={() => handleAddPoints(true)}
                            >
                                <Text style={styles.subtractText}>
                                    − Subtract
                                </Text>
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.modalButton,
                                    styles.addPointsButton,
                                    pressed && styles.buttonPressed,
                                ]}
                                onPress={() => handleAddPoints(false)}
                            >
                                <Text style={styles.addPointsText}>+ Add</Text>
                            </Pressable>
                        </View>

                        <Pressable
                            style={styles.resetButton}
                            onPress={handleResetPlayer}
                        >
                            <Text style={styles.resetText}>Reset to 0</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>

            <Modal
                visible={showMenu}
                transparent
                animationType="fade"
                onRequestClose={() => setShowMenu(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setShowMenu(false)}
                >
                    <Pressable style={styles.menuContent} onPress={() => {}}>
                        <Text style={styles.menuTitle}>Game Menu</Text>

                        <Pressable
                            style={styles.menuItem}
                            onPress={() => {
                                saveGame();
                                setShowMenu(false);
                                Alert.alert(
                                    'Saved!',
                                    'Game saved successfully'
                                );
                            }}
                        >
                            <Text style={styles.menuItemText}>Save Game</Text>
                        </Pressable>

                        <Pressable
                            style={styles.menuItem}
                            onPress={handleResetAll}
                        >
                            <Text style={styles.menuItemText}>
                                Reset All Scores
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.menuItem}
                            onPress={handleEndGame}
                        >
                            <Text style={styles.menuItemText}>End Game</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.menuItem, styles.quitItem]}
                            onPress={handleQuit}
                        >
                            <Text
                                style={[styles.menuItemText, styles.quitText]}
                            >
                                Quit Game
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.cancelItem}
                            onPress={() => setShowMenu(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.surface,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: theme.colors.text,
    },
    menuButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuButtonText: {
        fontSize: 22,
    },
    listWrapper: {
        flex: 1,
    },
    listContent: {
        padding: theme.spacing.md,
    },
    playerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 2,
    },
    playerCardPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    winnerCard: {
        backgroundColor: theme.colors.accent + '40',
        borderColor: theme.colors.accentDark,
        borderWidth: 3,
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    colorDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: theme.spacing.sm,
    },
    playerName: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text,
    },
    playerScore: {
        fontSize: 36,
        fontWeight: '800',
    },
    endedActions: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
    },
    endedButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
    },
    playAgainButton: {
        backgroundColor: theme.colors.successDark,
    },
    playAgainText: {
        color: theme.colors.textOnPrimary,
        fontSize: 18,
        fontWeight: '700',
    },
    newGameButton: {
        backgroundColor: theme.colors.surface,
        borderWidth: 2,
        borderColor: theme.colors.border,
    },
    newGameText: {
        color: theme.colors.text,
        fontSize: 18,
        fontWeight: '700',
    },
    buttonPressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.9,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        width: '85%',
        maxWidth: 340,
        alignItems: 'center',
        ...theme.shadows.card,
    },
    modalPlayerDot: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginBottom: theme.spacing.sm,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.xs,
    },
    modalSubtitle: {
        fontSize: 16,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    pointsInput: {
        width: '100%',
        backgroundColor: '#F5F0FC',
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        fontSize: 32,
        fontWeight: '700',
        textAlign: 'center',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
    },
    subtractButton: {
        backgroundColor: theme.colors.dangerDark,
    },
    subtractText: {
        color: theme.colors.textOnPrimary,
        fontSize: 17,
        fontWeight: '700',
    },
    addPointsButton: {
        backgroundColor: theme.colors.successDark,
    },
    addPointsText: {
        color: theme.colors.textOnPrimary,
        fontSize: 17,
        fontWeight: '700',
    },
    resetButton: {
        paddingVertical: theme.spacing.sm,
        alignItems: 'center',
    },
    resetText: {
        color: theme.colors.textLight,
        fontSize: 15,
        fontWeight: '500',
    },
    menuContent: {
        backgroundColor: theme.colors.backgroundLight,
        borderRadius: theme.borderRadius.xl,
        width: '85%',
        maxWidth: 340,
        overflow: 'hidden',
        ...theme.shadows.card,
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.colors.text,
        textAlign: 'center',
        padding: theme.spacing.lg,
    },
    menuItem: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    menuItemText: {
        fontSize: 17,
        color: theme.colors.text,
        textAlign: 'center',
        fontWeight: '600',
    },
    quitItem: {
        backgroundColor: theme.colors.danger + '20',
    },
    quitText: {
        color: theme.colors.dangerDark,
    },
    cancelItem: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    cancelText: {
        fontSize: 17,
        color: theme.colors.textLight,
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default BoardScreen;
