import React, { useEffect, useState } from 'react';
import { getNews, getPromotions } from '../services/api';
import { Calendar, Tag, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const News = () => {
    const [news, setNews] = useState([]);
    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        getNews().then(res => setNews(res.data.results || res.data)).catch(console.error);
        getPromotions().then(res => setPromotions(res.data.results || res.data)).catch(console.error);
    }, []);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `http://127.0.0.1:8000${imagePath}`;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-dark text-light pt-24 pb-16 px-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-40 -left-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute bottom-20 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-6 py-2 mb-4 glass-panel rounded-full text-primary font-bold tracking-[0.2em] text-xs uppercase border border-primary/20">
                        Новости и события
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display">
                        <span className="text-light">Мир </span>
                        <span className="text-gradient-gold">Dubai Elite</span>
                    </h1>
                    <p className="text-xl text-muted max-w-2xl mx-auto">
                        Последние новости, обзоры и специальные предложения
                    </p>
                </motion.div>

                {/* Promotions Section */}
                {promotions.length > 0 && (
                    <section className="mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-accent/10 rounded-lg border border-accent/20">
                                <Tag className="h-6 w-6 text-accent" />
                            </div>
                            <h2 className="text-3xl font-bold text-light font-display">Актуальные акции</h2>
                        </div>
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            {promotions.map(promo => (
                                <motion.div
                                    key={promo.id}
                                    variants={itemVariants}
                                    whileHover={{ y: -8 }}
                                    className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col md:flex-row group border border-primary/10 hover:border-accent/30 transition-all duration-500"
                                >
                                    {promo.image && (
                                        <div className="w-full md:w-2/5 relative overflow-hidden h-64 md:h-auto">
                                            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/50 to-transparent z-10 group-hover:from-dark/70 transition-all duration-500" />
                                            <img
                                                src={getImageUrl(promo.image)}
                                                alt={promo.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-accent text-dark font-bold rounded-lg text-xs uppercase tracking-wider shadow-lg shadow-accent/30 flex items-center gap-1.5">
                                                <Sparkles className="h-3 w-3" />
                                                <span>Акция</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-3 text-light group-hover:text-primary transition-colors duration-300">
                                                {promo.title}
                                            </h3>
                                            <p className="text-muted mb-6 line-clamp-3 leading-relaxed">
                                                {promo.description}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-primary/10 pt-4 mt-auto">
                                            <div className="flex items-center text-sm text-muted">
                                                <Clock className="h-4 w-4 mr-2 text-primary" />
                                                <span>До: {new Date(promo.end_date).toLocaleDateString()}</span>
                                            </div>
                                            <button className="text-primary font-semibold flex items-center group/btn hover:text-primary/80 transition-colors">
                                                Подробнее
                                                <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </section>
                )}

                {/* News Section */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                            <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-light font-display">Последние новости</h2>
                    </div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {news.map(item => (
                            <motion.div
                                key={item.id}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                className="glass-panel glass-panel-hover rounded-2xl overflow-hidden group flex flex-col h-full border border-primary/10 hover:border-primary/30 transition-all duration-500"
                            >
                                {item.image && (
                                    <div className="relative h-56 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/40 to-transparent z-10 group-hover:from-dark/70 transition-all duration-500" />
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute bottom-4 left-4 z-20 flex items-center text-xs text-light bg-dark/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-primary/20">
                                            <Calendar className="h-3 w-3 mr-2 text-primary" />
                                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold mb-3 text-light group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-muted text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                                        {item.content}
                                    </p>

                                    <a
                                        href="#"
                                        className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors mt-auto group/link"
                                    >
                                        Читать полностью
                                        <ArrowRight className="ml-2 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform" />
                                    </a>
                                </div>

                                {/* Corner Accent */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Empty State */}
                    {news.length === 0 && (
                        <div className="glass-panel rounded-2xl p-12 text-center border border-primary/10">
                            <Calendar className="h-16 w-16 mx-auto mb-4 text-primary opacity-20" />
                            <h3 className="text-xl font-bold text-light mb-2">Новостей пока нет</h3>
                            <p className="text-muted">Следите за обновлениями</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default News;
