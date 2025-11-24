import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

export interface Note {
  id: string;
  title: string;
  description: string;
  imageUri: string;
  date: string;
}

interface NotesContextType {
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "date">) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem("notes");
      if (stored) setNotes(JSON.parse(stored));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = (data: Omit<Note, "id" | "date">) => {
    const newNote = {
      ...data,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id: string, data: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...data, date: new Date().toISOString() } : n
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => {
      const noteToDelete = prev.find((n) => n.id === id);
      if (
        noteToDelete &&
        noteToDelete.imageUri.startsWith(FileSystem.documentDirectory!)
      ) {
        FileSystem.deleteAsync(noteToDelete.imageUri).catch(() => {});
      }
      return prev.filter((n) => n.id !== id);
    });
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error("useNotes debe usarse dentro de NotesProvider");
  return context;
};
