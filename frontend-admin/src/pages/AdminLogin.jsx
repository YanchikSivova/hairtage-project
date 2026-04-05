import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/pages/admin-login.css';
import { useAuth } from '../hooks/useAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, isAuth, isAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    document.body.classList.add('admin-login-body');

    return () => {
      document.body.classList.remove('admin-login-body');
    };
  }, []);

  useEffect(() => {
    if (isAuth && isAdmin) {
      const target = location.state?.from?.pathname || '/admin/products';
      navigate(target, { replace: true });
    }
  }, [isAuth, isAdmin, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim() || !password.trim()) {
      setLocalError('Заполни email и пароль');
      return;
    }

    const result = await login(email.trim(), password);

    if (!result?.success) {
      return;
    }

    if (!result?.isAdmin) {
      setLocalError('У пользователя нет прав администратора');
      return;
    }

    navigate('/admin/products', { replace: true });
  };

  return (
    <main className='admin-login-main'>
      <h1 className='admin-login-title'>Система администрирования Hairtage</h1>

      <form onSubmit={handleSubmit} className='admin-login-card'>
        <label className='admin-field'>
          <span>Email</span>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </label>

        <label className='admin-field'>
          <span>Пароль*</span>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </label>

        <div className='admin-login-hint'>*Минимум 8 символов</div>

        {(localError || error) && <p className='warn'>{localError || error}</p>}

        <button type='submit' className='admin-login-btn' disabled={loading}>
          {loading ? 'Вход...' : 'Вход'}
        </button>
      </form>
    </main>
  );
}