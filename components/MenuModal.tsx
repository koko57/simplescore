import { Modal, Pressable, Text, View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

type MenuModalProps = {
    visible: boolean;
    onClose: () => void;
    saveGame: () => void;
    resetScores: () => void;
    endGame: () => void;
    quitGame: () => void;
};

export const MenuModal = ({
    visible,
    onClose,
    saveGame,
    resetScores,
    endGame,
    quitGame,
}: MenuModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={styles.menuWrapper}>
                    <View style={styles.menuContent}>
                        <Text style={styles.menuTitle}>Game Menu</Text>

                        <Pressable style={styles.menuItem} onPress={saveGame}>
                            <Text style={styles.menuItemText}>Save Game</Text>
                        </Pressable>

                        <Pressable
                            style={styles.menuItem}
                            onPress={resetScores}
                        >
                            <Text style={styles.menuItemText}>
                                Reset All Scores
                            </Text>
                        </Pressable>

                        <Pressable style={styles.menuItem} onPress={endGame}>
                            <Text style={styles.menuItemText}>End Game</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.menuItem, styles.quitItem]}
                            onPress={quitGame}
                        >
                            <Text
                                style={[styles.menuItemText, styles.quitText]}
                            >
                                Quit Game
                            </Text>
                        </Pressable>

                        <Pressable style={styles.cancelItem} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuWrapper: {
        borderRadius: theme.borderRadius.xl,
        width: '85%',
        maxWidth: 340,
        ...theme.shadows.card,
    },
    menuContent: {
        borderRadius: theme.borderRadius.xl,
        backgroundColor: theme.colors.surface,
        overflow: 'hidden',
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.colors.text,
        textAlign: 'center',
        padding: theme.spacing.lg,
    },
    menuItem: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    menuItemText: {
        fontSize: 17,
        color: theme.colors.text,
        textAlign: 'center',
        fontWeight: '600',
    },
    quitItem: {
        backgroundColor: theme.colors.danger + '20',
    },
    quitText: {
        color: theme.colors.dangerDark,
    },
    cancelItem: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        backgroundColor: theme.colors.background,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    cancelText: {
        fontSize: 17,
        color: theme.colors.textLight,
        textAlign: 'center',
        fontWeight: '600',
    },
});
