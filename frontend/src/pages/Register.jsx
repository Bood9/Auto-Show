import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Пароли не совпадают");
            return;
        }
        try {
            await register({
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            navigate('/login');
        } catch (err) {
            console.error("Registration error:", err);
            if (err.response && err.response.data) {
                // Handle Django REST Framework error format
                const errors = err.response.data;
                let errorMessage = '';

                if (typeof errors === 'object') {
                    // Combine all error messages
                    Object.keys(errors).forEach(key => {
                        const messages = Array.isArray(errors[key]) ? errors[key].join(' ') : errors[key];
                        errorMessage += `${key}: ${messages}\n`;
                    });
                } else {
                    errorMessage = 'Ошибка регистрации. Попробуйте еще раз.';
                }
                setError(errorMessage || 'Ошибка регистрации. Возможно, имя пользователя уже занято.');
            } else {
                setError('Ошибка соединения с сервером. Попробуйте позже.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-dark text-white flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-800"
            >
                <div className="flex justify-center mb-6">
                    <div className="bg-primary p-3 rounded-full">
                        <UserPlus className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-center mb-6">Создать аккаунт</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Имя пользователя</label>
                        <input
                            type="text"
                            name="username"
                            required
                            className="w-full bg-dark border border-gray-700 rounded px-4 py-2 focus:border-primary focus:outline-none"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full bg-dark border border-gray-700 rounded px-4 py-2 focus:border-primary focus:outline-none"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Пароль</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full bg-dark border border-gray-700 rounded px-4 py-2 focus:border-primary focus:outline-none"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Подтвердите пароль</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            required
                            className="w-full bg-dark border border-gray-700 rounded px-4 py-2 focus:border-primary focus:outline-none"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-2 rounded hover:bg-red-700 transition-colors"
                    >
                        Зарегистрироваться
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-400 text-sm">
                    Уже есть аккаунт? <Link to="/login" className="text-primary hover:underline">Войти</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
