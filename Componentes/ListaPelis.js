import React, { useState } from "react";
import {View,Text,FlatList,TouchableOpacity,Image,StyleSheet,TextInput,ActivityIndicator,Alert} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Retoceso from "./Retroceso";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { SERVER_URL } from "../config/config";

const ListaPelis = () => {
  const [pelicula, setPelicula] = useState("");
  const [resultados, setResultados] = useState([]);
  const [consultado, setConsultado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [genre, setGenre] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [ratingMin, setRatingMin] = useState("");
  const navigation = useNavigation();

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
      if (!token) {
        Alert.alert("Sesión expirada", "Inicia sesión de nuevo", [
          { text: "OK", onPress: () => navigation.replace("Login") }
        ]);
        return;
      }

      const resp = await axios.get(
        `${SERVER_URL}/movies/search`,
        {
          params: { query: texto },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      const baseResults = Array.isArray(resp.data) ? resp.data : [];

      const detailedResults = await Promise.all(
        baseResults.map(async (item) => {
          try {
            const det = await axios.get(
              `${SERVER_URL}/movies/details/${item.imdbID}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                }
              }
            );
            return det.data;
          } catch {
            return null;
          }
        })
      );

      const filtrados = detailedResults.filter((movie) => {
        if (!movie) return false;
        const okGenre  = genre
          ? movie.Genre?.toLowerCase().includes(genre.toLowerCase())
          : true;
        const okYear   = yearMin
          ? parseInt(movie.Year, 10) >= parseInt(yearMin, 10)
          : true;
        const okRating = ratingMin
          ? parseFloat(movie.imdbRating) >= parseFloat(ratingMin)
          : true;
        return okGenre && okYear && okRating;
      });

      setResultados(filtrados);
      setConsultado(true);
    } catch (err) {
      console.error("Error en búsqueda:", err);
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Error inesperado"
      );
      setResultados([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("DetallesPelis", {
          imdbID: item.imdbID,
          titulo: item.Title,
          poster: item.Poster
        })
      }
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

        {/* Filtros */}
        <TextInput
          style={styles.filterInput}
          placeholder="Género (ej. action)"
          value={genre}
          onChangeText={setGenre}
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Año mínimo (ej. 2000)"
          keyboardType="numeric"
          value={yearMin}
          onChangeText={setYearMin}
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Rating mínimo (ej. 7.5)"
          keyboardType="numeric"
          value={ratingMin}
          onChangeText={setRatingMin}
        />
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D32F2F" />
         
        </View>
      )}

      {!isLoading && consultado && resultados.length === 0 && (
        <Text style={styles.noResultsText}>
          No se encontraron resultados para "{pelicula}"
        </Text>
      )}

      <FlatList
        data={resultados}
        renderItem={renderItem}
        keyExtractor={(item) => item.imdbID}
        numColumns={3}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          consultado && resultados.length > 0 && (
          <Text style={styles.resultsCount}>
              {resultados.length} 
              {resultados.length !== 1 && "s"} 
            </Text>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    
  },

  header: {
    width: "100%",
    backgroundColor: "#e13b35",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#800",
    alignSelf: "stretch",
    position: "relative",
    left: 0,
    right: 0,
    top: 40,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "InterBold",
    top: -5,
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
    width: "70%",
    top: 2,
  },

  resultadoTexto: {
    color: "#b22222",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 8,
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
    top: 30
  },
  
});



export default ListaPelis;
