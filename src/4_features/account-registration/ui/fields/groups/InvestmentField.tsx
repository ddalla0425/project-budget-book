// import { useGetDashboardQuery, type AccountSaveType } from '@/5_entities/account';
// import type { RawDashboardResponse } from '@/5_entities/account/type/rpc.type';
// import { useInstitutionStore } from '@/5_entities/institution';
// import { getConnectedBalanceInfo, getGroupedAssetOptions } from '@/6_shared/lib';
// import { Alert } from '@/6_shared/ui/alert';
// import { Button } from '@/6_shared/ui/button';
// import { Field } from '@/6_shared/ui/field';
// import { Grid } from '@/6_shared/ui/grid';
// import { Input } from '@/6_shared/ui/input';
// import { Select } from '@/6_shared/ui/select';
// import { useMemo, useState } from 'react';

// interface SearchResultAsset {
//   name: string;
//   ticker: string;
//   price: number;
//   type: string;
//   api_id?: string; // 코인게코용 ID (있을 수도 있고 없을 수도 있음)
// }

// // 🌟 가상의 주식/코인 검색 데이터 (나중에 실제 API 검색 결과로 교체)
// const MOCK_SEARCH_RESULTS: SearchResultAsset[] = [
//   { name: '삼성전자', ticker: '005930', price: 81000, type: 'STOCK' },
//   { name: '애플', ticker: 'AAPL', price: 230000, type: 'STOCK' },
//   { name: '테슬라', ticker: 'TSLA', price: 250000, type: 'STOCK' },
//   { name: '비트코인', ticker: 'KRW-BTC', price: 95000000, type: 'CRYPTO' },
//   { name: '이더리움', ticker: 'KRW-ETH', price: 4500000, type: 'CRYPTO' },
// ];

// interface Props {
//   accounts: AccountSaveType;
//   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//   onDetailChange: (field: string, value: string | number | boolean | null) => void;
// }

// export const InvestmentField = ({ accounts, onChange, onDetailChange }: Props) => {
//   const data = accounts as Extract<AccountSaveType, { type: 'INVESTMENT' }>;
//   const institutions = useInstitutionStore((s) => s.institutions);
//   const { data: assetData } = useGetDashboardQuery();
//   const rawData = assetData?.raw as RawDashboardResponse;

//   // 🌟 검색 관련 상태 추가
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState<SearchResultAsset[]>([]);
//   const [isFetching, setIsFetching] = useState(false);

//   const { flatAssets, groupedAssets } = useMemo(() => getGroupedAssetOptions(rawData), [rawData]);
//   const balanceInfo = getConnectedBalanceInfo(data.linked_account_id, flatAssets);

//   // 현재 선택된 투자 종류가 API 검색이 필요한 종류인지 확인
//   const isSearchableType = data.details.investment_type === 'STOCK' || data.details.investment_type === 'CRYPTO';

//   // 🌟 1. 종목 검색 실행 함수
//   // const handleSearch = () => {
//   //   if (!searchTerm.trim()) return setSearchResults([]);
//   //   // 실제로는 여기서 API를 호출합니다!
//   //   const results = MOCK_SEARCH_RESULTS.filter(
//   //     (item) =>
//   //       (item.name.includes(searchTerm) || item.ticker.includes(searchTerm.toUpperCase())) &&
//   //       item.type === data.details.investment_type // 주식이면 주식만, 코인이면 코인만 검색
//   //   );
//   //   setSearchResults(results);
//   // };
// // 🌟 1. 종목 검색 실행 함수 (실제 CoinGecko API 연동)
//   const handleSearch = async () => {
//     if (!searchTerm.trim()) return setSearchResults([]);
//     setIsFetching(true);

//     try {
//       if (data.details.investment_type === 'CRYPTO') {
//         // 🪙 코인게코 무료 검색 API 호출
//         const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchTerm}`);
//         const result = await response.json();

//         // 🚨 방어 로직: 코인게코가 에러를 뱉어서 coins 배열이 아예 없으면 빈 배열로 처리!
//         if (!result.coins || !Array.isArray(result.coins)) {
//           throw new Error('코인게코 API 응답 오류 (Rate Limit 등)');
//         }

//         const cryptoResults = result.coins.slice(0, 5).map((coin: any): SearchResultAsset => ({
//           name: coin.name,
//           ticker: coin.symbol.toUpperCase(),
//           api_id: coin.id,
//           price: 0,
//           type: 'CRYPTO',
//         }));

//         setSearchResults(cryptoResults);
//       } else {
//         const results = MOCK_SEARCH_RESULTS.filter(
//           (item) =>
//             (item.name.includes(searchTerm) || item.ticker.includes(searchTerm.toUpperCase())) &&
//             item.type === 'STOCK'
//         );
//         setSearchResults(results);
//       }
//     } catch (error) {
//       console.error('검색 실패:', error);
//       // 유저에게는 부드럽게 알림
//       alert('검색 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 직접 입력해 주세요.');
//       setSearchResults([]); // 에러 시 리스트 초기화
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   // 🌟 2. 검색된 종목을 클릭했을 때 (자동 입력 마법!)
//   // const handleSelectAsset = (asset: typeof MOCK_SEARCH_RESULTS[0]) => {
//   //   // 부모 폼 데이터 일괄 업데이트
//   //   onChange({ target: { name: 'name', value: asset.name } } as React.ChangeEvent<HTMLInputElement>);
//   //   onDetailChange('ticker_symbol', asset.ticker);
//   //   onDetailChange('last_market_price', asset.price);
//   //   onDetailChange('is_auto_sync', true); // 🎉 검색해서 넣었으니 자동 동기화 ON!

//   //   // 평가 금액 즉시 재계산
//   //   updateValuation(data.details.total_quantity || 0, asset.price);

//   //   // 검색창 초기화
//   //   setSearchTerm('');
//   //   setSearchResults([]);
//   // };
//   // 🌟 2. 검색된 종목을 클릭했을 때 (실시간 가격 조회 후 폼에 입력)
//   const handleSelectAsset = async (asset: any) => {
//     setIsFetching(true);
//     let livePrice = asset.price;

//     try {
//       if (asset.type === 'CRYPTO' && asset.api_id) {
//         // 🪙 클릭한 코인의 '실시간 원화(KRW) 가격'을 가져옵니다!
//         const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${asset.api_id}&vs_currencies=krw`);
//         const priceData = await priceRes.json();
//         livePrice = priceData[asset.api_id]?.krw || 0;
//       }

//       // 부모 폼 데이터 일괄 업데이트
//       onChange({ target: { name: 'name', value: asset.name } } as React.ChangeEvent<HTMLInputElement>);
//       onDetailChange('ticker_symbol', asset.ticker);
//       onDetailChange('last_market_price', livePrice);
//       onDetailChange('is_auto_sync', true); // 자동 동기화 ON

//       // 평가 금액 즉시 재계산
//       updateValuation(data.details.total_quantity || 0, livePrice);

//     } catch (error) {
//       console.error('가격 조회 실패:', error);
//       alert('가격을 불러오는데 실패했습니다.');
//     } finally {
//       setSearchTerm('');
//       setSearchResults([]);
//       setIsFetching(false);
//     }
//   };

//   // // 🌟 3. 이미 입력된 티커의 최신 시세를 다시 불러오는(갱신) 함수
//   // const handleRefreshPrice = async () => {
//   //   if (!data.details.ticker_symbol) return;
//   //   setIsFetching(true); // 버튼을 '불러오는 중...'으로 변경

//   //   // 가상의 API 통신 (실제로는 여기서 티커로 가격을 조회해 옵니다)
//   //   setTimeout(() => {
//   //     // Mock 데이터에서 현재 티커와 일치하는 종목을 찾거나, 없으면 가상의 숫자를 반환
//   //     const foundAsset = MOCK_SEARCH_RESULTS.find((a) => a.ticker === data.details.ticker_symbol);
//   //     const newPrice = foundAsset ? foundAsset.price : 99900; // 테스트용 임시 가격

//   //     // 폼 업데이트
//   //     onDetailChange('last_market_price', newPrice);
//   //     onDetailChange('is_auto_sync', true); // 🎉 다시 자동 동기화 ON! (수동 모드 경고창 사라짐)

//   //     // 평가 금액 재계산
//   //     updateValuation(data.details.total_quantity || 0, newPrice);

//   //     setIsFetching(false); // 로딩 종료
//   //   }, 1000);
//   // };
//   // 🌟 3. 시세 갱신 함수 (실제 API 연동)
//   const handleRefreshPrice = async () => {
//     if (!data.details.ticker_symbol) return;
//     setIsFetching(true);

//     try {
//       let newPrice = data.details.last_market_price;

//       if (data.details.investment_type === 'CRYPTO') {
//         // 💡 팁: 실제 서비스에서는 ticker(BTC)를 코인게코 ID(bitcoin)로 매핑하는 테이블이 필요합니다.
//         // 여기서는 임시로 ticker를 소문자로 변환해서 찔러봅니다 (예: bitcoin, ethereum)
//         const coinId = data.name.toLowerCase(); // 'bitcoin'
//         const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=krw`);
//         const priceData = await priceRes.json();

//         if (priceData[coinId]?.krw) {
//           newPrice = priceData[coinId].krw;
//         } else {
//           throw new Error('가격을 찾을 수 없습니다.');
//         }
//       } else {
//         // 주식은 당분간 1초 딜레이 MOCK 유지
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         newPrice = 85000;
//       }

//       onDetailChange('last_market_price', newPrice);
//       onDetailChange('is_auto_sync', true);
//       updateValuation(data.details.total_quantity || 0, newPrice as number);

//     } catch (error) {
//       alert('최신 시세를 불러오지 못했습니다. 수동으로 입력해주세요.');
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   // 🌟 수량/현재가 변경 시 평가 금액 계산
//   const updateValuation = (qty: number, price: number) => {
//     const valuation = qty * price;
//     onChange({
//       target: { name: 'current_balance', value: valuation, valueAsNumber: valuation, type: 'number' },
//     } as unknown as React.ChangeEvent<HTMLInputElement>);
//   };

//   return (
//     <>
//       <Input type="hidden" name="type" value="INVESTMENT" />

//       <Grid>
//         <Field label="투자 종류">
//           <Select
//             value={data.details.investment_type as string}
//             onChange={(e) => {
//               onDetailChange('investment_type', e.target.value);
//               // 종류가 바뀌면 기존에 입력된 티커와 가격 초기화 (안전장치)
//               onDetailChange('ticker_symbol', null);
//               onDetailChange('last_market_price', 0);
//               onDetailChange('is_auto_sync', false);
//             }}
//           >
//             <option value="STOCK">📈 주식 / ETF</option>
//             <option value="CRYPTO">🪙 가상화폐</option>
//             <option value="REAL_ESTATE">🏠 부동산</option>
//             <option value="CUSTOM">📦 기타 자산</option>
//           </Select>
//         </Field>

//         <Field label="증권사 / 거래소">
//           <Select name="institution_id" value={data.institution_id ?? ''} onChange={onChange}>
//             <option value="" disabled>선택하세요</option>
//             {institutions.filter((i) => i.type === 'INVESTMENT').map((inst) => (
//               <option key={inst.id} value={inst.id}>{inst.name}</option>
//             ))}
//           </Select>
//         </Field>
//       </Grid>

//       {/* 🌟 주식/코인일 때만 노출되는 '종목 검색' UI */}
//       {isSearchableType && (
//         <Grid>
//           <Field label="종목 검색 (자동 입력)">
//             <Grid selectCols="1fr auto">
//               <Input
//                 placeholder="예: 삼성전자, 애플, BTC"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
//               />
//               <Button type="button" variant="outline" onClick={handleSearch}>
//                 검색
//               </Button>
//             </Grid>
//           </Field>

//           {/* 검색 결과 리스트 렌더링 */}
//           {searchResults.length > 0 && (
//             <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '8px', marginTop: '-8px' }}>
//               <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>선택하면 자동으로 입력됩니다.</p>
//               {searchResults.map((asset) => (
//                 <div
//                   key={asset.ticker}
//                   onClick={() => handleSelectAsset(asset)}
//                   style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}
//                 >
//                   <strong>{asset.name} <span style={{ color: '#888', fontSize: '12px' }}>({asset.ticker})</span></strong>
//                   <span style={{ color: '#0066cc' }}>{asset.price.toLocaleString()}원</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </Grid>
//       )}

//       {/* 🌟 이름과 티커 (검색으로 자동 입력되지만, 수동 수정도 가능함) */}
//       <Grid selectCols={isSearchableType ? '1fr 1fr' : '1fr'}>
//         <Field label="자산 명칭">
//           <Input name="name" value={data.name} onChange={onChange} placeholder={isSearchableType ? "검색 시 자동 입력" : "예: 반포 자이 30평"} required />
//         </Field>

//         {/* 부동산/기타 자산일 때는 티커 입력란 숨김 */}
//         {isSearchableType && (
//           <Field label="티커 / 종목코드">
//             <Input
//               value={data.details.ticker_symbol ?? ''}
//               onChange={(e) => onDetailChange('ticker_symbol', e.target.value)}
//               placeholder="직접 입력도 가능"
//             />
//           </Field>
//         )}
//       </Grid>

//       {/* 🌟 수량과 단가 영역 */}
//       <Grid selectCols={isSearchableType ? '1fr 1fr 1fr' : '1fr 1fr'}>
//         <Field label={data.details.investment_type === 'REAL_ESTATE' ? '수량 (기본 1)' : '보유 수량'}>
//           <Input
//             type="number"
//             value={data.details.total_quantity || ''}
//             onChange={(e) => {
//               const qty = e.target.valueAsNumber;
//               onDetailChange('total_quantity', qty);
//               updateValuation(qty, data.details.last_market_price || 0);
//             }}
//           />
//         </Field>
//         <Field label={isSearchableType ? '현재가 (1주/1코인)' : '현재 자산 가치(시세)'}>
//           <Input
//             type="number"
//             value={data.details.last_market_price || ''}
//             onChange={(e) => {
//               const price = e.target.valueAsNumber;
//               onDetailChange('last_market_price', price);
//               onDetailChange('is_auto_sync', false); // 🌟 직접 수정하면 수동 모드로 전환!
//               updateValuation(data.details.total_quantity || 0, price);
//             }}
//           />
//         </Field>

//         {/* API 재호출 버튼도 검색 가능한 자산일 때만 노출 */}
//         {isSearchableType && (
//           <Field label=" ">
//             <Button
//               type="button"
//               variant="outline"
//               disabled={!data.details.ticker_symbol || isFetching}
//               onClick={handleRefreshPrice} // 🌟 만든 함수 연결!
//             >
//               {isFetching ? '불러오는 중...' : '🔄 시세 갱신'}
//             </Button>
//           </Field>
//         )}
//       </Grid>

//       {/* 🌟 원금 및 평가금액 */}
//       <Grid>
//         <Field label="총 투자 원금" description="* 수수료 등을 포함한 실제 투자 금액">
//           <Input
//             type="number"
//             value={data.details.principal_amount || ''}
//             onChange={(e) => onDetailChange('principal_amount', e.target.valueAsNumber)}
//           />
//         </Field>
//         <Field label="현재 평가 금액 (수량 × 현재가)">
//           <Input
//             type="number"
//             value={data.current_balance || ''}
//             readOnly
//             style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold' }}
//           />
//         </Field>
//       </Grid>

//       {/* 🌟 연결 계좌 및 잔액 알림 (기존과 동일) */}
//       <Grid>
//         <Field label='투자금 출금/연결 계좌 (선택)'>
//           {flatAssets.length > 0 ? (
//             <Select name="linked_account_id" value={data.linked_account_id ?? ''} onChange={onChange}>
//               <option value="" disabled>선택하세요</option>
//               {groupedAssets['은행'].length > 0 && (
//                 <optgroup label="🏦 은행 계좌">
//                   {groupedAssets['은행'].map((asset) => (
//                     <option key={asset.id} value={asset.id}>{asset.displayName}</option>
//                   ))}
//                 </optgroup>
//               )}
//             </Select>
//           ) : (
//              <Alert message="등록된 결제 수단이 없습니다." />
//           )}
//         </Field>
//         {balanceInfo.isVisible && balanceInfo.balanceMessage !== '' && (
//           <Field label={balanceInfo.label} labelTag="span" description={balanceInfo.accountName}>
//             <Alert variant="secondary" align="right" message={balanceInfo.balanceMessage} />
//           </Field>
//         )}
//       </Grid>

//       {/* 🌟 수동 모드 경고창 */}
//       {isSearchableType && !data.details.is_auto_sync && (
//         <Alert
//           variant="secondary"
//           message="⚠️ 현재 수동 입력 모드입니다. 대시보드 시세 자동 갱신이 중단되었습니다."
//         />
//       )}
//     </>
//   );
// };

// import { useGetDashboardQuery, type AccountSaveType } from '@/5_entities/account';
// import type { RawDashboardResponse } from '@/5_entities/account/type/rpc.type';
// import { useInstitutionStore } from '@/5_entities/institution';
// import { getConnectedBalanceInfo, getGroupedAssetOptions } from '@/6_shared/lib';
// import { Alert } from '@/6_shared/ui/alert';
// import { Button } from '@/6_shared/ui/button';
// import { Field } from '@/6_shared/ui/field';
// import { Grid } from '@/6_shared/ui/grid';
// import { Input } from '@/6_shared/ui/input';
// import { Select } from '@/6_shared/ui/select';
// import { useMemo, useState } from 'react';

// // 🌟 1. 검색 결과 타입 정의
// interface SearchResultAsset {
//   name: string;
//   ticker: string;
//   price: number;
//   type: string;
//   api_id?: string;
// }

// // 🌟 1-1. 코인게코 API 응답 아이템 타입 정의 (Any 에러 해결!)
// interface CoinGeckoSearchItem {
//   id: string;
//   name: string;
//   symbol: string;
// }

// const MOCK_SEARCH_RESULTS: SearchResultAsset[] = [
//   { name: '삼성전자', ticker: '005930', price: 81000, type: 'STOCK' },
//   { name: '애플', ticker: 'AAPL', price: 230000, type: 'STOCK' },
//   { name: '테슬라', ticker: 'TSLA', price: 250000, type: 'STOCK' },
//   { name: '비트코인', ticker: 'KRW-BTC', price: 95000000, type: 'CRYPTO' },
//   { name: '이더리움', ticker: 'KRW-ETH', price: 4500000, type: 'CRYPTO' },
// ];

// interface Props {
//   accounts: AccountSaveType;
//   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//   onDetailChange: (field: string, value: string | number | boolean | null) => void;
// }

// export const InvestmentField = ({ accounts, onChange, onDetailChange }: Props) => {
//   const data = accounts as Extract<AccountSaveType, { type: 'INVESTMENT' }>;
//   const institutions = useInstitutionStore((s) => s.institutions);
//   const { data: assetData } = useGetDashboardQuery();
//   const rawData = assetData?.raw as RawDashboardResponse;

//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState<SearchResultAsset[]>([]);
//   const [isFetching, setIsFetching] = useState(false);

//   const { flatAssets, groupedAssets } = useMemo(() => getGroupedAssetOptions(rawData), [rawData]);
//   const balanceInfo = getConnectedBalanceInfo(data.linked_account_id, flatAssets);

//   const isSearchableType = data.details.investment_type === 'STOCK' || data.details.investment_type === 'CRYPTO';

//   // 🌟 평단가 & 수량 입력 시 -> 총 투자 원금 자동 계산
//   const updatePrincipal = (qty: number, avgPrice: number) => {
//     const principal = qty * avgPrice;
//     onDetailChange('principal_amount', principal);
//   };

//   // 🌟 수량 & 현재가 입력 시 -> 현재 평가 금액 자동 계산
//   const updateValuation = (qty: number, price: number) => {
//     const valuation = qty * price;
//     onChange({
//       target: { name: 'current_balance', value: valuation, valueAsNumber: valuation, type: 'number' },
//     } as unknown as React.ChangeEvent<HTMLInputElement>);
//   };

//   const handleSearch = async () => {
//     if (!searchTerm.trim()) return setSearchResults([]);
//     setIsFetching(true);

//     try {
//       if (data.details.investment_type === 'CRYPTO') {
//         const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchTerm}`);
//         const result = await response.json();

//         if (!result.coins || !Array.isArray(result.coins)) {
//           throw new Error('코인게코 API 응답 오류');
//         }

//         // 🌟 any 대신 CoinGeckoSearchItem 적용
//         const cryptoResults = result.coins.slice(0, 5).map(
//           (coin: CoinGeckoSearchItem): SearchResultAsset => ({
//             name: coin.name,
//             ticker: coin.symbol.toUpperCase(),
//             api_id: coin.id,
//             price: 0, // 검색 API는 가격이 없으므로 임시 0
//             type: 'CRYPTO',
//           })
//         );

//         setSearchResults(cryptoResults);
//       } else {
//         const results = MOCK_SEARCH_RESULTS.filter(
//           (item) =>
//             (item.name.includes(searchTerm) || item.ticker.includes(searchTerm.toUpperCase())) && item.type === 'STOCK'
//         );
//         setSearchResults(results);
//       }
//     } catch (error) {
//       console.error('검색 실패:', error);
//       setSearchResults([]);
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   // 🌟 파라미터에 명확한 타입 적용
//   const handleSelectAsset = async (asset: SearchResultAsset) => {
//     setIsFetching(true);
//     let livePrice = asset.price;

//     try {
//       if (asset.type === 'CRYPTO' && asset.api_id) {
//         const priceRes = await fetch(
//           `https://api.coingecko.com/api/v3/simple/price?ids=${asset.api_id}&vs_currencies=krw`
//         );
//         const priceData = await priceRes.json();
//         livePrice = priceData[asset.api_id]?.krw || 0;
//       }

//       onChange({ target: { name: 'name', value: asset.name } } as React.ChangeEvent<HTMLInputElement>);
//       onDetailChange('ticker_symbol', asset.ticker);

//       // 🌟 현재가 업데이트
//       onDetailChange('last_market_price', livePrice);
//       onDetailChange('is_auto_sync', true);

//       updateValuation(data.details.total_quantity || 0, livePrice);
//     } catch (error) {
//       console.error('가격 조회 실패:', error);
//       alert('가격을 불러오는데 실패했습니다.');
//     } finally {
//       setSearchTerm('');
//       setSearchResults([]);
//       setIsFetching(false);
//     }
//   };

//   const handleRefreshPrice = async () => {
//     if (!data.details.ticker_symbol) return;
//     setIsFetching(true);

//     try {
//       let newPrice = data.details.last_market_price;

//       if (data.details.investment_type === 'CRYPTO') {
//         const coinId = data.name.toLowerCase();
//         const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=krw`);
//         const priceData = await priceRes.json();

//         if (priceData[coinId]?.krw) {
//           newPrice = priceData[coinId].krw;
//         } else {
//           throw new Error('가격을 찾을 수 없습니다.');
//         }
//       } else {
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         newPrice = 85000;
//       }

//       onDetailChange('last_market_price', newPrice as number);
//       onDetailChange('is_auto_sync', true);
//       updateValuation(data.details.total_quantity || 0, newPrice as number);
//     } catch (error) {
//       alert('최신 시세를 불러오지 못했습니다. 수동으로 입력해주세요.');
//       console.log('코인정보 요청 실패 : ', error);
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   return (
//     <>
//       <Input type="hidden" name="type" value="INVESTMENT" />

//       <Grid>
//         <Field label="투자 종류">
//           <Select
//             value={data.details.investment_type as string}
//             onChange={(e) => {
//               onDetailChange('investment_type', e.target.value);
//               onDetailChange('ticker_symbol', null);
//               onDetailChange('last_market_price', 0);
//               onDetailChange('is_auto_sync', false);
//             }}
//           >
//             <option value="STOCK">📈 주식 / ETF</option>
//             <option value="CRYPTO">🪙 가상화폐</option>
//             <option value="REAL_ESTATE">🏠 부동산</option>
//             <option value="CUSTOM">📦 기타 자산</option>
//           </Select>
//         </Field>

//         <Field label="증권사 / 거래소">
//           <Select name="institution_id" value={data.institution_id ?? ''} onChange={onChange}>
//             <option value="" disabled>
//               선택하세요
//             </option>
//             {institutions
//               .filter((i) => i.type === 'INVESTMENT')
//               .map((inst) => (
//                 <option key={inst.id} value={inst.id}>
//                   {inst.name}
//                 </option>
//               ))}
//           </Select>
//         </Field>
//       </Grid>

//       {isSearchableType && (
//         <Grid>
//           <Field label="종목 검색">
//             <Grid selectCols="1fr auto">
//               <Input
//                 placeholder="예: 삼성전자, 애플, bitcoin"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
//               />
//               <Button type="button" variant="outline" onClick={handleSearch} disabled={isFetching}>
//                 {isFetching ? '검색중...' : '검색'}
//               </Button>
//             </Grid>
//           </Field>

//           {searchResults.length > 0 && (
//             <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '8px', marginTop: '-8px' }}>
//               <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>선택하면 자동으로 입력됩니다.</p>
//               {searchResults.map((asset) => (
//                 <div
//                   key={asset.ticker}
//                   onClick={() => handleSelectAsset(asset)}
//                   style={{
//                     padding: '8px',
//                     cursor: 'pointer',
//                     borderBottom: '1px solid #eee',
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                   }}
//                 >
//                   <strong>
//                     {asset.name} <span style={{ color: '#888', fontSize: '12px' }}>({asset.ticker})</span>
//                   </strong>
//                   {/* 🌟 2. 0원 방지 로직 적용! */}
//                   {/* <span style={{ color: '#0066cc', fontSize: '13px' }}>
//                     {asset.price > 0 ? `${asset.price.toLocaleString()}원` : '👈 클릭 시 시세 확인'}
//                   </span> */}
//                 </div>
//               ))}
//             </div>
//           )}
//         </Grid>
//       )}

//       <Grid selectCols={isSearchableType ? '1fr 1fr' : '1fr'}>
//         <Field label="자산 명칭">
//           <Input
//             name="name"
//             value={data.name}
//             onChange={onChange}
//             placeholder={isSearchableType ? '검색 시 자동 입력' : '예: 반포 자이 30평'}
//             required
//           />
//         </Field>
//         {isSearchableType && (
//           <Field label="티커 / 종목코드">
//             <Input
//               value={data.details.ticker_symbol ?? ''}
//               onChange={(e) => onDetailChange('ticker_symbol', e.target.value)}
//               placeholder="직접 입력도 가능"
//             />
//           </Field>
//         )}
//       </Grid>

//       {/* 🌟 3. 매입 정보 영역 (수량 + 평단가 + 원금 자동계산) */}
//       <Grid selectCols="1fr 1fr 1fr">
//         <Field label="매입 평단가 (1주/1코인)">
//           <Input
//             type="number"
//             value={data.details.average_buy_price || ''}
//             placeholder="내가 산 가격"
//             onChange={(e) => {
//               const avgPrice = e.target.valueAsNumber;
//               onDetailChange('average_buy_price', avgPrice);
//               updatePrincipal(data.details.total_quantity || 0, avgPrice); // 원금 자동계산
//             }}
//           />
//         </Field>

//         <Field label={data.details.investment_type === 'REAL_ESTATE' ? '수량 (기본 1)' : '보유 수량'}>
//           <Input
//             type="number"
//             value={data.details.total_quantity || ''}
//             onChange={(e) => {
//               const qty = e.target.valueAsNumber;
//               onDetailChange('total_quantity', qty);
//               updateValuation(qty, data.details.last_market_price || 0);
//               updatePrincipal(qty, data.details.average_buy_price || 0); // 원금 재계산
//             }}
//           />
//         </Field>

//         <Field label="총 투자 원금">
//           <Input
//             type="number"
//             value={data.details.principal_amount || ''}
//             onChange={(e) => onDetailChange('principal_amount', e.target.valueAsNumber)}
//           />
//         </Field>
//       </Grid>

//       {/* 🌟 3. 현재 가치 정보 영역 (시장가 + 평가금액 + 갱신버튼) */}
//       <Grid selectCols={'.5fr 1fr'}>
//         <Field label={isSearchableType ? '현재 시장가 (1주/1코인)' : '현재 자산 가치(시세)'}>
//           <Input
//             type="number"
//             value={data.details.last_market_price || ''}
//             onChange={(e) => {
//               const price = e.target.valueAsNumber;
//               onDetailChange('last_market_price', price);
//               onDetailChange('is_auto_sync', false); // 수동 모드 전환
//               updateValuation(data.details.total_quantity || 0, price);
//             }}
//           />
//         </Field>

//         <Field label="현재 평가 금액 (총자산 반영)">
//           <Grid>
//             <Input
//               type="number"
//               value={data.current_balance || ''}
//               readOnly
//               style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold' }}
//             />
//             {isSearchableType && (
//               <Button
//                 type="button"
//                 variant="outline"
//                 disabled={!data.details.ticker_symbol || isFetching}
//                 onClick={handleRefreshPrice}
//                 style={{ alignSelf: 'flex-end' }}
//               >
//                 {isFetching ? '로딩중...' : '🔄 현재가'}
//               </Button>
//             )}
//           </Grid>
//         </Field>
//       </Grid>

//       <Grid>
//         <Field label="투자금 출금/연결 계좌 (선택)">
//           {flatAssets.length > 0 ? (
//             <Select name="linked_account_id" value={data.linked_account_id ?? ''} onChange={onChange}>
//               <option value="" disabled>
//                 선택하세요
//               </option>
//               {groupedAssets['은행'].length > 0 && (
//                 <optgroup label="🏦 은행 계좌">
//                   {groupedAssets['은행'].map((asset) => (
//                     <option key={asset.id} value={asset.id}>
//                       {asset.displayName}
//                     </option>
//                   ))}
//                 </optgroup>
//               )}
//             </Select>
//           ) : (
//             <Alert message="등록된 결제 수단이 없습니다." />
//           )}
//         </Field>
//         {balanceInfo.isVisible && balanceInfo.balanceMessage !== '' && (
//           <Field label={balanceInfo.label} labelTag="span" description={balanceInfo.accountName}>
//             <Alert variant="secondary" align="right" message={balanceInfo.balanceMessage} />
//           </Field>
//         )}
//       </Grid>

//       {isSearchableType && !data.details.is_auto_sync && (
//         <Alert variant="secondary" message="⚠️ 현재 수동 입력 모드입니다. 대시보드 시세 자동 갱신이 중단되었습니다." />
//       )}
//     </>
//   );
// };

// import { useGetDashboardQuery, type AccountSaveType } from '@/5_entities/account';
// import type { RawDashboardResponse } from '@/5_entities/account/type/rpc.type';
// import { useInstitutionStore } from '@/5_entities/institution';
// import { getConnectedBalanceInfo, getGroupedAssetOptions } from '@/6_shared/lib';
// import { Alert } from '@/6_shared/ui/alert';
// import { Button } from '@/6_shared/ui/button';
// import { Field } from '@/6_shared/ui/field';
// import { Grid } from '@/6_shared/ui/grid';
// import { Input } from '@/6_shared/ui/input';
// import { Select } from '@/6_shared/ui/select';
// import { useEffect, useMemo, useState } from 'react';

// // 🌟 1. 검색 결과 타입 정의
// interface SearchResultAsset {
//   name: string;
//   ticker: string;
//   price: number;
//   currency: string; // 추가됨!
//   type: string;
//   api_id?: string;
// }

// interface CoinGeckoSearchItem {
//   id: string;
//   name: string;
//   symbol: string;
// }

// const MOCK_SEARCH_RESULTS: SearchResultAsset[] = [
//   { name: '삼성전자', ticker: '005930', price: 81000, currency: 'KRW', type: 'STOCK' },
//   { name: '애플', ticker: 'AAPL', price: 175.5, currency: 'USD', type: 'STOCK' },
//   { name: '테슬라', ticker: 'TSLA', price: 202.3, currency: 'USD', type: 'STOCK' },
//   { name: '비트코인', ticker: 'KRW-BTC', price: 95000000, currency: 'KRW', type: 'CRYPTO' },
//   { name: '이더리움', ticker: 'KRW-ETH', price: 4500000, currency: 'KRW', type: 'CRYPTO' },
// ];

// interface Props {
//   accounts: AccountSaveType;
//   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//   onDetailChange: (field: string, value: string | number | boolean | null) => void;
// }

// export const InvestmentField = ({ accounts, onChange, onDetailChange }: Props) => {
//   const data = accounts as Extract<AccountSaveType, { type: 'INVESTMENT' }>;
//   const institutions = useInstitutionStore((s) => s.institutions);
//   const { data: assetData } = useGetDashboardQuery();
//   const rawData = assetData?.raw as RawDashboardResponse;

//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState<SearchResultAsset[]>([]);
//   const [isFetching, setIsFetching] = useState(false);

//   const { flatAssets, groupedAssets } = useMemo(() => getGroupedAssetOptions(rawData), [rawData]);
//   const balanceInfo = getConnectedBalanceInfo(data.linked_account_id, flatAssets);

//   const isSearchableType = data.details.investment_type === 'STOCK' || data.details.investment_type === 'CRYPTO';
//   const displayCurrency = data.currency || 'KRW';
//   // 🌟 평단가 & 수량 입력 시 -> 총 투자 원금 자동 계산
//   const updatePrincipal = (qty: number, avgPrice: number) => {
//     const principal = qty * avgPrice;
//     onDetailChange('principal_amount', principal);
//   };

//   // 🌟 수량 & 현재가 입력 시 -> 현재 평가 금액 자동 계산
//   const updateValuation = (qty: number, price: number) => {
//     const valuation = qty * price;
//     onChange({
//       target: { name: 'current_balance', value: valuation, valueAsNumber: valuation, type: 'number' },
//     } as unknown as React.ChangeEvent<HTMLInputElement>);
//   };

//   // 🌟 [핵심 로직] 디바운스를 적용한 실시간 검색 (타이핑 후 0.5초 대기 시 실행)
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     const delayDebounceFn = setTimeout(async () => {
//       setIsFetching(true);
//       try {
//         if (data.details.investment_type === 'CRYPTO') {
//           const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchTerm}`);
//           const result = await response.json();

//           if (!result.coins || !Array.isArray(result.coins)) throw new Error('코인게코 API 응답 오류');

//           const cryptoResults = result.coins.slice(0, 5).map((coin: CoinGeckoSearchItem): SearchResultAsset => {
//             // const isStableCoin = ['USDT', 'USDC', 'DAI', 'BUSD', 'FDUSD'].includes(coin.symbol.toUpperCase());
//             const symbol = coin.symbol.toUpperCase();
//             const isStableCoin = symbol.startsWith('USD') || ['DAI', 'BUSD', 'FDUSD'].includes(symbol);
//             return {
//               name: coin.name,
//               ticker: coin.symbol.toUpperCase(),
//               api_id: coin.id,
//               price: 0,
//               currency: isStableCoin ? 'USD' : 'KRW',
//               type: 'CRYPTO',
//             };
//           });
//           setSearchResults(cryptoResults);
//         } else {
//           const results = MOCK_SEARCH_RESULTS.filter(
//             (item) =>
//               (item.name.includes(searchTerm) || item.ticker.includes(searchTerm.toUpperCase())) &&
//               item.type === 'STOCK'
//           );
//           setSearchResults(results);
//         }
//       } catch (error) {
//         console.error('검색 실패:', error);
//         setSearchResults([]);
//       } finally {
//         setIsFetching(false);
//       }
//     }, 500); // 0.5초 (500ms) 대기

//     // 유저가 계속 타이핑하면 이전 타이머를 취소해서 API 호출을 막음
//     return () => clearTimeout(delayDebounceFn);
//   }, [searchTerm, data.details.investment_type]);

//   const handleSelectAsset = async (asset: SearchResultAsset) => {
//     setIsFetching(true);
//     let livePrice = asset.price;

//     try {
//       if (asset.type === 'CRYPTO' && asset.api_id) {
//         // 🌟 요청할 때 해당 코인에 맞는 통화(usd 또는 krw)로 코인게코에 물어봅니다!
//         const vsCurrency = asset.currency.toLowerCase();
//         const priceRes = await fetch(
//           `https://api.coingecko.com/api/v3/simple/price?ids=${asset.api_id}&vs_currencies=${vsCurrency}}`
//         );
//         const priceData = await priceRes.json();
//         livePrice = priceData[asset.api_id]?.krw || 0;
//       }

//       onChange({ target: { name: 'name', value: asset.name } } as React.ChangeEvent<HTMLInputElement>);
//       onDetailChange('ticker_symbol', asset.ticker);
//       onDetailChange('last_market_price', livePrice);
//       onDetailChange('is_auto_sync', true);
//       onDetailChange('base_currency', asset.currency);
//       updateValuation(data.details.total_quantity || 0, livePrice);
//     } catch (error) {
//       console.error('가격 조회 실패:', error);
//       alert('가격을 불러오는데 실패했습니다.');
//     } finally {
//       setSearchTerm(''); // 선택 완료 시 검색창 비우기
//       setSearchResults([]); // 결과창 닫기
//       setIsFetching(false);
//     }
//   };

//   const handleRefreshPrice = async () => {
//     if (!data.details.ticker_symbol) return;
//     setIsFetching(true);

//     try {
//       let newPrice = data.details.last_market_price;

//       if (data.details.investment_type === 'CRYPTO') {
//         const coinId = data.name.toLowerCase();
//         // 🌟 갱신할 때도 폼에 저장된 통화 기준(usd 또는 krw)으로 요청!
//         const vsCurrency = (data.currency || 'KRW').toLowerCase();
//         const priceRes = await fetch(
//           `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${vsCurrency}}`
//         );
//         const priceData = await priceRes.json();

//         if (priceData[coinId]?.krw) {
//           newPrice = priceData[coinId].krw;
//         } else {
//           throw new Error('가격을 찾을 수 없습니다.');
//         }
//       } else {
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         // 🌟 Mock 데이터를 다시 찾아서 해당 주식의 가격을 업데이트 (애플은 175.5 등)
//         const foundStock = MOCK_SEARCH_RESULTS.find((s) => s.ticker === data.details.ticker_symbol);
//         newPrice = foundStock ? foundStock.price : 85000;
//       }

//       onDetailChange('last_market_price', newPrice as number);
//       onDetailChange('is_auto_sync', true);
//       updateValuation(data.details.total_quantity || 0, newPrice as number);
//     } catch (error) {
//       alert('최신 시세를 불러오지 못했습니다. 수동으로 입력해주세요.');
//       console.log('코인정보 요청 실패 : ', error);
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   return (
//     <>
//       <Input type="hidden" name="type" value="INVESTMENT" />

//       <Grid>
//         <Field label="투자 종류">
//           <Select
//             value={data.details.investment_type as string}
//             onChange={(e) => {
//               onDetailChange('investment_type', e.target.value);
//               onDetailChange('ticker_symbol', null);
//               onDetailChange('last_market_price', 0);
//               onDetailChange('is_auto_sync', false);
//               onDetailChange('base_currency', 'KRW');
//               setSearchTerm(''); // 종류 바뀌면 검색어 초기화
//             }}
//           >
//             <option value="STOCK">📈 주식 / ETF</option>
//             <option value="CRYPTO">🪙 가상화폐</option>
//             <option value="REAL_ESTATE">🏠 부동산</option>
//             <option value="CUSTOM">📦 기타 자산</option>
//           </Select>
//         </Field>

//         {isSearchableType && (
//           <Field label="증권사 / 거래소">
//             <Select name="institution_id" value={data.institution_id ?? ''} onChange={onChange}>
//               <option value="" disabled>
//                 선택하세요
//               </option>
//               {institutions
//                 .filter((i) => i.type === 'INVESTMENT')
//                 .map((inst) => (
//                   <option key={inst.id} value={inst.id}>
//                     {inst.name}
//                   </option>
//                 ))}
//             </Select>
//           </Field>
//         )}
//       </Grid>

//       {isSearchableType && (
//         <Grid>
//           <Field label="종목 검색">
//             {/* 🌟 position: relative 를 부모에 주어 자식의 absolute 기준점이 되도록 설정 */}
//             <div style={{ position: 'relative', width: '100%' }}>
//               <Input
//                 placeholder={isFetching ? '검색 중...' : '예: 삼성전자, 애플, bitcoin'}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />

//               {/* 🌟 position: absolute 를 적용하여 검색결과가 위로 떠오르도록 설정 */}
//               {searchResults.length > 0 && (
//                 <div
//                   style={{
//                     position: 'absolute',
//                     top: 'calc(100% + 4px)', // Input 창 바로 아래에 위치
//                     left: 0,
//                     right: 0,
//                     backgroundColor: '#fff',
//                     border: '1px solid #ddd',
//                     borderRadius: '8px',
//                     padding: '8px',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//                     zIndex: 50, // 다른 폼들보다 항상 위에 뜨도록
//                     maxHeight: '250px', // 너무 길어지면 스크롤
//                     overflowY: 'auto',
//                   }}
//                 >
//                   <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px', paddingLeft: '4px' }}>
//                     선택하면 자동으로 입력됩니다.
//                   </p>
//                   {searchResults.map((asset) => (
//                     <div
//                       key={asset.ticker}
//                       onClick={() => handleSelectAsset(asset)}
//                       style={{
//                         padding: '10px 8px',
//                         cursor: 'pointer',
//                         borderBottom: '1px solid #f0f0f0',
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                       }}
//                     >
//                       <strong>
//                         {asset.name} <span style={{ color: '#888', fontSize: '12px' }}>({asset.ticker})</span>
//                       </strong>
//                       {/* 🌟 2. 통화 표시 추가! */}
//                       <span style={{ color: '#0066cc', fontSize: '13px', fontWeight: '500' }}>
//                         {asset.price > 0
//                           ? `${asset.price.toLocaleString()} ${asset.currency}`
//                           : `👈 클릭 시 ${asset.currency} 시세 확인`}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </Field>
//         </Grid>
//       )}

//       <Grid selectCols={isSearchableType ? '1fr 1fr 1fr' : '1fr 1fr'}>
//         <Field label="자산 명칭">
//           <Input
//             name="name"
//             value={data.name}
//             onChange={onChange}
//             placeholder={isSearchableType ? '검색 시 자동 입력' : '예: 반포 자이 30평'}
//             required
//           />
//         </Field>
//         {isSearchableType && (
//           <Field label="티커 / 종목코드">
//             <Input
//               value={data.details.ticker_symbol ?? ''}
//               onChange={(e) => onDetailChange('ticker_symbol', e.target.value)}
//               placeholder="직접 입력도 가능"
//             />
//           </Field>
//         )}
//         <Field label={isSearchableType ? `현재 시장가 (${displayCurrency})` : `현재 자산 가치 (${displayCurrency})`}>
//           <Input
//             type="number"
//             value={data.details.last_market_price || ''}
//             onChange={(e) => {
//               const price = e.target.valueAsNumber;
//               onDetailChange('last_market_price', price);
//               onDetailChange('is_auto_sync', false);
//               updateValuation(data.details.total_quantity || 0, price);
//             }}
//           />
//         </Field>
//       </Grid>

//       <Grid selectCols="1fr 1fr 1fr">
//         <Field
//           label={isSearchableType ? `매입 평단가 (${displayCurrency})` : `매입 평 단가 (${displayCurrency})`}
//           description={isSearchableType ? '* 1주/1코인 당' : '* 1평당'}
//         >
//           <Input
//             type="number"
//             value={data.details.average_buy_price || ''}
//             placeholder="예: 20000"
//             onChange={(e) => {
//               const avgPrice = e.target.valueAsNumber;
//               onDetailChange('average_buy_price', avgPrice);
//               updatePrincipal(data.details.total_quantity || 0, avgPrice);
//             }}
//           />
//         </Field>

//         <Field label={data.details.investment_type === 'REAL_ESTATE' ? '평수' : '보유 수량'}>
//           <Input
//             type="number"
//             placeholder="예: 10"
//             value={data.details.total_quantity || ''}
//             onChange={(e) => {
//               const qty = e.target.valueAsNumber;
//               onDetailChange('total_quantity', qty);
//               updateValuation(qty, data.details.last_market_price || 0);
//               updatePrincipal(qty, data.details.average_buy_price || 0);
//             }}
//           />
//         </Field>

//         <Field label={`총 투자 원금 (${displayCurrency})`}>
//           <Input
//             type="number"
//             placeholder="예: 200000"
//             value={data.details.principal_amount || ''}
//             onChange={(e) => onDetailChange('principal_amount', e.target.valueAsNumber)}
//           />
//         </Field>
//       </Grid>

//       <Grid>
//         <Field label={`현재 평가 금액 (${displayCurrency})`}>
//           <Grid selectCols="1fr 100px">
//             <Input
//               type="number"
//               value={data.current_balance || ''}
//               readOnly
//               style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold' }}
//             />
//             {isSearchableType && (
//               <Button
//                 type="button"
//                 variant="outline"
//                 disabled={!data.details.ticker_symbol || isFetching}
//                 onClick={handleRefreshPrice}
//                 style={{ alignSelf: 'flex-end' }}
//               >
//                 {isFetching ? '로딩중...' : '🔄 현재가'}
//               </Button>
//             )}
//           </Grid>
//         </Field>
//       </Grid>

//       <Grid>
//         <Field label="투자금 출금/연결 계좌 (선택)">
//           {flatAssets.length > 0 ? (
//             <Select name="linked_account_id" value={data.linked_account_id ?? ''} onChange={onChange}>
//               <option value="" disabled>
//                 선택하세요
//               </option>
//               {groupedAssets['은행']?.length > 0 && (
//                 <optgroup label="🏦 은행 계좌">
//                   {groupedAssets['은행'].map((asset) => (
//                     <option key={asset.id} value={asset.id}>
//                       {asset.displayName}
//                     </option>
//                   ))}
//                 </optgroup>
//               )}
//             </Select>
//           ) : (
//             <Alert message="등록된 결제 수단이 없습니다." />
//           )}
//         </Field>
//         {balanceInfo.isVisible && balanceInfo.balanceMessage !== '' && (
//           <Field label={balanceInfo.label} labelTag="span" description={balanceInfo.accountName}>
//             <Alert variant="secondary" align="right" message={balanceInfo.balanceMessage} />
//           </Field>
//         )}
//       </Grid>

//       {isSearchableType && !data.details.is_auto_sync && (
//         <Alert variant="secondary" message="⚠️ 현재 수동 입력 모드입니다. 대시보드 시세 자동 갱신이 중단되었습니다." />
//       )}
//     </>
//   );
// };

// CG-KNTMp6PWSJZj5u3VkhFQ2Z3J
// https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=bitcoin&x_cg_demo_api_key=CG-KNTMp6PWSJZj5u3VkhFQ2Z3J

// import { useGetDashboardQuery, type AccountSaveType } from '@/5_entities/account';
// import type { RawDashboardResponse } from '@/5_entities/account/type/rpc.type';
// import { useInstitutionStore } from '@/5_entities/institution';
// import { getConnectedBalanceInfo, getGroupedAssetOptions } from '@/6_shared/lib';
// import { Alert } from '@/6_shared/ui/alert';
// import { Button } from '@/6_shared/ui/button';
// import { Field } from '@/6_shared/ui/field';
// import { Grid } from '@/6_shared/ui/grid';
// import { Input } from '@/6_shared/ui/input';
// import { Select } from '@/6_shared/ui/select';
// import { useEffect, useMemo, useState } from 'react';

// // 🌟 검색 결과 타입
// interface SearchResultAsset {
//   name: string;
//   ticker: string;
//   price: number;
//   currency: string;
//   type: string;
// }

// // 🌟 업비트 마켓(코인 목록) 정보 타입
// interface UpbitMarketItem {
//   market: string; // 예: KRW-BTC
//   korean_name: string; // 예: 비트코인
//   english_name: string; // 예: Bitcoin
// }

// const MOCK_SEARCH_RESULTS: SearchResultAsset[] = [
//   { name: '삼성전자', ticker: '005930', price: 81000, currency: 'KRW', type: 'STOCK' },
//   { name: '애플', ticker: 'AAPL', price: 175.5, currency: 'USD', type: 'STOCK' },
//   { name: '테슬라', ticker: 'TSLA', price: 202.3, currency: 'USD', type: 'STOCK' },
// ];

// interface Props {
//   accounts: AccountSaveType;
//   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//   onDetailChange: (field: string, value: string | number | boolean | null) => void;
// }

// export const InvestmentField = ({ accounts, onChange, onDetailChange }: Props) => {
//   const data = accounts as Extract<AccountSaveType, { type: 'INVESTMENT' }>;
//   const institutions = useInstitutionStore((s) => s.institutions);
//   const { data: assetData } = useGetDashboardQuery();
//   const rawData = assetData?.raw as RawDashboardResponse;

//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState<SearchResultAsset[]>([]);
//   const [isFetching, setIsFetching] = useState(false);

//   // 🌟 업비트 코인 전체 목록을 담아둘 상태 (한 번만 불러와서 저장)
//   const [upbitMarkets, setUpbitMarkets] = useState<UpbitMarketItem[]>([]);

//   const { flatAssets, groupedAssets } = useMemo(() => getGroupedAssetOptions(rawData), [rawData]);
//   const balanceInfo = getConnectedBalanceInfo(data.linked_account_id, flatAssets);

//   const isSearchableType = data.details.investment_type === 'STOCK' || data.details.investment_type === 'CRYPTO';
//   const displayCurrency = data.currency || 'KRW';

//   const updatePrincipal = (qty: number, avgPrice: number) => {
//     const principal = qty * avgPrice;
//     onDetailChange('principal_amount', principal);
//   };

//   const updateValuation = (qty: number, price: number) => {
//     const valuation = qty * price;
//     onChange({
//       target: { name: 'current_balance', value: valuation, valueAsNumber: valuation, type: 'number' },
//     } as unknown as React.ChangeEvent<HTMLInputElement>);
//   };

//   // 🌟 1. 가상화폐 선택 시 업비트에서 코인 목록 딱 1번만 가져오기
//   useEffect(() => {
//     if (data.details.investment_type === 'CRYPTO' && upbitMarkets.length === 0) {
//       fetch('https://api.upbit.com/v1/market/all?isDetails=true')
//         .then((res) => res.json())
//         .then((markets) => {
//           // 우리가 필요한 건 원화(KRW)로 거래되는 코인들!
//           const krwMarkets = markets.filter((coin: UpbitMarketItem) => coin.market.startsWith('KRW-'));
//           setUpbitMarkets(krwMarkets);
//         })
//         .catch((err) => console.error('업비트 목록 로딩 실패:', err));
//     }
//   }, [data.details.investment_type, upbitMarkets.length]);

//   // 🌟 2. 타자 칠 때 실행되는 로컬 검색 로직 (API 안 찌름! 초고속!)
//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     const delayDebounceFn = setTimeout(() => {
//       try {
//         if (data.details.investment_type === 'CRYPTO') {
//           // 업비트 목록(메모리)에서 한글, 영어, 티커 중 하나라도 일치하면 검색 (초고속 필터링)
//           const lowerTerm = searchTerm.toLowerCase();
//           const filtered = upbitMarkets
//             .filter(
//               (coin) =>
//                 coin.korean_name.includes(searchTerm) ||
//                 coin.english_name.toLowerCase().includes(lowerTerm) ||
//                 coin.market.toLowerCase().includes(lowerTerm)
//             )
//             .slice(0, 5); // 상위 5개만

//           const cryptoResults = filtered.map(
//             (coin): SearchResultAsset => ({
//               name: coin.korean_name, // 예: 비트코인 (한글 지원!)
//               ticker: coin.market, // 예: KRW-BTC
//               price: 0,
//               currency: 'KRW', // 업비트 원화 마켓이므로 KRW 고정
//               type: 'CRYPTO',
//             })
//           );
//           setSearchResults(cryptoResults);
//         } else {
//           const results = MOCK_SEARCH_RESULTS.filter(
//             (item) =>
//               (item.name.includes(searchTerm) || item.ticker.includes(searchTerm.toUpperCase())) &&
//               item.type === 'STOCK'
//           );
//           setSearchResults(results);
//         }
//       } catch (error) {
//         console.error('검색 실패:', error);
//         setSearchResults([]);
//       }
//     }, 200); // 로컬 검색이므로 디바운스를 0.2초로 확 줄여서 반응속도 극대화!

//     return () => clearTimeout(delayDebounceFn);
//   }, [searchTerm, data.details.investment_type, upbitMarkets]);

//   // 🌟 3. 종목 클릭 시 업비트 시세 조회 API 찌르기
//   const handleSelectAsset = async (asset: SearchResultAsset) => {
//     setIsFetching(true);
//     let livePrice = asset.price;

//     try {
//       if (asset.type === 'CRYPTO' && asset.ticker) {
//         // 업비트의 현재가(ticker) 조회 API (이건 찔러야 됨)
//         const priceRes = await fetch(`https://api.upbit.com/v1/ticker?markets=${asset.ticker}`);
//         const priceData = await priceRes.json();
//         livePrice = priceData[0]?.trade_price || 0; // trade_price 가 현재가입니다.
//       }

//       onChange({ target: { name: 'name', value: asset.name } } as React.ChangeEvent<HTMLInputElement>);
//       onDetailChange('ticker_symbol', asset.ticker);
//       onDetailChange('last_market_price', livePrice);
//       onDetailChange('is_auto_sync', true);
//       onDetailChange('base_currency', asset.currency);

//       updateValuation(data.details.total_quantity || 0, livePrice);
//     } catch (error) {
//       console.error('가격 조회 실패:', error);
//       alert('가격을 불러오는데 실패했습니다.');
//     } finally {
//       setSearchTerm('');
//       setSearchResults([]);
//       setIsFetching(false);
//     }
//   };

//   // 🌟 4. 시세 갱신 버튼 클릭 시 업비트 최신가 가져오기
//   const handleRefreshPrice = async () => {
//     if (!data.details.ticker_symbol) return;
//     setIsFetching(true);

//     try {
//       let newPrice = data.details.last_market_price;

//       if (data.details.investment_type === 'CRYPTO') {
//         const priceRes = await fetch(`https://api.upbit.com/v1/ticker?markets=${data.details.ticker_symbol}`);
//         const priceData = await priceRes.json();

//         if (priceData && priceData.length > 0) {
//           newPrice = priceData[0].trade_price;
//         } else {
//           throw new Error('가격을 찾을 수 없습니다.');
//         }
//       } else {
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//         const foundStock = MOCK_SEARCH_RESULTS.find((s) => s.ticker === data.details.ticker_symbol);
//         newPrice = foundStock ? foundStock.price : 85000;
//       }

//       onDetailChange('last_market_price', newPrice as number);
//       onDetailChange('is_auto_sync', true);
//       updateValuation(data.details.total_quantity || 0, newPrice as number);
//     } catch (error) {
//       alert('최신 시세를 불러오지 못했습니다. 수동으로 입력해주세요.');
//       console.error('코인정보 요청 실패 : ', error);
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   return (
//     <>
//       <Input type="hidden" name="type" value="INVESTMENT" />

//       <Grid>
//         <Alert message="" />
//       </Grid>
//       <Grid>
//         <Field label="투자 종류">
//           <Select
//             value={data.details.investment_type as string}
//             onChange={(e) => {
//               onDetailChange('investment_type', e.target.value);
//               onDetailChange('ticker_symbol', null);
//               onDetailChange('last_market_price', 0);
//               onDetailChange('is_auto_sync', false);
//               onDetailChange('base_currency', 'KRW');
//               setSearchTerm('');
//             }}
//           >
//             <option value="STOCK">📈 주식 / ETF</option>
//             <option value="CRYPTO">🪙 가상화폐</option>
//             <option value="REAL_ESTATE">🏠 부동산</option>
//             <option value="CUSTOM">📦 기타 자산</option>
//           </Select>
//         </Field>

//         <Field label="증권사 / 거래소">
//           <Select name="institution_id" value={data.institution_id ?? ''} onChange={onChange}>
//             <option value="" disabled>
//               선택하세요
//             </option>

//             {data.details.investment_type === 'STOCK' ? (
//               institutions
//                 .filter((i) => i.type === 'INVESTMENT')
//                 .map((inst) => (
//                   <option key={inst.id} value={inst.id}>
//                     {inst.name}
//                   </option>
//                 ))
//             ) : (
//               <option value="">업비트</option>
//               // TODO : 업비트 financial_institutions에 넣을지 말지 고민, 넣을거면 넣고 아이디 연결.
//               // 안 넣을거면 어떻게 처리 할 지 고민하기 ㅠㅠ 일단 타입이 CRYPTO 이면, 업비트 하나밖에 없으니까.
//               // 지금 value값을 '' 으로 두고, 인풋 히든으로 accounts의 description에 '업비트' 넣을지 고민해보기.
//             )}
//           </Select>
//         </Field>

//         {/* <Field label="거래 통화 (Currency)">
//           <Select
//             name="base_currency"
//             value={displayCurrency}
//             onChange={(e) => {
//               onDetailChange('base_currency', e.target.value);
//               if (data.details.ticker_symbol) onDetailChange('is_auto_sync', false);
//             }}
//           >
//             <option value="KRW">🇰🇷 KRW (원)</option>
//             <option value="USD">🇺🇸 USD (달러)</option>
//             <option value="EUR">🇪🇺 EUR (유로)</option>
//             <option value="JPY">🇯🇵 JPY (엔)</option>
//             <option value="CNY">🇨🇳 CNY (위안)</option>
//           </Select>
//         </Field> */}
//       </Grid>

//       {isSearchableType && (
//         <Grid>
//           {/* <Field label="종목 검색">
//             <div style={{ position: 'relative', width: '100%' }}>
//               <Input
//                placeholder={isFetching ? "검색 중..." : "예: 비트코인 (업비트 원화 마켓 기준)"}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />

//               {searchResults.length > 0 && (
//                 <div
//                   style={{
//                     position: 'absolute',
//                     top: 'calc(100% + 4px)',
//                     left: 0,
//                     right: 0,
//                     backgroundColor: '#fff',
//                     border: '1px solid #ddd',
//                     borderRadius: '8px',
//                     padding: '8px',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//                     zIndex: 50,
//                     maxHeight: '250px',
//                     overflowY: 'auto'
//                   }}
//                 >
//                   <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px', paddingLeft: '4px' }}>
//                     선택하면 자동으로 입력됩니다.
//                   </p>
//                   {searchResults.map((asset) => (
//                     <div
//                       key={asset.ticker}
//                       onClick={() => handleSelectAsset(asset)}
//                       style={{
//                         padding: '10px 8px',
//                         cursor: 'pointer',
//                         borderBottom: '1px solid #f0f0f0',
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                       }}
//                     >
//                       <strong>
//                         {asset.name} <span style={{ color: '#888', fontSize: '12px' }}>({asset.ticker})</span>
//                       </strong>
//                       <span style={{ color: '#0066cc', fontSize: '13px', fontWeight: '500' }}>
//                         {asset.price > 0 ? `${asset.price.toLocaleString()} ${asset.currency}` : `👈 클릭 시 ${asset.currency} 시세 확인`}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </Field> */}
//           <Field label="종목 검색">
//             <div style={{ position: 'relative', width: '100%' }}>
//               <Input
//                 // 🌟 1. 플레이스홀더에 은근슬쩍 기준을 알려줍니다.
//                 placeholder={isFetching ? '검색 중...' : '예: 비트코인 (업비트 원화 마켓 기준)'}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />

//               {/* 검색어가 있을 때 팝업 컨테이너 렌더링 */}
//               {searchTerm.trim() !== '' && (
//                 <div
//                   style={{
//                     position: 'absolute',
//                     top: 'calc(100% + 4px)',
//                     left: 0,
//                     right: 0,
//                     backgroundColor: '#fff',
//                     border: '1px solid #ddd',
//                     borderRadius: '8px',
//                     padding: '8px',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//                     zIndex: 50,
//                     maxHeight: '250px',
//                     overflowY: 'auto',
//                   }}
//                 >
//                   {/* 🌟 2-A. 검색 결과가 있을 때 */}
//                   {searchResults.length > 0 ? (
//                     <>
//                       <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px', paddingLeft: '4px' }}>
//                         선택하면 자동으로 입력됩니다.
//                       </p>
//                       {searchResults.map((asset) => (
//                         <div
//                           key={asset.ticker}
//                           onClick={() => handleSelectAsset(asset)}
//                           style={{
//                             padding: '10px 8px',
//                             cursor: 'pointer',
//                             borderBottom: '1px solid #f0f0f0',
//                             display: 'flex',
//                             justifyContent: 'space-between',
//                           }}
//                         >
//                           <strong>
//                             {asset.name} <span style={{ color: '#888', fontSize: '12px' }}>({asset.ticker})</span>
//                           </strong>
//                           <span style={{ color: '#0066cc', fontSize: '13px', fontWeight: '500' }}>
//                             {asset.price > 0
//                               ? `${asset.price.toLocaleString()} ${asset.currency}`
//                               : `👈 클릭 시 ${asset.currency} 시세 확인`}
//                           </span>
//                         </div>
//                       ))}
//                     </>
//                   ) : (
//                     /* 🌟 2-B. 검색 결과가 없을 때 (Empty State 💡) */
//                     !isFetching && (
//                       <div style={{ padding: '20px 10px', textAlign: 'center' }}>
//                         <p style={{ color: '#555', fontWeight: '500', marginBottom: '4px' }}>검색 결과가 없습니다.</p>
//                         <p style={{ color: '#888', fontSize: '12px', lineHeight: '1.4' }}>
//                           * 업비트 <strong>원화(KRW) 마켓</strong>에 상장된 자산만 검색됩니다.
//                           <br />* 그 외 자산은 직접 수기로 입력해 주세요.
//                         </p>
//                       </div>
//                     )
//                   )}
//                 </div>
//               )}
//             </div>
//           </Field>
//         </Grid>
//       )}

//       <Grid selectCols={isSearchableType ? '1fr 1fr' : '1fr'}>
//         <Field label="자산 명칭">
//           <Input
//             name="name"
//             value={data.name}
//             onChange={onChange}
//             placeholder={isSearchableType ? '검색 시 자동 입력' : '예: 반포 자이 30평'}
//             required
//           />
//         </Field>
//         {isSearchableType && (
//           <Field label="티커 / 종목코드">
//             <Input
//               value={data.details.ticker_symbol ?? ''}
//               onChange={(e) => onDetailChange('ticker_symbol', e.target.value)}
//               placeholder="직접 입력도 가능"
//             />
//           </Field>
//         )}
//       </Grid>

//       <Grid selectCols="1fr 1fr 1fr">
//         <Field label={`매입 평단가 (${displayCurrency})`} description={isSearchableType ? '* 1주/1코인 당' : '* 1평당'}>
//           <Input
//             type="number"
//             value={data.details.average_buy_price || ''}
//             placeholder="예: 20000"
//             onChange={(e) => {
//               const avgPrice = e.target.valueAsNumber;
//               onDetailChange('average_buy_price', avgPrice);
//               updatePrincipal(data.details.total_quantity || 0, avgPrice);
//             }}
//           />
//         </Field>

//         <Field label={data.details.investment_type === 'REAL_ESTATE' ? '평수' : '보유 수량'}>
//           <Input
//             type="number"
//             value={data.details.total_quantity || ''}
//             onChange={(e) => {
//               const qty = e.target.valueAsNumber;
//               onDetailChange('total_quantity', qty);
//               updateValuation(qty, data.details.last_market_price || 0);
//               updatePrincipal(qty, data.details.average_buy_price || 0);
//             }}
//           />
//         </Field>

//         <Field label={`총 투자 원금 (${displayCurrency})`}>
//           <Input
//             type="number"
//             value={data.details.principal_amount || ''}
//             onChange={(e) => onDetailChange('principal_amount', e.target.valueAsNumber)}
//           />
//         </Field>
//       </Grid>

//       <Grid selectCols={'.5fr 1fr'}>
//         <Field label={isSearchableType ? `현재 시장가 (${displayCurrency})` : `현재 자산 가치 (${displayCurrency})`}>
//           <Input
//             type="number"
//             value={data.details.last_market_price || ''}
//             onChange={(e) => {
//               const price = e.target.valueAsNumber;
//               onDetailChange('last_market_price', price);
//               onDetailChange('is_auto_sync', false);
//               updateValuation(data.details.total_quantity || 0, price);
//             }}
//           />
//         </Field>

//         <Field label={`현재 평가 금액 (${displayCurrency})`}>
//           <Grid selectCols="1fr 100px">
//             <Input
//               type="number"
//               value={data.current_balance || ''}
//               readOnly
//               style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold' }}
//             />
//             {isSearchableType && (
//               <Button
//                 type="button"
//                 variant="outline"
//                 disabled={!data.details.ticker_symbol || isFetching}
//                 onClick={handleRefreshPrice}
//                 style={{ alignSelf: 'flex-end' }}
//               >
//                 {isFetching ? '로딩중...' : '🔄 현재가'}
//               </Button>
//             )}
//           </Grid>
//         </Field>
//       </Grid>

//       <Grid>
//         <Field label="투자금 출금/연결 계좌 (선택)">
//           {flatAssets.length > 0 ? (
//             <Select name="linked_account_id" value={data.linked_account_id ?? ''} onChange={onChange}>
//               <option value="" disabled>
//                 선택하세요
//               </option>
//               {groupedAssets['은행']?.length > 0 && (
//                 <optgroup label="🏦 은행 계좌">
//                   {groupedAssets['은행'].map((asset) => (
//                     <option key={asset.id} value={asset.id}>
//                       {asset.displayName}
//                     </option>
//                   ))}
//                 </optgroup>
//               )}
//             </Select>
//           ) : (
//             <Alert message="등록된 결제 수단이 없습니다." />
//           )}
//         </Field>
//         {balanceInfo.isVisible && balanceInfo.balanceMessage !== '' && (
//           <Field label={balanceInfo.label} labelTag="span" description={balanceInfo.accountName}>
//             <Alert variant="secondary" align="right" message={balanceInfo.balanceMessage} />
//           </Field>
//         )}
//       </Grid>

//       {isSearchableType && !data.details.is_auto_sync && (
//         <Alert variant="secondary" message="⚠️ 현재 수동 입력 모드입니다. 대시보드 시세 자동 갱신이 중단되었습니다." />
//       )}
//     </>
//   );
// };

// import { useGetDashboardQuery, type AccountSaveType } from '@/5_entities/account';
// import type { RawDashboardResponse } from '@/5_entities/account/type/rpc.type';
// import { useInstitutionStore } from '@/5_entities/institution';
// import { formatNumberWithCommas, getConnectedBalanceInfo, getGroupedAssetOptions, parseNumberFromCommas } from '@/6_shared/lib';
// import { Alert } from '@/6_shared/ui/alert';
// import { Button } from '@/6_shared/ui/button';
// import { Field } from '@/6_shared/ui/field';
// import { Grid } from '@/6_shared/ui/grid';
// import { Input } from '@/6_shared/ui/input';
// import { Select } from '@/6_shared/ui/select';
// import React, { useEffect, useMemo, useState } from 'react';

// interface SearchResultAsset {
//   name: string;
//   ticker: string;
//   price: number;
//   currency: string;
//   type: string;
// }

// interface UpbitMarketItem {
//   market: string;
//   korean_name: string;
//   english_name: string;
// }

// const MOCK_SEARCH_RESULTS: SearchResultAsset[] = [
//   { name: '삼성전자', ticker: '005930', price: 81000, currency: 'KRW', type: 'STOCK' },
//   { name: '애플', ticker: 'AAPL', price: 175.5, currency: 'USD', type: 'STOCK' },
//   { name: '테슬라', ticker: 'TSLA', price: 202.3, currency: 'USD', type: 'STOCK' },
// ];

// interface Props {
//   accounts: AccountSaveType;
//   onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
//   onDetailChange: (field: string, value: string | number | boolean | null) => void;
// }

// export const InvestmentField = ({ accounts, onChange, onDetailChange }: Props) => {
//   const data = accounts as Extract<AccountSaveType, { type: 'INVESTMENT' }>;
//   const institutions = useInstitutionStore((s) => s.institutions);
//   const { data: assetData } = useGetDashboardQuery();
//   const rawData = assetData?.raw as RawDashboardResponse;

//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState<SearchResultAsset[]>([]);
//   const [isFetching, setIsFetching] = useState(false);
//   const [upbitMarkets, setUpbitMarkets] = useState<UpbitMarketItem[]>([]);
//   // 🌟 계산 모드 상태: 'NORMAL'(평단가 입력) | 'REVERSE'(원금 입력)
//   const [calcMode, setCalcMode] = useState<'NORMAL' | 'REVERSE'>('NORMAL');
//   // 🌟 마지막 조회 시간 상태
//   const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

//   const { flatAssets, groupedAssets } = useMemo(() => getGroupedAssetOptions(rawData), [rawData]);
//   const balanceInfo = getConnectedBalanceInfo(data.linked_account_id, flatAssets);

//   const {
//     total_quantity: qty = 0,
//     average_buy_price: avgPrice = 0,
//     principal_amount: principal = 0,
//     last_market_price: marketPrice = 0,
//   } = data.details;
//   const isSearchableType = data.details.investment_type === 'STOCK' || data.details.investment_type === 'CRYPTO';
//   const displayCurrency = data.currency || 'KRW';

//   // 🌟 현재 시간 포맷팅 함수
//   const updateTime = () => {
//     const now = new Date();
//     setLastUpdatedAt(now.toLocaleTimeString());
//   };

//   // // 🌟 로직 4: 계산 함수들
//   // const calcPrincipal = (qty: number, avgPrice: number) => {
//   //   onDetailChange('principal_amount', qty * avgPrice);
//   // };

//   // const calcAveragePrice = (qty: number, principal: number) => {
//   //   if (qty > 0) {
//   //     onDetailChange('average_buy_price', Math.floor(principal / qty));
//   //   }
//   // };

//   // 🌟 핵심: 모든 입력 시 호출되는 중앙 계산 로직
//   const handleCalcLogic = (field: string, value: number | null) => {
//     onDetailChange(field, value); // 1. 해당 필드 값 먼저 업데이트

//     const currentQty = field === 'total_quantity' ? (value ?? 0) : (qty ?? 0);
//     const currentAvg = field === 'average_buy_price' ? (value ?? 0) : (avgPrice ?? 0);
//     const currentPrincipal = field === 'principal_amount' ? (value ?? 0) : (principal ?? 0);
//     const currentMarket = field === 'last_market_price' ? (value ?? 0) : (marketPrice ?? 0);

//     // 2. 모드에 따른 자동 계산
//     if (calcMode === 'NORMAL') {
//       // 일반 모드: 평단가 x 수량 = 원금
//       onDetailChange('principal_amount', Math.floor(currentAvg * currentQty));
//     } else {
//       // 역산 모드: 원금 / 수량 = 평단가
//       if (currentQty > 0) {
//         onDetailChange('average_buy_price', Math.floor(currentPrincipal / currentQty));
//       }
//     }

//     // 3. 평가금액 연동 (수량이나 시장가가 바뀔 때만)
//     if (field === 'total_quantity' || field === 'last_market_price') {
//       updateValuation(currentQty, currentMarket);
//     }
//   };
//   const updateValuation = (qty: number, price: number) => {
//     const valuation = qty * price;
//     onChange({
//       target: { name: 'current_balance', value: String(valuation), valueAsNumber: valuation, type: 'number' },
//     } as unknown as React.ChangeEvent<HTMLInputElement>);
//   };

//   useEffect(() => {
//     if (data.details.investment_type === 'CRYPTO' && upbitMarkets.length === 0) {
//       fetch('https://api.upbit.com/v1/market/all?isDetails=true')
//         .then((res) => res.json())
//         .then((markets) => {
//           const krwMarkets = markets.filter((coin: UpbitMarketItem) => coin.market.startsWith('KRW-'));
//           setUpbitMarkets(krwMarkets);
//         })
//         .catch((err) => console.error('업비트 목록 로딩 실패:', err));
//     }
//   }, [data.details.investment_type, upbitMarkets.length]);

//   useEffect(() => {
//     if (!searchTerm.trim()) {
//       setSearchResults([]);
//       return;
//     }

//     const delayDebounceFn = setTimeout(() => {
//       if (data.details.investment_type === 'CRYPTO') {
//         const lowerTerm = searchTerm.toLowerCase();
//         const filtered = upbitMarkets
//           .filter(
//             (coin) =>
//               coin.korean_name.includes(searchTerm) ||
//               coin.english_name.toLowerCase().includes(lowerTerm) ||
//               coin.market.toLowerCase().includes(lowerTerm)
//           )
//           .slice(0, 5);

//         setSearchResults(
//           filtered.map((coin) => ({
//             name: coin.korean_name,
//             ticker: coin.market,
//             price: 0,
//             currency: 'KRW',
//             type: 'CRYPTO',
//           }))
//         );
//       } else {
//         setSearchResults(
//           MOCK_SEARCH_RESULTS.filter(
//             (item) =>
//               (item.name.includes(searchTerm) || item.ticker.includes(searchTerm.toUpperCase())) &&
//               item.type === 'STOCK'
//           )
//         );
//       }
//     }, 200);

//     return () => clearTimeout(delayDebounceFn);
//   }, [searchTerm, data.details.investment_type, upbitMarkets]);

//   const handleSelectAsset = async (asset: SearchResultAsset) => {
//     setIsFetching(true);
//     let livePrice = asset.price;

//     try {
//       if (asset.type === 'CRYPTO' && asset.ticker) {
//         const priceRes = await fetch(`https://api.upbit.com/v1/ticker?markets=${asset.ticker}`);
//         const priceData = await priceRes.json();
//         livePrice = priceData[0]?.trade_price || 0;
//       }

//       onChange({ target: { name: 'name', value: asset.name } } as React.ChangeEvent<HTMLInputElement>);
//       onDetailChange('ticker_symbol', asset.ticker);
//       onDetailChange('last_market_price', livePrice);
//       onDetailChange('is_auto_sync', true);
//       onDetailChange('base_currency', asset.currency);
//       updateValuation(data.details.total_quantity || 0, livePrice);
//       updateTime(); // 시간 업데이트
//     } catch (error) {
//       alert('가격을 불러오는데 실패했습니다.');
//       console.log('가격 조회 에러 : ', error);
//     } finally {
//       setSearchTerm('');
//       setSearchResults([]);
//       setIsFetching(false);
//     }
//   };

//   const handleRefreshPrice = async () => {
//     if (!data.details.ticker_symbol) return;
//     setIsFetching(true);

//     try {
//       let newPrice = data.details.last_market_price;
//       if (data.details.investment_type === 'CRYPTO') {
//         const priceRes = await fetch(`https://api.upbit.com/v1/ticker?markets=${data.details.ticker_symbol}`);
//         const priceData = await priceRes.json();
//         newPrice = priceData[0]?.trade_price;
//       } else {
//         await new Promise((res) => setTimeout(res, 1000));
//         const foundStock = MOCK_SEARCH_RESULTS.find((s) => s.ticker === data.details.ticker_symbol);
//         newPrice = foundStock ? foundStock.price : 85000;
//       }

//       onDetailChange('last_market_price', newPrice as number);
//       onDetailChange('is_auto_sync', true);
//       updateValuation(data.details.total_quantity || 0, newPrice as number);
//       updateTime(); // 시간 업데이트
//     } catch (error) {
//       alert('최신 시세를 불러오지 못했습니다.');
//       console.log('최신 시세 조회 에러 : ', error);
//     } finally {
//       setIsFetching(false);
//     }
//   };

//   return (
//     <>
//       <Input type="hidden" name="type" value="INVESTMENT" />

//       <Grid>
//         <Field label="투자 종류">
//           <Select
//             value={data.details.investment_type as string}
//             onChange={(e) => {
//               const type = e.target.value;
//               onDetailChange('investment_type', type);
//               onDetailChange('ticker_symbol', null);
//               onDetailChange('last_market_price', 0);
//               onDetailChange('is_auto_sync', false);
//               setLastUpdatedAt(null);
//               onChange({target: {name: 'name', value: ''}} as unknown as React.ChangeEvent<HTMLSelectElement>)

//               // 🌟 로직 2: 부동산/기타 자산일 경우 기관 ID 초기화
//               if (type === 'REAL_ESTATE' || type === 'CUSTOM') {
//                 onChange({
//                   target: { name: 'institution_id', value: '' },
//                 } as unknown as React.ChangeEvent<HTMLSelectElement>);
//               }
//             }}
//           >
//             <option value="STOCK">📈 주식 / ETF</option>
//             <option value="CRYPTO">🪙 가상화폐</option>
//             <option value="REAL_ESTATE">🏠 부동산</option>
//             <option value="CUSTOM">📦 기타 자산</option>
//           </Select>
//         </Field>

//         {/* 🌟 로직 2: 주식/코인일 때만 증권사 필드 노출 */}
//         {isSearchableType && (
//           <Field label="증권사 / 거래소">
//             <Select name="institution_id" value={data.institution_id ?? ''} onChange={onChange}>
//               <option value="" disabled>
//                 선택하세요
//               </option>
//               {data.details.investment_type === 'STOCK' ? (
//                 institutions
//                   .filter((i) => i.type === 'INVESTMENT')
//                   .map((inst) => (
//                     <option key={inst.id} value={inst.id}>
//                       {inst.name}
//                     </option>
//                   ))
//               ) : (
//                 <option value="UPBIT">업비트</option>
//               )}
//             </Select>
//           </Field>
//         )}
//       </Grid>

//       {isSearchableType && (
//         <Grid>
//           <Field label="종목 검색">
//             <div style={{ position: 'relative', width: '100%' }}>
//               <Input
//                 placeholder={isFetching ? '검색 중...' : '예: 비트코인 (업비트 원화 마켓 기준)'}
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               {searchTerm.trim() !== '' && (
//                 <div
//                   style={{
//                     position: 'absolute',
//                     top: '105%',
//                     left: 0,
//                     right: 0,
//                     backgroundColor: '#fff',
//                     border: '1px solid #ddd',
//                     borderRadius: '8px',
//                     zIndex: 50,
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//                     padding: '8px',
//                   }}
//                 >
//                   {searchResults.length > 0
//                     ? searchResults.map((asset) => (
//                         <div
//                           key={asset.ticker}
//                           onClick={() => handleSelectAsset(asset)}
//                           style={{
//                             padding: '10px 8px',
//                             cursor: 'pointer',
//                             borderBottom: '1px solid #f0f0f0',
//                             display: 'flex',
//                             justifyContent: 'space-between',
//                           }}
//                         >
//                           <strong>
//                             {asset.name} <span style={{ color: '#888', fontSize: '12px' }}>({asset.ticker})</span>
//                           </strong>
//                         </div>
//                       ))
//                     : !isFetching && (
//                         <div style={{ padding: '20px 10px', textAlign: 'center' }}>
//                           <p style={{ fontSize: '12px', color: '#888' }}>업비트 원화 마켓 상장 자산만 검색됩니다.</p>
//                         </div>
//                       )}
//                 </div>
//               )}
//             </div>
//           </Field>
//         </Grid>
//       )}

//       <Grid selectCols={isSearchableType ? '1fr 1fr' : '1fr'}>
//         <Field label="자산 명칭">
//           <Input name="name" value={data.name} onChange={onChange} required />
//         </Field>
//         {isSearchableType && (
//           <Field label="티커 / 종목코드">
//             <Input value={data.details.ticker_symbol ?? ''} readOnly />
//           </Field>
//         )}
//       </Grid>

//       <Grid selectCols={'1fr .3fr'}>
//         {/* 🌟 로직 3: 현재가 readOnly 처리 (주식/코인일 때만) */}
//         <Field
//           label={isSearchableType ? `현재 시장가 (${displayCurrency})` : `현재 자산 가치 (${displayCurrency})`}
//           description={lastUpdatedAt ? `최종 조회: ${lastUpdatedAt}` : undefined} // 🌟 로직 1: 시간 표시
//         >
//           <Input
//             data-type="number"
//             // value={data.details.last_market_price || ''}
//             value={formatNumberWithCommas(marketPrice)}
//             readOnly={isSearchableType}
//             onChange={(e) => {
//               if (!isSearchableType) {
//                 // const price = e.target.valueAsNumber;
//                 const price = parseNumberFromCommas(e.target.value);
//                 onDetailChange('last_market_price', price);
//                 // updateValuation(data.details.total_quantity || 0, price);
//                 updateValuation(qty ?? 0, price ?? 0);
//               }
//             }}
//           />
//         </Field>

//         {isSearchableType && (
//           <Button
//             type="button"
//             variant="outline"
//             disabled={!data.details.ticker_symbol || isFetching}
//             onClick={handleRefreshPrice}
//             style={lastUpdatedAt ? {alignSelf: 'center'}: {alignSelf: 'flex-end'}}
//           >
//             {isFetching ? '...' : '🔄 시세'}
//             {/* TODO :
//                     1. 🔄 -> 이것때문에 버튼 크기 커져서 옆의 인풋박스도 커짐.-> 줄이는 방안 고려
//                     2.
//                 */}
//           </Button>
//         )}
//       </Grid>

//       <Grid selectCols="1fr 1fr 1fr">
//         <Field label={`매입 평단가 (${displayCurrency})`} style={calcMode === 'NORMAL' ? { order: 1 } : { order: 3 }}>
//           <Input
//             data-type="number"
//             // value={data.details.average_buy_price || ''}
//             value={formatNumberWithCommas(avgPrice)}
//             onChange={(e) => handleCalcLogic('average_buy_price', parseNumberFromCommas(e.target.value))}
//           />
//         </Field>

//         <Field label={data.details.investment_type === 'REAL_ESTATE' ? '평수' : '보유 수량'} style={{ order: 2 }}>
//           <Input
//             data-type="number"
//             // value={data.details.total_quantity || ''}
//             value={formatNumberWithCommas(qty)}
//             onChange={(e) => handleCalcLogic('total_quantity', parseNumberFromCommas(e.target.value))}
//           />
//         </Field>

//         <Field label={`총 투자 원금 (${displayCurrency})`} style={calcMode === 'NORMAL' ? { order: 3 } : { order: 1 }}>
//           <Input
//             data-type="number"
//             // value={data.details.principal_amount || ''}
//             value={formatNumberWithCommas(principal)}
//             onChange={(e) => handleCalcLogic('principal_amount', parseNumberFromCommas(e.target.value))}
//           />
//         </Field>
//       </Grid>
//       <Grid selectCols="1fr 150px">
//         {/* 🌟 역산 버튼 추가 */}
//         <Field
//           // style={{ textAlign: 'right', marginTop: '-12px', marginBottom: '12px' }}
//           description={
//             calcMode === 'NORMAL'
//               ? '🧮 매입 평단가 * 보유 수량 = 총 투자 원금'
//               : '🧮 총 투자 원금 / 보유 수량 = 매입 평단가'
//           }
//         >
//           {/* [x] : order 사용해서 1, 2, 3 부여하고. 역계산 버튼 클릭시 3, 2, 1 로 변경 하기   */}
//           <Button
//             type="button"
//             variant="secondary"
//             deviceSize="sm"
//             onClick={() => setCalcMode((prev) => (prev === 'NORMAL' ? 'REVERSE' : 'NORMAL'))}
//             style={{ fontSize: '12px', color: '#FFF' }}
//           >
//             {calcMode === 'NORMAL' ? '🔄 매입 평단가 기준으로 입력하기' : '🔄 총 투자 원금 기준으로 입력하기'}
//           </Button>
//         </Field>
//         <Field label={`현재 평가 금액 (${displayCurrency})`}>
//           <Input
//             data-type="number"
//             // value={data.current_balance || ''}
//             value={formatNumberWithCommas(data.current_balance)}
//             readOnly
//             style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
//           />
//         </Field>
//       </Grid>

//       <Grid>
//         <Field label="투자금 출금/연결 계좌 (선택)">
//           {flatAssets.length > 0 ? (
//             <Select name="linked_account_id" value={data.linked_account_id ?? ''} onChange={onChange}>
//               <option value="" disabled>
//                 선택하세요
//               </option>
//               {groupedAssets['은행']?.length > 0 && (
//                 <optgroup label="🏦 은행 계좌">
//                   {groupedAssets['은행'].map((asset) => (
//                     <option key={asset.id} value={asset.id}>
//                       {asset.displayName}
//                     </option>
//                   ))}
//                 </optgroup>
//               )}
//             </Select>
//           ) : (
//             <Alert message="등록된 결제 수단이 없습니다." />
//           )}
//         </Field>
//         {balanceInfo.isVisible && balanceInfo.balanceMessage !== '' && (
//           <Field label={balanceInfo.label} labelTag="span" description={balanceInfo.accountName}>
//             <Alert variant="secondary" align="right" message={balanceInfo.balanceMessage} />
//           </Field>
//         )}
//       </Grid>

//       {isSearchableType && !data.details.is_auto_sync && (
//         <Alert variant="secondary" message="⚠️ 현재 수동 입력 모드입니다. 대시보드 시세 자동 갱신이 중단되었습니다." />
//       )}
//     </>
//   );
// };

import { useGetDashboardQuery, type AccountSaveType } from '@/5_entities/account';
import type { RawDashboardResponse } from '@/5_entities/account/type/rpc.type';
import { useInstitutionStore } from '@/5_entities/institution';
import { fetchUpbitTickerPrice, useUpbitMarketsQuery } from '@/6_shared/api';
import { fetchKoreanStockPrice, useStockMarketsQuery } from '@/6_shared/api/useQuery';
import {
  formatNumberWithCommas,
  getConnectedBalanceInfo,
  getGroupedAssetOptions,
  parseNumberFromCommas,
} from '@/6_shared/lib';
import { Alert } from '@/6_shared/ui/alert';
import { Button } from '@/6_shared/ui/button';
import { Field } from '@/6_shared/ui/field';
import { Grid } from '@/6_shared/ui/grid';
import { Input } from '@/6_shared/ui/input';
import { Select } from '@/6_shared/ui/select';
import React, { useEffect, useMemo, useState } from 'react';

// --- Types ---
interface SearchResultAsset {
  name: string;
  ticker: string;
  price: number;
  currency: string;
  type: string;
  market?: string;
}

interface Props {
  accounts: AccountSaveType;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onDetailChange: (field: string, value: string | number | boolean | null) => void;
}

export const InvestmentField = ({ accounts, onChange, onDetailChange }: Props) => {
  const data = accounts as Extract<AccountSaveType, { type: 'INVESTMENT' }>;
  const institutions = useInstitutionStore((s) => s.institutions);
  const { data: assetData } = useGetDashboardQuery();
  const rawData = assetData?.raw as RawDashboardResponse;

  // --- States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultAsset[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // 🌟 계산 모드 및 조회 시간 상태
  const [calcMode, setCalcMode] = useState<'NORMAL' | 'REVERSE'>('NORMAL');
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  // --- Memoized Values ---
  const { flatAssets, groupedAssets } = useMemo(() => getGroupedAssetOptions(rawData), [rawData]);
  const balanceInfo = getConnectedBalanceInfo(data.linked_account_id, flatAssets);

  // 데이터 구조 분해 할당
  const {
    total_quantity: qty = 0,
    average_buy_price: avgPrice = 0,
    principal_amount: principal = 0,
    last_market_price: marketPrice = 0,
  } = data.details;
  const isStock = data.details.investment_type === 'STOCK';
  const isCrypto = data.details.investment_type === 'CRYPTO';
  const isSearchableType = data.details.investment_type === 'STOCK' || data.details.investment_type === 'CRYPTO';
  const displayCurrency = data.currency || 'KRW';
  const { data: stockMarkets } = useStockMarketsQuery(isStock);
  const { data: upbitMarkets } = useUpbitMarketsQuery(isCrypto);

  // --- Handlers & Utils ---
  const updateTime = () => setLastUpdatedAt(new Date().toLocaleTimeString());

  // 🌟 중앙 계산 로직 (수량, 평단가, 원금 양방향 계산)
  const handleCalcLogic = (field: string, value: number | null) => {
    onDetailChange(field, value);

    const currentQty = field === 'total_quantity' ? (value ?? 0) : (qty ?? 0);
    const currentAvg = field === 'average_buy_price' ? (value ?? 0) : (avgPrice ?? 0);
    const currentPrincipal = field === 'principal_amount' ? (value ?? 0) : (principal ?? 0);
    const currentMarket = field === 'last_market_price' ? (value ?? 0) : (marketPrice ?? 0);

    if (calcMode === 'NORMAL') {
      onDetailChange('principal_amount', Math.floor(currentAvg * currentQty));
    } else {
      if (currentQty > 0) {
        onDetailChange('average_buy_price', Math.floor(currentPrincipal / currentQty));
      }
    }

    // 평가금액 연동 업데이트
    if (field === 'total_quantity' || field === 'last_market_price') {
      updateValuation(currentQty, currentMarket);
    }
  };

  const updateValuation = (quantity: number, price: number) => {
    const valuation = quantity * price;
    onChange({
      target: {
        name: 'current_balance',
        value: String(valuation),
        valueAsNumber: valuation,
        type: 'number',
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  // --- Effects (API Calls) ---
 
  // 2. 검색어 기반 로컬 필터링
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const lowerTerm = searchTerm.toLowerCase();

      if (isCrypto) {
        const lowerTerm = searchTerm.toLowerCase();
        const safeMarkets = upbitMarkets || [];
        const filtered = safeMarkets
          .filter(
            (coin) =>
              coin.korean_name.includes(searchTerm) ||
              coin.english_name.toLowerCase().includes(lowerTerm) ||
              coin.market.toLowerCase().includes(lowerTerm)
          )
          .slice(0, 5);

        setSearchResults(
          filtered.map((coin) => ({
            name: coin.korean_name,
            ticker: coin.market,
            price: 0,
            currency: 'KRW',
            type: 'CRYPTO',
          }))
        );
      } else if (isStock) {
        const safeStocks = stockMarkets || [];
        const filtered = safeStocks
          .filter(
            (stock) => stock.name.toLowerCase().includes(lowerTerm) || stock.ticker.toLowerCase().includes(lowerTerm)
          )
          .slice(0, 5); // 결과가 너무 길어지지 않게 5개만 노출
        setSearchResults(
          filtered.map((stock) => ({
            name: stock.name,
            ticker: stock.ticker,
            market: stock.market, // KOSPI, NASDAQ 등
            price: 0, // 실제 가격은 클릭 후 API로!
            currency: stock.currency,
            type: 'STOCK',
          }))
        );
      }
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isStock, isCrypto, stockMarkets, upbitMarkets]);

  // --- Actions ---

  const handleSelectAsset = async (asset: SearchResultAsset) => {
    setIsFetching(true);
    let livePrice = asset.price;

    try {
      if (asset.type === 'CRYPTO' && asset.ticker) {
        livePrice = await fetchUpbitTickerPrice(asset.ticker);
      } else if (asset.type === 'STOCK' && asset.ticker) {
        // 🚨 임시 모의 가격 (다음 스텝에서 공공데이터 API 연결 예정!)
        // 1초 쉬고 임의의 가격 꽂아주기
        // await new Promise((res) => setTimeout(res, 1000));
        // livePrice = 50000;
        if (asset.market === 'KOSPI' || asset.market === 'KOSDAQ') {
          // 한국 주식일 때만 한투 API 호출!
          livePrice = await fetchKoreanStockPrice(asset.ticker);
        } else {
          // 미국 주식(NASDAQ, NYSE 등)은 아직 연결 안 했으니 임시로 0원 처리
          livePrice = 0; 
        }
      }

      onChange({ target: { name: 'name', value: asset.name } } as React.ChangeEvent<HTMLInputElement>);
      onDetailChange('ticker_symbol', asset.ticker);
      onDetailChange('last_market_price', livePrice);
      onDetailChange('is_auto_sync', true);
      onDetailChange('base_currency', asset.currency);
      updateValuation(qty || 0, livePrice);
      updateTime();
    } catch (error) {
      alert('가격을 불러오는데 실패했습니다.');
      console.log('가격을 불러오는데 실패했습니다 : ', error);
    } finally {
      setSearchTerm('');
      setSearchResults([]);
      setIsFetching(false);
    }
  };

  const handleRefreshPrice = async () => {
    if (!data.details.ticker_symbol) return;
    setIsFetching(true);

    try {
      let newPrice = marketPrice;
      if (isCrypto) {
        newPrice = await fetchUpbitTickerPrice(data.details.ticker_symbol);
      } else if (isStock) {
        // 🚨 임시 모의 가격 (다음 스텝에서 공공데이터 API 연결 예정!)
        await new Promise((res) => setTimeout(res, 500));
        newPrice = 50000;
      }

      onDetailChange('last_market_price', newPrice);
      onDetailChange('is_auto_sync', true);
      updateValuation(qty || 0, newPrice as number);
      updateTime();
    } catch (error) {
      alert('최신 시세를 불러오지 못했습니다.');
      console.log('최신 시세를 불러오지 못했습니다. : ', error);
    } finally {
      setIsFetching(false);
    }
  };

  // 🌟 상세 입력 폼 노출 조건 (점진적 노출 UX)
  const showDetailFields = !isSearchableType || !!lastUpdatedAt || !!data.details.ticker_symbol;

  return (
    <>
      <Input type="hidden" name="type" value="INVESTMENT" />

      {/* 1. 기본 설정 영역 */}
      <Grid>
        <Field label="투자 종류">
          <Select
            value={data.details.investment_type as string}
            onChange={(e) => {
              const type = e.target.value;
              onDetailChange('investment_type', type);
              onDetailChange('ticker_symbol', null);
              onDetailChange('last_market_price', 0);
              onDetailChange('is_auto_sync', false);
              setLastUpdatedAt(null);
              onChange({ target: { name: 'name', value: '' } } as unknown as React.ChangeEvent<HTMLSelectElement>);

              if (type === 'REAL_ESTATE' || type === 'CUSTOM') {
                onChange({
                  target: { name: 'institution_id', value: '' },
                } as unknown as React.ChangeEvent<HTMLSelectElement>);
              }
            }}
          >
            <option value="STOCK">📈 주식 / ETF</option>
            <option value="CRYPTO">🪙 가상화폐</option>
            <option value="REAL_ESTATE">🏠 부동산</option>
            <option value="CUSTOM">📦 기타 자산</option>
          </Select>
        </Field>

        {isSearchableType && (
          <Field label="증권사 / 거래소">
            <Select name="institution_id" required value={data.institution_id ?? ''} onChange={onChange}>
              <option value="" disabled>
                선택하세요
              </option>
              {data.details.investment_type === 'STOCK'
                ? institutions
                    .filter((i) => i.type === 'INVESTMENT')
                    .map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name}
                      </option>
                    ))
                : institutions
                    .filter((i) => i.type === 'INVESTMENT_EXCHANGE')
                    .map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name}
                      </option>
                    ))}
            </Select>
          </Field>
        )}
      </Grid>

      {/* 2. 종목 검색 영역 */}
      {isSearchableType && (
        <Grid hasBoxStyle={true}>
          <Field label="종목 검색" labelTag="span">
            <div style={{ position: 'relative', width: '100%' }}>
              <Input
                placeholder={
                  isFetching
                    ? '검색 중...'
                    : data.details.investment_type === 'STOCK'
                      ? '예: 삼성전자'
                      : '예: 비트코인 (업비트 원화 마켓 기준)'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm.trim() !== '' && (
                <div
                  style={{
                    position: 'absolute',
                    top: '105%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    zIndex: 50,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: '8px',
                  }}
                >
                  {searchResults.length > 0
                    ? searchResults.map((asset) => (
                        <div
                          key={asset.ticker}
                          onClick={() => handleSelectAsset(asset)}
                          style={{
                            padding: '10px 8px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f0f0f0',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          {/* 🌟 시장 정보(KOSPI, NASDAQ 등)를 추가해서 노출합니다! */}
                          <strong>
                            {asset.name}{' '}
                            <span style={{ color: '#888', fontSize: '12px', fontWeight: 'normal' }}>
                              ({asset.market ? `${asset.market} | ` : ''}{asset.ticker})
                            </span>
                          </strong>
                        </div>
                      ))
                    : !isFetching && (
                        <div style={{ padding: '20px 10px', textAlign: 'center' }}>
                          <p style={{ fontSize: '12px', color: '#888' }}>
                            {isStock ? '검색된 주식 종목이 없습니다.' : '업비트 원화 마켓 상장 자산만 검색됩니다.'}
                          </p>
                        </div>
                      )}
                </div>
              )}
            </div>
          </Field>
        </Grid>
      )}

      {showDetailFields && (
        <Grid direction="vertical">
          <Grid>
            {/* 3. 명칭 및 코드 영역 */}
            <Grid selectCols={isSearchableType ? '1fr 1fr' : '1fr'}>
              <Field label="자산 명칭">
                <Input name="name" value={data.name} readOnly onChange={onChange} required />
              </Field>
              {isSearchableType && (
                <Field label="티커 / 종목코드">
                  <Input
                    value={data.details.ticker_symbol ?? ''}
                    readOnly
                    style={{ backgroundColor: '#f9f9f9', color: '#666' }}
                  />
                </Field>
              )}
            </Grid>

            {/* 4. 현재가 영역 */}
            <Grid selectCols={isSearchableType ? '1fr 85px' : '1fr'}>
              <Field
                label={isSearchableType ? `현재 시장가 (${displayCurrency})` : `현재 자산 가치 (${displayCurrency})`}
                description={lastUpdatedAt ? `최종 조회: ${lastUpdatedAt}` : undefined}
              >
                <Input
                  type="text"
                  data-type="number"
                  value={formatNumberWithCommas(marketPrice)}
                  readOnly={isSearchableType}
                  style={isSearchableType ? { backgroundColor: '#f9f9f9', color: '#666' } : {}}
                  onChange={(e) => {
                    if (!isSearchableType) {
                      const price = parseNumberFromCommas(e.target.value);
                      onDetailChange('last_market_price', price);
                      updateValuation(qty ?? 0, price ?? 0);
                    }
                  }}
                />
              </Field>

              {isSearchableType && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={!data.details.ticker_symbol || isFetching}
                  onClick={handleRefreshPrice}
                  style={lastUpdatedAt ? { alignSelf: 'center' } : { alignSelf: 'flex-end' }}
                >
                  {isFetching ? '...' : '🔄 시세'}
                </Button>
              )}
            </Grid>
          </Grid>
          {/* 5. 매입 정보 영역 (UI 순서 동적 변경) */}
          <Grid
            selectCols="1fr 1fr 1fr"
            description={
              calcMode === 'NORMAL'
                ? '* 평단가 기준 계산 적용 : 평단가 × 수량 = 총 투자 원금'
                : '* 원금 기준 계산 적용 : 총 투자 원금 ÷ 수량 = 평단가 '
            }
          >
            <Field label={`매입 평단가 (${displayCurrency})`} style={{ order: calcMode === 'NORMAL' ? 1 : 3 }}>
              <Input
                type="text"
                data-type="number"
                value={formatNumberWithCommas(avgPrice)}
                readOnly={calcMode === 'REVERSE'}
                style={calcMode === 'REVERSE' ? { backgroundColor: '#f9f9f9' } : {}}
                onChange={(e) => handleCalcLogic('average_buy_price', parseNumberFromCommas(e.target.value))}
              />
            </Field>

            <Field label={data.details.investment_type === 'REAL_ESTATE' ? '평수' : '수량'} style={{ order: 2 }}>
              <Input
                type="text"
                data-type="number"
                required
                value={formatNumberWithCommas(qty)}
                onChange={(e) => handleCalcLogic('total_quantity', parseNumberFromCommas(e.target.value))}
              />
            </Field>

            <Field label={`총 투자 원금 (${displayCurrency})`} style={{ order: calcMode === 'NORMAL' ? 3 : 1 }}>
              <Input
                type="text"
                data-type="number"
                value={formatNumberWithCommas(principal)}
                readOnly={calcMode === 'NORMAL'}
                style={calcMode === 'NORMAL' ? { backgroundColor: '#f9f9f9' } : {}}
                onChange={(e) => handleCalcLogic('principal_amount', parseNumberFromCommas(e.target.value))}
              />
            </Field>
          </Grid>

          {/* 6. 평가 금액 및 계산 모드 전환 영역 */}
          <Grid selectCols="170px 1fr">
            <Field label="계산 전환" labelTag="span">
              <Button
                type="button"
                variant="secondary"
                deviceSize="sm"
                onClick={() => setCalcMode((prev) => (prev === 'NORMAL' ? 'REVERSE' : 'NORMAL'))}
                style={{ fontSize: '12px' }}
              >
                {calcMode === 'NORMAL' ? '🔄 원금 기준으로 입력하기' : '🔄 평단가 기준으로 입력하기'}
              </Button>
            </Field>

            <Field label={`현재 평가 금액 (${displayCurrency})`}>
              <Input
                type="text"
                data-type="number"
                value={formatNumberWithCommas(data.current_balance)}
                readOnly
                style={{ fontWeight: 'bold' }}
              />
            </Field>
          </Grid>
        </Grid>
      )}

      {/* 7. 연결 계좌 설정 영역 */}
      <Grid>
        <Field label="투자금 출금/연결 계좌 (선택)">
          {flatAssets.length > 0 ? (
            <Select name="linked_account_id" value={data.linked_account_id ?? ''} onChange={onChange}>
              <option value="" disabled>
                선택하세요
              </option>
              {groupedAssets['은행']?.length > 0 && (
                <optgroup label="🏦 은행 계좌">
                  {groupedAssets['은행'].map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.displayName}
                    </option>
                  ))}
                </optgroup>
              )}
            </Select>
          ) : (
            <Alert message="등록된 결제 수단이 없습니다." />
          )}
        </Field>
        {balanceInfo.isVisible && balanceInfo.balanceMessage !== '' && (
          <Field label={balanceInfo.label} labelTag="span" description={balanceInfo.accountName}>
            <Alert variant="secondary" align="right" message={balanceInfo.balanceMessage} />
          </Field>
        )}
      </Grid>

      {isSearchableType && !data.details.is_auto_sync && (
        <Alert variant="secondary" message="⚠️ 현재 수동 입력 모드입니다. 대시보드 시세 자동 갱신이 중단되었습니다." />
      )}
    </>
  );
};
