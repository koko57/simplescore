import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '@/constants/theme';
import { Player } from '@/types';

type PlayerNameRowProps = {
    item: Player;
    isEditing: boolean;
    editName: string;
    setEditName: (name: string) => void;
    handleSaveEdit: () => void;
    handleStartEdit: (player: Player) => void;
    onRemove: (id: string) => void;
};

export const PlayerNameRow = ({
    item,
    isEditing,
    editName,
    setEditName,
    handleSaveEdit,
    handleStartEdit,
    onRemove,
}: PlayerNameRowProps) => {
    return (
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
            <Pressable
                style={({ pressed }) => [
                    styles.actionButton,
                    isEditing && styles.saveButton,
                    pressed && styles.actionButtonPressed,
                ]}
                onPress={isEditing ? handleSaveEdit : () => onRemove(item.id)}
                hitSlop={8}
            >
                <Text style={styles.actionIcon}>{isEditing ? '✓' : '✕'}</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
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
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.danger,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.spacing.sm,
    },
    saveButton: {
        backgroundColor: theme.colors.successDark,
    },
    actionButtonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.95 }],
    },
    actionIcon: {
        color: theme.colors.textOnPrimary,
        fontSize: 14,
        fontWeight: '700',
    },
});
