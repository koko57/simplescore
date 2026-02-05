import { useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    FlatList,
    Modal,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGame } from '@/context/GameContext';
import { Player } from '@/types';
import { theme } from '@/constants/theme';
import { AddPointsModal } from '@components/AddPointsModal';
import { PlayerRow } from '@components/PlayerRow';
import { EndGameFooter } from '@components/EndGameFooter';
import { MenuModal } from '@components/MenuModal';

const STORAGE_KEY = '@scoreboard_game';

const BoardScreen = () => {
    const router = useRouter();
    const { state, dispatch } = useGame();
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [showMenu, setShowMenu] = useState(false);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [contentHeight, setContentHeight] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const [gameEnded, setGameEnded] = useState(false);

    // Disable scroll when all content fits on screen
    useEffect(() => {
        if (contentHeight > 0 && containerHeight > 0) {
            setScrollEnabled(contentHeight > containerHeight);
        }
    }, [contentHeight, containerHeight]);

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

    const handlePlayerTap = (player: Player): void => {
        if (gameEnded) return;
        setSelectedPlayer(player);
    };

    const onClose = (): void => setSelectedPlayer(null);

    const handleAddPoints = (
        value: string,
        subtract: boolean = false
    ): void => {
        if (!selectedPlayer) return;

        const points = parseInt(value, 10);
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
        setGameEnded(true);
        setShowMenu(false);
    };

    const handleQuitGame = async (): Promise<void> => {
        Alert.alert(
            'Quit Game',
            'Are you sure? Any unsaved progress will be lost.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Quit',
                    style: 'destructive',
                    onPress: () => {
                        dispatch({ type: 'NEW_GAME' });
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
        setGameEnded(false);
    };

    const playerScores = state.players.map((player) => player.score);

    const renderPlayer = ({ item }: { item: Player }) => {
        const isWinner = gameEnded && item.score === Math.max(...playerScores);

        return (
            <PlayerRow
                item={item}
                handlePlayerTap={handlePlayerTap}
                disabled={gameEnded}
                isWinner={isWinner}
            />
        );
    };

    const handleSaveGame = () => {
        saveGame();
        setShowMenu(false);
        Alert.alert('Saved!', 'Game saved successfully');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    {gameEnded ? 'Game Over!' : 'Scoreboard'}
                </Text>
                {!gameEnded && (
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

            {gameEnded && (
                <EndGameFooter
                    playAgain={handlePlayAgain}
                    newGame={handleNewGameFromEnd}
                />
            )}

            <AddPointsModal
                addPoints={handleAddPoints}
                selectedPlayer={selectedPlayer}
                onClose={onClose}
            />

            <MenuModal
                onClose={() => setShowMenu(false)}
                saveGame={handleSaveGame}
                resetScores={handleResetAll}
                endGame={handleEndGame}
                quitGame={handleQuitGame}
                visible={showMenu}
            />
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
});

export default BoardScreen;
