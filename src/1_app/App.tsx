import { GlobalStyle } from '@/1_app/styles';
import { Modal } from '@/6_shared/ui/modal';
import { useGetFinancialInstitutionsQuery, useInstitutionStore } from '@/5_entities/institution';
import 'swiper/bundle';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Router } from './router';

function App() {
  const { data: institutions } = useGetFinancialInstitutionsQuery();
  const setInstitutions = useInstitutionStore((s) => s.setInstitutions);

  useEffect(() => {
    if (institutions) {
      setInstitutions(institutions);
      console.log('금융기관 정보가 스토어에 저장되었습니다.');
    }
  }, [institutions, setInstitutions]);

  return (
    <>
      <GlobalStyle />
      <Modal />
      <RouterProvider router={Router}/>
    </>
  );
}

export default App;
