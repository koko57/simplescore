import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { theme } from '@/constants/theme';
import { Player } from '@/types';

type AddPointsModalProps = {
    selectedPlayer: Player | null;
    onClose: () => void;
    addPoints: (value: string, subtract: boolean) => void;
};

export const AddPointsModal = ({
    selectedPlayer,
    addPoints,
    onClose,
}: AddPointsModalProps) => {
    const [value, setValue] = useState('');

    const handleAddPoints = (subtract: boolean) => {
        addPoints(value, subtract);
        setValue('');
    };

    return (
        <Modal
            visible={selectedPlayer !== null}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.modalContent}>
                    <View
                        style={[
                            styles.modalPlayerDot,
                            { backgroundColor: selectedPlayer?.color },
                        ]}
                    />
                    <Text style={styles.modalTitle}>
                        {selectedPlayer?.name}
                    </Text>
                    <Text style={styles.modalSubtitle}>
                        Current score: {selectedPlayer?.score}
                    </Text>

                    <TextInput
                        style={styles.pointsInput}
                        placeholder="0"
                        placeholderTextColor={theme.colors.textMuted}
                        keyboardType="number-pad"
                        value={value}
                        onChangeText={setValue}
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
                            <Text style={styles.subtractText}>−</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.modalButton,
                                styles.addPointsButton,
                                pressed && styles.buttonPressed,
                            ]}
                            onPress={() => handleAddPoints(false)}
                        >
                            <Text style={styles.addPointsText}>+</Text>
                        </Pressable>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    buttonPressed: {
        transform: [{ scale: 0.97 }],
        opacity: 0.9,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        width: '85%',
        maxWidth: 340,
        alignItems: 'center',
        ...theme.shadows.card,
    },
    modalPlayerDot: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginBottom: theme.spacing.sm,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.xs,
    },
    modalSubtitle: {
        fontSize: 16,
        color: theme.colors.textLight,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    pointsInput: {
        width: '100%',
        backgroundColor: theme.colors.backgroundLight,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        fontSize: 32,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
    },
    subtractButton: {
        backgroundColor: theme.colors.dangerDark,
    },
    subtractText: {
        color: theme.colors.textOnPrimary,
        fontSize: 17,
        fontWeight: '700',
    },
    addPointsButton: {
        backgroundColor: theme.colors.successDark,
    },
    addPointsText: {
        color: theme.colors.textOnPrimary,
        fontSize: 17,
        fontWeight: '700',
    },
});
