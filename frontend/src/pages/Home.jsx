import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCars, getNews } from '../services/api';
import CarCard from '../components/CarCard';

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
                {/* Premium Background with Gradient */}
                <div className="absolute inset-0 z-0">
                    {/* Base gradient background - luxury showroom feel */}
                    <div className="absolute inset-0 bg-gradient-to-br from-dark via-[#0a0a12] to-dark"></div>

                    {/* Grid pattern overlay for showroom effect */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `linear-gradient(rgba(201,169,97,0.1) 1px, transparent 1px),
                                         linear-gradient(90deg, rgba(201,169,97,0.1) 1px, transparent 1px)`,
                        backgroundSize: '100px 100px'
                    }}></div>

                    {/* Radial gradient spotlights */}
                    <div className="absolute top-0 left-0 w-full h-full">
                        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px] animate-pulse-slow"></div>
                        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
                    </div>

                    {/* Gradient overlays for depth */}
                    <div className="absolute inset-0 bg-gradient-to-b from-dark/90 via-dark/50 to-dark z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-transparent to-dark/80 z-10"></div>

                    {/* Shimmer effect lines */}
                    <div className="absolute inset-0 z-5 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-shimmer"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-shimmer" style={{ animationDelay: '3s' }}></div>
                    </div>
                </div>

                <div className="relative z-20 text-center px-4 max-w-6xl mx-auto mt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="mb-8"
                    >
                        <span className="inline-block px-6 py-2 mb-6 glass-panel rounded-full text-primary font-bold tracking-[0.25em] text-xs uppercase border border-primary/20">
                            Dubai Luxury Collection
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] font-display">
                            <span className="block text-light mb-2">РОСКОШЬ</span>
                            <span className="block text-gradient-gold text-6xl md:text-8xl lg:text-9xl">
                                БЕЗ КОМПРОМИССОВ
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        className="text-lg md:text-xl text-muted mb-12 max-w-3xl mx-auto font-light leading-relaxed"
                    >
                        Откройте для себя эксклюзивную коллекцию премиальных автомобилей.
                        <br className="hidden md:block" />
                        Каждый выбор – это воплощение совершенства и престижа.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                        className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6"
                    >
                        <Link
                            to="/catalog"
                            className="group relative px-8 md:px-10 py-3.5 md:py-4 bg-gradient-to-r from-primary to-primary/80 text-dark rounded-lg font-bold text-base md:text-lg overflow-hidden shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-500 border border-primary/20"
                        >
                            <span className="relative z-10 flex items-center font-semibold">
                                Смотреть коллекцию
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-right duration-500" />
                        </Link>

                        <Link
                            to="/sell"
                            className="group px-8 md:px-10 py-3.5 md:py-4 glass-panel rounded-lg font-bold text-base md:text-lg transition-all duration-500 border border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                        >
                            <span className="flex items-center text-light group-hover:text-primary transition-colors">
                                Продать авто
                            </span>
                        </Link>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.9 }}
                        className="mt-20 grid grid-cols-3 gap-6 md:gap-12 max-w-3xl mx-auto"
                    >
                        {[
                            { value: "500+", label: "Премиум авто" },
                            { value: "98%", label: "Довольных клиентов" },
                            { value: "15+", label: "Лет опыта" }
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-2xl md:text-4xl font-bold text-gradient-gold mb-2">{stat.value}</div>
                                <div className="text-xs md:text-sm text-muted uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 12, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 text-primary/60"
                >
                    <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex justify-center p-2 backdrop-blur-sm">
                        <div className="w-1 h-2 bg-primary rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-24 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-lighter to-dark"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <span className="inline-block px-6 py-2 mb-4 glass-panel rounded-full text-primary font-bold tracking-[0.2em] text-xs uppercase border border-primary/20">
                            Наши преимущества
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-light">Почему выбирают нас</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                className="relative group"
                            >
                                <div className="glass-panel glass-panel-hover rounded-2xl p-8 h-full border border-primary/10 hover:border-primary/30 transition-all duration-500">
                                    {/* Icon container with glow */}
                                    <div className="relative w-16 h-16 mb-6">
                                        <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl group-hover:bg-primary/30 transition-all duration-500"></div>
                                        <div className="relative w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-all duration-500">
                                            <feature.icon className="h-7 w-7 text-primary" />
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 text-light group-hover:text-primary transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted leading-relaxed">{feature.desc}</p>

                                    {/* Decorative corner accent */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Cars */}
            <section className="py-24 md:py-32 px-4 max-w-7xl mx-auto relative">
                {/* Background decoration */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
                        <div>
                            <span className="inline-block px-6 py-2 mb-4 glass-panel rounded-full text-primary font-bold tracking-[0.2em] text-xs uppercase border border-primary/20">
                                Премиум коллекция
                            </span>
                            <h2 className="text-3xl md:text-5xl font-bold text-light font-display">
                                Избранные автомобили
                            </h2>
                            <p className="text-muted mt-3 max-w-xl">
                                Тщательно отобранные автомобили класса люкс для самых взыскательных клиентов
                            </p>
                        </div>
                        <Link
                            to="/catalog"
                            className="group hidden md:flex items-center px-6 py-3 glass-panel rounded-lg text-light hover:text-primary border border-primary/20 hover:border-primary/40 transition-all duration-300"
                        >
                            <span className="font-semibold">Весь каталог</span>
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredCars.map((car, index) => (
                            <motion.div
                                key={car.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                            >
                                <CarCard car={car} />
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <Link
                            to="/catalog"
                            className="inline-flex items-center px-8 py-3 glass-panel rounded-lg text-primary font-bold border border-primary/20"
                        >
                            Весь каталог
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Latest News */}
            <section className="py-24 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-card to-dark"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-12 md:mb-16">
                        <span className="inline-block px-6 py-2 mb-4 glass-panel rounded-full text-primary font-bold tracking-[0.2em] text-xs uppercase border border-primary/20">
                            Новости и события
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-light font-display mb-4">
                            Последние новости
                        </h2>
                        <p className="text-muted max-w-2xl mx-auto">
                            Будьте в курсе новых поступлений, специальных предложений и событий
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {latestNews.map((news, index) => (
                            <motion.div
                                key={news.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden group border border-primary/10 hover:border-primary/30 transition-all duration-500"
                            >
                                {news.image && (
                                    <div className="h-52 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-card/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <img
                                            src={news.image}
                                            alt={news.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                )}
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary font-bold uppercase tracking-wider">
                                            Новости
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-light group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                        {news.title}
                                    </h3>
                                    <p className="text-muted text-sm mb-6 line-clamp-3 leading-relaxed">
                                        {news.content}
                                    </p>
                                    <Link
                                        to="/news"
                                        className="inline-flex items-center text-light hover:text-primary transition-colors text-sm font-semibold group/link"
                                    >
                                        Читать далее
                                        <ArrowRight className="ml-2 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
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
