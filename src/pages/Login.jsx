import React from "react";
import comb from '../assets/icons/comb.svg';
import brush from '../assets/icons/brush.svg';
import '../styles/pages/login.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
 function Login(){
    const navigate = useNavigate();
    const { login, loading, error } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) =>{
        const {id, value} = e.target;
        setFormData(prev =>({
            ...prev,
            [id]:value
        }));
        setValidationErrors(prev =>({
            ...prev,
            [id]:''
        }));
    };

    const validateForm = () =>{
        const errors = {};

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
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();

        const errors = validateForm();
        if(Object.keys(errors).length>0 ){
            setValidationErrors(errors);
            return;
        }
        const success = await login(formData.email, formData.password);
        if (success){
            if (localStorage.getItem("answers") !== null){
                navigate('/results', {state: {mode: 'survey'}});
            }
            navigate('/account');
        }
    };
    const goToRegister = () =>{
        navigate('/register')
    };
    return(
        <div>
            <div className="decor-left">
                <img src={comb}/>
            </div>
            <div className="decor-right">
                <img src={brush}/>
            </div>
            <main className="login">
                <div className="login-card">
                    <div className="log-banner">
                        <p className="login-title">Добро пожаловать в Hairtage</p>
                    </div>
                    <form id="loginForm" className="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email</label>
                            <input 
                            type="email" 
                            id="email" 
                            placeholder="your@email.com" 
                            value={formData.email}
                            onChange={handleChange}
                            className={validationErrors.email? 'error':''}
                            disabled={loading}
                            required/>
                            {validationErrors.email && (
                                <p className="field-error" style={{color: 'red', fontSize:'12px'}}>
                                    {validationErrors.email}
                                </p>
                            )}
                        </div>
                        <div className="form-group">
                            <label>Пароль</label>
                            <input 
                            type="password" 
                            id="password" 
                            placeholder="••••••••" 
                            value={formData.password}
                            onChange={handleChange}
                            className={validationErrors.password? 'error':''}
                            disabled={loading}
                            required/>
                            <p>*Минимум 8 символов</p>
                            {validationErrors.password &&(
                                <p className="field-error" style={{color: 'red', fontSize:'12px'}}>
                                    {validationErrors.password}
                                </p>
                            )}
                        </div>
                        <button 
                        type="submit" 
                        className="btn-primary" 
                        disabled={loading}
                        >
                            {loading? 'Вход...': 'Войти'}
                        </button>

                        <p className="login-footer">
                            Нет аккаунта?
                            <span onClick={goToRegister} style={{cursor: 'pointer'}}> Регистрация</span>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    )
 };

 export default Login;