import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Неверные учетные данные');
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
                        <LogIn className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-center mb-6">С возвращением</h2>

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
                            required
                            className="w-full bg-dark border border-gray-700 rounded px-4 py-2 focus:border-primary focus:outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Пароль</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-dark border border-gray-700 rounded px-4 py-2 focus:border-primary focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-2 rounded hover:bg-red-700 transition-colors"
                    >
                        Войти
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-400 text-sm">
                    Нет аккаунта? <Link to="/register" className="text-primary hover:underline">Зарегистрироваться</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
