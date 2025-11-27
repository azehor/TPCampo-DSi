import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Header from './components/Header';

export default function App() {
  return (
    <div className="app-container">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}