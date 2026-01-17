import { View, Text, StyleSheet, Image, Pressable, Switch, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useState, useEffect, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import LogoutModal from "../../components/LogoutModal";

export default function ProfileScreen() {
    const { theme, isDark, toggleTheme } = useTheme();
    const [notifs, setNotifs] = useState(true);
    const { user } = useAuth();
    const [major, setMajor] = useState("Computer Science"); // Default fallback
    const [faculty, setFaculty] = useState("");
    const [displayName, setDisplayName] = useState("");

    useFocusEffect(
        useCallback(() => {
            if (user) {
                const fetchUserData = async () => {
                    try {
                        const docRef = doc(db, "users", user.uid);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            const data = docSnap.data();
                            if (data.major) setMajor(data.major);
                            if (data.faculty) setFaculty(data.faculty);
                            // Prefer shortName, then fullName, then auth displayName
                            if (data.shortName) setDisplayName(data.shortName);
                            else if (data.fullName) setDisplayName(data.fullName);
                            else setDisplayName(user.displayName || "");
                        }
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                    }
                };
                fetchUserData();
            }
        }, [user])
    );

    const [logoutModalVisible, setLogoutModalVisible] = useState(false);

    const handleLogout = () => {
        setLogoutModalVisible(true);
    };

    const confirmLogout = async () => {
        try {
            await signOut(auth);
            setLogoutModalVisible(false);
        } catch (error: any) {
            Alert.alert("Error", "Failed to log out: " + error.message);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Title */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.header}>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
                    <Pressable
                        style={[styles.iconBtn, { backgroundColor: theme.colors.card }]}
                        onPress={() => router.push("/profile/settings")}
                    >
                        <Ionicons name="settings-outline" size={24} color={theme.colors.icon} />
                    </Pressable>
                </Animated.View>

                {/* Profile Card */}
                <Animated.View entering={FadeInDown.delay(200)} style={[styles.profileCard, { backgroundColor: theme.colors.card }]}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: (user?.photoURL && user.photoURL.startsWith('http')) ? user.photoURL : "https://i.pravatar.cc/150?img=68" }}
                            style={[styles.avatar, { borderColor: theme.colors.background }]}
                        />
                        <View style={[styles.onlineBadge, { borderColor: theme.colors.card }]} />
                    </View>
                    <Text style={[styles.name, { color: theme.colors.text }]}>{displayName || user?.displayName || user?.email?.split('@')[0] || "User"}</Text>
                    <Text style={[styles.studentId, { color: theme.colors.subtext }]}>{user?.email}</Text>
                    <Text style={[styles.major, { color: theme.colors.primary }]}>{major} {faculty ? `| ${faculty}` : ""}</Text>

                    <View style={[styles.statsRow, { borderTopColor: theme.colors.border }]}>
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.colors.text }]}>85%</Text>
                            <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>Attendance</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.colors.text }]}>12</Text>
                            <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>Completed</Text>
                        </View>
                        <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />
                        <View style={styles.statItem}>
                            <Text style={[styles.statValue, { color: theme.colors.text }]}>3.8</Text>
                            <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>GPA</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Menu Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.subtext }]}>General</Text>
                    <View style={[styles.menuContainer, { backgroundColor: theme.colors.card }]}>
                        <MenuItem
                            icon="person-outline"
                            label="Edit Profile"
                            color="#3B82F6"
                            delay={300}
                            onPress={() => router.push("/profile/edit")}
                            theme={theme}
                        />
                        <MenuItem
                            icon="notifications-outline"
                            label="Notifications"
                            color="#F59E0B"
                            delay={400}
                            theme={theme}
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
                            theme={theme}
                            rightElement={
                                <Switch
                                    value={isDark}
                                    onValueChange={toggleTheme}
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
                            theme={theme}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.subtext }]}>Support</Text>
                    <View style={[styles.menuContainer, { backgroundColor: theme.colors.card }]}>
                        <MenuItem
                            icon="help-circle-outline"
                            label="Help Center"
                            color="#EC4899"
                            delay={700}
                            onPress={() => router.push("/profile/help")}
                            theme={theme}
                        />
                        <MenuItem
                            icon="log-out-outline"
                            label="Log Out"
                            color="#EF4444"
                            delay={800}
                            onPress={handleLogout}
                            theme={theme}
                        />
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            <LogoutModal
                visible={logoutModalVisible}
                onClose={() => setLogoutModalVisible(false)}
                onLogout={confirmLogout}
                theme={theme}
            />
        </SafeAreaView>
    );
}

function MenuItem({ icon, label, color, delay, rightElement, value, onPress, theme }: any) {
    return (
        <Animated.View entering={FadeInRight.delay(delay)}>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: theme.colors.background }]}
            >
                <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
                    <Ionicons name={icon} size={20} color={color} />
                </View>
                <Text style={[styles.menuLabel, { color: theme.colors.text }]}>{label}</Text>
                {rightElement ? (
                    rightElement
                ) : value ? (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={[styles.menuValue, { color: theme.colors.subtext }]}>{value}</Text>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.subtext} />
                    </View>
                ) : (
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.border} />
                )}
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
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
        letterSpacing: -0.5,
    },
    iconBtn: {
        padding: 8,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    profileCard: {
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
    },
    name: {
        fontSize: 22,
        fontWeight: "800",
        marginBottom: 4,
    },
    studentId: {
        fontSize: 14,
        marginBottom: 2,
    },
    major: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-evenly",
        paddingTop: 20,
        borderTopWidth: 1,
    },
    statItem: {
        alignItems: "center",
    },
    statValue: {
        fontSize: 18,
        fontWeight: "800",
    },
    statLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 24,
    },

    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 12,
        marginLeft: 4,
    },
    menuContainer: {
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
    },
    menuValue: {
        fontSize: 14,
        marginRight: 4,
    },
});
