import { Link, useLocation, useNavigate } from 'react-router-dom'
import '../styles/pages/header.css'
import logo from '../assets/icons/logo.svg'
import { useAuth } from '../hooks/useAuth'

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { authenticated } = useAuth()

  const toggleMenu = () => {
    document.querySelector('.nav')?.classList.toggle('open')
    document.querySelector('.header')?.classList.toggle('open')
  }

  const goToAdminLogin = () => {
    navigate('/admin/login')
  }

  return (
    <nav className='header'>
      <button className='burger' onClick={toggleMenu} type='button' aria-label='Открыть меню'>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className='nav'>
        <li>
          <Link to='/' className={location.pathname === '/' ? 'active' : ''}>
            Главная
          </Link>
        </li>
        <li>
          <Link
            to={authenticated ? '/account' : '/login'}
            className={
              location.pathname === '/account' ||
              location.pathname === '/login' ||
              location.pathname === '/register'
                ? 'active'
                : ''
            }
          >
            {authenticated ? 'Аккаунт' : 'Вход'}
          </Link>
        </li>
        <li>
          <Link to='/results' className={location.pathname === '/results' ? 'active' : ''}>
            Подборка
          </Link>
        </li>
        <li>
          <button
            type='button'
            className='admin-link-btn nav-admin-btn'
            onClick={goToAdminLogin}
          >
            Админ
          </button>
        </li>
      </ul>

      <button type='button' className='brand brand-button' onClick={() => navigate('/')}>
        <span>Hairtage</span>
        <img src={logo} alt='Hairtage logo' />
      </button>
    </nav>
  )
}

export default Navigation