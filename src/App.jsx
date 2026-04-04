import './styles/variables.css'
import './styles/base.css'
import './styles/background-elements.css'
import './styles/components.css'
import './styles/reset.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navigation from './components/Navigation'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import Home from './pages/Home'
import Survey from './pages/Survey'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import Settings from './pages/Settings'
import SurveySuccess from './pages/SurveySuccess'
import Results from './pages/Results'
import AdminLogin from './pages/admin/AdminLogin'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className='App'>
      {!isAdminRoute && <Navigation />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/survey' element={<Survey />} />
        <Route path='/survey/success' element={<SurveySuccess />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/results' element={<Results />} />

        <Route
          path='/account'
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        <Route
          path='/account/settings'
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route path='/admin/login' element={<AdminLogin />} />
        {/* 
        <Route path='/admin/products' element={<AdminProducts />} />
        <Route path='/admin/products/new' element={<AdminProductForm />} />
        <Route path='/admin/products/:id/edit' element={<AdminProductForm />} />
         */}
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
      </Routes>
    </div>
  )
}

export default App