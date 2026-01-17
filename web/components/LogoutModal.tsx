import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import Animated, { FadeIn, FadeInUp, FadeOut, FadeOutDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';


interface LogoutModalProps {
    visible: boolean;
    onClose: () => void;
    onLogout: () => void;
    theme: any;
}

const { width } = Dimensions.get('window');

export default function LogoutModal({ visible, onClose, onLogout, theme }: LogoutModalProps) {
    if (!visible) return null;

    return (
        <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
            <View style={styles.overlay}>
                {/* Backdrop */}
                <Animated.View
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                    style={[styles.backdrop, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
                >
                    <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                </Animated.View>

                {/* Modal Content */}
                <Animated.View
                    entering={FadeInUp.springify().damping(15)}
                    exiting={FadeOutDown.duration(200)}
                    style={[styles.modalContainer, { backgroundColor: theme.colors.card }]}
                >
                    <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                        <Ionicons name="log-out" size={32} color="#EF4444" />
                    </View>

                    <Text style={[styles.title, { color: theme.colors.text }]}>Log Out</Text>
                    <Text style={[styles.message, { color: theme.colors.subtext }]}>
                        Are you sure you want to log out? You will need to sign in again to access your account.
                    </Text>

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[styles.button, styles.cancelButton, { backgroundColor: theme.colors.background }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.buttonText, { color: theme.colors.text }]}>Cancel</Text>
                        </Pressable>

                        <Pressable
                            style={[styles.button, styles.logoutButton]}
                            onPress={onLogout}
                        >
                            <Text style={[styles.buttonText, { color: '#FFF' }]}>Log Out</Text>
                        </Pressable>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContainer: {
        width: width * 0.85,
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        borderWidth: 1,
        borderColor: 'transparent',
    },
    logoutButton: {
        backgroundColor: '#EF4444',
        shadowColor: "#EF4444",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
