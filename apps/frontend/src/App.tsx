import { useEffect, useState } from 'react';
import './App.css';
import { Header } from './components/header.component.tsx';
import { Home } from './pages/home.tsx';
import { Route, Routes } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => setCount(1));
  return (
    <div id="app-div">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <a>{count}</a>
    </div>
  );
}

export default App;
