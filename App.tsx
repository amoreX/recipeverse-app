import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './navigation';

import './global.css';

export default function App() {
  return (
    <>
      <SafeAreaProvider>
        <NavigationContainer>
          <Navigation />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </>
  );
}
