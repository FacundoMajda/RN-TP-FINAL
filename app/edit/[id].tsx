import { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, router } from "expo-router";
import { useNotes } from "../../context/NotesContext";
import React from "react";

export default function EditNote() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes, updateNote } = useNotes();
  const note = notes.find((n) => n.id === id);

  const [title, setTitle] = useState(note?.title || "");
  const [desc, setDesc] = useState(note?.description || "");
  const [imageUri, setImageUri] = useState<string | null>(
    note?.imageUri || null
  );
  const [cameraOpen, setCameraOpen] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setDesc(note.description);
      setImageUri(note.imageUri);
    }
  }, [note]);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      const newPath = FileSystem.documentDirectory + Date.now() + ".jpg";
      await FileSystem.moveAsync({ from: photo.uri, to: newPath });
      setImageUri(newPath);
      setCameraOpen(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      const assetUri = result.assets[0].uri;
      const newPath = FileSystem.documentDirectory + Date.now() + ".jpg";
      await FileSystem.copyAsync({ from: assetUri, to: newPath });
      setImageUri(newPath);
    }
  };

  const handleSave = () => {
    if (!title || !imageUri) return alert("Falta título o imagen");
    updateNote(id as string, { title, description: desc, imageUri });
    router.back();
  };

  if (!note)
    return (
      <View style={styles.center}>
        <Text>Nota no encontrada</Text>
      </View>
    );

  if (cameraOpen) {
    if (!permission?.granted)
      return (
        <View style={styles.center}>
          <Text>Sin permiso de cámara</Text>
          <Button title="Pedir Permiso" onPress={requestPermission} />
        </View>
      );
    return (
      <CameraView style={{ flex: 1 }} ref={cameraRef}>
        <View style={styles.cameraControls}>
          <TouchableOpacity onPress={takePhoto} style={styles.captureBtn} />
          <Button
            title="Cancelar"
            onPress={() => setCameraOpen(false)}
            color="red"
          />
        </View>
      </CameraView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.form}>
      <TextInput
        placeholder="Título"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        placeholder="Descripción"
        style={[styles.input, { height: 80 }]}
        multiline
        value={desc}
        onChangeText={setDesc}
      />

      <View style={styles.btnRow}>
        <Button title="Abrir Cámara" onPress={() => setCameraOpen(true)} />
        <Button title="Galería" onPress={pickImage} />
      </View>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

      <View style={{ marginTop: 20 }}>
        <Button title="Guardar Cambios" onPress={handleSave} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  form: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  preview: { width: "100%", height: 200, borderRadius: 8, resizeMode: "cover" },
  cameraControls: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 30,
    alignItems: "center",
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
});
