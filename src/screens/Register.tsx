import { useEffect, useState } from 'react';

import { Alert } from 'react-native';

import { VStack } from 'native-base';

import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { Input } from '../components/Input';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { useNavigation } from '@react-navigation/native';

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [loggedUser, setLoggedUser] = useState<FirebaseAuthTypes.User>();

  const navigation = useNavigation();

  function handleNewOrderRegister() {
    if (!patrimony || !description) {
      return Alert.alert('Nova solicitação', 'Preencha todos os campos');
    }

    setIsLoading(true);

    firestore()
      .collection('orders')
      .add({
        patrimony,
        description,
        status: 'open',
        created_at: firestore.FieldValue.serverTimestamp(),
        created_by_uid: loggedUser.uid,
      })
      .then(() => {
        Alert.alert('Nova solicitação', 'Solicitação registrada com sucesso.');
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        return Alert.alert(
          'Nova solicitação',
          'Não foi possível criar uma nova solicitação.'
        );
      });
  }

  useEffect(() => {
    auth().onAuthStateChanged((response) => {
      setLoggedUser(response);
    });
  }, []);

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Nova solicitação" />

      <Input
        placeholder="Número do patrimônio"
        mt={4}
        onChangeText={setPatrimony}
        keyboardType="numeric"
      />

      <Input
        placeholder="Descrição do problema"
        flex={1}
        mt={5}
        multiline
        textAlignVertical="top"
        onChangeText={setDescription}
      />

      <Button
        title="Cadastrar"
        mt={5}
        isLoading={isLoading}
        onPress={handleNewOrderRegister}
      />
    </VStack>
  );
}
