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
            whileHover={{ y: -8 }}
            className="glass-panel glass-panel-hover rounded-2xl overflow-hidden group relative transition-all duration-500 border border-primary/10 hover:border-primary/30"
        >
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/50 to-transparent z-10 group-hover:from-dark-card/80 transition-all duration-500" />

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-20">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider backdrop-blur-xl ${
                        car.status === 'available'
                            ? 'bg-primary/20 text-primary border border-primary/40'
                            : car.status === 'sold'
                            ? 'bg-accent/20 text-accent border border-accent/40'
                            : 'bg-muted/20 text-muted border border-muted/40'
                    }`}>
                        {car.status === 'available' ? 'ДОСТУПЕН' : car.status === 'sold' ? 'ПРОДАН' : 'БРОНЬ'}
                    </span>
                </div>

                {/* Car Image */}
                <img
                    src={mainImage}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Hover Overlay Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
            </div>

            {/* Content */}
            <div className="p-6 relative z-20">
                {/* Title and Price */}
                <div className="mb-5">
                    <h3 className="text-2xl font-bold text-light mb-2 group-hover:text-primary transition-colors duration-300 font-display">
                        {car.brand} {car.model}
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <p className="text-gradient-gold font-bold text-2xl">${Number(car.price).toLocaleString()}</p>
                        <span className="text-xs text-muted uppercase tracking-wider">USD</span>
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 border border-primary/10 group-hover:border-primary/20 transition-all duration-300">
                        <Calendar className="h-5 w-5 mb-2 text-primary" />
                        <span className="text-xs font-semibold text-light">{car.year}</span>
                        <span className="text-[10px] text-muted uppercase tracking-wider mt-0.5">Год</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 border border-primary/10 group-hover:border-primary/20 transition-all duration-300">
                        <Gauge className="h-5 w-5 mb-2 text-primary" />
                        <span className="text-xs font-semibold text-light whitespace-nowrap">{car.mileage}k</span>
                        <span className="text-[10px] text-muted uppercase tracking-wider mt-0.5">км</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white/5 border border-primary/10 group-hover:border-primary/20 transition-all duration-300">
                        <Zap className="h-5 w-5 mb-2 text-primary" />
                        <span className="text-xs font-semibold text-light">
                            {car.transmission.toLowerCase() === 'automatic' ? 'Auto' :
                                car.transmission.toLowerCase() === 'manual' ? 'Manual' :
                                    car.transmission}
                        </span>
                        <span className="text-[10px] text-muted uppercase tracking-wider mt-0.5">КПП</span>
                    </div>
                </div>

                {/* CTA Button */}
                <Link
                    to={`/cars/${car.id}`}
                    className="relative w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-semibold transition-all duration-300 overflow-hidden group/btn bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 hover:border-primary/50 text-light hover:text-primary"
                >
                    <span className="relative z-10">Подробнее</span>
                    <ArrowRight className="relative z-10 h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300"></div>
                </Link>
            </div>

            {/* Corner Accent */}
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/5 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </motion.div>
    );
};

export default CarCard;
