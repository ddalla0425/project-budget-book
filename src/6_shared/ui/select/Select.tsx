import { forwardRef } from 'react';
import * as S from './Select.style';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  deviceSize?: 'sm' | 'md' | 'lg';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ variant = 'primary', deviceSize = 'md', id, children, ...props }, ref) => {
    return (
      <S.Select id={id} ref={ref} $variant={variant} $deviceSize={deviceSize} {...props}>
        {children}
      </S.Select>
    );
  }
);
