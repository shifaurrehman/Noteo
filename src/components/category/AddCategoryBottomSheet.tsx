import React, { useCallback, useEffect, useMemo, forwardRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
  { name: "Rose", color: "categoryRose" },
  { name: "Amber", color: "categoryAmber" },
  { name: "Emerald", color: "categoryEmerald" },
  { name: "Sky", color: "categorySky" },
  { name: "Indigo", color: "categoryIndigo" },
  { name: "Fuchsia", color: "categoryFuchsia" },
  { name: "Slate", color: "categorySlate" },
  { name: "Primary", color: "primary" },
];

const SYMBOLS = [
  "folder",
  "home",
  "star",
  "bolt",
  "shopping-cart",
  "book",
  "palette",
  "more-horiz",
];

export const AddCategoryBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ visible, onClose, onSave, initialValue, initialColor, initialIcon }, ref) => {

    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const snapPoints = useMemo(() => ["65%", "90%"], []);

    const [name, setName] = React.useState("");
    const defaultColor = useMemo(() => ACCENT_COLORS[ACCENT_COLORS.length - 1].color, []);
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
      setError(false);
      onClose();
      (ref as any)?.current?.dismiss();
    }, [onClose, ref]);

    const handleSave = useCallback(() => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        setError(true);
        return;
      }
      
      const selectedColorValue = (colors as any)[selectedColor] || colors.primary;
      onSave({ 
        name: trimmedName, 
        color: selectedColorValue, 
        icon: selectedIcon 
      });
      handleClose();

    }, [name, selectedColor, selectedIcon, onSave, colors, handleClose]);

    useEffect(() => {
      if (visible) {
        setName(initialValue || "");
        
        // Find internal color key from hex value if possible
        if (initialColor) {
          const colorEntry = ACCENT_COLORS.find(c => (colors as any)[c.color] === initialColor);
          if (colorEntry) {
            setSelectedColor(colorEntry.color);
          }
        } else {
          setSelectedColor(defaultColor);
        }
        
        setSelectedIcon(initialIcon || SYMBOLS[0]);
        setError(false);
      } else {
        setName("");
        setSelectedColor(defaultColor);
        setSelectedIcon(SYMBOLS[0]);
        setError(false);
      }
    }, [visible, initialValue, initialColor, initialIcon, colors, defaultColor]);


    const isDarkMode = colors.background === "#101122";
    const sheetBgColor = isDarkMode ? ((colors as any).surfaceDark || "#111122") : colors.surface;

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
          { backgroundColor: isDarkMode ? colors.primary + "33" : colors.border },
        ]}
        backgroundStyle={[
          styles.background,
          {
            backgroundColor: sheetBgColor,
          }
        ]}
      >
        <BottomSheetScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeIcon}>
              <MaterialIcons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            
            <Text style={[styles.headerTitle, { color: colors.textMain }]}>
              {initialValue ? "Edit Category" : "New Category"}
            </Text>
            
            <TouchableOpacity onPress={handleSave} style={styles.createBtn}>
              <Text style={[styles.createBtnText, { color: colors.primary }]}>
                {initialValue ? "Edit" : "Create"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Input Section */}
            <View style={styles.inputSection}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Category Name</Text>
              {(() => {
                const inputBg = error ? colors.error + "11" : (isDarkMode ? colors.surface : colors.background);
                const inputBorderColor = error ? colors.error : (name.length > 0 ? colors.primary : colors.border);
                
                return (
                  <View style={[
                    styles.inputWrapper, 
                    { 
                      backgroundColor: inputBg,
                      borderColor: inputBorderColor
                    }
                  ]}>
                    <BottomSheetTextInput
                      ref={inputRef}
                      style={[styles.input, { color: colors.textMain }]}
                      placeholder="e.g. Personal Projects"
                      placeholderTextColor={colors.textSecondary + "88"}
                      value={name}
                      onChangeText={(text) => {
                        setName(text);
                        if (text.trim()) setError(false);
                      }}
                    />
                    {error && (
                      <View style={styles.errorIcon}>
                        <MaterialIcons name="error" size={20} color={colors.error} />
                      </View>
                    )}
                  </View>
                );
              })()}
              {error && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  Name is required to continue
                </Text>
              )}
            </View>


            {/* Selection Grid */}
            <View style={styles.selectionGrid}>
              {/* Accent Color */}
              <View style={styles.selectionCol}>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Accent Color</Text>
                <View style={styles.colorGrid}>
                  {ACCENT_COLORS.map((item) => {
                    const colorValue = (colors as any)[item.color];
                    const isSelected = selectedColor === item.color;
                    return (
                      <TouchableOpacity
                        key={item.name}
                        onPress={() => setSelectedColor(item.color)}
                        style={[
                          styles.colorOption,
                          { backgroundColor: colorValue },
                          isSelected && [
                            styles.colorSelected,
                            { 
                              borderColor: isDarkMode ? "#1E293B" : "#FFFFFF",
                              shadowColor: colors.primary,
                              // For ring effect in RN, we use another view or borders
                            }
                          ]
                        ]}
                      >
                        {isSelected && <View style={[styles.colorRing, { borderColor: colorValue }]} />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Icon Picker */}
              <View style={styles.selectionCol}>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Symbol</Text>
                <View style={styles.iconGrid}>
                  {SYMBOLS.map((icon) => {
                    const isSelected = selectedIcon === icon;
                    const iconBg = isSelected 
                      ? (isDarkMode ? colors.primary + "33" : "#F1F5F9") 
                      : (isDarkMode ? colors.surface : "#F1F5F9");
                    const iconBorder = isSelected ? colors.primary + "4D" : "transparent";
                    const iconColor = isSelected 
                      ? colors.primary 
                      : (isDarkMode ? "#94A3B8" : colors.textSecondary);

                    return (
                      <TouchableOpacity
                        key={icon}
                        onPress={() => setSelectedIcon(icon)}
                        style={[
                          styles.iconOption,
                          { 
                            backgroundColor: iconBg,
                            borderColor: iconBorder
                          }
                        ]}
                      >
                        <MaterialIcons 
                          name={icon as any} 
                          size={18} 
                          color={iconColor} 
                        />
                      </TouchableOpacity>
                    );
                  })}

                </View>
              </View>
            </View>

            {/* Footer Save Button */}
            <TouchableOpacity
              style={[styles.saveBtn, { backgroundColor: colors.primary }]}
              onPress={handleSave}
              activeOpacity={0.9}
            >
              <MaterialIcons name="add-circle" size={24} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>Save Category</Text>
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
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  handleIndicator: {
    width: 48,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  closeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  createBtn: {
    paddingHorizontal: 8,
  },
  createBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
  },
  errorIcon: {
    marginLeft: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
  selectionGrid: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 32,
  },
  selectionCol: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorSelected: {
    borderWidth: 3,
  },
  colorRing: {
    position: "absolute",
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderRadius: 24,
    borderWidth: 2,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  iconOption: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
