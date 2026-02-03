import { useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    FlatList,
    Alert,
    Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGame } from '../src/context/GameContext';
import { MAX_PLAYERS } from '../src/constants/colors';
import { theme } from '../src/constants/theme';
import { Player } from '../src/types';
import PlayerNameRow from '../components/PlayerNameRow';

const AddPlayersScreen = () => {
    const router = useRouter();
    const { state, dispatch } = useGame();
    const [playerName, setPlayerName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const inputRef = useRef<TextInput>(null);

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

        dispatch({ type: 'ADD_PLAYER', payload: { name: trimmedName } });
        setPlayerName('');
        inputRef.current?.focus();
    };

    const handleRemovePlayer = (id: string): void => {
        dispatch({ type: 'REMOVE_PLAYER', payload: { id } });
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
            type: 'EDIT_PLAYER',
            payload: { id: editingId, name: editName.trim() },
        });
        setEditingId(null);
        setEditName('');
        Keyboard.dismiss();
    };

    const handleStartGame = (): void => {
        if (state.players.length < 2) {
            Alert.alert(
                'Not Enough Players',
                'Add at least 2 players to start',
            );
            return;
        }

        dispatch({ type: 'START_GAME' });
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
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.inputContainer}>
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder="Player name..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={playerName}
                    onChangeText={setPlayerName}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                    autoCapitalize="words"
                    maxLength={20}
                />
                <Pressable
                    style={({ pressed }) => [
                        styles.addButton,
                        pressed && styles.buttonPressed,
                        !playerName.trim() && styles.addButtonDisabled,
                    ]}
                    onPress={handleAddPlayer}
                    disabled={!playerName.trim()}
                >
                    <Text style={styles.addButtonText}>+</Text>
                </Pressable>
            </View>

            <View style={styles.listContainer}>
                <View style={styles.countContainer}>
                    <Text style={styles.playerCount}>
                        {state.players.length} / {MAX_PLAYERS}
                    </Text>
                    <Text style={styles.playerLabel}>players</Text>
                </View>

                {state.players.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                            No players yet!
                        </Text>
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

            <View style={styles.footer}>
                <Pressable
                    style={({ pressed }) => [
                        styles.startButton,
                        pressed && styles.buttonPressed,
                        state.players.length < 2 &&
                        styles.startButtonDisabled,
                    ]}
                    onPress={handleStartGame}
                    disabled={state.players.length < 2}
                >
                    <Text
                        style={[
                            styles.startButtonText,
                            state.players.length < 2 &&
                            styles.startButtonTextDisabled,
                        ]}
                    >
                        Start Game
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    container: {
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
    },
    input: {
        flex: 1,
        height: 56,
        backgroundColor: '#F5F0FC',
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        fontSize: 18,
        color: theme.colors.text,
        fontWeight: '500',
    },
    addButton: {
        width: 56,
        height: 56,
        backgroundColor: theme.colors.secondaryDark,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonDisabled: {
        backgroundColor: theme.colors.border,
    },
    addButtonText: {
        color: theme.colors.textOnPrimary,
        fontSize: 28,
        fontWeight: '600',
    },
    buttonPressed: {
        transform: [{ scale: 0.95 }],
        opacity: 0.9,
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
    playerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        ...theme.shadows.soft,
    },
    colorDot: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: theme.spacing.md,
    },
    playerNameContainer: {
        flex: 1,
    },
    playerName: {
        fontSize: 18,
        color: theme.colors.text,
        fontWeight: '600',
    },
    editHint: {
        fontSize: 13,
        color: theme.colors.textMuted,
        marginTop: 2,
    },
    editInput: {
        flex: 1,
        fontSize: 18,
        color: theme.colors.text,
        fontWeight: '600',
        padding: 0,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary,
    },
    deleteAction: {
        backgroundColor: theme.colors.danger,
        justifyContent: 'center',
        alignItems: 'center',
        width: 90,
        marginBottom: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
    },
    deleteText: {
        color: theme.colors.textOnPrimary,
        fontWeight: '600',
        fontSize: 15,
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
    footer: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
    },
    startButton: {
        backgroundColor: theme.colors.successDark,
        paddingVertical: 18,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        ...theme.shadows.soft,
    },
    startButtonDisabled: {
        backgroundColor: theme.colors.border,
        shadowOpacity: 0,
        elevation: 0,
    },
    startButtonText: {
        color: theme.colors.textOnPrimary,
        fontSize: 20,
        fontWeight: '700',
    },
    startButtonTextDisabled: {
        color: theme.colors.textMuted,
    },
});

export default AddPlayersScreen;
