import * as S from './Pagination.style';

interface PaginationProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  pageGroupSize: number; // 한 번에 보여줄 페이지 번호 개수 (예: 5)
  onPageChange: (page: number) => void;
}

export const Pagination = ({ totalCount, pageSize, currentPage, pageGroupSize, onPageChange }: PaginationProps) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const currentGroup = Math.ceil(currentPage / pageGroupSize);

  const startPage = (currentGroup - 1) * pageGroupSize + 1;
  const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <S.Pagination>
      <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
        {'<<'}
      </button>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        {'<'}
      </button>

      {pages.map((p) => (
        <S.PageNumber key={p} active={p === currentPage} onClick={() => onPageChange(p)}>
          {p}
        </S.PageNumber>
      ))}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        {'>'}
      </button>
      <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
        {'>>'}
      </button>
    </S.Pagination>
  );
};
