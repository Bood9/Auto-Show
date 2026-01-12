import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCars, getNews } from '../services/api';
import CarCard from '../components/CarCard';
import heroImage from '../assets/hero-car.jpg';

const Home = () => {
    const [featuredCars, setFeaturedCars] = useState([]);
    const [latestNews, setLatestNews] = useState([]);

    useEffect(() => {
        // Fetch featured cars
        getCars({ is_featured: true }).then(res => {
            const cars = res.data.results || res.data;
            setFeaturedCars(Array.isArray(cars) ? cars.slice(0, 3) : []);
        }).catch(console.error);

        getNews().then(res => {
            const news = res.data.results || res.data;
            setLatestNews(Array.isArray(news) ? news.slice(0, 3) : []);
        }).catch(console.error);
    }, []);

    const features = [
        { icon: Star, title: "Премиум Качество", desc: "Только проверенные автомобили высшего класса" },
        { icon: TrendingUp, title: "Выгодные Условия", desc: "Лучшие цены и программы кредитования" },
        { icon: Shield, title: "Гарантия Надежности", desc: "Полная юридическая чистота и техническая гарантия" }
    ];

    return (
        <div className="min-h-screen bg-dark text-white overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-dark/30 via-transparent to-dark z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-transparent to-dark/80 z-10" />
                    <img
                        src={heroImage}
                        alt="Premium Car"
                        className="w-full h-full object-cover scale-105 animate-float"
                    />
                </div>

                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mb-6"
                    >
                        <span className="text-accent tracking-[0.3em] text-sm font-bold uppercase mb-4 block drop-shadow-md">
                            Добро пожаловать в будущее
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight drop-shadow-xl">
                            УПРАВЛЯЙ <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-600 drop-shadow-sm">МЕЧТОЙ</span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto font-light drop-shadow-md"
                    >
                        Испытайте коллекцию премиальных автомобилей, созданных для вашего исключительного стиля жизни.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-6"
                    >
                        <Link
                            to="/catalog"
                            className="group relative px-8 py-4 bg-primary text-white rounded-full font-bold text-lg overflow-hidden shadow-[0_0_20px_rgba(211,47,47,0.5)] hover:shadow-[0_0_30px_rgba(211,47,47,0.8)] transition-all duration-300"
                        >
                            <span className="relative z-10 flex items-center">
                                Перейти в каталог <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                        </Link>

                        <Link
                            to="/sell"
                            className="px-8 py-4 glass-panel text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-md border border-white/20"
                        >
                            Продать авто
                        </Link>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-gray-400"
                >
                    <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center p-2 backdrop-blur-sm">
                        <div className="w-1 h-2 bg-gray-400 rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-dark-lighter relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="text-center group"
                            >
                                <div className="w-16 h-16 mx-auto mb-6 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                                    <feature.icon className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Cars */}
            <section className="py-24 px-4 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Эксклюзив</span>
                        <h2 className="text-4xl font-bold">Избранные автомобили</h2>
                    </div>
                    <Link to="/catalog" className="hidden md:flex items-center text-gray-400 hover:text-primary transition-colors group">
                        Смотреть все <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {featuredCars.map((car, index) => (
                        <motion.div
                            key={car.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <CarCard car={car} />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link to="/catalog" className="inline-flex items-center text-primary font-bold">
                        Смотреть все <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </section>

            {/* Latest News */}
            <section className="py-24 bg-dark-lighter relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Блог</span>
                        <h2 className="text-4xl font-bold">Последние новости</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {latestNews.map((news, index) => (
                            <motion.div
                                key={news.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-panel rounded-xl overflow-hidden group hover:border-primary/50 transition-colors duration-300"
                            >
                                {news.image && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={news.image}
                                            alt={news.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                )}
                                <div className="p-8">
                                    <div className="text-xs text-primary font-bold mb-3 uppercase tracking-wider">Новости</div>
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{news.title}</h3>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">{news.content}</p>
                                    <Link to="/news" className="inline-flex items-center text-white hover:text-primary transition-colors text-sm font-bold group/link">
                                        Читать далее <ArrowRight className="ml-2 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
