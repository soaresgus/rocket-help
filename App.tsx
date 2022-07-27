import React from 'react';

import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts,
} from '@expo-google-fonts/roboto';

import { NativeBaseProvider, StatusBar } from 'native-base';

import { Loading } from './src/components/Loading';

import { SignIn } from './src/screens/SignIn';
import { Home } from './src/screens/Home';
import { THEME } from './src/styles/theme';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {fontsLoaded ? <Home /> : <Loading />}
    </NativeBaseProvider>
  );
}
