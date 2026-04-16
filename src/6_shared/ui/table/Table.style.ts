import styled from 'styled-components';

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb; /* gray-200 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;

  thead {
    background-color: #f9fafb; /* gray-50 */
    border-bottom: 2px solid #e5e7eb; /* gray-200 */
  }

  th {
    padding: 14px 16px;
    font-weight: 600;
    color: #374151; /* gray-700 */
    white-space: nowrap;
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid #f3f4f6; /* gray-100 */
    color: #1f2937; /* gray-800 */
    vertical-align: middle;
  }

  tbody tr {
    transition: background-color 0.2s ease;
    cursor: pointer;

    &:hover {
      background-color: #f3f4f6; /* gray-100 */
    }

    &:last-child td {
      border-bottom: none;
    }
  }
`;

export const ExtraRow = styled.td`
  padding: 20px;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  /* 상세 내용이 들어갈 자리 */
`;
