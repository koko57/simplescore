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
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';
import { useGame } from '../src/context/GameContext';
import { MAX_PLAYERS } from '../src/constants/colors';
import { Player } from '../src/types';

export default function AddPlayersScreen() {
  const router = useRouter();
  const { state, dispatch } = useGame();
  const [playerName, setPlayerName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const inputRef = useRef<TextInput>(null);
  const swipeableRefs = useRef<Map<string, Swipeable>>(new Map());

  const handleAddPlayer = (): void => {
    const trimmedName = playerName.trim();
    if (!trimmedName) return;

    if (state.players.length >= MAX_PLAYERS) {
      Alert.alert('Limit Reached', `Maximum ${MAX_PLAYERS} players allowed`);
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
      Alert.alert('Not Enough Players', 'Add at least 2 players to start');
      return;
    }

    dispatch({ type: 'START_GAME' });
    router.replace('/board');
  };

  const renderRightActions = (id: string) => (
    <Pressable
      style={styles.deleteAction}
      onPress={() => handleRemovePlayer(id)}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </Pressable>
  );

  const renderPlayer = ({ item }: { item: Player }) => {
    const isEditing = editingId === item.id;

    return (
      <Swipeable
        ref={(ref) => {
          if (ref) {
            swipeableRefs.current.set(item.id, ref);
          }
        }}
        renderRightActions={() => renderRightActions(item.id)}
        onSwipeableOpen={() => handleRemovePlayer(item.id)}
        friction={2}
      >
        <View style={styles.playerItem}>
          <View style={[styles.colorDot, { backgroundColor: item.color }]} />
          {isEditing ? (
            <TextInput
              style={styles.editInput}
              value={editName}
              onChangeText={setEditName}
              onBlur={handleSaveEdit}
              onSubmitEditing={handleSaveEdit}
              autoFocus
              selectTextOnFocus
            />
          ) : (
            <Pressable
              style={styles.playerNameContainer}
              onPress={() => handleStartEdit(item)}
            >
              <Text style={styles.playerName}>{item.name}</Text>
              <Text style={styles.editHint}>Tap to edit</Text>
            </Pressable>
          )}
        </View>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Enter player name"
            placeholderTextColor="#999"
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
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.playerCount}>
            {state.players.length} / {MAX_PLAYERS} players
          </Text>

          {state.players.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No players yet</Text>
              <Text style={styles.emptySubtext}>
                Add at least 2 players to start
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
              state.players.length < 2 && styles.startButtonDisabled,
            ]}
            onPress={handleStartGame}
            disabled={state.players.length < 2}
          >
            <Text
              style={[
                styles.startButtonText,
                state.players.length < 2 && styles.startButtonTextDisabled,
              ]}
            >
              Start Game
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#333',
    paddingHorizontal: 24,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  playerCount: {
    fontSize: 14,
    color: '#999',
    marginVertical: 12,
  },
  listContent: {
    paddingBottom: 16,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  playerNameContainer: {
    flex: 1,
  },
  playerName: {
    fontSize: 17,
    color: '#333',
    fontWeight: '500',
  },
  editHint: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 2,
  },
  editInput: {
    flex: 1,
    fontSize: 17,
    color: '#333',
    fontWeight: '500',
    padding: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  deleteAction: {
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 8,
    borderRadius: 10,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  startButton: {
    backgroundColor: '#43A047',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonDisabled: {
    backgroundColor: '#ccc',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  startButtonTextDisabled: {
    color: '#fff',
  },
});
