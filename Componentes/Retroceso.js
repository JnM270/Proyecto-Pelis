 import { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useNavigationState } from '@react-navigation/native';

const Retoceso = ({ currentScreenName, navigation }) => {
  useEffect(() => {
    const backAction = () => {
      if (currentScreenName === 'ListaPelis' ) {
        Alert.alert(
          'Alerta',
          '¿Deseas volver a la pantalla de inicio?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', onPress: () => navigation.navigate("Inicio") },
          ],
          { cancelable: true }
        );
        return true; 
      } else if (currentScreenName === 'Login' || currentScreenName === 'Registro') {
        navigation.navigate('Inicio');
        return true;
      }

if (currentScreenName === 'Inicio' ) {
        Alert.alert(
          'Alerta',
          '¿Deseas salir de la aplicación?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', onPress: () => BackHandler.exitApp() },
          ],
          { cancelable: true }
          
        );
        return true;
      }
      
if (currentScreenName === "DetallesPelis") {
  navigation.goBack();
  return true;
}
      return false; 
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove(); 
  }, [currentScreenName, navigation]);

  return null; 
};

export default Retoceso;
