import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

export default function PrivacyScreen() {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.colors.card }]}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Privacy Policy</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={[styles.lastUpdated, { color: theme.colors.subtext }]}>Last updated: November 28, 2025</Text>

                <Text style={[styles.paragraph, { color: theme.colors.text }]}>
                    At CampusHub, accessible from our mobile application, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by CampusHub and how we use it.
                </Text>

                <Text style={[styles.heading, { color: theme.colors.text }]}>Log Files</Text>
                <Text style={[styles.paragraph, { color: theme.colors.text }]}>
                    CampusHub follows a standard procedure of using log files. These files log visitors when they use app. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
                </Text>

                <Text style={[styles.heading, { color: theme.colors.text }]}>Privacy Policies</Text>
                <Text style={[styles.paragraph, { color: theme.colors.text }]}>
                    You may consult this list to find the Privacy Policy for each of the advertising partners of CampusHub.
                </Text>

                <Text style={[styles.heading, { color: theme.colors.text }]}>Third Party Privacy Policies</Text>
                <Text style={[styles.paragraph, { color: theme.colors.text }]}>
                    CampusHub's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.
                </Text>

                <Text style={[styles.heading, { color: theme.colors.text }]}>Children's Information</Text>
                <Text style={[styles.paragraph, { color: theme.colors.text }]}>
                    Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
                </Text>

                <Text style={[styles.heading, { color: theme.colors.text }]}>Consent</Text>
                <Text style={[styles.paragraph, { color: theme.colors.text }]}>
                    By using our app, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
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
