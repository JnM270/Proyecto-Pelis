import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Retoceso from './Retroceso';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { SERVER_URL } from '../config/config';

const Login = ({ navigation }) => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Error', 'Debes completar ambos campos');
    }

    setLoading(true);
    try {

      const resp = await axios.post(
        `${SERVER_URL}/user/login`,
        { email, password }
      );

      if (resp.data.success) {
        
        await SecureStore.setItemAsync('userToken', resp.data.token);

        Alert.alert(
          '✔️ Sesión iniciada',
          `Bienvenido ${resp.data.user.username || resp.data.user.email}`
        );
        
        navigation.replace('ListaPelis');
      } else {
        Alert.alert('Error', resp.data.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('Login fallido:', err.response?.data || err.message);
      Alert.alert(
        'Error',
        err.response?.data?.message ||
        'Ocurrió un error al conectar con el servidor'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Retoceso currentScreenName="Login" navigation={navigation} />

      <View style={styles.topSectionL}>
        <Image source={require('../assets/logoM1.png')} style={styles.logoL} />
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

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Ingresar</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Registro')}>
        <Text style={styles.registerText}>
          ¿No tienes cuenta? Regístrate
        </Text>
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
