import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

export default function TermsScreen() {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.colors.card }]}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Terms of Service</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.lastUpdated, { color: theme.colors.subtext }]}>Last updated: November 28, 2025</Text>

                <Text style={[styles.paragraph, { color: theme.colors.text }]}>
                    Please read these terms of service ("Terms", "Terms of Service") carefully before using the CampusHub mobile application (the "Service") operated by CampusHub ("us", "we", or "our").
                </Text>

                <Text style={[styles.heading, { color: theme.colors.text }]}>1. Conditions of Use</Text>
                <Text style={[styles.paragraph, { color: theme.colors.text }]}>
                    We will provide their services to you, which are subject to the conditions stated below in this document. Every time you visit this app, use its services or make a purchase, you accept the following conditions. This is why we urge you to read them carefully.
                </Text>

                <Text style={[styles.heading, { color: theme.colors.text }]}>2. Privacy Policy</Text>
                <Text style={[styles.paragraph, { color: theme.colors.text }]}>
                    Before you continue using our website we advise you to read our privacy policy regarding our user data collection. It will help you better understand our practices.
                </Text>

                <Text style={[styles.heading, { color: theme.colors.text }]}>3. Copyright</Text>
                <Text style={[styles.paragraph, { color: theme.colors.text }]}>
                    Content published on this app (digital downloads, images, texts, graphics, logos) is the property of CampusHub and/or its content creators and protected by international copyright laws.
                </Text>

                <Text style={[styles.heading, { color: theme.colors.text }]}>4. Communications</Text>
                <Text style={[styles.paragraph, { color: theme.colors.text }]}>
                    The entire communication with us is electronic. Every time you send us an email or visit our website, you are going to be communicating with us. You hereby consent to receive communications from us.
                </Text>

                <Text style={[styles.heading, { color: theme.colors.text }]}>5. Applicable Law</Text>
                <Text style={[styles.paragraph, { color: theme.colors.text }]}>
                    By visiting this app, you agree that the laws of the your location, without regard to principles of conflict laws, will govern these Terms of Service, or any dispute of any sort that might come between CampusHub and you, or its business partners and associates.
                </Text>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
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
    lastUpdated: {
        fontSize: 14,
        marginBottom: 24,
        fontStyle: 'italic',
    },
    heading: {
        fontSize: 18,
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 16,
    },
});
