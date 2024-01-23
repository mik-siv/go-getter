import './App.css';
import { Header } from './components/header.component.tsx';
import { Home } from './pages/home.tsx';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div id="app-div">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
