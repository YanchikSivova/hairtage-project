import React, { useState } from "react";
import comb from '../assets/icons/comb.svg';
import brush from '../assets/icons/brush.svg';
import '../styles/pages/register.css'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function Register() {
    const navigate = useNavigate();
    const {register, loading, error} = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email:'',
        password:''
    });

    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) =>{
        const {id, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [id]:value
        }));
        setValidationErrors(prev => ({
            ...prev,
            [id]:''
        }));
    };

    const validateForm = () =>{
        const errors = {};

        if(!formData.name.trim()){
            errors.name = 'Имя обязательно';
        }

        if (!formData.email){
            errors.email = 'Email обязателен';
        }else if (!/\S+@\S+\.\S+/.test(formData.email)){
            errors.email = 'Введите корректный email';
        }
        
        if (!formData.password){
            error.password = 'Пароль обязателен';
        }else if (formData.password.length < 8){
            errors.password = 'Пароль должен быть минимум 8 символов';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if(Object.keys(errors).length > 0){
            setValidationErrors(errors);
            return;
        }
        const success = await register(
            formData.name,
            formData.email,
            formData.password
        );

        if (success){
            navigate('/account');
        }
    };

    const goToLogin = () =>{
        navigate('/login')
    }
    return (
        <div>
            <div className="decor-left">
                <img src={comb} />
            </div>
            <div className="decor-right">
                <img src={brush} />
            </div>
            <main className="register">
                <div className="register-card">
                    <div className="reg-banner">
                        <p className="register-title">Регистрация в Hairtage</p>
                    </div>

                    <form id="registerForm" className="register-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Имя</label>
                            <input type="text" 
                            id="name" 
                            value={formData.name}
                            onChange={handleChange}
                            className={validationErrors.name? 'error':''}
                            disabled={loading}
                            required />
                            {validationErrors.name && (
                                <p className="field-error" style={{color:'red', fontSize:'12px'}}>
                                    {validationErrors.name}
                                </p>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email"
                             id="email" 
                             placeholder="your@email.com" 
                             value={formData.email}
                             onChange={handleChange}
                             className={validationErrors.email? 'error' : ''}
                             disabled={loading}
                             required />
                             {validationErrors.email && (
                                <p className="field-error" style={{color:'red', fontSize:'12px'}}>
                                    {validationErrors.email}
                                </p>
                             )}
                        </div>
                        <div className="form-group">
                            <label>Пароль</label>
                            <input type="password" 
                            id="password" 
                            placeholder="••••••••" 
                            value={formData.password}
                            onChange={handleChange}
                            className={validationErrors.password? 'error': ''}
                            disabled={loading}
                            required />
                            <p>*Минимум 8 символов</p>
                            {validationErrors.password && (
                                <p className="field-error" style={{color:'red', fontSize:'12px'}}>
                                    {validationErrors.password}
                                </p>
                            )}
                        </div>
                        <button 
                        type="submit" 
                        className="btn-primary"
                        disabled={loading}>
                            {loading? 'Регистрация...':'Регистрация'}
                        </button>
                        <p className="register-footer">
                            Есть аккаунт?
                            <span onClick={goToLogin} style={{cursor: 'pointer'}}> Вход</span>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    )
};

export default Register;