import React, { useEffect, useState } from "react";
import {View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, TextInput} from "react-native";
import Retoceso from "./Retroceso";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { FontAwesome } from "@expo/vector-icons";
import { SERVER_URL } from "../config/config";

const DetallesPelis = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { imdbID } = params || {};

  
  const [pelicula, setPelicula] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const obtenerDetalles = async () => {
      try {
        if (!imdbID) throw new Error("ID de película no proporcionado");

        const token = await SecureStore.getItemAsync("userToken");
        if (!token) throw new Error("No se encontró token de sesión");

        const response = await fetch(
          `${SERVER_URL}/movies/details/${imdbID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        if (!response.ok) {
          const text = await response.text();
          if (text.startsWith("<")) {
            throw new Error("El servidor devolvió HTML. Revisa la ruta o tu sesión.");
          }
          try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.message || "Error al obtener detalles");
          } catch {
            throw new Error("Respuesta inesperada del servidor");
          }
        }

        const datos = await response.json();
        setPelicula(datos);
      } catch (err) {
        console.error("Error al obtener detalles:", err);
        setError(err.message);

        if (err.message.toLowerCase().includes("token")) {
          Alert.alert("Sesión expirada", "Por favor inicia sesión nuevamente", [
            { text: "OK", onPress: () => navigation.replace("Login") }
          ]);
        }
      } finally {
        setCargando(false);
      }
    };

    obtenerDetalles();
  }, [imdbID]);

  const handleEnviarComentario = async () => {
    if (calificacion < 1 || calificacion > 5) {
      return Alert.alert("Error", "Por favor selecciona una calificación del 1 al 5");
    }
    if (!comentario.trim()) {
      return Alert.alert("Error", "El comentario no puede estar vacío");
    }

    setSubmitting(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const email = await SecureStore.getItemAsync("userEmail");
      if (!token || !email) {
        throw new Error("Sesión inválida. Vuelve a iniciar sesión");
      }

      const resp = await axios.post(
        `${SERVER_URL}/comments`,
        {
          imdbID,
          email,
          rating: calificacion,
          comment: comentario.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (resp.data.success) {
        Alert.alert("¡Gracias!", "Tu comentario se ha enviado correctamente");
        setComentario("");
        setCalificacion(0);
      } else {
        throw new Error(resp.data.message || "No se pudo enviar el comentario");
      }
    } catch (err) {
      console.error("Error enviando comentario:", err);
      Alert.alert("Error", err.message);
      if (err.message.toLowerCase().includes("token")) {
        navigation.replace("Login");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#D32F2F" />
        <Text style={styles.loadingText}>Cargando detalles...</Text>
      </View>
    );
  }

  if (error || !pelicula) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>{error || "No se pudo cargar la información"}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Retoceso currentScreenName="DetallesPelis" navigation={navigation} />

      <Image
        style={styles.poster}
        source={
          pelicula.Poster === "N/A"
            ? require("../assets/logoM01.png")
            : { uri: pelicula.Poster }
        }
        resizeMode="contain"
      />

      <Text style={styles.titulo}>
        {pelicula.Title} ({pelicula.Year})
      </Text>

      <View style={styles.metaContainer}>
        <Text style={styles.metaText}>
          {pelicula.Released} • {pelicula.Runtime}
        </Text>
        <Text style={styles.metaText}>{pelicula.Genre}</Text>
        <Text style={styles.metaText}>
          {pelicula.imdbRating}/10 ({pelicula.imdbVotes} votos)
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Director</Text>
        <Text style={styles.texto}>{pelicula.Director}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reparto</Text>
        <Text style={styles.texto}>{pelicula.Actors}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sinopsis</Text>
        <Text style={styles.texto}>{pelicula.Plot}</Text>
      </View>

      {pelicula.Awards && pelicula.Awards !== "N/A" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premios</Text>
          <Text style={styles.texto}>{pelicula.Awards}</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calificación</Text>
        <Text style={styles.texto}>{pelicula.Rated}</Text>
      </View>

      {/* Sección de comentario */}
      <View style={styles.commentSection}>
        <Text style={styles.sectionTitle}>Deja tu comentario</Text>

        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setCalificacion(star)}
              disabled={submitting}
            >
              <FontAwesome
                name={star <= calificacion ? "star" : "star-o"}
                size={28}
                color="#FFD700"
                style={{ marginHorizontal: 4 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.commentInput}
          placeholder="Escribe tu comentario..."
          multiline
          numberOfLines={3}
          value={comentario}
          onChangeText={setComentario}
          editable={!submitting}
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleEnviarComentario}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Enviar comentario</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  poster: {
    width: 220,
    height: 330,
    resizeMode: "cover",
    marginVertical: 16,
    borderRadius: 8,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#b22222",
    marginBottom: 8,
    textAlign: "center",
  },
  metaContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  metaText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
    textAlign: "center",
  },
  section: {
    width: "100%",
    marginTop: 18,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#b22222",
    marginBottom: 6,
    textAlign: "center",
    textTransform: "uppercase",
  },
  texto: {
    color: "#000",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 6,
    lineHeight: 22,
  },


  commentSection: {
    width: "100%",
    marginTop: 36,
    paddingHorizontal: 16,
    paddingBottom: 24,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  commentInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: "#b22222",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});


export default DetallesPelis;

