import {
  HStack,
  VStack,
  IconButton,
  useTheme,
  Text,
  Heading,
  FlatList,
  Center,
  Image,
} from 'native-base';

import { ChatTeardropText, SignOut } from 'phosphor-react-native';
import { useState, useEffect } from 'react';

import Logo from '../assets/logo_secondary.png';
import { Button } from '../components/Button';

import { Filter } from '../components/Filter';
import { Order, IOrder } from '../components/Order';
import { Loading } from '../components/Loading';

import { useNavigation } from '@react-navigation/native';

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { Alert } from 'react-native';

import { dateFormat } from '../utils/firestoreDateFormat';

export function Home() {
  const { colors } = useTheme();

  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>(
    'open'
  );
  const [groupSelected, setGroupSelected] = useState<'all' | 'mine'>('all');
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState<FirebaseAuthTypes.User>();

  const navigation = useNavigation();

  function handleNewOrder() {
    navigation.navigate('new');
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate('details', { orderId });
  }

  function handleLogout() {
    auth()
      .signOut()
      .catch((error) => {
        console.log(error);
        return Alert.alert('Sair', 'Não foi possível sair.');
      });
  }

  useEffect(() => {
    setIsLoading(true);

    auth().onAuthStateChanged((response) => {
      setLoggedUser(response);
    });

    let subscriber;

    if (groupSelected === 'mine') {
      subscriber = firestore()
        .collection('orders')
        .where('status', '==', statusSelected)
        .where('created_by_uid', '==', loggedUser.uid)
        .onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => {
            const { patrimony, description, status, created_at } = doc.data();

            return {
              id: doc.id,
              patrimony,
              description,
              status,
              when: dateFormat(created_at),
            };
          });

          setOrders(data);
          setIsLoading(false);
        });
    } else {
      subscriber = firestore()
        .collection('orders')
        .where('status', '==', statusSelected)
        .onSnapshot((snapshot) => {
          const data = snapshot.docs.map((doc) => {
            const {
              patrimony,
              description,
              status,
              created_at,
              created_by_uid,
            } = doc.data();

            return {
              id: doc.id,
              patrimony,
              description,
              status,
              when: dateFormat(created_at),
            };
          });

          setOrders(data);
          setIsLoading(false);
        });
    }

    return subscriber;
  }, [statusSelected, groupSelected]);

  return (
    <VStack flex={1} pb={6} bg="gray.700">
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Image alt="Logotipo" source={Logo} w={200} h={12} />

        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
          onPress={handleLogout}
        />
      </HStack>

      <VStack flex={1} px={6}>
        <HStack
          w="full"
          mt={8}
          mb={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading color="gray.100">Solicitações</Heading>
          <Text color="gray.200">{orders.length}</Text>
        </HStack>

        <HStack space={3} mb={3}>
          <Filter
            type="primary"
            title="Em andamento"
            onPress={() => setStatusSelected('open')}
            isActive={statusSelected === 'open'}
          />
          <Filter
            type="secondary"
            title="Finalizados"
            onPress={() => setStatusSelected('closed')}
            isActive={statusSelected === 'closed'}
          />
        </HStack>

        <HStack space={3} mb={8}>
          <Filter
            title="todas"
            onPress={() => setGroupSelected('all')}
            isActive={groupSelected === 'all'}
          />
          <Filter
            title="MINHAS SOLICITAÇÕES"
            onPress={() => setGroupSelected('mine')}
            isActive={groupSelected === 'mine'}
          />
        </HStack>

        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Order data={item} onPress={() => handleOpenDetails(item.id)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            ListEmptyComponent={() => (
              <Center>
                <ChatTeardropText color={colors.gray[300]} size={40} />
                <Text color="gray.300" fontSize="xl" mt={6} textAlign="center">
                  {groupSelected === 'mine' ? 'Você a' : 'A'}inda não possuí
                  solicitações{' '}
                  {statusSelected === 'open' ? 'em andamento' : 'finalizadas'}
                </Text>
              </Center>
            )}
          />
        )}

        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}
