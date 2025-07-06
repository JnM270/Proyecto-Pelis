import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Retoceso from "./Retroceso";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const ListaPelis = () => {
  const [pelicula, setPelicula] = useState("");
  const [resultados, setResultados] = useState([]);
  const [consultado, setConsultado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Reemplaza con tu IP/URL real
  const API_URL = "http://X:port";

  const buscarPeliculas = async (texto) => {
    setPelicula(texto);

    if (texto.length < 3) {
      setResultados([]);
      setConsultado(false);
      return;
    }

    setIsLoading(true);
    setConsultado(false);

    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) throw new Error("No se encontró token de sesión");

      const response = await axios.get(`${API_URL}/api/movies/search`, {
        params: { query: texto },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setResultados(response.data || []);
      setConsultado(true);

    } catch (error) {
      
      const errMsg =
        error.response?.data?.message || error.message || "Error inesperado";
      console.error("Error en búsqueda:", errMsg);

      if (errMsg.toLowerCase().includes("token") || errMsg.toLowerCase().includes("sesión")) {
        Alert.alert("Sesión expirada", "Por favor inicia sesión nuevamente", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert("Error", errMsg);
      }

      setResultados([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("DetallesPelis", {
          imdbID: item.imdbID,
          titulo: item.Title,
          poster: item.Poster,
        })
      }
      style={styles.card}
    >
      <Image
        style={styles.poster}
        source={
          item.Poster === "N/A"
            ? require("../assets/logoM01.png")
            : { uri: item.Poster }
        }
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Retoceso currentScreenName="ListaPelis" navigation={navigation} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>BAD SEED</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar películas..."
          placeholderTextColor="#aaa"
          value={pelicula}
          onChangeText={buscarPeliculas}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D32F2F" />
          <Text style={styles.loadingText}>Buscando películas...</Text>
        </View>
      ) : consultado && resultados.length === 0 ? (
        <Text style={styles.noResultsText}>
          No se encontraron resultados para "{pelicula}"
        </Text>
      ) : null}

      <FlatList
        data={resultados}
        renderItem={renderItem}
        keyExtractor={(item) => item.imdbID}
        numColumns={3}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={
          consultado && resultados.length > 0 ? (
            <Text style={styles.resultsCount}>
              {resultados.length} resultado
              {resultados.length !== 1 ? "s" : ""} encontrado
              {resultados.length !== 1 ? "s" : ""}
            </Text>
          ) : null
        }
      />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    //padding: 12,
  },
  header: {
  width:'100%',
  backgroundColor: '#e13b35',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: '#800',
  alignSelf: 'stretch',
  position: 'relative',
  left: 0,
  right: 0,
  top: 40
},
headerTitle: {
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold',
  fontFamily: "InterBold",
  top: -5
},

  searchInput: {
    backgroundColor: "#a61e1a",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginHorizontal: 10,
    marginBottom: 12,
    color: "#fff",
    width:'70%',
    top:2,
  },
  resultadoTexto: {
    color: "#b22222",
    textAlign: "center",
    marginVertical: 8,
    top: 55,
  },
  lista: {
    alignItems: "center",
  },
  card: {
    margin: 8,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 6,
    top: 60,
  },
});

export default ListaPelis;
