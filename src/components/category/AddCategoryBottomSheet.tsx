import React, { useCallback, useEffect, useMemo, forwardRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetTextInput,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSave: (category: { name: string; color: string; icon: string }) => void;
  initialValue?: string;
  initialColor?: string;
  initialIcon?: string;
}

const ACCENT_COLORS = [
  { name: "Orange", color: "#FF6D24" }, // Orange from screenshot
  { name: "Sky", color: "#3B82F6" },
  { name: "Emerald", color: "#10B981" },
  { name: "Violet", color: "#A855F7" },
  { name: "Pink", color: "#EC4899" },
  { name: "Amber", color: "#EAB308" },
  { name: "Teal", color: "#14B8A6" },
  { name: "Rose", color: "#F43F5E" },
  { name: "Cyan", color: "#06B6D4" },
  { name: "Indigo", color: "#6366F1" },
  { name: "Lime", color: "#84CC16" },
];

const SYMBOLS = [
  "folder",
  "work",
  "fitness-center",
  "shopping-cart",
  "book",
  "restaurant",
  "public",
  "lightbulb",
  "payments",
  "star",
  "favorite",
  "home",
  "event",
  "brush",
  "more-horiz",
];

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ICON_GAP = 12;
const ICON_COLUMNS = 5;
const CONTENT_PADDING = 24;
const ICON_SIZE = (SCREEN_WIDTH - (CONTENT_PADDING * 2) - (ICON_GAP * (ICON_COLUMNS - 1))) / ICON_COLUMNS;

export const AddCategoryBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ visible, onClose, onSave, initialValue, initialColor, initialIcon }, ref) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const snapPoints = useMemo(() => ["80%", "90%"], []);

    const [name, setName] = React.useState("");
    const defaultColor = ACCENT_COLORS[0].color;
    const [selectedColor, setSelectedColor] = React.useState(defaultColor);
    const [selectedIcon, setSelectedIcon] = React.useState(SYMBOLS[0]);
    const [error, setError] = React.useState(false);

    const inputRef = React.useRef<any>(null);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.6}
          enableTouchThrough={false}
        />
      ),
      []
    );

    const handleClose = useCallback(() => {
      setName("");
      setSelectedColor(initialColor || defaultColor);
      setSelectedIcon(initialIcon || SYMBOLS[0]);
      setError(false);
      onClose();
      (ref as any)?.current?.dismiss();
    }, [onClose, ref, initialColor, initialIcon, defaultColor]);

    const handleSave = useCallback(() => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        setError(true);
        return;
      }

      onSave({
        name: trimmedName,
        color: selectedColor,
        icon: selectedIcon
      });
      handleClose();
    }, [name, selectedColor, selectedIcon, onSave, handleClose]);

    useEffect(() => {
      if (visible) {
        setName(initialValue || "");
        setSelectedColor(initialColor || defaultColor);
        setSelectedIcon(initialIcon || SYMBOLS[0]);
        setError(false);
      }
    }, [visible, initialValue, initialColor, initialIcon, defaultColor]);

    const isDarkMode = colors.background === "#101122";
    const sheetBgColor = isDarkMode ? "#0F1121" : colors.background; // Matched with SelectionBottomSheet

    return (
      <BottomSheetModal
        ref={ref}
        index={visible ? 0 : -1}
        enableDynamicSizing={false}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        handleIndicatorStyle={[
          styles.handleIndicator,
          { backgroundColor: colors.settingsIcon + "40" },
        ]}
        backgroundStyle={[
          styles.background,
          {
            backgroundColor: sheetBgColor,
          }
        ]}
      >
        <BottomSheetScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Header Redesign */}
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: colors.textMain }]}>
                {initialValue ? "Edit Category" : "New Category"}
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Organize your thoughts with style
              </Text>
            </View>

            {/* Name Input */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>NAME</Text>
              <View style={[
                styles.inputWrapper,
                { 
                  backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "#F1F5F9", 
                  borderColor: error ? colors.error : "transparent" 
                }
              ]}>
                <BottomSheetTextInput
                  ref={inputRef}
                  style={[styles.input, { color: colors.textMain }]}
                  placeholder="e.g. Personal Projects"
                  placeholderTextColor={colors.textSecondary + "80"}
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (text.trim()) setError(false);
                  }}
                />
              </View>
              {error && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  Name is required
                </Text>
              )}
            </View>

            {/* Icon Picker - Grid Style */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>CHOOSE ICON</Text>
              <View style={styles.iconGrid}>
                {SYMBOLS.map((icon) => {
                  const isSelected = selectedIcon === icon;
                  return (
                    <TouchableOpacity
                      key={icon}
                      onPress={() => setSelectedIcon(icon)}
                      style={[
                        styles.iconOption,
                        {
                          backgroundColor: isSelected 
                            ? selectedColor 
                            : isDarkMode ? "rgba(255, 255, 255, 0.05)" : "#F1F5F9",
                        }
                      ]}
                    >
                      <MaterialIcons
                        name={icon as any}
                        size={24}
                        color={isSelected ? "#FFFFFF" : colors.textSecondary}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Accent Color - Horizontal Scroll */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>ACCENT COLOR</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.colorList}
              >
                {ACCENT_COLORS.map((item) => {
                  const isSelected = selectedColor === item.color;
                  return (
                    <TouchableOpacity
                      key={item.color}
                      onPress={() => setSelectedColor(item.color)}
                      style={[
                        styles.colorOption,
                        { backgroundColor: item.color },
                        isSelected && styles.colorSelected
                      ]}
                    >
                      {isSelected && <View style={[styles.colorRing, { borderColor: isDarkMode ? "#FFFFFF" : colors.primary }]} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: selectedColor }]}
              onPress={handleSave}
              activeOpacity={0.9}
            >
              <Text style={styles.saveBtnText}>
                {initialValue ? "Update Category" : "Create Category"}
              </Text>
            </TouchableOpacity>

            <View style={{ height: insets.bottom + 20 }} />
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

AddCategoryBottomSheet.displayName = "AddCategoryBottomSheet";

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 12,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: CONTENT_PADDING,
    paddingTop: 0,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  inputWrapper: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  input: {
    fontSize: 17,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
    marginLeft: 4,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: ICON_GAP,
    justifyContent: "flex-start",
  },
  iconOption: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    margin: 0,
  },
  colorList: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 14,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  colorSelected: {
    // No transform to avoid cutting off the ring
  },
  colorRing: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    borderWidth: 2,
  },
  saveBtn: {
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },
});
