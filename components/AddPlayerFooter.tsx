import { Pressable, Text, View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

type AddPlayerFooterProps = {
    handleStartGame: () => void;
    disabled: boolean;
};

export const AddPlayerFooter = ({ handleStartGame, disabled }: AddPlayerFooterProps) => {
    return (
        <View style={styles.footer}>
            <Pressable
                style={({ pressed }) => [
                    styles.startButton,
                    pressed && styles.buttonPressed,
                    disabled && styles.startButtonDisabled,
                ]}
                onPress={handleStartGame}
                disabled={disabled}
            >
                <Text
                    style={[
                        styles.startButtonText,
                        disabled && styles.startButtonTextDisabled,
                    ]}
                >
                    Start Game
                </Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
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
    buttonPressed: {
        transform: [{ scale: 0.95 }],
        opacity: 0.9,
    },
});
