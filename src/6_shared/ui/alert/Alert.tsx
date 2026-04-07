import * as S from './Alert.style';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'right' | 'center';
  variant?: 'primary' | 'secondary' | 'danger';
  deviceSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  message?: string | React.ReactNode;
}

export const Alert = ({
  align = 'center',
  variant = 'primary',
  deviceSize = 'md',
  fullWidth = true,
  message,
  children,
  ...props
}: AlertProps) => {
  return (
    <S.Alert $align={align} $variant={variant} $deviceSize={deviceSize} $fullWidth={fullWidth} {...props}>
      {message || children}
    </S.Alert>
  );
};
