// services/session.js
import * as SecureStore from 'expo-secure-store';

export const getSessionToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('userToken');
    return token || null;
  } catch (error) {
    console.error('Error al leer el token:', error);
    return null;
  }
};

