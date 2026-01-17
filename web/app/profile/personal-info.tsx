import { View, Text, StyleSheet, Image, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useState, useCallback } from "react";

export default function PersonalInfoScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);

    useFocusEffect(
        useCallback(() => {
            if (user) {
                const fetchUserData = async () => {
                    // Don't set loading to true on every focus to avoid flicker if data is already there, 
                    // or maybe just for the first load. 
                    // For now, let's keep it simple but maybe check if we already have data?
                    // Actually, we want to refresh if they edited it.
                    try {
                        const docRef = doc(db, "users", user.uid);
                        const docSnap = await getDoc(docRef);
                        if (docSnap.exists()) {
                            setUserData(docSnap.data());
                        }
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                    } finally {
                        setLoading(false);
                    }
                };
                fetchUserData();
            }
        }, [user])
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.colors.card }]}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Personal Info</Text>
                <Pressable onPress={() => router.push("/profile/edit")} style={[styles.editBtn, { backgroundColor: theme.colors.primary }]}>
                    <Ionicons name="pencil" size={20} color="#FFF" />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: (user?.photoURL && user.photoURL.startsWith('http')) ? user.photoURL : "https://i.pravatar.cc/150?img=68" }}
                        style={[styles.avatar, { borderColor: theme.colors.card }]}
                    />
                </View>

                <InfoItem label="Full Name" value={userData?.fullName || user?.displayName || "Not set"} theme={theme} />
                <InfoItem label="Short Name" value={userData?.shortName || "Not set"} theme={theme} />
                <InfoItem label="Email" value={user?.email || "Not set"} theme={theme} />
                <InfoItem label="Phone Number" value={userData?.phoneNumber || "Not set"} theme={theme} />
                <InfoItem label="Major" value={userData?.major || "Not set"} theme={theme} />
                <InfoItem label="Faculty" value={userData?.faculty || "Not set"} theme={theme} />

            </ScrollView>
        </SafeAreaView>
    );
}

function InfoItem({ label, value, theme }: any) {
    return (
        <View style={[styles.infoItem, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.label, { color: theme.colors.subtext }]}>{label}</Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
        </View>
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
    editBtn: {
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
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
    },
    infoItem: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
    },
});
