 import { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  ActivityIndicator, 
  StyleSheet,
  Alert
} from "react-native";
import Retoceso from "./Retroceso"; 
import { useRoute, useNavigation } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store'; 

const DetallesPelis = () => {
  const { params } = useRoute();
  const navigation = useNavigation();
  const { imdbID } = params || {}; 
  const [pelicula, setPelicula] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://X:port'; 

  useEffect(() => {
    const obtenerDetalles = async () => {
      try {
        setCargando(true);
        setError(null);
        
        if (!imdbID) {
          throw new Error('ID de película no proporcionado');
        }
        
        // Obtener token de SecureStore
        const token = await SecureStore.getItemAsync('userToken');
        
        if (!token) {
          throw new Error('No se encontró token de sesión');
        }

        const response = await fetch(`${API_URL}/api/movies/details/${imdbID}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Manejar errores o fallos de respuesta
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener detalles');
        }

        const datos = await response.json();
        setPelicula(datos);

      } catch (err) {
        console.error("Error al obtener detalles:", err);
        setError(err.message);
        
        // Manejar errores de autenticación específicamente
        if (err.message.includes('token') || err.message.includes('sesión')) {
          Alert.alert(
            "Sesión expirada", 
            "Por favor inicia sesión nuevamente",
            [{ text: "OK", onPress: () => navigation.navigate('Login') }]
          );
        }
      } finally {
        setCargando(false);
      }
    };

    obtenerDetalles();
  }, [imdbID]);

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
        <Text style={styles.errorText}>{error || 'No se pudo cargar la información'}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
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
      
      <Text style={styles.titulo}>{pelicula.Title} ({pelicula.Year})</Text>
      
      <View style={styles.metaContainer}>
        <Text style={styles.metaText}>{pelicula.Released} • {pelicula.Runtime}</Text>
        <Text style={styles.metaText}>{pelicula.Genre}</Text>
        <Text style={styles.metaText}> {pelicula.imdbRating}/10 ({pelicula.imdbVotes} votos)</Text>
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
    fontSize: 22,
    fontWeight: "bold",
    color: "#b22222",
    marginBottom: 8,
  },
  texto: {
    color: "#000",
    fontSize: 16,
    marginBottom: 6,
    textAlign: "center",
  },
});

export default DetallesPelis;
