import React, { useMemo } from 'react';
import * as S from './Table.style';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  width?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  renderExtraRow?: (item: T) => React.ReactNode; // 상세 정보 토글용
}

export const Table = <T,>({ columns, data, onRowClick, renderExtraRow }: TableProps<T>) => {
  // 실시간 데이터 대응을 위한 메모이제이션
  const memoizedData = useMemo(() => data, [data]);

  return (
    <S.TableContainer>
      <S.StyledTable>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={{ width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {memoizedData.map((item, index) => (
            <React.Fragment key={index}>
              <tr onClick={() => onRowClick?.(item)}>
                {columns.map((col, i) => (
                  <td key={i}>
                    {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
              {/* 상세 정보 토글 영역 */}
              {renderExtraRow && <S.ExtraRow>{renderExtraRow(item)}</S.ExtraRow>}
            </React.Fragment>
          ))}
        </tbody>
      </S.StyledTable>
    </S.TableContainer>
  );
};
