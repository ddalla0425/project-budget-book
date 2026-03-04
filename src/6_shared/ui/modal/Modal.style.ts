import styled, { keyframes } from 'styled-components';
import { Button } from '../button';
import { Swiper } from 'swiper/react';

// 모달 등장 애니메이션
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 다른 UI 위에 올라오도록 */
  animation: ${fadeIn} 0.2s ease-out forwards;
`;

export const Container = styled.div`
  background-color: #fff;
  border-radius: 24px; // 좀 더 둥글게 해서 부드러운 느낌
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); // 그림자를 더 깊고 부드럽게
  width: 90%;
  max-width: 500px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 40px;
  /*   animation: ${slideUp} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;*/ // 탄성 있는 애니메이션
`;

export const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 90%;
  max-width: 500px;
  /* Swiper에 줬던 애니메이션과 그림자를 여기로 옮겨도 좋습니다 */
  animation: ${slideUp} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
`;

export const StyledSwiper = styled(Swiper)`
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  background-color: #fff;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  animation: ${slideUp} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;

  .swiper-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    width: 100% !important;
    min-width: 100%;
    height: auto;
  }
`;

/* 페이지네이션 도트 스타일 커스텀 */
export const CustomPagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  z-index: 10;

  /* 💡 Swiper가 생성하는 점들에 대한 스타일 */
  .swiper-pagination-bullet {
    display: inline-flex;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    opacity: 1;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 0 !important;
  }

  .swiper-pagination-bullet-active {
    background: #48b4ff;
    width: 25px; /* 활성화 시 길어지는 효과 */
    border-radius: 5px;
  }
`;

export const ModalCard = styled(Container)`
  box-shadow: none;
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: none;
  animation: none;
  padding: 40px; // 유저님이 정하신 넉넉한 패딩 유지
`;

export const Header = styled.div`
  text-align: center; // 제목 중앙 정렬
  font-size: 24px;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.5px;
`;

export const Content = styled.div`
  padding: 30px 0 60px;
  text-align: center; // 본문 중앙 정렬
  line-height: 1.6;
  color: #666;
  font-size: 16px;

  .main-message {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
  }

  .sub-message {
    display: block;
    font-size: 15px;
    color: #888;
    font-weight: 400;
  }

  .highlight {
    color: #007bff;
    font-weight: 600;
  }

  .emoji {
    font-size: 54px;
    display: block;
    margin-bottom: 24px;
  }
`;

export const Footer = styled.div`
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ModalButton = styled(Button)`
  width: 100%; /* 모달 너비에 맞춤 */
  padding: 16px; /* 좀 더 두툼하게 */
  font-size: 16px; /* 가독성 업 */
  font-weight: 700;
  border-radius: 12px;

  &:active {
    transform: scale(0.98);
  }
`;

// TODO: 추후 중복코드 줄이기
