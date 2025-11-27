import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from "../../context/ThemeContext";

export default function EditProfileScreen() {
    const user = auth.currentUser;
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
    const [major, setMajor] = useState("");
    const [faculty, setFaculty] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();
    const { theme } = useTheme();

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setMajor(data.major || "");
                        setFaculty(data.faculty || "");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchUserData();
        }
    }, [user]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri: string) => {
        if (!user) return;
        setUploading(true);
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const storageRef = ref(storage, `profile_images/${user.uid}`);
            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);
            setPhotoURL(downloadURL);
        } catch (error: any) {
            Alert.alert("Upload Failed", error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Update Auth Profile
            await updateProfile(user, {
                displayName: displayName,
                photoURL: photoURL,
            });

            // Update Firestore Data
            await setDoc(doc(db, "users", user.uid), {
                major: major,
                faculty: faculty,
                email: user.email, // Keep email in sync
                displayName: displayName,
                photoURL: photoURL,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            Alert.alert("Success", "Profile updated successfully");
            router.back();
        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={pickImage} disabled={uploading}>
                        <Image
                            source={{ uri: (photoURL && photoURL.startsWith('http')) ? photoURL : "https://i.pravatar.cc/150?img=68" }}
                            style={styles.avatar}
                        />
                        {uploading && (
                            <View style={styles.uploadOverlay}>
                                <ActivityIndicator color="#FFF" />
                            </View>
                        )}
                        <View style={[styles.cameraIcon, { borderColor: theme.colors.background }]}>
                            <Ionicons name="camera" size={20} color="#FFF" />
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.avatarHint, { color: theme.colors.subtext }]}>Tap to change profile picture</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput, {
                                borderColor: theme.colors.border,
                                backgroundColor: theme.colors.border, // Slightly darker for disabled
                                color: theme.colors.subtext
                            }]}
                            value={user?.email || ""}
                            editable={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: theme.colors.text }]}>Display Name</Text>
                        <TextInput
                            style={[styles.input, {
                                borderColor: theme.colors.border,
                                backgroundColor: theme.colors.card,
                                color: theme.colors.text
                            }]}
                            value={displayName}
                            onChangeText={setDisplayName}
                            placeholder="Enter your name"
                            placeholderTextColor={theme.colors.subtext}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: theme.colors.text }]}>Major (Jurusan)</Text>
                        <TextInput
                            style={[styles.input, {
                                borderColor: theme.colors.border,
                                backgroundColor: theme.colors.card,
                                color: theme.colors.text
                            }]}
                            value={major}
                            onChangeText={setMajor}
                            placeholder="e.g. Computer Science"
                            placeholderTextColor={theme.colors.subtext}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: theme.colors.text }]}>Faculty (Fakultas)</Text>
                        <TextInput
                            style={[styles.input, {
                                borderColor: theme.colors.border,
                                backgroundColor: theme.colors.card,
                                color: theme.colors.text
                            }]}
                            value={faculty}
                            onChangeText={setFaculty}
                            placeholder="e.g. Faculty of Engineering"
                            placeholderTextColor={theme.colors.subtext}
                        />
                    </View>

                    <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.colors.primary }]} onPress={handleSave} disabled={loading || uploading}>
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
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
        backgroundColor: "#F3F4F6",
    },
    uploadOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#6D28D9",
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
    },
    avatarHint: {
        fontSize: 14,
        marginTop: 12,
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
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
    },
    disabledInput: {
        // Styles overridden inline for dynamic theme
    },
    saveButton: {
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
