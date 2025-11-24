import { useLocalSearchParams, router } from "expo-router";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import { useNotes } from "../../context/NotesContext";

export default function NoteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes, deleteNote } = useNotes();
  const note = notes.find((n) => n.id === id);

  if (!note)
    return (
      <View style={styles.container}>
        <Text>Nota no encontrada</Text>
      </View>
    );

  const handleDelete = () => {
    Alert.alert("Eliminar", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          deleteNote(note.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: note.imageUri }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.date}>
          Creado: {new Date(note.date).toLocaleString()}
        </Text>
        <Text style={styles.desc}>{note.description}</Text>
        <View
          style={{
            marginTop: 30,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Button
            title="Editar"
            onPress={() => router.push(`/edit/${note.id}`)}
          />
          <Button title="Eliminar Nota" color="red" onPress={handleDelete} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 300 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  date: { color: "#888", marginBottom: 20 },
  desc: { fontSize: 16, lineHeight: 24 },
});
