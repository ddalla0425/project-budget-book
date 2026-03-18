import { isWithinInterval } from 'date-fns';
import { toSafeDate } from './date.utils.';

/**  @description 데이터 필터링 시 사용할 연산자 타입 정의 */
type Operator =
  | 'EQUALS' /** 일치 (===) */
  | 'NOT' /** 불일치 (!==) */
  | 'GT' /** 초과 (>) */
  | 'LT' /** 미만 (<) */
  | 'IN' /** 배열 포함 여부 (Array.includes) */
  | 'NOT_IN' /** 배열 미포함 여부 (!Array.includes) */
  | 'BETWEEN'; /** 범위 포함 여부 (날짜 또는 숫자) */

/** @description 연산자를 포함한 필터 값 타입(구조) 정의 : 연산자 포함 */
interface FilterValue<V> {
  operator: Operator;
  value: V | V[];
}

/** @description 데이터 모델 T에 대한 필터 조건 객체 타입
 * 각 키는 T의 속성명이며, 값은 단일 값, 배열, 또는 FilterValue 객체일 수 있음
 */
export type FilterCondition<T> = {
  [K in keyof T]?: T[K] | T[K][] | FilterValue<T[K]>;
};

/** @description 다양한 형의 값을 비교 가능한 숫자로 변환
 * @param {unknown} val 변환할 값
 * @returns {number} 변환된 숫자 (실패 시 0)
 */
// 비교 가능한 숫자로 변환 함수
const ensureNumber = (val: unknown): number => {
  if (val instanceof Date) return val.getTime();
  const num = Number(val);
  return isNaN(num) ? 0 : num; // 숫자가 아니면 0으로 처리 (혹은 기획에 따라 -Infinity 등)
};

/** @description 여러 조건을 기반으로 배열 데이터를 필터링하는 범용 함수
 * @template T 데이터 모델 타입
 * @param {T[] | undefined} data 필터링할 원본 데이터 배열
 * @param {FilterCondition<T>} filters 적용할 필터 조건 객체
 * @returns {T[]} 필터링된 결과 배열
 */
export const filterData = <T>(data: T[] | undefined, filters: FilterCondition<T>): T[] => {
  if (!data) return [];

  return data.filter((item) => {
    return Object.entries(filters).every(([key, condition]) => {
      const itemValue = item[key as keyof T];

      // 조건 없는 경우 패스
      if (condition === undefined || condition === null) return true;

      // 단순 값 또는 배열 매칭
      if (typeof condition !== 'object' || condition === null || Array.isArray(condition)) {
        if (Array.isArray(condition)) return (condition as unknown[]).includes(itemValue);
        return itemValue === condition;
      }

      const { operator, value } = condition as FilterValue<unknown>;

      const targetValue: number = ensureNumber(itemValue);
      const compareValue: number = ensureNumber(value);

      switch (operator) {
        case 'BETWEEN': // [시작일, 종료일] 형태의 배열을 받음
          if (Array.isArray(value) && value.length === 2) {
            const start = toSafeDate(value[0]);
            const end = toSafeDate(value[1]);
            const current = toSafeDate(itemValue);
            if (start && end && current) {
              return isWithinInterval(current, { start, end });
            }
            return targetValue >= ensureNumber(value[0]) && targetValue <= ensureNumber(value[1]);
          }
          return true;
        case 'GT':
          return targetValue > compareValue;
        case 'LT':
          return targetValue < compareValue;
        case 'NOT':
          return itemValue !== value;
        case 'IN':
          return Array.isArray(value) && value.includes(itemValue);
        case 'NOT_IN':
          return Array.isArray(value) && !value.includes(itemValue);
        case 'EQUALS':
        default:
          return itemValue === value;
      }
    });
  });
};
