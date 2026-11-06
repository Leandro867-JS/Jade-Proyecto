import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductoList from './components/ProductoList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductoList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;