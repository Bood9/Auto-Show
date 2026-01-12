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
        <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'glass-panel py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <Car className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300 drop-shadow-[0_0_8px_rgba(211,47,47,0.5)]" />
                        <span className="text-2xl font-bold tracking-wider">
                            LEGACY <span className="text-gradient-primary group-hover:text-gradient-gold transition-all duration-500">MOTORS</span>
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-primary hover:drop-shadow-[0_0_5px_rgba(211,47,47,0.5)] ${location.pathname === link.path ? 'text-primary drop-shadow-[0_0_5px_rgba(211,47,47,0.5)]' : 'text-gray-300'
                                        }`}
                                >
                                    {link.name}
                                    {location.pathname === link.path && (
                                        <motion.div
                                            layoutId="underline"
                                            className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-red-600 shadow-[0_0_10px_rgba(211,47,47,0.8)]"
                                        />
                                    )}
                                </Link>
                            ))}

                            {/* Theme Toggle */}
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                            >
                                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                {user.is_superuser && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition-colors font-bold"
                                        title="Админ-панель"
                                    >
                                        <Shield className="h-5 w-5" />
                                    </Link>
                                )}
                                <Link
                                    to="/dashboard"
                                    className="flex items-center space-x-2 glass-panel glass-panel-hover text-white px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/10"
                                >
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Кабинет</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                                    title="Выйти"
                                >
                                    <LogOut className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center space-x-2 glass-panel glass-panel-hover text-white px-6 py-2 rounded-full transition-all duration-300"
                            >
                                <User className="h-4 w-4" />
                                <span>Войти</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-300 hover:text-white p-2"
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
                        className="md:hidden bg-dark border-t border-white/10"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.path ? 'text-primary' : 'text-gray-300 hover:text-white'}`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <div className="border-t border-white/10 my-2 pt-2">
                                {user ? (
                                    <>
                                        <div className="px-3 py-2 text-sm text-gray-400">
                                            Привет, {user.username || user.first_name || 'Пользователь'}
                                        </div>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsOpen(false)}
                                            className="block hover:text-primary px-3 py-2 rounded-md text-base font-medium text-white flex items-center"
                                        >
                                            <LayoutDashboard className="h-4 w-4 mr-2" /> Личный кабинет
                                        </Link>
                                        {user.is_superuser && (
                                            <Link
                                                to="/admin"
                                                onClick={() => setIsOpen(false)}
                                                className="block text-red-500 hover:text-red-400 px-3 py-2 rounded-md text-base font-bold"
                                            >
                                                Админ-панель
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left block hover:text-red-500 px-3 py-2 rounded-md text-base font-medium text-gray-400 flex items-center"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" /> Выйти
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        to="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block hover:text-primary px-3 py-2 rounded-md text-base font-medium text-primary flex items-center"
                                    >
                                        <User className="h-4 w-4 mr-2" /> Войти
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
