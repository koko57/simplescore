import { Pressable, Text, View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

type EndGameFooterProps = {
    playAgain: () => void;
    newGame: () => void;
};

export const EndGameFooter = ({ playAgain, newGame }: EndGameFooterProps) => {
    return (
        <View style={styles.endedActions}>
            <Pressable
                style={({ pressed }) => [
                    styles.endedButton,
                    styles.playAgainButton,
                    pressed && styles.buttonPressed,
                ]}
                onPress={playAgain}
            >
                <Text style={styles.playAgainText}>Play Again</Text>
            </Pressable>
            <Pressable
                style={({ pressed }) => [
                    styles.endedButton,
                    styles.newGameButton,
                    pressed && styles.buttonPressed,
                ]}
                onPress={newGame}
            >
                <Text style={styles.newGameText}>New Game</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
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
});
