import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from "react-native";
import { useRouter } from "expo-router";
import { updateProfile } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
    const user = auth.currentUser;
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await updateProfile(user, {
                displayName: displayName,
                photoURL: photoURL,
            });
            Alert.alert("Success", "Profile updated successfully");
            router.back();
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.avatarSection}>
                    <Image
                        source={{ uri: (photoURL && photoURL.startsWith('http')) ? photoURL : "https://i.pravatar.cc/150?img=68" }}
                        style={styles.avatar}
                    />
                    <Text style={styles.avatarHint}>Preview of your profile picture</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Display Name</Text>
                        <TextInput
                            style={styles.input}
                            value={displayName}
                            onChangeText={setDisplayName}
                            placeholder="Enter your name"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Photo URL</Text>
                        <TextInput
                            style={styles.input}
                            value={photoURL}
                            onChangeText={setPhotoURL}
                            placeholder="https://example.com/photo.jpg"
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
    },
    content: {
        padding: 24,
    },
    avatarSection: {
        alignItems: "center",
        marginBottom: 32,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
        backgroundColor: "#F3F4F6",
    },
    avatarHint: {
        fontSize: 14,
        color: "#6B7280",
    },
    form: {
        gap: 20,
    },
    inputContainer: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        color: "#374151",
    },
    input: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: "#1F2937",
        backgroundColor: "#F9FAFB",
    },
    saveButton: {
        backgroundColor: "#6D28D9",
        height: 50,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
    },
    saveButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
});
