import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Car, User, Sun, Moon, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [theme, setTheme] = useState('dark');
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        // Initialize theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    const navLinks = [
        { name: 'Главная', path: '/' },
        { name: 'Каталог', path: '/catalog' },
        { name: 'Продать авто', path: '/sell' },
        { name: 'Новости', path: '/news' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'glass-panel py-3 shadow-lg shadow-primary/10' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
                        <div className="relative">
                            <Car className="h-9 w-9 text-primary group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_12px_rgba(201,169,97,0.6)]" />
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/30 transition-all duration-300"></div>
                        </div>
                        <span className="text-2xl font-bold tracking-wider font-display whitespace-nowrap">
                            <span className="text-light">DUBAI </span>
                            <span className="text-gradient-gold">ELITE</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-1 ml-auto mr-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg whitespace-nowrap ${
                                    location.pathname === link.path
                                        ? 'text-primary drop-shadow-[0_0_8px_rgba(201,169,97,0.5)]'
                                        : 'text-muted hover:text-light hover:bg-white/5'
                                }`}
                            >
                                {link.name}
                                {location.pathname === link.path && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Actions - Right */}
                    <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-white/5 transition-all duration-300 text-muted hover:text-primary group"
                        >
                            {theme === 'dark' ? (
                                <Sun className="h-5 w-5 group-hover:rotate-90 transition-transform duration-500" />
                            ) : (
                                <Moon className="h-5 w-5 group-hover:-rotate-12 transition-transform duration-500" />
                            )}
                        </button>

                        {/* User Menu */}
                        {user ? (
                            <>
                                {user.is_superuser && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-all duration-300 font-semibold border border-accent/20"
                                        title="Админ-панель"
                                    >
                                        <Shield className="h-4 w-4" />
                                        <span className="text-sm">Админ</span>
                                    </Link>
                                )}
                                <Link
                                    to="/dashboard"
                                    className="flex items-center space-x-2 glass-panel glass-panel-hover px-4 py-2 rounded-lg transition-all duration-300 border border-primary/20"
                                >
                                    <LayoutDashboard className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">Кабинет</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 rounded-lg text-muted hover:text-accent hover:bg-accent/10 transition-all duration-300"
                                    title="Выйти"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="relative flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 hover:border-primary/50 text-primary font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <User className="h-4 w-4 relative z-10" />
                                <span className="text-sm relative z-10">Войти</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden flex-shrink-0">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-muted hover:text-primary hover:bg-white/5 transition-all duration-300"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden glass-panel border-t border-primary/10 mt-2"
                    >
                        <div className="px-4 pt-3 pb-4 space-y-2">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Link
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-all duration-300 ${
                                            location.pathname === link.path
                                                ? 'bg-primary/10 text-primary border border-primary/20'
                                                : 'text-muted hover:text-light hover:bg-white/5'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <div className="border-t border-primary/10 my-3 pt-3">
                                {user ? (
                                    <>
                                        <div className="px-4 py-2 text-sm text-primary font-semibold">
                                            {user.username || user.first_name || 'Пользователь'}
                                        </div>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center px-4 py-2.5 rounded-lg text-base font-medium text-light hover:bg-white/5 transition-all duration-300 mt-2"
                                        >
                                            <LayoutDashboard className="h-4 w-4 mr-3 text-primary" />
                                            Личный кабинет
                                        </Link>
                                        {user.is_superuser && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center px-4 py-2.5 rounded-lg text-base font-semibold text-accent hover:bg-accent/10 transition-all duration-300 mt-2"
                                            >
                                                <Shield className="h-4 w-4 mr-3" />
                                                Админ-панель
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-4 py-2.5 rounded-lg text-base font-medium text-muted hover:text-accent hover:bg-accent/10 transition-all duration-300 mt-2"
                                        >
                                            <LogOut className="h-4 w-4 mr-3" />
                                            Выйти
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center px-4 py-2.5 rounded-lg text-base font-semibold text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all duration-300"
                                    >
                                        <User className="h-4 w-4 mr-3" />
                                        Войти
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
