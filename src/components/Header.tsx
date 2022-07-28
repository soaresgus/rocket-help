import {
  HStack,
  IconButton,
  useTheme,
  StyledProps,
  Heading,
} from 'native-base';
import { CaretLeft } from 'phosphor-react-native';

interface HeaderProps extends StyledProps {
  title: string;
}

export function Header({ title, ...props }: HeaderProps) {
  const { colors } = useTheme();

  return (
    <HStack
      w="full"
      justifyContent="space-between"
      alignItems="center"
      pb={6}
      pt={12}
      {...props}
    >
      <IconButton icon={<CaretLeft color={colors.gray[200]} size={24} />} />

      <Heading
        color="gray.100"
        textAlign="center"
        fontSize="lg"
        flex={1}
        ml={-6}
      >
        {title}
      </Heading>
    </HStack>
  );
}
