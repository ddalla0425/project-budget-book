import * as S from './Button.style';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'active';
  isActive?: boolean;
  deviceSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = ({
  variant = 'primary',
  isActive,
  deviceSize = 'md',
  fullWidth = false,
  children,
  ...props
}: ButtonProps) => {
  return (
    <S.Button $variant={variant} $isActive={isActive} $deviceSize={deviceSize} $fullWidth={fullWidth} {...props}>
      {children}
    </S.Button>
  );
};
