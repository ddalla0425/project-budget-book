/**
 * 한글 단어의 마지막 글자 받침 유무를 확인합니다.
 * @param word 확인할 단어
 * @returns 받침이 있으면 true, 없으면 false
 */
export const hasJongSeong = (word: string): boolean => {
  if (!word) return false;
  const lastChar = word.charCodeAt(word.length - 1);
  // 한글의 유니코드 범위 내에 있는지 확인 (가 ~ 힣)
  if (lastChar < 0xac00 || lastChar > 0xd7a3) return false;

  return (lastChar - 0xac00) % 28 > 0;
};

/**
 * 단어에 맞는 한국어 조사를 반환합니다.
 * @param word 대상 단어
 * @param type 필요한 조사 타입 ('을를', '은는', '이가', '와과')
 * @returns 단어 + 알맞은 조사 (예: '은행을', '카드사를')
 */
export const appendJosa = (word: string, type: '을를' | '은는' | '이가' | '와과'): string => {
  if (!word) return '';

  const hasJong = hasJongSeong(word);

  switch (type) {
    case '을를':
      return word + (hasJong ? '을' : '를');
    case '은는':
      return word + (hasJong ? '은' : '는');
    case '이가':
      return word + (hasJong ? '이' : '가');
    case '와과':
      return word + (hasJong ? '과' : '와');
    default:
      return word;
  }
};
