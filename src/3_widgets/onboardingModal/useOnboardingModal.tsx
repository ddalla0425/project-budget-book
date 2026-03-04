import { useNavigate } from 'react-router-dom';
import { useModalStore } from '@/6_shared/model';

export const useOnboardingModal = () => {
  const navigate = useNavigate();
  const openModal = useModalStore((s) => s.openModal);

  const openOnboarding = () => {
    openModal({
      slides: [
        {
          title: '반가워요! 👋',
          content: (
            <div>
              <span className="emoji">📊</span>
              <strong className="main-message">서비스 이용이 처음이신가요?</strong>
              <span className="sub-message">똑똑한 자산 관리를 시작해 보세요.</span>
            </div>
          ),
          confirmText: '다음으로',
        },
        {
          title: 'STEP 1. 자산을 등록해 볼까요? ✋',
          content: (
            <div>
              <span className="emoji">📊</span>
              <strong className="main-message">
                아직 등록된 자산이 없어서
                <br />
                대시보드를 구성할 수 없어요!
              </strong>
              <span className="sub-message">
                자산 등록 페이지로 이동해서
                <br />첫 자산을 만들어 보세요~ 🚀
              </span>
            </div>
          ),
          confirmText: '자산 등록하러 가기',
          onConfirm: () => navigate('/account/create'),
        },
      ],
    });
  };

  return { openOnboarding };
};
