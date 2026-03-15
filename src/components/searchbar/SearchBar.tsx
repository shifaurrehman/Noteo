// src/components/common/SearchBar.tsx
import responsive, { useDeviceType, useResponsive } from '@/utilities/responsive';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear?: () => void;
    placeholder?: string;
    colors: {
        surface: string;
        textMain: string;
        textSecondary: string;
        border: string;
        primary?: string;
    };
}
export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    onClear,
    placeholder = 'Search...',
    colors,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const { width } = useResponsive();
    const deviceType = useDeviceType();

    // Dynamically calculate the dimensions based on the device type and screen size
    const { mainHeight, borderRadius, fontSize, iconSize } = useMemo(() => {
        // Base heights depending on device
        const heightMapping = {
            mobile: Math.max(48, responsive.height(52)), // between 48 and scale
            tablet: 56,
            desktop: 60,
            web: 60,
        };

        const calculatedHeight = heightMapping[deviceType] || 48;

        return {
            mainHeight: calculatedHeight,
            borderRadius: calculatedHeight / 2,
            fontSize: responsive.fontSizeAdvanced(16, width),
            iconSize: responsive.iconSize(24, width),
        };
    }, [deviceType, width]);

    return (
        <View style={[styles.container, { height: mainHeight + responsive.padding(20) }]}>
            <View
                style={[
                    styles.inputWrapper,
                    {
                        backgroundColor: colors.surface,
                        borderColor: isFocused ? colors.primary : colors.border,
                        height: mainHeight,
                        borderRadius: borderRadius,
                    }
                ]}
            >
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={colors.textSecondary}
                    value={value}
                    onChangeText={onChangeText}
                    style={[styles.input, { color: colors.textMain, fontSize }]}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                {value.length > 0 && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={onClear ? onClear : () => onChangeText('')}
                    >
                        <Ionicons name="close-circle" size={iconSize} color={colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: responsive.padding(16),
        alignSelf: "center",
        width: "100%",
        maxWidth: 1200,
        justifyContent: "center",
    },
    inputWrapper: {
        position: 'relative',
        borderWidth: 1,
        width: "100%",
        justifyContent: "center",
    },
    input: {
        paddingHorizontal: responsive.padding(20),
        height: "100%",
    },
    clearButton: {
        position: 'absolute',
        right: responsive.padding(12),
        height: "100%",
        justifyContent: "center",
        paddingHorizontal: responsive.padding(4),
    },
});
