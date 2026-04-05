import './styles/variables.css';
import './styles/base.css';
import './styles/background-elements.css';
import './styles/components.css';
import './styles/reset.css';
import { Route, Routes, Navigate } from 'react-router-dom';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLogin from './pages/AdminLogin';
import AdminProducts from './pages/AdminProducts';
import AdminProductForm from './pages/AdminProductForm';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Navigate to='/admin/login' replace />} />
        <Route path='/admin/login' element={<AdminLogin />} />

        <Route
          path='/admin/products'
          element={
            <AdminProtectedRoute>
              <AdminProducts />
            </AdminProtectedRoute>
          }
        />

        <Route
          path='/admin/products/new'
          element={
            <AdminProtectedRoute>
              <AdminProductForm />
            </AdminProtectedRoute>
          }
        />

        <Route
          path='/admin/products/:id/edit'
          element={
            <AdminProtectedRoute>
              <AdminProductForm />
            </AdminProtectedRoute>
          }
        />

        <Route path='*' element={<Navigate to='/admin/login' replace />} />
      </Routes>
    </div>
  );
}

export default App;