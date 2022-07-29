import { useEffect, useState } from 'react';

import { Alert } from 'react-native';

import { HStack, Text, VStack, useTheme, ScrollView } from 'native-base';

import { Header } from '../components/Header';
import { IOrder } from '../components/Order';
import { Loading } from '../components/Loading';
import { CardDetails } from '../components/CardDetails';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

import { useNavigation, useRoute } from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';

import { OrderFirestoreDTO } from '../DTOS/OrderFirestoreDTO';

import { dateFormat } from '../utils/firestoreDateFormat';

import {
  CircleWavyCheck,
  Hourglass,
  DesktopTower,
  Clipboard,
} from 'phosphor-react-native';

interface RouteParams {
  orderId: string;
}

interface OrderDetails extends IOrder {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState('');
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const { colors } = useTheme();

  const navigation = useNavigation();

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert(
        'Encerrar solicitação',
        'Informa a solução para encerrar a solicitação.'
      );
    }

    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert('Encerrar solicitação', 'Solicitação encerrada.');
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(
          'Encerrar solicitação',
          'Não foi possível encerrar a solicitação.'
        );
      });
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>('orders')
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          description,
          status,
          created_at,
          closed_at,
          solution,
        } = doc.data();

        const closed = closed_at && dateFormat(closed_at);

        setOrder({
          id: doc.id,
          patrimony,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed,
        });

        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Header title="Solicitação" />

      <HStack bg="gray.500" justifyContent="center" p={4}>
        {order.status === 'closed' ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}

        <Text
          fontSize="sm"
          color={
            order.status === 'closed'
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === 'closed' ? 'finalizado' : 'em andamento'}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="equipamento"
          description={`Patrimônio ${order.patrimony}`}
          icon={DesktopTower}
        />

        <CardDetails
          title="descrição do problema"
          description={order.description}
          icon={Clipboard}
          footer={`Aberto em ${order.when}`}
        />

        <CardDetails
          title="solução"
          icon={CircleWavyCheck}
          footer={order.closed && `Encerrado em ${order.closed}`}
          description={order.solution}
        >
          {order.status === 'open' && (
            <Input
              placeholder="Descrição da solução"
              onChangeText={setSolution}
              h={24}
              textAlignVertical="top"
              multiline
              bg="gray.500"
            />
          )}
        </CardDetails>
      </ScrollView>

      {order.status === 'open' && (
        <Button title="Encerrar solicitação" m={5} onPress={handleOrderClose} />
      )}
    </VStack>
  );
}
