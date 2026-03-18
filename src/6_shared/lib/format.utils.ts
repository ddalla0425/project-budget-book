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
  const { currency = 'KRW', locale = 'ko-KR', showSign = false, fallback = '₩0' } = options;

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

    let formatted = formatter.format(amount);

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
