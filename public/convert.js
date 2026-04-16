import fs from 'fs';

// 1. CSV 파일 읽기
// const csvText = fs.readFileSync('public/raw_stocks.csv', 'utf-8');
// 파일을 텍스트가 아닌 '바이트 덩어리(Buffer)'로 먼저 읽어옵니다. (utf-8 옵션 제거)
const buffer = fs.readFileSync('public/raw_stocks.csv');
// 한국어 전용 인코딩(euc-kr) 번역기를 돌려서 텍스트로 변환합니다!
const csvText = new TextDecoder('euc-kr').decode(buffer);


// 2. 줄바꿈(\n) 기준으로 배열로 나누고, 첫 줄(헤더)은 날림
const rows = csvText.split('\n').slice(1);

// 3. 필요한 데이터만 뽑아서 JSON 객체로 변환
const stocksJson = rows
  .filter((row) => row.trim() !== '') // 빈 줄 제거
  .map((row) => {
    // 쉼표로 쪼갠 뒤, 모든 열에서 쌍따옴표(")를 찾아서 지워버립니다!
    const columns = row.split(',').map(col => col.replace(/"/g, '').trim());
    return {
      ticker: columns[0], // 종목코드
      name: columns[1], // 종목명
      market: columns[2],
      type: 'STOCK', // 투자 종류 고정
      currency: 'KRW', // 한국 주식이므로 원화 고정
    };
  });

// 4. JSON 파일로 저장
fs.writeFileSync('public/kr_stocks.json', JSON.stringify(stocksJson, null, 2));
console.log('✅ 변환 완료! 총 종목 수:', stocksJson.length);
