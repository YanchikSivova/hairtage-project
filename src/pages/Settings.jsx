import React, { useState } from "react";
import comb from '../assets/icons/comb.svg';
import brush from '../assets/icons/brush.svg';
import '../styles/pages/settings.css';
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();
    const { user, settings } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user? user.name : 'banana_mama',
        email: user? user.email : 'mama@email.ru',
        password: user? user.password : "12345678"
    });
    const [validationErrors, setValidationErrors] = useState({});
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        setValidationErrors(prev => ({
            ...prev,
            [id]: ''
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) {
            errors.name = 'Имя обязательно';
        }

        if (!formData.email) {
            errors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Введите корректный email';
        }

        if (!formData.password) {
            error.password = 'Пароль обязателен';
        } else if (formData.password.length < 8) {
            errors.password = 'Пароль должен быть минимум 8 символов';
        }
        return errors;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        const success = await settings(
            formData.name,
            formData.email,
            formData.password,
        );
        if (success) {
            navigate('/account')
        }
    };

    const goToAccount = () => {
        navigate('/account')
    };

    return (
        <>
            <div className="decor-left">
                <img src={comb} alt="" />
            </div>
            <div className="decor-right">
                <img src={brush} alt="" />
            </div>
            <main className="settings-page">
                <form id="settingsForm" className="settings-form" onSubmit={handleSubmit}>
                    <label className="settings-label">
                        Имя
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={validationErrors.name ? 'settings-input error' : 'settings-input'}
                            disabled={loading}
                            required />
                        {validationErrors.name && (
                            <p className="field-error" style={{ color: 'red', fontSize: '12px' }}>
                                {validationErrors.name}
                            </p>
                        )}
                    </label>
                    <label className="settings-label">
                        Email
                        <input
                            type="email"
                            id="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={validationErrors.email ? 'settings-input error' : 'settings-input'}
                            disabled={loading}
                            required
                        />
                        {validationErrors.email && (
                            <p className="field-error" style={{ color: 'red', fontSize: '12px' }}>
                                {validationErrors.email}
                            </p>
                        )}
                    </label>
                    <label className="settings-label">
                        Пароль *
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className={validationErrors.password ? 'settings-input error' : 'settings-input'}
                            disabled={loading}
                            required
                        />
                        {validationErrors.password && (
                            <p className="field-error" style={{ color: 'red', fontSize: '12px' }}>
                                {validationErrors.password}
                            </p>
                        )}
                    </label>
                    <p className="hint">*Минимум 8 символов</p>
                    <button type="submit" className="btn-primary-set">Сохранить</button>
                    <button type="button" className="btn-secondary-set" onClick={goToAccount}>Отмена</button>
                </form>
            </main>
        </>
    )
};

export default Settings;