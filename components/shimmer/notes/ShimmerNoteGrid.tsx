// components/shimmer/ShimmerNotesGrid.tsx
import React from "react";
import { ScrollView } from "react-native";
import { ShimmerNoteCard } from "./ShimmerNoteCard";

export const ShimmerNotesGrid = () => {
  const placeholders = Array.from({ length: 5 }); // number of cards

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 10 }} showsVerticalScrollIndicator={false}>
      {placeholders.map((_, index) => (
        <ShimmerNoteCard key={index} />
      ))}
    </ScrollView>
  );
};
