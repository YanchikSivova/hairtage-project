import { Link, useLocation } from "react-router-dom";
import '../styles/pages/header.css';
import logo from '../assets/icons/logo.svg';
import { useAuth } from "../hooks/useAuth";

function Navigation() {
    const location = useLocation();

    const {isAuth} = useAuth();

    const toggleMenu = () => {
        document.querySelector('.nav').classList.toggle('open');
        document.querySelector('.header').classList.toggle('open');
    };

    return (
        <nav className="header">
            <button className="burger" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul className="nav">
                <li>
                    <Link to='/' className={location.pathname === '/' ? 'active' : ''}>
                        Главная
                    </Link>
                </li>
                <li>
                    <Link to={isAuth ? '/account' : '/login'} className={location.pathname === '/account' || location.pathname ==='/login' || location.pathname ==='/register' ? 'active' : ''}>
                        Аккаунт
                    </Link>
                </li>
                <li>
                    <Link to={isAuth? '/results': '/'} state={{mode: 'last'}} className={location.pathname === '/results' ? 'active' : ''}>
                        Подборка
                    </Link>
                </li>
            </ul>
            <div className="brand">
                <span>Hairtage</span>
                <img src={logo} alt="Hairtage logo"/>
            </div>
        </nav>
    );
};

export default Navigation;