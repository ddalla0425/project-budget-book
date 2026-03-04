import { GlobalStyle } from '@/1_app/styles';
import { AppRouter } from '@/1_app/providers';
import { Modal } from '@/6_shared/ui/modal';
import 'swiper/bundle';

function App() {
  return (
    <>
      <GlobalStyle />
      <Modal />
      <AppRouter />
    </>
  );
}

export default App;
