import React from 'react';
import './App.css';
import { Header } from './components/header.component';
import { AuthProvider } from './providers/authentication.provider';
import Routes from './Routes';

const App: React.FC = () => {
  return (
    <div id="app-div">
      <AuthProvider>
        <Header />
        <Routes />
      </AuthProvider>
    </div>
  );
};
export default App;