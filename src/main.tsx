import { createRoot } from 'react-dom/client';
import { Providers } from './1_app/providers';
import App from './1_app/App';

createRoot(document.getElementById('root')!).render(
  <Providers>
    <App/>
  </Providers>
);
