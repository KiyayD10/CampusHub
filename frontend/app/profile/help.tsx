import { View, Text, StyleSheet, ScrollView, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";

export default function HelpCenterScreen() {
    const { theme } = useTheme();

    const handleEmailSupport = () => {
        Linking.openURL("mailto:support@campushub.com");
    };

    const handleCallSupport = () => {
        Linking.openURL("tel:+1234567890");
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.colors.card }]}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Help Center</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Search Bar Placeholder (Visual only for now) */}
                <View style={[styles.searchBar, { backgroundColor: theme.colors.card }]}>
                    <Ionicons name="search" size={20} color={theme.colors.subtext} />
                    <Text style={[styles.searchText, { color: theme.colors.subtext }]}>Search for help...</Text>
                </View>

                {/* Quick Actions */}
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Contact Us</Text>
                <View style={styles.actionsRow}>
                    <Pressable
                        style={[styles.actionCard, { backgroundColor: theme.colors.card }]}
                        onPress={handleEmailSupport}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#DBEAFE' }]}>
                            <Ionicons name="mail" size={24} color="#3B82F6" />
                        </View>
                        <Text style={[styles.actionLabel, { color: theme.colors.text }]}>Email Support</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.actionCard, { backgroundColor: theme.colors.card }]}
                        onPress={handleCallSupport}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
                            <Ionicons name="call" size={24} color="#10B981" />
                        </View>
                        <Text style={[styles.actionLabel, { color: theme.colors.text }]}>Call Us</Text>
                    </Pressable>
                </View>

                {/* FAQ Section */}
                <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 32 }]}>Frequently Asked Questions</Text>

                <FAQItem
                    question="How do I reset my password?"
                    answer="You can reset your password by going to the login screen and tapping on 'Forgot Password'. Follow the instructions sent to your email."
                    theme={theme}
                    delay={100}
                />
                <FAQItem
                    question="How do I change my major?"
                    answer="To change your major, please contact the administration office or submit a request through the 'Reports' tab."
                    theme={theme}
                    delay={200}
                />
                <FAQItem
                    question="Where can I view my attendance?"
                    answer="Your attendance statistics are displayed on the Profile screen. You can also view detailed reports in the Reports tab."
                    theme={theme}
                    delay={300}
                />
                <FAQItem
                    question="How do I enable dark mode?"
                    answer="Go to Profile > General > Dark Mode and toggle the switch to enable dark mode."
                    theme={theme}
                    delay={400}
                />

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function FAQItem({ question, answer, theme, delay }: any) {
    const [expanded, setExpanded] = useState(false);

    return (
        <Animated.View entering={FadeInDown.delay(delay)} style={[styles.faqItem, { backgroundColor: theme.colors.card }]}>
            <Pressable onPress={() => setExpanded(!expanded)} style={styles.faqHeader}>
                <Text style={[styles.question, { color: theme.colors.text }]}>{question}</Text>
                <Ionicons name={expanded ? "chevron-up" : "chevron-down"} size={20} color={theme.colors.subtext} />
            </Pressable>
            {expanded && (
                <Text style={[styles.answer, { color: theme.colors.subtext }]}>{answer}</Text>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backBtn: {
        padding: 8,
        borderRadius: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    content: {
        padding: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 32,
    },
    searchText: {
        marginLeft: 12,
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 16,
    },
    actionCard: {
        flex: 1,
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    faqItem: {
        marginBottom: 12,
        borderRadius: 16,
        overflow: 'hidden',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    question: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        marginRight: 12,
    },
    answer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        fontSize: 14,
        lineHeight: 20,
    },
});
