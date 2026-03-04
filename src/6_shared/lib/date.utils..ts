import {
  startOfDay,
  endOfDay,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
  isValid,
  parseISO,
} from 'date-fns';

/** @description 입력된 값을 유효한 Date 객체로 변환
 * @param {unknown} value 변환할 값 (ISO 문자열, 타임스탬프, Date 객체 등)
 * @returns {Date | null} 변환된 Date 객체 (유효하지 않은 경우 null)
 */
export const toSafeDate = (value: unknown): Date | null => {
  if (value instanceof Date) return isValid(value) ? value : null;

  let d: Date;
  if (typeof value === 'string') {
    // ISO 문자열인 경우 parseISO가 new Date()보다 성능과 정확도 면에서 유리
    d = parseISO(value);
  } else if (typeof value === 'number') {
    d = new Date(value);
  } else {
    return null; // 유효하지 않은 경우 null 반환 -> 런타임 에러 방지
  }

  return isValid(d) ? d : null;
};

/** @description 기간 프리셋 타입 정의
 * @type RangeType
 */
type RangeType =
  | 'today' /** 오늘 */
  | 'lastWeekly' /** 오늘기준  역순 7일 */
  | 'weekly' /** 이번주 */
  | 'monthly' /** 이번달 */
  | 'yearly'; /** 올해 */

/** @description 기간 프리셋 기반의 시작/종료 시각 반환
 * @param {RangeType} type 프리셋 타입 ('today' | 'lastWeekly' | 'weekly' | 'monthly' | 'yearly')
 * @param {Date} [baseDate=new Date()] 기준일 (기본값: 현재 시각)
 * @returns {[Date, Date]} [시작 시각, 종료 시각]
 */
export const getDateRange = (type: RangeType, baseDate: Date = new Date()): [Date, Date] => {
  //   switch (type) {
  //     case 'today':
  //       return [startOfDay(baseDate), endOfDay(baseDate)]
  //     case 'weekly':
  //       return [
  //         startOfWeek(baseDate, { weekStartsOn: 1 }),
  //         endOfWeek(baseDate, { weekStartsOn: 1 }),
  //       ]
  //     case 'lastWeekly':
  //       return [startOfDay(subDays(baseDate, 6)), endOfDay(baseDate)]
  //     case 'monthly':
  //       return [startOfMonth(baseDate), endOfMonth(baseDate)]
  //     case 'yearly':
  //       return [startOfYear(baseDate), endOfYear(baseDate)]
  //     default:
  //       return [startOfMonth(baseDate), endOfMonth(baseDate)]
  //   }
  const presets: Record<RangeType, [Date, Date]> = {
    today: [startOfDay(baseDate), endOfDay(baseDate)],
    weekly: [startOfWeek(baseDate, { weekStartsOn: 1 }), endOfWeek(baseDate, { weekStartsOn: 1 })],
    lastWeekly: [startOfDay(subDays(baseDate, 6)), endOfDay(baseDate)],
    monthly: [startOfMonth(baseDate), endOfMonth(baseDate)],
    yearly: [startOfYear(baseDate), endOfYear(baseDate)],
  };
  return presets[type] || presets['monthly'];
};

/** @description 특정 연/월의 전체 시간 범위 반환
 * @param {number} year 연도 (예: 2026)
 * @param {number} month 월 (1 ~ 12)
 * @returns {[Date, Date]} [해당 월 1일 00:00:00, 마지막 날 23:59:59]
 */
export const getSpecificMonthRange = (year: number, month: number): [Date, Date] => {
  const date = new Date(year, month - 1, 1);
  return [startOfMonth(date), endOfMonth(date)];
};

/** @description 사용자 지정 기간의 시작/종료 시간 범위 반환
 * @param {Date | string | number} from 시작일
 * @param {Date | string | number} to 종료일
 * @returns {[Date, Date]} [시작일 00:00:00, 종료일 23:59:59]
 */
export const getCustomRange = (from: Date | string | number, to: Date | string | number): [Date, Date] => {
  const startDate = toSafeDate(from) || new Date(from);
  const endDate = toSafeDate(to) || new Date(to);

  return [startOfDay(startDate), endOfDay(endDate)];
};

/** @description 날짜 범위 배열을 문자열 형식으로 변환
 * @param {[Date, Date]} range [시작일, 종료일]
 * @returns {string} 'yyyy.MM.dd ~ yyyy.MM.dd' 형식의 문자열
 */
export const formatPeriod = (range: [Date, Date]): string => {
  if (!range?.[0] || !range?.[1]) return '';
  return `${format(range[0], 'yyyy.MM.dd')} ~ ${format(range[1], 'yyyy.MM.dd')}`;
};

/** @description ISO 날짜 문자열을 한국 표준시(KST) 포맷 문자열로 변환
 * @param {string | Date | number | null | undefined} value 변환할 날짜 값
 * @param {string} [formatStr='yyyy.MM.dd HH:mm:ss'] 출력 포맷 (기본값: 2024.10.27 15:30)
 * @returns {string} 포맷팅된 날짜 문자열
 */
export const formatKST = (
  value: string | Date | number | null | undefined,
  formatStr: string = 'yyyy.MM.dd HH:mm:ss'
): string => {
  const date = toSafeDate(value);
  if (!date || !isValid(date)) return '';

  // DB(UTC) -> Date 객체 생성 시 브라우저 타임존(KST)이 자동 적용됨
  return format(date, formatStr);
};
