import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModalStore } from '@/6_shared/model/modal.store'; // 스토어 임포트
import * as S from './Modal.style'; // 스타일 임포트
import { SwiperSlide, type SwiperClass } from 'swiper/react';
import { Pagination } from 'swiper/modules';

export const Modal = () => {
  const { isOpen, slides, closeModal } = useModalStore();
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [paginationEl, setPaginationEl] = useState<HTMLDivElement | null>(null);
  // console.log('slides 데이터:', slides);
  // 모달이 열리면 스크롤 방지, 닫히면 해제
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset'; // 컴포넌트 언마운트 시 정리
    };
  }, [isOpen]);

  if (!isOpen || !slides) return null;

  // createPortal을 사용하여 body 직계자식으로 렌더링
  return createPortal(
    // <S.Overlay onClick={closeModal}>
    <S.Overlay>
      <S.ModalWrapper onClick={(e) => e.stopPropagation()}>
        <S.StyledSwiper
          slidesPerView={1}
          spaceBetween={0}
          pagination={{
            clickable: true,
            el: paginationEl,
          }}
          modules={[Pagination]}
          onSwiper={(s) => setSwiper(s)}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <S.ModalCard>
                <S.Header>{slide.title}</S.Header>
                <S.Content>{slide.content}</S.Content>
                <S.Footer>
                  <S.ModalButton
                    variant="primary"
                    onClick={() => {
                      if (index < slides.length - 1) {
                        if (slide.onConfirm) slide.onConfirm();
                        swiper?.slideNext();
                      } else {
                        // 마지막 슬라이드라면 등록된 액션 실행 후 닫기
                        if (slide.onConfirm) {
                          slide.onConfirm();
                        }
                        closeModal();
                      }
                    }}
                  >
                    {slide.confirmText || (index < slides.length - 1 ? '다음으로' : '확인')}
                  </S.ModalButton>
                </S.Footer>
              </S.ModalCard>
            </SwiperSlide>
          ))}
        </S.StyledSwiper>
        <S.CustomPagination ref={setPaginationEl} />
      </S.ModalWrapper>
    </S.Overlay>,
    document.body // body 태그 바로 아래에 렌더링
  );
};
