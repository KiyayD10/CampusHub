import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";

export default function SettingsScreen() {
    const { theme } = useTheme();
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [emailNotifs, setEmailNotifs] = useState(true);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: theme.colors.card }]}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Account Section */}
                <Text style={[styles.sectionTitle, { color: theme.colors.subtext }]}>Account</Text>
                <View style={[styles.sectionContainer, { backgroundColor: theme.colors.card }]}>
                    <SettingItem
                        icon="person-outline"
                        label="Personal Information"
                        theme={theme}
                        onPress={() => router.push("/profile/personal-info")}
                    />
                    <SettingItem
                        icon="lock-closed-outline"
                        label="Change Password"
                        theme={theme}
                        onPress={() => router.push("/profile/change-password")}
                    />
                    <SettingItem
                        icon="mail-outline"
                        label="Email Preferences"
                        theme={theme}
                        rightElement={
                            <Switch
                                value={emailNotifs}
                                onValueChange={setEmailNotifs}
                                trackColor={{ false: "#D1D5DB", true: "#8B5CF6" }}
                                thumbColor={"#FFF"}
                            />
                        }
                    />
                </View>

                {/* Privacy & Security */}
                <Text style={[styles.sectionTitle, { color: theme.colors.subtext, marginTop: 24 }]}>Privacy & Security</Text>
                <View style={[styles.sectionContainer, { backgroundColor: theme.colors.card }]}>
                    <SettingItem
                        icon="finger-print-outline"
                        label="Biometric Login"
                        theme={theme}
                        rightElement={
                            <Switch
                                value={biometricEnabled}
                                onValueChange={setBiometricEnabled}
                                trackColor={{ false: "#D1D5DB", true: "#8B5CF6" }}
                                thumbColor={"#FFF"}
                            />
                        }
                    />
                    <SettingItem
                        icon="shield-checkmark-outline"
                        label="Data Usage"
                        theme={theme}
                        onPress={() => { }}
                    />
                </View>

                {/* About */}
                <Text style={[styles.sectionTitle, { color: theme.colors.subtext, marginTop: 24 }]}>About</Text>
                <View style={[styles.sectionContainer, { backgroundColor: theme.colors.card }]}>
                    <SettingItem
                        icon="information-circle-outline"
                        label="App Version"
                        theme={theme}
                        value="1.0.0"
                    />
                    <SettingItem
                        icon="document-text-outline"
                        label="Terms of Service"
                        theme={theme}
                        onPress={() => router.push("/profile/terms")}
                    />
                    <SettingItem
                        icon="lock-open-outline"
                        label="Privacy Policy"
                        theme={theme}
                        onPress={() => router.push("/profile/privacy")}
                    />
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function SettingItem({ icon, label, theme, rightElement, value, onPress }: any) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.item,
                pressed && onPress && { backgroundColor: theme.colors.background }
            ]}
        >
            <View style={styles.itemLeft}>
                <Ionicons name={icon} size={22} color={theme.colors.text} style={{ marginRight: 12 }} />
                <Text style={[styles.itemLabel, { color: theme.colors.text }]}>{label}</Text>
            </View>

            {rightElement ? (
                rightElement
            ) : value ? (
                <Text style={[styles.itemValue, { color: theme.colors.subtext }]}>{value}</Text>
            ) : (
                <Ionicons name="chevron-forward" size={20} color={theme.colors.subtext} />
            )}
        </Pressable>
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
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    content: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionContainer: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(150, 150, 150, 0.1)',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    itemValue: {
        fontSize: 14,
    },
});
