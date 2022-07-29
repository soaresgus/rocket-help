import { Button as NativeBaseButton, IButtonProps, Heading } from 'native-base';

interface ButtonProps extends IButtonProps {
  title: string;
}

export function Button({ title, ...props }: ButtonProps) {
  return (
    <NativeBaseButton
      bg="purple.700"
      h={12}
      fontSize="sm"
      rounded="sm"
      _pressed={{
        bg: 'purple.500',
      }}
      {...props}
    >
      <Heading color="white" fontSize="sm">
        {title}
      </Heading>
    </NativeBaseButton>
  );
}
