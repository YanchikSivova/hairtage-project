import React, { useEffect, useState } from "react";
import '../styles/pages/account.css';
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import SurveyHistory from "../components/SurveyHistory";
function Account(){
    const {user, logout} = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    const handleLogoutClick = () =>{
        setShowLogoutModal(true);
    }

    const handleConfirmLogout = () =>{
        setShowLogoutModal(false);
        logout();
        navigate('/');
    }

    const handleCancelLogout = () =>{
        setShowLogoutModal(false);
    }

    const goToSettings = () =>{
        navigate('/account/settings');
    }

    useEffect(() => {
        document.body.classList.add('with-pic');

        return () => {
            document.body.classList.remove('with-pic');
        };
    }, []);

    return(
        <main className="account">
            <section className="profile-card">
                <h2>{user? user.username : "banana_mama"}</h2>
                <p>{user? user.email : "mama@email.ru"}</p>
                <div className="buttons">
                    <button className="btn-account" onClick={goToSettings}>Изменить</button>
                    <button className="btn-account" onClick={handleLogoutClick}>Выйти</button>
                </div>
            </section>
            <section className="survey-section">
                <SurveyHistory />
            </section>
            <ConfirmModal
            isOpen={showLogoutModal}
            onConfirm={handleConfirmLogout}
            onCancel={handleCancelLogout}
            message="Вы хотите выйти из аккаунта?"/>
        </main>
    )
};

export default Account;