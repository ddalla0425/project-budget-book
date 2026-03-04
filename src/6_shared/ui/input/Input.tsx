import { forwardRef } from 'react';
import * as S from './Input.style';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  deviceSize?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'primary', deviceSize = 'md', id, ...props }, ref) => {
    return <S.Input id={id} ref={ref} $variant={variant} $deviceSize={deviceSize} {...props} />;
  }
);
