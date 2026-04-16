// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// import { createClient } from "supabase";

// // 🌟 CORS 에러 방지를 위한 마법의 헤더
// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers":
//     "authorization, x-client-info, apikey, content-type",
// };

// // 한국투자증권 실전투자(운영) API 주소
// const KIS_URL = "https://openapi.koreainvestment.com:9443";

// serve(async (req) => {
//   // 브라우저의 사전 요청(OPTIONS) 통과시켜주기
//   if (req.method === "OPTIONS") {
//     return new Response("ok", { headers: corsHeaders });
//   }

//   try {
//     // 프론트엔드에서 보낸 종목코드(ticker) 받기
//     const { ticker } = await req.json();
//     const appKey = Deno.env.get("KIS_APP_KEY");
//     const appSecret = Deno.env.get("KIS_APP_SECRET");
//     const supabase = createClient(
//       Deno.env.get("SUPABASE_URL") ?? "",
//       Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
//     );
//     if (!appKey || !appSecret) {
//       throw new Error("API 키가 서버에 설정되지 않았습니다.");
//     }

//     let validToken = "";

//     // 우선 DB에서 'KIS'라는 provider_name을 가진 토큰을 조회
//     const { data: tokenData, error: tokenError } = await supabase
//       .from("api_tokens")
//       .select("*")
//       .eq("provider_name", "KIS")
//       .maybeSingle(); // single 대신 maySingle 사용해야 오류안남.

//     if (tokenError) {
//       console.error("KIS DB 토큰 조회 에러:", tokenError);
//     }

//     const now = new Date();

//     // tokenData가 존재하고, 만료일이 현재보다 미래라면
//     if (tokenData && new Date(tokenData.expires_at) > now) {
//       // 토큰 재활용 (발급 시간 확인 가능!)
//       validToken = tokenData.access_token;
//       console.log(`✅ 기존 토큰 재활용 (발급일시: ${tokenData.created_at})`);
//     } else {
//       // 토큰 신규 발급
//       console.log("⚠️ 토큰이 없거나 만료됨. 새로 발급받습니다.");
//       const tokenRes = await fetch(`${KIS_URL}/oauth2/tokenP`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           grant_type: "client_credentials",
//           appkey: appKey,
//           appsecret: appSecret,
//         }),
//       });

//       const newAuth = await tokenRes.json();
//       validToken = newAuth.access_token;

//       const expiresAt = new Date(now.getTime() + 23 * 60 * 60 * 1000)
//         .toISOString(); // 만료시간 23시간 뒤로 설정 (1시간 여유)

//       // 🌟 새로 발급받은 토큰을 DB에 저장합니다. (onConflict로 중복 방지)
//       await supabase
//         .from("api_tokens")
//         .upsert({
//           provider_name: "KIS",
//           access_token: validToken,
//           expires_at: expiresAt,
//           created_at: now.toISOString(),
//         }, { onConflict: "provider_name" });
//     }

//     // 토큰으로 '주식 현재가' 조회!
//     const priceRes = await fetch(
//       `${KIS_URL}/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${ticker}`,
//       {
//         method: "GET",
//         headers: {
//           "authorization": `Bearer ${validToken}`,
//           "appkey": appKey,
//           "appsecret": appSecret,
//           "tr_id": "FHKST01010100", // 한투의 '주식현재가 시세' 고유 코드
//           "custtype": "P", // 개인(P), 법인(B)
//         },
//       },
//     );

//     const priceData = await priceRes.json();
//     const currentPrice = priceData.output.stck_prpr; // 결과물 중 '현재가' 쏙 빼오기

//     // 5. 프론트엔드로 깔끔하게 가격만 전달!
//     return new Response(JSON.stringify({ price: Number(currentPrice) }), {
//       headers: { ...corsHeaders, "Content-Type": "application/json" },
//       status: 200,
//     });
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     console.error("🚨 [엣지펑션 에러 발생] :", errorMessage);
//     return new Response(JSON.stringify({ error: errorMessage }), {
//       headers: corsHeaders,
//       status: 400,
//     });
//   }
// });
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "supabase";

// 🌟 CORS 에러 방지를 위한 마법의 헤더
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// 한국투자증권 실전투자(운영) API 주소
const KIS_URL = "https://openapi.koreainvestment.com:9443";

// 🌟 [핵심 비급] 서버 메모리에 저장해둘 전역 변수
let cachedToken = "";
let tokenExpiresAt = 0; // 토큰 만료 시간 (숫자형 ms)

serve(async (req) => {
  // 브라우저의 사전 요청(OPTIONS) 통과시켜주기
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1. 프론트엔드에서 보낸 종목코드(ticker) 받기
    const { ticker } = await req.json();
    const appKey = Deno.env.get("KIS_APP_KEY");
    const appSecret = Deno.env.get("KIS_APP_SECRET");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    if (!appKey || !appSecret) {
      throw new Error("API 키가 서버에 설정되지 않았습니다.");
    }

    let validToken = "";
    const now = Date.now();

    // 🚀 1단계: 내 머릿속(메모리)부터 확인! (DB 안 가니까 초고속 0.001초 컷!)
    if (cachedToken && tokenExpiresAt > now) {
      validToken = cachedToken;
      console.log("⚡ [초고속] 메모리에 저장된 토큰을 바로 꺼내 씁니다!");
    } 
    // 🐢 2단계: 머릿속에 없으면 그때서야 DB 금고를 열어봄
    else {
      console.log("🔍 메모리에 토큰이 없어서 DB를 확인합니다...");
      const { data: tokenData, error: tokenError } = await supabase
        .from("api_tokens")
        .select("*")
        .eq("provider_name", "KIS")
        .maybeSingle();
      
      if (tokenError) {
        console.error("KIS DB 토큰 조회 에러:", tokenError);
      }

      if (tokenData && new Date(tokenData.expires_at).getTime() > now) {
        validToken = tokenData.access_token;
        // 🌟 DB에서 찾은 걸 다음을 위해 내 머릿속(메모리)에 저장!
        cachedToken = validToken;
        tokenExpiresAt = new Date(tokenData.expires_at).getTime();
        console.log(`✅ DB에서 찾은 토큰을 메모리에 캐싱했습니다. (발급일시: ${tokenData.created_at})`);
      } else {
        // 🎫 3단계: DB에도 없거나 만료됐으면 한투 가서 새로 발급!
        console.log("⚠️ 토큰이 없거나 만료됨. 새로 발급받습니다.");
        
        // 👉 사라졌던 바로 그 로직 복구! (한투 서버 통신)
        const tokenRes = await fetch(`${KIS_URL}/oauth2/tokenP`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grant_type: "client_credentials",
            appkey: appKey,
            appsecret: appSecret,
          }),
        });

        const newAuth = await tokenRes.json();
        validToken = newAuth.access_token; // 여기서 newAuth를 사용합니다!

        // 23시간 30분(23.5) 더하기
        const expiresAtDate = new Date(now + 23.5 * 60 * 60 * 1000);

        // 🌟 새로 발급받은 걸 다음을 위해 내 머릿속(메모리)에 저장!
        cachedToken = validToken;
        tokenExpiresAt = expiresAtDate.getTime();

        // 🌟 DB에도 갱신해서 저장 (upsert)
        await supabase
          .from("api_tokens")
          .upsert({
            provider_name: "KIS",
            access_token: validToken,
            expires_at: expiresAtDate.toISOString(),
            created_at: new Date().toISOString(),
          }, { onConflict: "provider_name" });
      }
    }

    // 📈 4단계: [놀이기구] 발급받은(혹은 캐싱된) 토큰으로 '주식 현재가' 조회!
    const priceRes = await fetch(
      `${KIS_URL}/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${ticker}`,
      {
        method: "GET",
        headers: {
          "authorization": `Bearer ${validToken}`,
          "appkey": appKey,
          "appsecret": appSecret,
          "tr_id": "FHKST01010100", // 한투의 '주식현재가 시세' 고유 코드
          "custtype": "P", // 개인(P), 법인(B)
        },
      },
    );

    const priceData = await priceRes.json();
    
    // 혹시 모를 한투 에러 방어 코드
    if (!priceData.output) {
      console.error("한투 API 응답 에러:", priceData);
      throw new Error(`한투 API 에러: ${priceData.msg1 || '데이터를 불러올 수 없습니다.'}`);
    }

    const currentPrice = priceData.output.stck_prpr; // 결과물 중 '현재가' 쏙 빼오기

    // 5. 프론트엔드로 깔끔하게 가격만 전달!
    return new Response(JSON.stringify({ price: Number(currentPrice) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("🚨 [엣지펑션 에러 발생] :", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: corsHeaders,
      status: 400,
    });
  }
});