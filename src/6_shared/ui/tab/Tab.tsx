import * as S from './Tab.style';

interface TabOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface TabsProps {
  options?: TabOption[];
  currentValue: string;
  variant?: 'default' | 'card' | 'pill' | 'underline' | 'outline' | 'round';
  direction?: 'horizontal' | 'vertical';
  onChange: (value: string) => void;
  disabled?: boolean;
  tabSize?: 'sm' | 'md' | 'lg';
}

export const Tab = ({
  options,
  currentValue,
  variant = 'default',
  direction = 'horizontal',
  onChange,
  disabled,
  tabSize,
}: TabsProps) => {
  return (
    <S.Tab $variant={variant} $direction={direction}>
      {options?.map((opt) => {
        const isSelected = currentValue === opt.value;
        return (
          <S.TabButton
            key={opt.value}
            type="button"
            $isActive={isSelected}
            $tabSize={tabSize}
            $variant={variant}
            disabled={disabled || opt.disabled}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </S.TabButton>
        );
      })}
    </S.Tab>
  );
};
