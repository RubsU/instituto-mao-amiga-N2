import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DetalheDoacaoScreen from './src/screens/DetalheDoacaoScreen';
import DetalhePontoScreen from './src/screens/DetalhePontoScreen';
import FormularioDoacaoScreen from './src/screens/FormularioDoacaoScreen';
import FormularioPontoScreen from './src/screens/FormularioPontoScreen';
import HistoricoScreen from './src/screens/HistoricoScreen';
import ListaPontosScreen from './src/screens/ListaPontosScreen';
import MeusPontosScreen from './src/screens/MeusPontosScreen';
import type { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

// O App.tsx só monta a navegação
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Pontos">
        <Stack.Screen name="Pontos" component={ListaPontosScreen} options={{ title: 'Pontos de coleta' }} />
        <Stack.Screen name="DetalhePonto" component={DetalhePontoScreen} options={{ title: 'Detalhe do ponto' }} />
        <Stack.Screen name="FormularioPonto" component={FormularioPontoScreen} options={{ title: 'Ponto' }} />
        <Stack.Screen name="MeusPontos" component={MeusPontosScreen} options={{ title: 'Meus pontos' }} />
        <Stack.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Minhas doações' }} />
        <Stack.Screen name="DetalheDoacao" component={DetalheDoacaoScreen} options={{ title: 'Doação' }} />
        <Stack.Screen name="FormularioDoacao" component={FormularioDoacaoScreen} options={{ title: 'Doação' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
