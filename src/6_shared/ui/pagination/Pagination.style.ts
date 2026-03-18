import styled, { css } from 'styled-components';

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 24px;
  padding: 16px 0;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 34px;
    height: 34px;
    padding: 0 8px;
    border: 1px solid #d1d5db; /* gray-300 */
    background: #ffffff;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #4b5563; /* gray-600 */
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      border-color: #3b82f6; /* blue-500 (포인트 컬러) */
      color: #3b82f6;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.4;
      background: #f3f4f6;
    }
  }
`;

export const PageNumber = styled.button<{ active?: boolean }>`
  ${({ active }) =>
    active
      ? css`
          background-color: #3b82f6 !important; /* blue-500 */
          border-color: #3b82f6 !important;
          color: #ffffff !important;
          font-weight: 600;
        `
      : css`
          &:hover {
            background-color: #eff6ff; /* blue-50 */
          }
        `}
`;
