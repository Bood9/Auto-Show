import React, { useEffect, useState } from 'react';
import { getNews, getPromotions } from '../services/api';
import { Calendar, Tag, ArrowRight, Clock } from 'lucide-react';
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
        return `http://localhost:8000${imagePath}`;
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
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-dark text-white pt-24 pb-12 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-40 -left-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-20" />
                <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-bold mb-4">Мир <span className="text-gradient-primary">Legacy Motors</span></h1>
                    <p className="text-xl text-gray-400">Последние новости, обзоры и специальные предложения</p>
                </motion.div>

                {/* Promotions */}
                {promotions.length > 0 && (
                    <section className="mb-20">
                        <div className="flex items-center space-x-3 mb-8">
                            <Tag className="h-6 w-6 text-accent" />
                            <h2 className="text-3xl font-bold">Актуальные акции</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {promotions.map(promo => (
                                <motion.div
                                    key={promo.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ y: -5 }}
                                    className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col md:flex-row group"
                                >
                                    {promo.image && (
                                        <div className="w-full md:w-2/5 relative overflow-hidden h-64 md:h-auto">
                                            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent z-10" />
                                            <img
                                                src={getImageUrl(promo.image)}
                                                alt={promo.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute top-4 left-4 z-20 bg-accent text-dark font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                                                Акция
                                            </div>
                                        </div>
                                    )}
                                    <div className="p-8 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{promo.title}</h3>
                                            <p className="text-gray-400 mb-6 line-clamp-3">{promo.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Clock className="h-4 w-4 mr-2" />
                                                <span>До: {new Date(promo.end_date).toLocaleDateString()}</span>
                                            </div>
                                            <button className="text-primary font-medium flex items-center group/btn">
                                                Подробнее <ArrowRight className="ml-2 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* News Grid */}
                <section>
                    <div className="flex items-center space-x-3 mb-8">
                        <Calendar className="h-6 w-6 text-primary" />
                        <h2 className="text-3xl font-bold">Последние новости</h2>
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
                                className="glass-panel glass-panel-hover rounded-xl overflow-hidden group flex flex-col h-full"
                            >
                                {item.image && (
                                    <div className="relative h-56 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark/90 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute bottom-4 left-4 z-20 flex items-center text-xs text-gray-300 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <Calendar className="h-3 w-3 mr-2" />
                                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold mb-3 group-hover:text-gradient-primary transition-all duration-300 line-clamp-2">{item.title}</h3>
                                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">{item.content}</p>

                                    <a href="#" className="inline-flex items-center text-sm font-medium text-white/70 hover:text-white transition-colors mt-auto group/link">
                                        Читать полностью
                                        <ArrowRight className="ml-2 h-4 w-4 transform group-hover/link:translate-x-1 transition-transform text-primary" />
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            </div>
        </div>
    );
};

export default News;
