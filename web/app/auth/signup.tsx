import { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
    const [fullName, setFullName] = useState("");
    const [shortName, setShortName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async () => {
        if (!fullName || !shortName || !phoneNumber || !email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update Auth Profile
            await updateProfile(user, {
                displayName: fullName
            });

            // Save to Firestore
            await setDoc(doc(db, "users", user.uid), {
                fullName,
                shortName,
                phoneNumber,    
                email,
                createdAt: new Date().toISOString()
            });

            await auth.signOut();
            Alert.alert("Success", "Account created successfully. Please sign in.", [
                { text: "OK", onPress: () => router.replace("/auth/signin") }
            ]);
        } catch (error: any) {
            Alert.alert("Sign Up Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join CampusHub today</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="happy-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Short Name (Nickname)"
                        value={shortName}
                        onChangeText={setShortName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="call-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                    />
                </View>

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

                <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Sign Up</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <Link href="/auth/signin" asChild>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Sign In</Text>
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
    footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
    footerText: { color: "#6B7280", fontSize: 14 },
    linkText: { color: "#6D28D9", fontSize: 14, fontWeight: "600" },
});
