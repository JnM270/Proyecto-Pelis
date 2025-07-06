import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import Retoceso from "./Retroceso";

const Login = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'http://X:port'; 

  const handleLogin = async () => {
    // Validaciones
    if (!email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    setIsLoading(true);

    try {
      // Aquí se hace la petición al backend
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el inicio de sesión');
      }
      
      Alert.alert('Tarea completada', 'Se ha iniciado sesión', [
        { text: 'OK', onPress: () => navigation.navigate('ListaPelis') }
      ]);
      
    } catch (error) {
      Alert.alert('Error', error.message || 'Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Gestiona el retroceso entre pantallas */}
      <Retoceso currentScreenName="Login" navigation={navigation} />
      <View style={styles.topSectionL}>
        <Image source={require("../assets/logoM1.png")} style={styles.logoL} />
        <Text style={styles.titleL}>BAD SEED</Text>
      </View>
      
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="Correo electrónico" 
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="Contraseña" 
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
        <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#666666",
    fontFamily: "InterBold",
  },
   logoL: {
    width: 180,
    height: 180,
    marginBottom: 20,
    resizeMode: "contain",
    marginRight: 15,
  },
  titleL: {
    fontSize: 40,
    fontFamily: "InterBold",
    color: "#fff",
    textAlign: "left",
    right: 10,

  },
  topSectionL: {
    flexDirection: "row",
    backgroundColor: "#e13b35",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    top: -150,
  },

  input: {
    margin: 0,
    width: '80%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e13b35',
    borderRadius: 15,
    backgroundColor: "white",
    
  },
  button: {
    backgroundColor: "#cc3a3a",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 10
   
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: "InterBold",
  },

  
   registerText: {
    color: '#666666',
    marginTop: 20,
    fontFamily: "Inter",
   
  },
});

export default Login;

