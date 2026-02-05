import { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
    Alert,
    Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '@/context/GameContext';
import { MAX_PLAYERS } from '@/constants/colors';
import { theme } from '@/constants/theme';
import { ACTION_TYPES } from '@/constants/actionTypes';
import { Player } from '@/types';
import { PlayerNameRow } from '@components/PlayerNameRow';
import { AddPlayerInput } from '@components/AddPlayerInput';
import { AddPlayerFooter } from '@components/AddPlayerFooter';

const AddPlayersScreen = () => {
    const router = useRouter();
    const { state, dispatch } = useGame();
    const [playerName, setPlayerName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const inputRef = useRef<TextInput>(null);

    const notEnoughPlayers = state.players.length < 2;

    const handleAddPlayer = (): void => {
        const trimmedName = playerName.trim();
        if (!trimmedName) return;

        if (state.players.length >= MAX_PLAYERS) {
            Alert.alert(
                'Limit Reached',
                `Maximum ${MAX_PLAYERS} players allowed`,
            );
            return;
        }

        dispatch({ type: ACTION_TYPES.ADD_PLAYER, payload: { name: trimmedName } });
        setPlayerName('');
        inputRef.current?.focus();
    };

    const handleRemovePlayer = (id: string): void => {
        dispatch({ type: ACTION_TYPES.REMOVE_PLAYER, payload: { id } });
    };

    const handleStartEdit = (player: Player): void => {
        setEditingId(player.id);
        setEditName(player.name);
    };

    const handleSaveEdit = (): void => {
        if (!editingId || !editName.trim()) {
            setEditingId(null);
            return;
        }

        dispatch({
            type: ACTION_TYPES.EDIT_PLAYER,
            payload: { id: editingId, name: editName.trim() },
        });
        setEditingId(null);
        setEditName('');
        Keyboard.dismiss();
    };

    const handleStartGame = (): void => {
        if (notEnoughPlayers) {
            Alert.alert(
                'Not Enough Players',
                'Add at least 2 players to start',
            );
            return;
        }

        router.replace('/board');
    };

    const renderPlayer = ({ item }: { item: Player }) => {
        const isEditing = editingId === item.id;

        return (
            <PlayerNameRow
                item={item}
                isEditing={isEditing}
                editName={editName}
                setEditName={setEditName}
                handleSaveEdit={handleSaveEdit}
                handleStartEdit={handleStartEdit}
                onRemove={handleRemovePlayer}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <AddPlayerInput
                inputRef={inputRef}
                addPlayer={handleAddPlayer}
                playerName={playerName}
                setPlayerName={setPlayerName}
            />

            <View style={styles.listContainer}>
                <View style={styles.countContainer}>
                    <Text style={styles.playerCount}>
                        {state.players.length} / {MAX_PLAYERS}
                    </Text>
                    <Text style={styles.playerLabel}>players</Text>
                </View>

                {state.players.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No players yet!</Text>
                        <Text style={styles.emptySubtext}>
                            Add at least 2 players to start the game
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={state.players}
                        keyExtractor={(item) => item.id}
                        renderItem={renderPlayer}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            <AddPlayerFooter
                handleStartGame={handleStartGame}
                disabled={notEnoughPlayers}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: theme.spacing.md,
    },
    countContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: theme.spacing.xs,
        marginVertical: theme.spacing.md,
    },
    playerCount: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.text,
    },
    playerLabel: {
        fontSize: 16,
        color: theme.colors.textLight,
        fontWeight: '500',
    },
    listContent: {
        paddingBottom: theme.spacing.md,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    emptyText: {
        fontSize: 22,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    emptySubtext: {
        fontSize: 16,
        color: theme.colors.textLight,
        textAlign: 'center',
    },
});

export default AddPlayersScreen;
