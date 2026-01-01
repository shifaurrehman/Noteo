// src/components/common/SearchBar.tsx
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onClear?: () => void;
    placeholder?: string;
    colors: {
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        primary?: string;
    };
}
const { width } = Dimensions.get('window');
export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    onClear,
    placeholder = 'Search...',
    colors,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View style={styles.container}>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: isFocused ? colors.primary : colors.border, }]}>
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={colors.textSecondary}
                    value={value}
                    onChangeText={onChangeText}
                    style={[styles.input, { color: colors.text }]}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />

                {value.length > 0 && (
                    <TouchableOpacity
                        style={styles.clearButton}
                        onPress={onClear ? onClear : () => onChangeText('')}
                    >
                        <Ionicons name="close-circle" size={30} color={colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        alignSelf: "center",
        width: width,
        height: width * 0.18,
        alignItems: "center",
        justifyContent: "center"
    },
    inputWrapper: {
        position: 'relative',
        borderRadius: (width * 0.21) / 2, // since height = width * 0.21
        borderWidth: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
    },
    input: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        fontSize: 16,
    },
    clearButton: {
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: [{ translateY: -20 }], // half of icon size (20 / 2)
        padding: 4,
    },
});
