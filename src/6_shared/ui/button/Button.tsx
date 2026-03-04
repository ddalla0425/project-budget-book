import * as S from './Button.style';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = ({ variant = 'primary', size = 'md', fullWidth = false, children, ...props }: ButtonProps) => {
  return (
    <S.Button $variant={variant} $size={size} $fullWidth={fullWidth} {...props}>
      {children}
    </S.Button>
  );
};
