import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function TasksScreen() {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
            <Stack.Screen options={{
                headerShown: true,
                title: "Tasks",
                headerStyle: { backgroundColor: theme.colors.background },
                headerTintColor: theme.colors.text,
                headerShadowVisible: false,
            }} />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: theme.colors.text }]}>My Tasks</Text>
                    <Text style={[styles.subtitle, { color: theme.colors.subtext }]}>Manage your daily activities</Text>
                </View>

                {/* Placeholder for task list */}
                <View style={styles.emptyState}>
                    <Ionicons name="checkbox-outline" size={64} color={theme.colors.border} />
                    <Text style={[styles.emptyText, { color: theme.colors.text }]}>No tasks yet</Text>
                    <Text style={[styles.emptySub, { color: theme.colors.subtext }]}>Add a task to get started</Text>
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
    emptySub: { fontSize: 14, marginTop: 8 },
});
