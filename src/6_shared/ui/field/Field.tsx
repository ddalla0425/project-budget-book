import React, { useId } from 'react';
import * as S from './Field.style';

interface ChildProps {
  id?: string;
  deviceSize?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'danger'; // 통일성을 위한 variant 추가
}

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  labelTag?: 'label' | 'span';
  error?: string; // 에러 메시지 내용
  description?: string;
  children: React.ReactElement; // cloneElement를 위해 ReactNode 대신 ReactElement 권장
  required?: boolean;
  deviceSize?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'danger'; // 통일성을 위한 variant 추가
}

export const Field = ({
  label,
  labelTag = 'label',
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
  const isLabel = labelTag === 'label';

  return (
    <S.Field $deviceSize={deviceSize} $variant={variant} {...rest}>
      {label && (
        <S.Label as={labelTag} htmlFor={isLabel ? targetId : undefined}>
          {label}
          {required && <S.RequiredMark>*</S.RequiredMark>}
        </S.Label>
      )}

      {/* 실제 Input이나 Select가 위치할 자리 */}
      <S.ControlWrapper>
        {React.isValidElement(children)
          ? React.cloneElement(children, {
              id: targetId,
              // 자식이 string(예: 'input', 'button')이 아닐 때만 프롭 주입
              ...(typeof children.type !== 'string' && {
                $variant: currentVariant,
                $deviceSize: deviceSize,
              }),
            } as ChildProps)
          : children}
      </S.ControlWrapper>

      {error ? (
        <S.Message $variant="danger">{error}</S.Message>
      ) : (
        description && <S.Message $variant="primary">{description}</S.Message>
      )}
    </S.Field>
  );
};
