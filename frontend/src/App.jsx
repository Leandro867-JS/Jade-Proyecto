import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductoList from './components/ProductoList';
import ProductoDetalle from './components/ProductoDetalle';
import Carrito from './components/Carrito';
import Alquimia from './components/Alquimia';
import Contacto from './components/Contacto';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<ProductoList />} />
        <Route path="/categoria/:nombre" element={<ProductoList />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/alquimia" element={<Alquimia />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route
          path="*"
          element={
            <div className="container my-5 text-center">
              <h2 className="catalog-title text-center">Página no encontrada</h2>
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