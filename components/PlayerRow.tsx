import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Player } from '@/types';
import { theme } from '@/constants/theme';
import { MAX_SCORE } from '@/constants';

type PlayerRowProps = {
    item: Player;
    handlePlayerTap: (item: Player) => void;
    disabled: boolean;
    isWinner: boolean;
};

export const PlayerRow = ({
    item,
    handlePlayerTap,
    disabled,
    isWinner,
}: PlayerRowProps) => {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.playerCard,
                {
                    backgroundColor: item.color + '20',
                    borderColor: item.color,
                },
                pressed && !disabled && styles.playerCardPressed,
                isWinner && styles.winnerCard,
            ]}
            onPress={() => handlePlayerTap(item)}
            disabled={disabled}
        >
            <View style={styles.playerInfo}>
                <View
                    style={[styles.colorDot, { backgroundColor: item.color }]}
                />
                <Text
                    style={styles.playerName}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {item.name}
                    {isWinner && ' (Winner)'}
                </Text>
            </View>
            <View style={styles.scoreContainer}>
                {item.score === MAX_SCORE && (
                    <View style={styles.maxBadge}>
                        <Text style={styles.maxBadgeText}>MAX</Text>
                    </View>
                )}
                <Text style={[styles.playerScore, { color: item.color }]}>
                    {item.score}
                </Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    playerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 2,
    },
    playerCardPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    winnerCard: {
        backgroundColor: theme.colors.accent + '40',
        borderColor: theme.colors.accentDark,
        borderWidth: 3,
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    colorDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: theme.spacing.sm,
    },
    playerName: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text,
        flexShrink: 1,
    },
    playerScore: {
        fontSize: 36,
        fontWeight: '800',
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    maxBadge: {
        backgroundColor: theme.colors.accent,
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: 2,
        marginLeft: 2,
        borderRadius: theme.borderRadius.sm,
    },
    maxBadgeText: {
        color: theme.colors.textOnPrimary,
        fontSize: 10,
        fontWeight: '800',
    },
});
