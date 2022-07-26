import { Input as NativeBaseInput, IInputProps } from 'native-base';

export function Input({ ...props }: IInputProps) {
  return (
    <NativeBaseInput
      bg="gray.700"
      h={12}
      size="md"
      borderWidth={0}
      fontSize="md"
      fontFamily="body"
      color="white"
      placeholderTextColor="gray.300"
      _focus={{
        borderWidth: 1,
        borderColor: 'purple.500',
        bg: 'gray.700',
      }}
      {...props}
    />
  );
}
