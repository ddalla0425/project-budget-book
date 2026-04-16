import { useQuery } from "@tanstack/react-query";
import { supabase } from "./supabaseClient";

// 주식 데이터 타입
export interface StockMarketItem {
    ticker: string;
    name: string;
    market: string;
    type: string;
    currency: string;
}

// 가상화폐 데이터 타입
export interface UpbitMarketItem {
    market: string;
    korean_name: string;
    english_name: string;
}

// 🌟 주식 목록(한국+미국)을 public 폴더에서 가져와 캐싱하는 훅
export const useStockMarketsQuery = (enabled: boolean) => {
    return useQuery({
        queryKey: ["stockMarkets"],
        queryFn: async () => {
            // public 폴더의 두 JSON 파일을 동시에(병렬로) 초고속 로드!
            const [krRes, usRes] = await Promise.all([
                fetch("/kr_stocks.json"),
                fetch("/us_stocks.json"),
            ]);

            const krStocks: StockMarketItem[] = await krRes.json();
            const usStocks: StockMarketItem[] = await usRes.json();

            // 두 배열을 하나로 합쳐서 반환 (총 약 2,740개)
            return [...krStocks, ...usStocks];
        },
        // 정적 파일이므로 한 번 불러오면 앱이 켜져 있는 동안 영구 캐싱!
        staleTime: Infinity,
        enabled, // '주식' 탭을 눌렀을 때만 로드하도록 최적화
    });
};

// 업비트 전체 KRW 마켓 목록을 가져오는 훅 (React Query 캐싱 적용)
export const useUpbitMarketsQuery = (enabled: boolean) => {
    return useQuery({
        queryKey: ["upbitMarkets"],
        queryFn: async () => {
            const res = await fetch(
                "https://api.upbit.com/v1/market/all?isDetails=true",
            );
            if (!res.ok) throw new Error("업비트 목록 로딩 실패");

            const markets: UpbitMarketItem[] = await res.json();
            // KRW 마켓만 필터링해서 반환
            return markets.filter((coin) => coin.market.startsWith("KRW-"));
        },
        // 코인 목록은 자주 안 바뀌므로 하루(24시간) 동안 캐싱하여 불필요한 API 호출 방지
        staleTime: 1000 * 60 * 60 * 24,
        enabled, // 가상화폐를 선택했을 때만 API를 찌르도록 최적화
    });
};

// 특정 코인의 현재가를 단건으로 조회하는 유틸 함수
export const fetchUpbitTickerPrice = async (
    ticker: string,
): Promise<number> => {
    const res = await fetch(
        `https://api.upbit.com/v1/ticker?markets=${ticker}`,
    );
    if (!res.ok) throw new Error("가격 조회 실패");

    const priceData = await res.json();
    return priceData[0]?.trade_price || 0;
};

// 🌟 한국 주식 현재가 조회 (Supabase Edge Function 호출)
export const fetchKoreanStockPrice = async (ticker: string| number): Promise<number> => {
  
  const safeTiccker = String(ticker).padStart(6,'0')
    const { data, error } = await supabase.functions.invoke('get-kis-price', {
    body: { ticker : safeTiccker }, // 아까 테스트할 때 넣었던 그 {"ticker": "005930"} 입니다!
  });
  console.log('입력받은 티커 : ', safeTiccker)

  if (error) {
    console.error('🚨 한투 API 엣지 펑션 에러 원본:', error);
    console.error('🚨 에러 상세 정보(context):', await error.context?.json().catch(() => '상세 정보 없음'));
    // console.error('한투 API 엣지 펑션 에러:', error);
    throw new Error('주식 시세를 불러오지 못했습니다.');
  }

  // 백엔드에서 넘겨준 {"price": 81000} 에서 price만 쏙 빼서 리턴!
  return data.price; 
};