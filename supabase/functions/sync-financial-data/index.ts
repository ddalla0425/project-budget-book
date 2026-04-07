import { createClient } from 'supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 1. 토스페이먼츠 및 금융사 코드 정의 (확장형)
const INSTITUTIONS = {
  BANK: {
    '039': '경남은행',
    '034': '광주은행',
    '012': '단위농협',
    '032': '부산은행',
    '045': '새마을금고',
    '064': '산림조합',
    '088': '신한은행',
    '048': '신협',
    '027': '씨티은행',
    '020': '우리은행',
    '071': '우체국',
    '050': '저축은행',
    '037': '전북은행',
    '035': '제주은행',
    '090': '카카오뱅크',
    '089': '케이뱅크',
    '092': '토스뱅크',
    '081': '하나은행',
    '054': '홍콩상하이은행',
    '060': 'BOA',
    '003': 'IBK기업은행',
    '004': 'KB국민은행',
    '031': 'iM뱅크',
    '002': '한국산업은행',
    '023': 'SC제일은행',
    '007': 'Sh수협은행',
    '030': '수협중앙회',
    '011': 'NH농협은행',
  },
  CARD: {
    '3K': '기업 BC',
    '46': '광주은행',
    '71': '롯데카드',
    '30': 'KDB산업은행',
    '31': 'BC카드',
    '51': '삼성카드',
    '38': '새마을금고',
    '41': '신한카드',
    '62': '신협',
    '36': '씨티카드',
    '33': '우리BC카드(BC 매입)',
    W1: '우리카드(우리 매입)',
    '37': '우체국예금보험',
    '39': '저축은행중앙회',
    '35': '전북은행',
    '42': '제주은행',
    '15': '카카오뱅크',
    '3A': '케이뱅크',
    '24': '토스뱅크',
    '21': '하나카드',
    '61': '현대카드',
    '11': 'KB국민카드',
    '91': 'NH농협카드',
    '34': 'Sh수협은행',
  },
  CARD_OVERSEAS: {
    // 해외 카드 브랜드
    '6D': '다이너스 클럽',
    '4M': '마스터카드',
    '3C': '유니온페이',
    '7A': '아메리칸 익스프레스',
    '4J': 'JCB',
    '4V': 'VISA',
  },
  INVESTMENT: {
    '261': '교보증권',
    '267': '대신증권',
    '287': '메리츠증권',
    '238': '미래에셋증권',
    '290': '부국증권',
    '240': '삼성증권',
    '291': '신영증권',
    '278': '신한금융투자',
    '209': '유안타증권',
    '280': '유진투자증권',
    '288': '카카오페이증권',
    '264': '키움증권',
    '271': '토스증권',
    '294': '한국포스증권',
    '270': '하나금융투자',
    '262': '하이투자증권',
    '243': '한국투자증권',
    '269': '한화투자증권',
    '263': '현대차증권',
    '279': 'DB금융투자',
    '218': 'KB증권',
    '227': '다올투자증권',
    '292': 'LIG투자증권',
    '247': 'NH투자증권',
    '266': 'SK증권',
  },
  PAY: {
    TOSSPAY: '토스페이',
    NAVERPAY: '네이버페이',
    SAMSUNGPAY: '삼성페이',
    APPLEPAY: '애플페이',
    LPAY: '엘페이',
    KAKAOPAY: '카카오페이',
    PINPAY: '핀페이',
    PAYCO: '페이코',
    SSG: 'SSG페이',
  },
  TELECOM: {
    KT: 'KT',
    LGU: 'LG 유플러스',
    SKT: 'SK 텔레콤',
    HELLO: 'LG 헬로모바일',
    KCT: '티플러스',
    SK7: 'SK 세븐모바일',
  },
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

    // 2. 통합 데이터 변환 로직
    const finalItems = Object.entries(INSTITUTIONS).flatMap(([type, codeMap]) => {
      return Object.entries(codeMap).map(([code, name]) => ({
        code: `${type}_${code}`, // 중복 방지를 위해 TYPE_CODE 형식 사용
        name: name,
        type: type, // BANK, CARD, INVEST, PAY, TELECOM 등
        updated_at: new Date().toISOString(),
      }));
    });

    // 3. DB Upsert
    const { error } = await supabase.from('financial_institutions').upsert(finalItems, { onConflict: 'code' });

    if (error) throw error;

    return new Response(
      JSON.stringify({
        message: 'Success: Multi-type Sync',
        count: finalItems.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    return new Response(JSON.stringify({ error: 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
