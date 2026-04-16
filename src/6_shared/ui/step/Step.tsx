import * as S from './Step.style';

interface StepProps {
  totalSteps: number;
  currentStep: number;
  variant?: 'primary' | 'secondary' | 'danger' | 'disabled' | 'textDisabled';
}

export const Step = ({ totalSteps, currentStep, variant = 'primary' }: StepProps) => {
  return (
    <S.Container>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        return (
          <S.StepWrapper key={stepNumber}>
            <S.StepCircle $isActive={currentStep === stepNumber} $variant={variant}>
              {stepNumber}
            </S.StepCircle>
            {index < totalSteps - 1 && <S.Connector $isActive={currentStep > stepNumber} $variant={variant} />}
          </S.StepWrapper>
        );
      })}
    </S.Container>
  );
};
