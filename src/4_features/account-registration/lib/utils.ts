import { STRICT_NULL_FIELDS } from '../constants/accountStrictNullFields';

export const normalizeAccountValue = (name: string, value: number) => {
  // NaN(빈 값)이거나 0인 경우 체크
  if (Number.isNaN(value) || value === 0) {
    // 0이면 안 되는 필드(결산일 등)는 null로 탈출
    if (STRICT_NULL_FIELDS.includes(name)) {
      return null;
    }
    // 나머지는 안전하게 0으로 변환 (NaN -> 0)
    return 0;
  }

  // 4. 정상적인 숫자라면 그대로 반환
  return value;
};
