import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import Gallery from './pages/Gallery';
import Favorites from './pages/Favorites';

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-800 text-white p-4 flex gap-6">
        <Link to="/" className="hover:underline">Галерея</Link>
        <Link to="/admin" className="hover:underline">Адмін панель</Link>
        <Link to="/favorites" className="hover:underline">Улюблені</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
