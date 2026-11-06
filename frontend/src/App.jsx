import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductoList from './components/ProductoList';

function App() {
  return (
    <BrowserRouter>
      <div className="container mt-5">
        <h2 className="text-center mb-5 fw-bold" style={{ color: '#2c3e50' }}>
          Jade Aromas Que Sanan
        </h2>
        <Routes>
          <Route path="/" element={<ProductoList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;