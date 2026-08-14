import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './router';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import { RoleProvider } from './context/RoleContext';
import { ToastProvider } from './context/ToastContext';
import { AppDataProvider } from './context/AppDataContext';

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <RoleProvider>
        <AppDataProvider>
          <ToastProvider>
            <BrowserRouter basename={__BASE_PATH__}>
              <AppRoutes />
            </BrowserRouter>
          </ToastProvider>
        </AppDataProvider>
      </RoleProvider>
    </I18nextProvider>
  );
}

export default App;