import { forwardRef } from 'react';
import * as S from './Input.style';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  deviceSize?: 'sm' | 'md' | 'lg';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'primary', deviceSize = 'md', id, ...props }, ref) => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // 숫자 타입일 때 클릭하면 텍스트 전체 선택
      if (props.type === 'number') {
        if (Number(e.target.value) === 0) {
          e.target.select();
          // React의 onChange 이벤트를 수동으로 트리거하는 가장 안전한 방법
          const event = {
            ...e,
            target: { ...e.target, name: props.name, value: '' },
          } as unknown as React.ChangeEvent<HTMLInputElement>;

          props.onChange?.(event);
        }
      }
      // 기존에 전달받은 onFocus가 있다면 실행
      props.onFocus?.(e);
    };
    return <S.Input id={id} ref={ref} $variant={variant} $deviceSize={deviceSize} {...props} onFocus={handleFocus} />;
  }
);
