import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCars } from '../services/api';
import CarCard from '../components/CarCard';
import { Filter, Search, X } from 'lucide-react';

const Catalog = () => {
    const [cars, setCars] = useState([]);
    const [filters, setFilters] = useState({
        brand: '',
        transmission: '',
        body_type: '',
    });
    const [showFilters, setShowFilters] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    useEffect(() => {
        fetchCars();
    }, [filters]);

    const fetchCars = async () => {
        try {
            const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
            const res = await getCars(params);
            setCars(res.data.results || res.data);
        } catch (error) {
            console.error("Error fetching cars:", error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setFilters({
            brand: '',
            transmission: '',
            body_type: '',
        });
    };

    const hasActiveFilters = Object.values(filters).some(v => v !== '');

    return (
        <div className="min-h-screen bg-dark text-light pt-24 pb-16 px-4">
            {/* Hero Header */}
            <div className="max-w-7xl mx-auto mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <span className="inline-block px-6 py-2 mb-4 glass-panel rounded-full text-primary font-bold tracking-[0.2em] text-xs uppercase border border-primary/20">
                        Премиум каталог
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display">
                        <span className="text-light">Наша </span>
                        <span className="text-gradient-gold">Коллекция</span>
                    </h1>
                    <p className="text-muted text-lg max-w-2xl mx-auto">
                        Эксклюзивный выбор премиальных автомобилей мировых брендов
                    </p>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar - Desktop */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <div className="glass-panel rounded-2xl p-6 sticky top-28 border border-primary/10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                                        <Filter className="h-5 w-5 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold text-light">Фильтры</h2>
                                </div>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-accent hover:text-accent/80 font-semibold transition-colors"
                                    >
                                        Сбросить
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Brand Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-light mb-3">Марка автомобиля</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                                        <input
                                            type="text"
                                            name="brand"
                                            value={filters.brand}
                                            onChange={handleFilterChange}
                                            placeholder="Например: BMW"
                                            className="w-full bg-dark-card border border-primary/20 rounded-lg pl-10 pr-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Transmission Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-light mb-3">Коробка передач</label>
                                    <select
                                        name="transmission"
                                        value={filters.transmission}
                                        onChange={handleFilterChange}
                                        className="w-full bg-dark-card border border-primary/20 rounded-lg px-4 py-3 text-light focus:border-primary/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="">Все типы</option>
                                        <option value="manual">Механика</option>
                                        <option value="automatic">Автомат</option>
                                        <option value="robot">Робот</option>
                                        <option value="cvt">Вариатор</option>
                                    </select>
                                </div>

                                {/* Body Type Filter */}
                                <div>
                                    <label className="block text-sm font-semibold text-light mb-3">Тип кузова</label>
                                    <select
                                        name="body_type"
                                        value={filters.body_type}
                                        onChange={handleFilterChange}
                                        className="w-full bg-dark-card border border-primary/20 rounded-lg px-4 py-3 text-light focus:border-primary/50 focus:outline-none transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="">Все типы</option>
                                        <option value="sedan">Седан</option>
                                        <option value="suv">Внедорожник</option>
                                        <option value="hatchback">Хэтчбек</option>
                                        <option value="coupe">Купе</option>
                                        <option value="minivan">Минивэн</option>
                                        <option value="pickup">Пикап</option>
                                    </select>
                                </div>
                            </div>

                            {/* Active Filters Summary */}
                            {hasActiveFilters && (
                                <div className="mt-6 pt-6 border-t border-primary/10">
                                    <p className="text-xs text-muted mb-3">Активные фильтры:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {filters.brand && (
                                            <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary">
                                                {filters.brand}
                                            </span>
                                        )}
                                        {filters.transmission && (
                                            <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary">
                                                {filters.transmission}
                                            </span>
                                        )}
                                        {filters.body_type && (
                                            <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary">
                                                {filters.body_type}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Mobile Filter Button */}
                    <div className="lg:hidden fixed bottom-6 right-6 z-40">
                        <button
                            onClick={() => setShowFilters(true)}
                            className="p-4 bg-gradient-to-r from-primary to-primary/80 text-dark rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 border border-primary/20"
                        >
                            <Filter className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Mobile Filters Modal */}
                    {showFilters && (
                        <div className="lg:hidden fixed inset-0 bg-dark/95 backdrop-blur-xl z-50 overflow-y-auto">
                            <div className="min-h-screen p-4">
                                <div className="glass-panel rounded-2xl p-6 border border-primary/10 max-w-md mx-auto">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-light">Фильтры</h2>
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            <X className="h-6 w-6 text-light" />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-light mb-3">Марка</label>
                                            <input
                                                type="text"
                                                name="brand"
                                                value={filters.brand}
                                                onChange={handleFilterChange}
                                                placeholder="Например: BMW"
                                                className="w-full bg-dark-card border border-primary/20 rounded-lg px-4 py-3 text-light focus:border-primary/50 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-light mb-3">Коробка</label>
                                            <select
                                                name="transmission"
                                                value={filters.transmission}
                                                onChange={handleFilterChange}
                                                className="w-full bg-dark-card border border-primary/20 rounded-lg px-4 py-3 text-light focus:border-primary/50 focus:outline-none"
                                            >
                                                <option value="">Все</option>
                                                <option value="manual">Механика</option>
                                                <option value="automatic">Автомат</option>
                                                <option value="robot">Робот</option>
                                                <option value="cvt">Вариатор</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-light mb-3">Кузов</label>
                                            <select
                                                name="body_type"
                                                value={filters.body_type}
                                                onChange={handleFilterChange}
                                                className="w-full bg-dark-card border border-primary/20 rounded-lg px-4 py-3 text-light focus:border-primary/50 focus:outline-none"
                                            >
                                                <option value="">Все</option>
                                                <option value="sedan">Седан</option>
                                                <option value="suv">Внедорожник</option>
                                                <option value="hatchback">Хэтчбек</option>
                                                <option value="coupe">Купе</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex gap-3">
                                        {hasActiveFilters && (
                                            <button
                                                onClick={clearFilters}
                                                className="flex-1 px-6 py-3 glass-panel rounded-lg font-semibold border border-accent/20 text-accent hover:bg-accent/10 transition-colors"
                                            >
                                                Сбросить
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setShowFilters(false)}
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-dark rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
                                        >
                                            Применить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Car Grid */}
                    <main className="flex-1">
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-muted">
                                        Найдено <span className="text-primary font-bold">{cars.length}</span> {cars.length === 1 ? 'автомобиль' : 'автомобилей'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {cars.length > 0 ? (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                            >
                                {cars.map((car, index) => (
                                    <motion.div
                                        key={car.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 30 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                    >
                                        <CarCard car={car} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="glass-panel rounded-2xl p-12 max-w-md mx-auto border border-primary/10">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Search className="h-10 w-10 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-light mb-3">Ничего не найдено</h3>
                                    <p className="text-muted mb-6">По вашему запросу не найдено автомобилей. Попробуйте изменить фильтры.</p>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="px-6 py-3 bg-primary/10 border border-primary/20 text-primary rounded-lg font-semibold hover:bg-primary/20 transition-colors"
                                        >
                                            Сбросить фильтры
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Catalog;
