import * as S from './Alert.style';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  deviceSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  message?: string | React.ReactNode;
}

export const Alert = ({
  variant = 'primary',
  deviceSize = 'md',
  fullWidth = true,
  message,
  children,
  ...props
}: AlertProps) => {
  return (
    <S.Alert $variant={variant} $deviceSize={deviceSize} $fullWidth={fullWidth} {...props}>
      {message || children}
    </S.Alert>
  );
};
