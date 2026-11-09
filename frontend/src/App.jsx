import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductoList from './components/ProductoList';
import ProductoDetalle from './components/ProductoDetalle';
import Carrito from './components/Carrito';


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/" element={<ProductoList />} />
        <Route path="/categoria/:nombre" element={<ProductoList />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route
          path="*"
          element={
            <div className="container my-5 text-center">
              <h2 className="catalog-title text-center">Página en construcción</h2>
              <Link to="/" className="btn btn-add" style={{ width: 'auto', padding: '8px 32px' }}>
                Volver al catálogo
              </Link>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;