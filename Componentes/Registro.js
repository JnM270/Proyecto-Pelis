import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'; 
import Retoceso from "./Retroceso"; 
import axios from 'axios';
import { URL_SERVER } from '@env';

const Registro = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = URL_SERVER

const handleRegister = async () => {
  if (!email || !password || !confirmPassword) {
    Alert.alert('Error', 'Todos los campos son obligatorios');
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert('Error', 'Las contraseñas no coinciden');
    return;
  }

  setIsLoading(true);

  try {
    const response = await axios.post(`${API_URL}/api/auth/registro`, {
      email,
      password
    });

    console.log('Registro completado:', response.data);

    Alert.alert('Tarea completada', 'Usuario registrado exitosamente', [
      { text: 'OK', onPress: () => navigation.navigate('ListaPelis') }
    ]);
    
  } catch (error) {
    console.error('Ha ocurrido un error al registrar al usuario:', error.response?.data || error.message);
    const mensaje = error.response?.data?.error || 'Error al registrar el usuario';
    Alert.alert('Error', mensaje);
  } finally {
    setIsLoading(false);
  }
};
 console.log('URL del servidor:', URL_SERVER);

  return (
    <View style={styles.container}>
      {/* Gestiona el retroceso entre pantallas */}
      <Retoceso currentScreenName="Registro" navigation={navigation} />
      <View style={styles.topSectionR}>
        <Image source={require("../assets/logoM1.png")} style={styles.logoR} />
        <Text style={styles.titleR}>BAD SEED</Text>
      </View>
      
      <Text style={styles.title}>Registrarse</Text>
      
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
      
      <TextInput 
      style={styles.input} 
      placeholder="Confirmar contraseña" secureTextEntry 
      value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Crear cuenta</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>¿Ya tienes cuenta? Inicia sesión</Text>
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
    
    
  },
  logoR: {
    width: 180,
    height: 180,
    marginBottom: 20,
    resizeMode: "contain",
    marginRight: 15,
  },
  titleR: {
    fontSize: 40,
    fontFamily: "InterBold",
    color: "#fff",
    textAlign: "left",
    right: 10,

  },
  topSectionR: {
    flexDirection: "row",
    backgroundColor: "#e13b35",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    top: -92,

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
    backgroundColor: '#cc3a3a',
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
   loginText: {
    marginTop: 20,
    color: "#666666",
    fontFamily: "InterRegular",

  },
});

export default Registro;