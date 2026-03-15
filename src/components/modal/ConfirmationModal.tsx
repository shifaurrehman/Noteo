import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { memo } from "react";
import {
    Dimensions,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

interface ConfirmationModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "info";
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = memo(({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    type = "danger",
}) => {
    const { colors } = useTheme();

    const getIconName = () => {
        switch (type) {
            case "danger":
                return "alert-circle";
            case "warning":
                return "warning";
            case "info":
                return "information-circle";
            default:
                return "alert-circle";
        }
    };

    const getIconColor = () => {
        switch (type) {
            case "danger":
                return colors.error;
            case "warning":
                return colors.warning;
            case "info":
                return colors.primary;
            default:
                return colors.error;
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    {Platform.OS === "ios" ? (
                        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
                    ) : (
                        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0, 0, 0, 0.6)" }]} />
                    )}

                    <TouchableWithoutFeedback>
                        <View style={[styles.modalContainer, { backgroundColor: colors.cardBg, shadowColor: colors.shadow }]}>
                            {/* Icon Header */}
                            <View style={[styles.iconContainer, { backgroundColor: getIconColor() + "15" }]}>
                                <Ionicons name={getIconName()} size={32} color={getIconColor()} />
                            </View>

                            {/* Text Content */}
                            <View style={styles.textContent}>
                                <Text style={[styles.title, { color: colors.textMain }]}>{title}</Text>
                                <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
                            </View>

                            {/* Action Buttons */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                                    onPress={onClose}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[styles.cancelButtonText, { color: colors.textMain }]}>{cancelText}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.button,
                                        styles.confirmButton,
                                        { backgroundColor: type === "danger" ? colors.error : colors.primary }
                                    ]}
                                    onPress={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.confirmButtonText}>{confirmText}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
});

ConfirmationModal.displayName = 'ConfirmationModal';

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: Math.min(width - 40, 340),
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.1,
                shadowRadius: 20,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    textContent: {
        alignItems: "center",
        marginBottom: 28,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        marginBottom: 8,
        textAlign: "center",
        letterSpacing: -0.5,
    },
    message: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: "center",
        paddingHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        width: "100%",
        gap: 12,
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    cancelButton: {
        borderWidth: 1,
    },
    confirmButton: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    cancelButtonText: {
        fontSize: 15,
        fontWeight: "600",
    },
    confirmButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
});
