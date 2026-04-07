import {
  addMonths,
  addYears,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isValid,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
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

// /** * @description 기준일(시작일)에 특정 개월 수를 더하여 만기일을 반환 (윤년 및 월말 자동 계산)
//  * @param {string | Date | number | null | undefined} startDate 시작일
//  * @param {number} months 더할 개월 수 (예: 12, 24, 36)
//  * @param {string} [formatStr='yyyy-MM-dd'] 반환 포맷 (기본값: input type="date"에 맞는 'yyyy-MM-dd')
//  * @returns {string} 계산된 만기일 문자열 (유효하지 않은 경우 빈 문자열 반환)
//  */
// export const calculateExpiryDate = (
//   startDate: string | Date | number | null | undefined,
//   months: number,
//   formatStr: string = 'yyyy-MM-dd'
// ): string => {
//   // toSafeDate를 활용해 안전하게 Date 객체로 변환
//   const date = toSafeDate(startDate);

//   // 날짜가 유효하지 않거나, 더할 개월 수가 없으면 빈 문자열 반환
//   if (!date || !months) return '';

//   // date-fns의 addMonths를 사용하여 개월 수 더하기 (31일 -> 30일 등 월말 엣지케이스 자동 방어)
//   const expiryDate = addMonths(date, months);

//   // 원하는 포맷으로 리턴 (기본값은 HTML <input type="date">에 쏙 들어가는 포맷)
//   return format(expiryDate, formatStr);
// };

// 🌟 기간 단위 타입 정의
export type DurationUnit = 'MONTHS' | 'YEARS';

/** * @description 시작일에 특정 기간(개월/년)을 더하여 종료일(만기일)을 반환하는 만능 함수
 * @param {string | Date | number | null | undefined} startDate 시작일
 * @param {number} duration 더할 기간 (예: 12, 24, 3)
 * @param {DurationUnit} [unit='MONTHS'] 기간 단위 ('MONTHS' | 'YEARS') - 기본값은 개월
 * @param {string} [formatStr='yyyy-MM-dd'] 반환 포맷 (기본값: HTML date input 용)
 * @returns {string} 계산된 만기일 문자열 (유효하지 않은 경우 빈 문자열 반환)
 */
export const calculateExpiryDate = (
  startDate: string | Date | number | null | undefined,
  duration: number | null | undefined,
  unit: DurationUnit = 'MONTHS',
  formatStr: string = 'yyyy-MM-dd'
): string => {
  const date = toSafeDate(startDate);

  // 날짜가 없거나, 기간이 0/null 이면 계산하지 않음 (빈 문자열 반환)
  if (!date || !duration || duration <= 0) return '';

  // 단위에 따라 date-fns 함수 선택 (윤년, 월말 자동 계산됨)
  const endDate = unit === 'YEARS' ? addYears(date, duration) : addMonths(date, duration);

  return format(endDate, formatStr);
};

/** @description 기간(개월/년) 변환 유틸리티 */
export const durationUtils = {
  /** @description DB에 저장된 개월 수를 UI 표시용 값으로 변환 (연납 시 12로 나눔)
   * @param {number | null | undefined} months DB에 저장된 총 납입 개월 수
   * @param {'MONTHLY' | 'YEARLY' | 'ONCE' | string} cycle 납입 주기
   * @returns {number | string} 변환된 기간 값 (유효하지 않은 경우 빈 문자열 반환)
   */
  toDisplayValue: (
    months: number | null | undefined,
    cycle: 'MONTHLY' | 'YEARLY' | 'ONCE' | string
  ): number | string => {
    if (!months) return '';
    return cycle === 'YEARLY' ? months / 12 : months;
  },

  /** @description UI에서 입력받은 기간 값을 DB 저장용 개월 수로 변환 (연납 시 12를 곱함)
   * @param {number} inputValue 사용자가 입력한 납입 기간
   * @param {'MONTHLY' | 'YEARLY' | 'ONCE' | string} cycle 납입 주기
   * @returns {number | ''} 계산된 총 개월 수 (숫자가 아닌 경우 빈 문자열 반환)
   */
  toSaveValue: (inputValue: number, cycle: 'MONTHLY' | 'YEARLY' | 'ONCE' | string): number | '' => {
    if (isNaN(inputValue)) return '';
    return cycle === 'YEARLY' ? inputValue * 12 : inputValue;
  },
};
