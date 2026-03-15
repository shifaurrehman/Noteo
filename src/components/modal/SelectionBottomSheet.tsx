import React, { useCallback, useMemo, forwardRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeColors } from "@/theme/colors";

interface Option {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface Props {
  title: string;
  description: string;
  options: Option[];
  selectedValue: string;
  onSelect: (value: any) => void;
  colors: ThemeColors;
}

export type SelectionBottomSheetRef = BottomSheetModal;

export const SelectionBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ title, description, options, selectedValue, onSelect, colors }, ref) => {
    const insets = useSafeAreaInsets();
    // variables
    const snapPoints = useMemo(() => ["50%", "70%"], []);

    // callbacks
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      []
    );

    const handleOptionPress = (id: string) => {
      onSelect(id);
      (ref as any)?.current?.dismiss();
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={[
          styles.handle,
          { backgroundColor: colors.settingsIcon + "40" },
        ]}
        backgroundStyle={{
          backgroundColor:
            colors.background === "#101122" ? "#0F1121" : colors.background,
          borderRadius: 32,
        }}
      >
        <BottomSheetView
          style={[
            styles.contentContainer,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textMain }]}>{title}</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {description}
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            {options.map((option) => {
              const isSelected = selectedValue === option.id;
              return (
                <TouchableOpacity
                  key={option.id}
                  activeOpacity={0.7}
                  onPress={() => handleOptionPress(option.id)}
                  style={[
                    styles.optionItem,
                    {
                      borderColor: isSelected
                        ? colors.primary
                        : colors.settingsBorder + "40",
                      backgroundColor: isSelected
                        ? colors.primary + "10"
                        : "transparent",
                    },
                  ]}
                >
                  <View style={styles.optionLeft}>
                    <Ionicons
                      name={option.icon}
                      size={20}
                      color={isSelected ? colors.primary : colors.textSecondary}
                      style={styles.optionIcon}
                    />
                    <Text
                      style={[
                        styles.optionLabel,
                        {
                          color: colors.textMain,
                          fontWeight: isSelected ? "600" : "400",
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.radioButton,
                      {
                        borderColor: isSelected
                          ? colors.primary
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {isSelected && (
                      <View
                        style={[
                          styles.radioInner,
                          { backgroundColor: colors.primary },
                        ]}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

SelectionBottomSheet.displayName = 'SelectionBottomSheet';

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  handle: {
    width: 40,
    height: 4,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionIcon: {
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 16,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
