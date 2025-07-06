import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from "expo-font";
import { Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import Inicio from './Componentes/Inicio';
import Login from './Componentes/Login';
import Registro from './Componentes/Registro';
import ListaPelis from './Componentes/ListaPelis';
import DetallesPelis from './Componentes/DetallesPelis';

const Stack = createStackNavigator();

export default function App() {
  
  const [fontsLoaded] = useFonts({
    RobotoRegular: Roboto_400Regular,
    RobotoBold: Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen name="Inicio">
          {props => <Inicio {...props} fontsLoaded={fontsLoaded} />}
        </Stack.Screen> 
        <Stack.Screen name="Registro" component={Registro} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ListaPelis" component={ListaPelis} />
        <Stack.Screen name="DetallesPelis" component={DetallesPelis} />
      
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
