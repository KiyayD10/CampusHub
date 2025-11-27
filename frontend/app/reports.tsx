import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function ReportsScreen() {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
            <Stack.Screen options={{
                headerShown: true,
                title: "Reports",
                headerStyle: { backgroundColor: theme.colors.background },
                headerTintColor: theme.colors.text,
                headerShadowVisible: false,
            }} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>Reports</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.subtext }]}>View your academic performance</Text>
                </View>

                <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
                    <View style={[styles.cardIcon, { backgroundColor: theme.dark ? '#3730a3' : '#F3E8FF' }]}>
                        <Ionicons name="stats-chart" size={24} color={theme.colors.primary} />
                    </View>
                    <View>
                        <Text style={[styles.cardTitle, { color: theme.colors.subtext }]}>GPA Overview</Text>
                        <Text style={[styles.cardValue, { color: theme.colors.text }]}>3.8</Text>
                    </View>
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
    card: {
        padding: 20,
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
    },
    cardIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center"
    },
    cardTitle: { fontSize: 14, fontWeight: "600" },
    cardValue: { fontSize: 24, fontWeight: "bold" }
});
