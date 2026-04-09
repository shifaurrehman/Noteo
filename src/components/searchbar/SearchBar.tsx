import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
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
    placeholder = 'Search...',
    colors,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
            <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: isFocused ? colors.primary : colors.border + "60", }]}>
                <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
                <TextInput
                    style={[styles.searchInput, { color: colors.textMain }]}
                    placeholder={placeholder}
                    placeholderTextColor={colors.textSecondary}
                    value={value}
                    onChangeText={onChangeText}
                    returnKeyType="search"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {value.length > 0 && (
                    <TouchableOpacity onPress={() => onChangeText("")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>
    );
};

const styles = StyleSheet.create({
    searchInput: {
        flex: 1,
        fontSize: 15,
        padding: 0,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 999,
        borderWidth: 1,
        gap: 10,
    },
});
