import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ReportsScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{
                headerShown: true,
                title: "Reports",
                headerStyle: { backgroundColor: '#F3F4F6' },
                headerShadowVisible: false,
            }} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>Reports</Text>
                    <Text style={styles.subtitle}>View your academic performance</Text>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardIcon}>
                        <Ionicons name="stats-chart" size={24} color="#6D28D9" />
                    </View>
                    <View>
                        <Text style={styles.cardTitle}>GPA Overview</Text>
                        <Text style={styles.cardValue}>3.8</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F3F4F6" },
    content: { padding: 20 },
    header: { marginBottom: 20 },
    title: { fontSize: 28, fontWeight: "bold", color: "#1F2937" },
    subtitle: { fontSize: 16, color: "#6B7280", marginTop: 4 },
    card: {
        backgroundColor: "white",
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
        backgroundColor: "#F3E8FF",
        alignItems: "center",
        justifyContent: "center"
    },
    cardTitle: { fontSize: 14, color: "#6B7280", fontWeight: "600" },
    cardValue: { fontSize: 24, fontWeight: "bold", color: "#1F2937" }
});
