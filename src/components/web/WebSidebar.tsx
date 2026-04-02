import { Category } from '@/types/category/category.types';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SidebarProps {
    categories: Category[];
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string | null) => void;
    userEmail?: string;
    userName?: string;
}

export const WebSidebar: React.FC<SidebarProps> = ({
    categories,
    selectedCategory,
    onSelectCategory,
    userEmail = 'jane@example.ai',
    userName = 'Jane Doe',
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.appName}>Noteo</Text>
            </View>

            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView style={styles.categoriesList}>
                <TouchableOpacity
                    style={[styles.categoryItem, selectedCategory === null && styles.activeCategory]}
                    onPress={() => onSelectCategory(null)}
                >
                    <MaterialIcons name="folder" size={20} color={selectedCategory === null ? '#fff' : '#888'} />
                    <Text style={[styles.categoryText, selectedCategory === null && styles.activeCategoryText]}>
                        All Projects
                    </Text>
                </TouchableOpacity>

                {categories.map((category) => (
                    !category.isDeleted &&
                    <TouchableOpacity
                        key={category.id}
                        style={[styles.categoryItem, selectedCategory === category.id && styles.activeCategory]}
                        onPress={() => onSelectCategory(category.id)}
                    >
                        <MaterialIcons name="folder" size={20} color={selectedCategory === category.id ? '#fff' : '#888'} />
                        <Text style={[styles.categoryText, selectedCategory === category.id && styles.activeCategoryText]}>
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.userSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
                </View>
                <View>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userEmail}>{userEmail}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 250,
        backgroundColor: '#1e1e1e', // Dark background from Stitch
        padding: 20,
        height: '100%',
        borderRightWidth: 1,
        borderRightColor: '#333',
    },
    header: {
        marginBottom: 30,
    },
    appName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    sectionTitle: {
        color: '#888',
        fontSize: 12,
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    categoriesList: {
        flex: 1,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 4,
    },
    activeCategory: {
        backgroundColor: '#333',
    },
    categoryText: {
        marginLeft: 10,
        color: '#aaa',
        fontSize: 14,
    },
    activeCategoryText: {
        color: '#fff',
        fontWeight: '500',
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4a90e2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    userName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    userEmail: {
        color: '#888',
        fontSize: 12,
    },
});
