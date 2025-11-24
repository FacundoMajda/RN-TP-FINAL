import {
  View,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { useNotes } from "../context/NotesContext";
import React from "react";

export default function Index() {
  const { notes } = useNotes();

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/note/${item.id}`)}
            style={styles.card}
          >
            <Image source={{ uri: item.imageUri }} style={styles.thumb} />
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        onPress={() => router.push("/create")}
        style={styles.fab}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  card: {
    flexDirection: "row",
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  thumb: { width: 60, height: 60, borderRadius: 4, backgroundColor: "#ddd" },
  info: { marginLeft: 10, justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "bold" },
  date: { fontSize: 12, color: "#666" },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: { color: "#fff", fontSize: 30 },
});
