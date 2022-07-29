import React, { useState } from 'react';

import { Alert } from 'react-native';

import { VStack, Heading, Icon, useTheme } from 'native-base';

import Logo from '../assets/logo_primary.svg';

import { Input } from '../components/Input';
import { Button } from '../components/Button';

import { Envelope, Key } from 'phosphor-react-native';

import auth from '@react-native-firebase/auth';

export function SignIn() {
  const { colors } = useTheme();

  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  function handleSignIn() {
    if (!email || !password) {
      return Alert.alert('Login', 'Informe e-mail e senha.');
    }

    setIsLoading(true);

    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        console.log(error);
        setIsLoading(false);

        if (error.code === 'auth/invalid-email') {
          return Alert.alert('Login', 'E-mail inválido');
        }

        if (error.code === 'auth/user-not-found') {
          return Alert.alert('Login', 'E-mail ou senha inválida.');
        }

        if (error.code === 'auth/wrong-password') {
          return Alert.alert('Login', 'E-mail ou senha inválida.');
        }

        return Alert.alert('Login', 'Não foi possível acessar');
      });
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />

      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>

      <Input
        mb={4}
        placeholder="E-mail"
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
        onChangeText={setEmail}
      />
      <Input
        mb={8}
        placeholder="Senha"
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button
        title="Entrar"
        w="full"
        onPress={handleSignIn}
        isLoading={isLoading}
      />
    </VStack>
  );
}
