import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TasksScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen options={{
                headerShown: true,
                title: "Tasks",
                headerStyle: { backgroundColor: '#F3F4F6' },
                headerShadowVisible: false,
            }} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>My Tasks</Text>
                    <Text style={styles.subtitle}>Manage your daily activities</Text>
                </View>

                {/* Placeholder for task list */}
                <View style={styles.emptyState}>
                    <Ionicons name="checkbox-outline" size={64} color="#DDD" />
                    <Text style={styles.emptyText}>No tasks yet</Text>
                    <Text style={styles.emptySub}>Add a task to get started</Text>
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
    emptyState: { alignItems: "center", justifyContent: "center", marginTop: 100 },
    emptyText: { fontSize: 18, fontWeight: "600", color: "#374151", marginTop: 16 },
    emptySub: { fontSize: 14, color: "#9CA3AF", marginTop: 8 },
});
