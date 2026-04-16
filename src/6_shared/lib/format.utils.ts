/** @description 통화 포맷팅을 위한 옵션 객체 인터페이스 */
interface FormatCurrencyOptions {
  /** 통화 코드 (예: 'KRW', 'USD', 'JPY') @default 'KRW' */
  currency?: string;
  /** 로케일 설정 (예: 'ko-KR', 'en-US') @default 'ko-KR' */
  locale?: string;
  /** 양수일 때 '+' 기호를 강제로 표시할지 여부 @default false */
  showSign?: boolean;
  /** 유효하지 않은 숫자값이 들어왔을 때 보여줄 기본 문자열 @default '₩0' */
  fallback?: string;
}

/** @description 숫자를 통화 형식으로 변환하는 범용 유틸리티
 * 숫자를 각 나라의 통화 형식에 맞춰 문자열로 변환합니다.
 * 천 단위 쉼표(,) 처리와 통화 기호 부착을 자동으로 수행합니다.
 * * @param amount - 포맷팅할 숫자 (null, undefined, NaN 대응 가능)
 * @param options - 통화, 로케일, 기호 표시 등 설정을 담은 객체
 * @returns 포맷팅된 통화 문자열
 * * @example
 * formatCurrency(15000); // "₩15,000"
 * formatCurrency(15000, { showSign: true }); // "+₩15,000"
 * formatCurrency(100, { currency: 'USD', locale: 'en-US' }); // "$100.00"
 */
export const formatCurrency = (amount: number | null | undefined, options: FormatCurrencyOptions = {}): string => {
  const { currency = 'KRW', locale = 'ko-KR', showSign = false, fallback = '0₩' } = options;

  // 1. 방어 로직: 숫자가 아니거나 유효하지 않은 값이 들어오면 fallback 반환
  if (amount === null || amount === undefined || isNaN(amount)) {
    return fallback;
  }

  try {
    // 2. Intl.NumberFormat은 브라우저 내장 API로 매우 강력하고 유연함
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    });

    const parts = formatter.formatToParts(amount);
    // 통화 기호('₩')와 나머지 숫자/부호 영역을 분리합니다.
    const currencySymbol = parts.find((part) => part.type === 'currency')?.value || '';
    const numberPart = parts
      .filter((part) => part.type !== 'currency')
      .map((part) => part.value)
      .join('')
      .trim(); // 혹시 모를 공백 제거

    // 🌟 숫자를 먼저 배치하고 기호를 맨 뒤에 붙여 조립합니다.
    let formatted = `${numberPart}${currencySymbol}`;
    // 3. 비즈니스 로직: 양수일 때 '+' 기호 강제 추가
    if (showSign && amount > 0) {
      // locale에 따라 기호 위치가 다를 수 있으므로 신중하게 처리
      // 한국어 기준으로는 보통 앞에 붙임
      formatted = `+${formatted}`;
    }

    return formatted;
  } catch (error) {
    // 에러 발생 시(지원하지 않는 통화 등) 최소한의 방어
    console.error('통화 formatting error:', error);
    return fallback;
  }
};

/** @description 퍼센트 포맷팅 (예: 0.5 -> 50%)
 * 숫자를 퍼센트(%) 형식의 문자열로 변환합니다.
 * 소수점은 반올림하여 정수로 표시합니다.
 * * @param value - 0에서 1 사이의 소수점 값 (예: 0.5)
 * @returns 퍼센트 문자열 (예: "50%")
 * * @example
 * formatPercent(0.125); // "13%"
 */
export const formatPercent = (value: number): string => {
  if (isNaN(value)) return '0%';
  return `${Math.round(value * 100)}%`;
};

/** * @description 숫자를 3자리마다 콤마가 찍힌 문자열로 변환 (화면 표시용)
 * 입력값이 숫자가 아니거나 비어있을 경우 빈 문자열을 반환합니다.
 * * @param value - 변환할 값 (숫자, 문자열, null, 또는 undefined)
 * @returns 콤마가 포함된 문자열 (예: "1,234,567") 또는 빈 문자열
 * * @example
 * formatNumberWithCommas(1234567); // "1,234,567"
 * formatNumberWithCommas("1234.5"); // "1,234.5"
 */
export const formatNumberWithCommas = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined || value === '') return '';
  const num = typeof value === 'string' ? Number(value.replace(/[^0-9.-]/g, '')) : value;
  return isNaN(num) ? '' : num.toLocaleString();
};

/** * @description 콤마가 포함된 문자열에서 숫자만 추출 (DB/상태 저장용)
 * 문자열 내의 숫자, 마침표(.), 마이너스(-) 기호를 제외한 모든 문자를 제거하고 숫자로 변환합니다.
 * * @param value - 콤마가 포함된 숫자 형식의 문자열
 * @returns 변환된 숫자(number) 또는 변환 불가 시 null
 * * @example
 * parseNumberFromCommas("1,234,567"); // 1234567
 * parseNumberFromCommas("₩ 50,000"); // 50000
 */
export const parseNumberFromCommas = (value: string): number | null => {
  if (value.trim() === '') return null;
  const num = Number(value.replace(/[^0-9.-]/g, ''));
  return isNaN(num) ? null : num;
};