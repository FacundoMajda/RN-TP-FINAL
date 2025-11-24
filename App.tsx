import React from "react";
import { Slot } from "expo-router";
import { NotesProvider } from "./context/NotesContext";

export default function App() {
  return (
    <NotesProvider>
      <Slot />
    </NotesProvider>
  );
}
