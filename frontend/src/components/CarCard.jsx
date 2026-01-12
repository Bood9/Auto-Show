import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gauge, Calendar, Zap, ArrowRight } from 'lucide-react';

const CarCard = ({ car }) => {
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:8000${imagePath}`;
    };

    const mainImage = getImageUrl(car.images.find(img => img.is_main)?.image || car.images[0]?.image);

    return (
        <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className="glass-panel glass-panel-hover rounded-xl overflow-hidden group relative transition-all duration-500"
        >
            <div className="relative h-60 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                <img
                    src={mainImage}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 z-20">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider backdrop-blur-md ${car.status === 'available' ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(74,222,128,0.2)]' :
                        car.status === 'sold' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        }`}>
                        {car.status === 'available' ? 'В НАЛИЧИИ' : car.status === 'sold' ? 'ПРОДАНО' : 'ЗАБРОНИРОВАНО'}
                    </span>
                </div>
            </div>

            <div className="p-5 relative z-20">
                <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-gradient-primary transition-all duration-300">{car.brand} {car.model}</h3>
                    <p className="text-gradient-gold font-bold text-xl drop-shadow-[0_0_5px_rgba(255,215,0,0.3)]">${Number(car.price).toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-3 border-t border-white/10 pt-4 mb-6 divide-x divide-white/10">
                    <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-300 transition-colors px-1">
                        <Calendar className="h-4 w-4 mb-1.5 text-primary group-hover:text-accent transition-colors" />
                        <span className="text-xs font-medium">{car.year}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-300 transition-colors px-1">
                        <Gauge className="h-4 w-4 mb-1.5 text-primary group-hover:text-accent transition-colors" />
                        <span className="text-xs font-medium whitespace-nowrap">{car.mileage} km</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-300 transition-colors px-1">
                        <Zap className="h-4 w-4 mb-1.5 text-primary group-hover:text-accent transition-colors" />
                        <span className="text-xs font-medium capitalize">
                            {car.transmission.toLowerCase() === 'automatic' ? 'Auto' :
                                car.transmission.toLowerCase() === 'manual' ? 'Manual' :
                                    car.transmission}
                        </span>
                    </div>
                </div>

                <Link
                    to={`/cars/${car.id}`}
                    className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-gradient-to-r hover:from-primary hover:to-red-600 text-white py-3 rounded-lg transition-all duration-300 border border-white/10 hover:border-transparent hover:shadow-[0_0_15px_rgba(211,47,47,0.5)] group/btn"
                >
                    <span className="font-medium">Подробнее</span>
                    <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
};

export default CarCard;
