import { Stack } from "expo-router";
import { NotesProvider } from "../context/NotesContext";
import { Platform } from "react-native";
import React from "react";

export default function Layout() {
  return (
    <NotesProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#fff" },
          animation: Platform.OS === "web" ? "none" : "default",
        }}
      />
    </NotesProvider>
  );
}
