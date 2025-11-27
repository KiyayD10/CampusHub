import { View, Text, StyleSheet, Image, Pressable, Switch, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useState } from "react";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

export default function ProfileScreen() {
    const [isDark, setIsDark] = useState(false);
    const [notifs, setNotifs] = useState(true);
    const { user } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Router redirect is handled in _layout.tsx via AuthContext listener
        } catch (error: any) {
            Alert.alert("Error", "Failed to log out: " + error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Title */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <Pressable style={styles.iconBtn}>
                        <Ionicons name="settings-outline" size={24} color="#111827" />
                    </Pressable>
                </Animated.View>

                {/* Profile Card */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: (user?.photoURL && user.photoURL.startsWith('http')) ? user.photoURL : "https://i.pravatar.cc/150?img=68" }}
                            style={styles.avatar}
                        />
                        <View style={styles.onlineBadge} />
                    </View>
                    <Text style={styles.name}>{user?.displayName || user?.email?.split('@')[0] || "User"}</Text>
                    <Text style={styles.studentId}>{user?.email}</Text>
                    <Text style={styles.major}>Computer Science</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>85%</Text>
                            <Text style={styles.statLabel}>Attendance</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>3.8</Text>
                            <Text style={styles.statLabel}>GPA</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Menu Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>General</Text>
                    <View style={styles.menuContainer}>
                        <MenuItem
                            icon="person-outline"
                            label="Edit Profile"
                            color="#3B82F6"
                            delay={300}
                        />
                        <MenuItem
                            icon="notifications-outline"
                            label="Notifications"
                            color="#F59E0B"
                            delay={400}
                            rightElement={
                                <Switch
                                    value={notifs}
                                    onValueChange={setNotifs}
                                    trackColor={{ false: "#D1D5DB", true: "#8B5CF6" }}
                                    thumbColor={"#FFF"}
                                />
                            }
                        />
                        <MenuItem
                            icon="moon-outline"
                            label="Dark Mode"
                            color="#6366F1"
                            delay={500}
                            rightElement={
                                <Switch
                                    value={isDark}
                                    onValueChange={setIsDark}
                                    trackColor={{ false: "#D1D5DB", true: "#8B5CF6" }}
                                    thumbColor={"#FFF"}
                                />
                            }
                        />
                        <MenuItem
                            icon="language-outline"
                            label="Language"
                            color="#10B981"
                            delay={600}
                            value="English"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <View style={styles.menuContainer}>
                        <MenuItem
                            icon="help-circle-outline"
                            label="Help Center"
                            color="#EC4899"
                            delay={700}
                        />
                        <MenuItem
                            icon="log-out-outline"
                            label="Log Out"
                            color="#EF4444"
                            delay={800}
                            onPress={handleLogout}
                        />
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function MenuItem({ icon, label, color, delay, rightElement, value, onPress }: any) {
    return (
        <Animated.View entering={FadeInRight.delay(delay)}>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: "#F9FAFB" }]}
            >
                <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
                    <Ionicons name={icon} size={20} color={color} />
                </View>
                <Text style={styles.menuLabel}>{label}</Text>
                {rightElement ? (
                    rightElement
                ) : value ? (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={styles.menuValue}>{value}</Text>
                        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                    </View>
                ) : (
                    <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                )}
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F3F4F6" },
    scrollContent: { padding: 20 },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "800",
        color: "#111827",
        letterSpacing: -0.5,
    },
    iconBtn: {
        padding: 8,
        backgroundColor: "white",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    profileCard: {
        backgroundColor: "white",
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
        shadowColor: "#6D28D9",
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        marginBottom: 24,
    },
    avatarContainer: {
        position: "relative",
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: "#F3F4F6",
    },
    onlineBadge: {
        position: "absolute",
        bottom: 4,
        right: 4,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#10B981",
        borderWidth: 3,
        borderColor: "white",
    },
    name: {
        fontSize: 22,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 4,
    },
    studentId: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 2,
    },
    major: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6D28D9",
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-evenly",
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    statItem: {
        alignItems: "center",
    },
    statValue: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
    },
    statLabel: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: "#E5E7EB",
    },

    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#374151",
        marginBottom: 12,
        marginLeft: 4,
    },
    menuContainer: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 8,
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 14,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    menuLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: "600",
        color: "#1F2937",
    },
    menuValue: {
        fontSize: 14,
        color: "#6B7280",
        marginRight: 4,
    },
});
