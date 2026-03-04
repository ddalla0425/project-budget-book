import React, { useId } from 'react';
import * as S from './Field.style';

interface ChildProps {
  id?: string;
  deviceSize?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'danger'; // 통일성을 위한 variant 추가
}

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string; // 에러 메시지 내용
  description?: string;
  children: React.ReactElement; // cloneElement를 위해 ReactNode 대신 ReactElement 권장
  required?: boolean;
  deviceSize?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'danger'; // 통일성을 위한 variant 추가
}

export const Field = ({
  label,
  error,
  description,
  children,
  required,
  deviceSize = 'md',
  variant = 'primary',
  ...rest
}: FieldProps) => {
  const currentVariant = error ? 'danger' : variant;
  const generatedId = useId();
  const targetId = (children.props as ChildProps).id || generatedId;

  return (
    <S.Field $deviceSize={deviceSize} $variant={variant} {...rest}>
      {label && (
        <S.Label>
          {label}
          {required && <S.RequiredMark>*</S.RequiredMark>}
        </S.Label>
      )}

      {/* 실제 Input이나 Select가 위치할 자리 */}
      <S.ControlWrapper>
        {React.cloneElement(children, {
          id: targetId,
          $variant: currentVariant,
          $deviceSize: deviceSize,
        } as ChildProps)}
      </S.ControlWrapper>

      {error ? (
        <S.Message $variant="danger">{error}</S.Message>
      ) : (
        description && <S.Message $variant="primary">{description}</S.Message>
      )}
    </S.Field>
  );
};
