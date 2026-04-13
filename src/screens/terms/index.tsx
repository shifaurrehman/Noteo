import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/header/Header';
import { useTheme } from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

export default function TermsOfServiceScreen() {
    const { colors, typography } = useTheme();
    const router = useRouter();
    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
            <Header
                title="Terms of Service"
                onBack={handleBack}
                titleStyle={{ color: colors.primary }}
            />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textMain, fontSize: typography.h3 }]}>1. Acceptance of Terms</Text>
                    <Text style={[styles.text, { color: colors.textSecondary, fontSize: typography.body }]}>
                        By accessing and using Noteo, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textMain, fontSize: typography.h3 }]}>2. Use of Service</Text>
                    <Text style={[styles.text, { color: colors.textSecondary, fontSize: typography.body }]}>
                        You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to use the service only for lawful purposes.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textMain, fontSize: typography.h3 }]}>3. Data Privacy</Text>
                    <Text style={[styles.text, { color: colors.textSecondary, fontSize: typography.body }]}>
                        Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using the service, you agree to the collection and use of information in accordance with our policy.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textMain, fontSize: typography.h3 }]}>4. Intellectual Property</Text>
                    <Text style={[styles.text, { color: colors.textSecondary, fontSize: typography.body }]}>
                        The service and its original content, features, and functionality are and will remain the exclusive property of Noteo and its licensors.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textMain, fontSize: typography.h3 }]}>5. Limitation of Liability</Text>
                    <Text style={[styles.text, { color: colors.textSecondary, fontSize: typography.body }]}>
                        In no event shall Noteo be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textMain, fontSize: typography.h3 }]}>6. Changes to Terms</Text>
                    <Text style={[styles.text, { color: colors.textSecondary, fontSize: typography.body }]}>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this screen.
                    </Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
    },
    text: {
        fontSize: 15,
        lineHeight: 22,
    },
});
