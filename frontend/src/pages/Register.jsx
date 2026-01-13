import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

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

    // Password strength indicator
    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { strength: 0, label: '', color: '' };

        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;

        if (strength <= 1) return { strength: 25, label: 'Слабый', color: 'bg-accent' };
        if (strength === 2) return { strength: 50, label: 'Средний', color: 'bg-yellow-500' };
        if (strength === 3) return { strength: 75, label: 'Хороший', color: 'bg-blue-500' };
        return { strength: 100, label: 'Отличный', color: 'bg-primary' };
    };

    const passwordStrength = getPasswordStrength();
    const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

    return (
        <div className="min-h-screen bg-dark text-light flex items-center justify-center px-4 py-20 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
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
                            <UserPlus className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2 text-light font-display">
                        Создать аккаунт
                    </h2>
                    <p className="text-muted">
                        Присоединяйтесь к Dubai Elite
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg flex items-start gap-3"
                    >
                        <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <p className="text-accent text-sm whitespace-pre-line">{error}</p>
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
                                name="username"
                                required
                                placeholder="Введите имя пользователя"
                                className="w-full bg-dark-card border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-light">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                            <input
                                type="email"
                                name="email"
                                placeholder="example@email.com"
                                className="w-full bg-dark-card border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                required
                                placeholder="Создайте надежный пароль"
                                className="w-full bg-dark-card border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-muted">Надежность пароля:</span>
                                    <span className={`text-xs font-semibold ${
                                        passwordStrength.strength === 100 ? 'text-primary' :
                                        passwordStrength.strength >= 75 ? 'text-blue-400' :
                                        passwordStrength.strength >= 50 ? 'text-yellow-400' : 'text-accent'
                                    }`}>
                                        {passwordStrength.label}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-dark-card rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${passwordStrength.strength}%` }}
                                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-light">
                            Подтвердите пароль
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                            <input
                                type="password"
                                name="confirmPassword"
                                required
                                placeholder="Повторите пароль"
                                className="w-full bg-dark-card border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {passwordsMatch && (
                                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-6 py-4 bg-gradient-to-r from-primary to-primary/80 text-dark rounded-lg font-bold text-lg uppercase tracking-wider hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-500 flex items-center justify-center gap-2 group"
                    >
                        <span>Зарегистрироваться</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 pt-6 border-t border-primary/10 text-center">
                    <p className="text-muted text-sm">
                        Уже есть аккаунт?{' '}
                        <Link
                            to="/login"
                            className="text-primary hover:text-primary/80 font-semibold transition-colors"
                        >
                            Войти
                        </Link>
                    </p>
                </div>

                {/* Corner Accent */}
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-primary/5 to-transparent rounded-tr-full pointer-events-none"></div>
            </motion.div>
        </div>
    );
};

export default Register;
