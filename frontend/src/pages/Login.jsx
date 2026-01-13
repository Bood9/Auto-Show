import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';

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
        <div className="min-h-screen bg-dark text-light flex items-center justify-center px-4 py-20 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="glass-panel p-8 md:p-10 rounded-2xl max-w-md w-full border border-primary/20 relative z-10"
            >
                {/* Icon Header */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full"></div>
                        <div className="relative p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/30">
                            <LogIn className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 text-light font-display">
                        С возвращением
                    </h2>
                    <p className="text-muted">
                        Войдите в свой личный кабинет
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg flex items-center gap-3"
                    >
                        <AlertCircle className="h-5 w-5 text-accent flex-shrink-0" />
                        <p className="text-accent text-sm">{error}</p>
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username Field */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-light">
                            Имя пользователя
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                            <input
                                type="text"
                                required
                                placeholder="Введите имя пользователя"
                                className="w-full bg-dark-card border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-light">
                            Пароль
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                            <input
                                type="password"
                                required
                                placeholder="Введите пароль"
                                className="w-full bg-dark-card border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-6 py-4 bg-gradient-to-r from-primary to-primary/80 text-dark rounded-lg font-bold text-lg uppercase tracking-wider hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-500 flex items-center justify-center gap-2 group"
                    >
                        <span>Войти</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 pt-6 border-t border-primary/10 text-center">
                    <p className="text-muted text-sm">
                        Нет аккаунта?{' '}
                        <Link
                            to="/register"
                            className="text-primary hover:text-primary/80 font-semibold transition-colors"
                        >
                            Зарегистрироваться
                        </Link>
                    </p>
                </div>

                {/* Corner Accent */}
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/5 to-transparent rounded-tl-full pointer-events-none"></div>
            </motion.div>
        </div>
    );
};

export default Login;
