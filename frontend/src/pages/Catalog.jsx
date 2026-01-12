import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCars } from '../services/api';
import CarCard from '../components/CarCard';
import { Filter } from 'lucide-react';

const Catalog = () => {
    const [cars, setCars] = useState([]);
    const [filters, setFilters] = useState({
        brand: '',
        transmission: '',
        body_type: '',
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    useEffect(() => {
        fetchCars();
    }, [filters]);

    const fetchCars = async () => {
        try {
            // Filter out empty strings
            const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
            const res = await getCars(params);
            setCars(res.data.results || res.data); // Handle pagination if needed
        } catch (error) {
            console.error("Error fetching cars:", error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-dark text-white pt-20 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-gray-900 p-6 rounded-lg sticky top-24">
                        <div className="flex items-center space-x-2 mb-6">
                            <Filter className="h-5 w-5 text-primary" />
                            <h2 className="text-xl font-bold">Фильтры</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Марка</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={filters.brand}
                                    onChange={handleFilterChange}
                                    placeholder="напр. BMW"
                                    className="w-full bg-dark border border-gray-700 rounded px-3 py-2 text-white focus:border-primary focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Коробка</label>
                                <select
                                    name="transmission"
                                    value={filters.transmission}
                                    onChange={handleFilterChange}
                                    className="w-full bg-dark border border-gray-700 rounded px-3 py-2 text-white focus:border-primary focus:outline-none"
                                >
                                    <option value="">Все</option>
                                    <option value="manual">Механика</option>
                                    <option value="automatic">Автомат</option>
                                    <option value="robot">Робот</option>
                                    <option value="cvt">Вариатор</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Кузов</label>
                                <select
                                    name="body_type"
                                    value={filters.body_type}
                                    onChange={handleFilterChange}
                                    className="w-full bg-dark border border-gray-700 rounded px-3 py-2 text-white focus:border-primary focus:outline-none"
                                >
                                    <option value="">Все</option>
                                    <option value="sedan">Седан</option>
                                    <option value="suv">Внедорожник</option>
                                    <option value="hatchback">Хэтчбек</option>
                                    <option value="coupe">Купе</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Car Grid */}
                <main className="flex-1">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold">Каталог автомобилей</h1>
                        <p className="text-gray-400">Найдено {cars.length} авто</p>
                    </div>

                    {cars.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
                        >
                            {cars.map(car => (
                                <CarCard key={car.id} car={car} />
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            По вашему запросу ничего не найдено.
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Catalog;
