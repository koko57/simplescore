import { Pressable, Text, TextInput, View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { RefObject } from 'react';

type AddPlayerInputProps = {
    inputRef: RefObject<TextInput | null>;
    addPlayer: () => void;
    playerName: string;
    setPlayerName: (name: string) => void;
};

export const AddPlayerInput = ({
    inputRef,
    addPlayer,
    playerName,
    setPlayerName,
}: AddPlayerInputProps) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Player name..."
                placeholderTextColor={theme.colors.textMuted}
                value={playerName}
                onChangeText={setPlayerName}
                onSubmitEditing={addPlayer}
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
                onPress={addPlayer}
                disabled={!playerName.trim()}
            >
                <Text style={styles.addButtonText}>+</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        gap: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
    },
    input: {
        flex: 1,
        height: 56,
        backgroundColor: theme.colors.backgroundLight,
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
});
