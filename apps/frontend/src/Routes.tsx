import React from 'react';
import { Route, Routes as ReactRouterRoutes } from 'react-router-dom';
import LoginPage from './pages/login.page';
import { HomePage } from './pages/home.page';
import { useAuthContext } from './contexts/authentication.context';

const Routes: React.FC = () => {
  const authContext = useAuthContext();

  if (authContext === null) {
    return <LoginPage />;
  }

  const { token } = authContext;

  return (
    <ReactRouterRoutes>
      { token
        ? <Route path="/" element={<PrivateRoutes />} />
        : <Route path="/" element={<LoginPage />} /> }
    </ReactRouterRoutes>
  );
};

const PrivateRoutes: React.FC = () => {
  return <HomePage />;
};

export default Routes;
