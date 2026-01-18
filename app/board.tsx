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
import * as Haptics from 'expo-haptics';
import { useGame } from '../src/context/GameContext';
import { Player } from '../src/types';

const STORAGE_KEY = '@scoreboard_game';

export default function BoardScreen() {
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
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.players));
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

  const handlePlayerTap = async (player: Player): Promise<void> => {
    if (state.gameEnded) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPlayer(player);
    setPointsInput('');
  };

  const handleAddPoints = async (subtract: boolean = false): Promise<void> => {
    if (!selectedPlayer) return;

    const points = parseInt(pointsInput, 10);
    if (isNaN(points) || points === 0) {
      setSelectedPlayer(null);
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

  const handleResetPlayer = async (): Promise<void> => {
    if (!selectedPlayer) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
          onPress: async () => {
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Warning
            );
            dispatch({ type: 'RESET_ALL' });
            setShowMenu(false);
          },
        },
      ]
    );
  };

  const handleEndGame = async (): Promise<void> => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Warning
            );
            await AsyncStorage.removeItem(STORAGE_KEY);
            dispatch({ type: 'QUIT_GAME' });
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleNewGameFromEnd = async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await AsyncStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'NEW_GAME' });
    router.replace('/add-players');
  };

  const handlePlayAgain = async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch({ type: 'RESET_ALL' });
  };

  const renderPlayer = ({ item }: { item: Player }) => {
    const isWinner = item.winner && state.gameEnded;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.playerCard,
          { borderLeftColor: item.color },
          pressed && !state.gameEnded && styles.playerCardPressed,
          isWinner && styles.winnerCard,
        ]}
        onPress={() => handlePlayerTap(item)}
        disabled={state.gameEnded}
      >
        <Text style={[styles.playerName, isWinner && styles.winnerName]}>
          {item.name}
          {isWinner && ' 🏆'}
        </Text>
        <Text style={[styles.playerScore, isWinner && styles.winnerScore]}>
          {item.points}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Header */}
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

      {/* Player List */}
      <View
        style={styles.listWrapper}
        onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
      >
        <FlatList
          data={state.players}
          keyExtractor={(item) => item.id}
          renderItem={renderPlayer}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={(_, height) => setContentHeight(height)}
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

      {/* Points Modal */}
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
            <Text style={styles.modalTitle}>{selectedPlayer?.name}</Text>
            <Text style={styles.modalSubtitle}>
              Current: {selectedPlayer?.points} points
            </Text>

            <TextInput
              style={styles.pointsInput}
              placeholder="Enter points"
              placeholderTextColor="#999"
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
                <Text style={styles.subtractText}>− Subtract</Text>
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

      {/* Menu Modal */}
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
                Alert.alert('Saved', 'Game saved successfully');
              }}
            >
              <Text style={styles.menuItemText}>Save Game</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={handleResetAll}>
              <Text style={styles.menuItemText}>Reset All Scores</Text>
            </Pressable>

            <Pressable style={styles.menuItem} onPress={handleEndGame}>
              <Text style={styles.menuItemText}>End Game</Text>
            </Pressable>

            <Pressable
              style={[styles.menuItem, styles.quitItem]}
              onPress={handleQuit}
            >
              <Text style={[styles.menuItemText, styles.quitText]}>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '600',
  },
  listWrapper: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  playerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  playerCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  winnerCard: {
    backgroundColor: '#FFF9C4',
    borderLeftWidth: 5,
    borderLeftColor: '#FFD600',
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  winnerName: {
    color: '#333',
  },
  playerScore: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  winnerScore: {
    color: '#333',
  },
  endedActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  endedButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  playAgainButton: {
    backgroundColor: '#43A047',
  },
  playAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  newGameButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  newGameText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 340,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  pointsInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  subtractButton: {
    backgroundColor: '#FFEBEE',
  },
  subtractText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: '600',
  },
  addPointsButton: {
    backgroundColor: '#E8F5E9',
  },
  addPointsText: {
    color: '#43A047',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  menuContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '85%',
    maxWidth: 340,
    overflow: 'hidden',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  quitItem: {
    backgroundColor: '#FFEBEE',
  },
  quitText: {
    color: '#E53935',
    fontWeight: '600',
  },
  cancelItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  cancelText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
});
