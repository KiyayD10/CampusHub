import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function NotificationsScreen() {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
            <Stack.Screen options={{
                headerShown: true,
                title: "Notifications",
                headerStyle: { backgroundColor: theme.colors.background },
                headerTintColor: theme.colors.text,
                headerShadowVisible: false,
            }} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>Notifications</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.subtext }]}>Stay updated with campus news</Text>
                </View>

                <View style={styles.emptyState}>
                    <Ionicons name="notifications-off-outline" size={64} color={theme.colors.border} />
                    <Text style={[styles.emptyText, { color: theme.colors.text }]}>No new notifications</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20 },
    header: { marginBottom: 20 },
    title: { fontSize: 28, fontWeight: "bold" },
    subtitle: { fontSize: 16, marginTop: 4 },
    emptyState: { alignItems: "center", justifyContent: "center", marginTop: 100 },
    emptyText: { fontSize: 18, fontWeight: "600", marginTop: 16 },
});
