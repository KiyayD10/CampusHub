import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Google Sign In Request
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: '7634332378-vlg6ffalolstteog6624linao88g25oc.apps.googleusercontent.com', // Replace with your Web Client ID
        //  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com', // Optional
        //  androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com', // Optional
    });

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            if (router) router.replace("/(tabs)");
        } catch (error: any) {
            console.error("Sign In Error:", error);
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                Alert.alert("Login Failed", "Invalid email or password. Please check your credentials.");
            } else if (error.code === 'auth/too-many-requests') {
                Alert.alert("Login Failed", "Too many failed attempts. Please try again later.");
            } else {
                Alert.alert("Login Failed", error.message || "An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        const result = await promptAsync();
        if (result?.type === 'success') {
            const { id_token } = result.params;
            const credential = GoogleAuthProvider.credential(id_token);
            try {
                await signInWithCredential(auth, credential);
                router.replace("/(tabs)");
            } catch (error: any) {
                Alert.alert("Google Sign-In Failed", error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue to CampusHub</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Sign In</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.divider}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>OR</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Don't have an account? </Text>
                    <Link href="/auth/signup" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Sign Up</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF", padding: 24, justifyContent: "center" },
    header: { marginBottom: 32 },
    title: { fontSize: 32, fontWeight: "bold", color: "#1F2937", marginBottom: 8 },
    subtitle: { fontSize: 16, color: "#6B7280" },
    form: { gap: 16 },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: "#F9FAFB",
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontSize: 16, color: "#1F2937" },
    button: {
        backgroundColor: "#6D28D9",
        height: 56,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
        shadowColor: "#6D28D9",
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
    divider: { flexDirection: "row", alignItems: "center", marginVertical: 16 },
    line: { flex: 1, height: 1, backgroundColor: "#E5E7EB" },
    orText: { marginHorizontal: 16, color: "#9CA3AF", fontSize: 14 },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        height: 56,
        gap: 12,
        backgroundColor: "#FFF",
    },
    googleButtonText: { fontSize: 16, fontWeight: "600", color: "#374151" },
    footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
    footerText: { color: "#6B7280", fontSize: 14 },
    linkText: { color: "#6D28D9", fontSize: 14, fontWeight: "600" },
});
