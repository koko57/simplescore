import { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useGame } from '../src/context/GameContext';
import { Player } from '../src/types';

const STORAGE_KEY = '@scoreboard_game';

export default function HomeScreen() {
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

  const handleNewGame = async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch({ type: 'NEW_GAME' });
    router.push('/add-players');
  };

  const handleLoadGame = async (): Promise<void> => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const players: Player[] = JSON.parse(saved);
        dispatch({ type: 'LOAD_GAME', payload: { players } });
        router.push('/board');
      }
    } catch {
      Alert.alert('Error', 'Failed to load saved game');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>ScoreBoard</Text>
        <Text style={styles.subtitle}>Track scores for your games</Text>

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
              Load Game
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 64,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  primaryButton: {
    backgroundColor: '#333',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#eee',
  },
  textDisabled: {
    color: '#bbb',
  },
});
