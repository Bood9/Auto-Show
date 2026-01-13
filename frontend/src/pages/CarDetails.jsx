import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCar, createTestDriveRequest } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Gauge, Zap, Check, Phone, User, Clock, X, ArrowLeft, Fuel, Palette, Package } from 'lucide-react';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ client_name: '', phone: '', requested_date: '' });
    const [submitStatus, setSubmitStatus] = useState(null);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/800x600';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:8000${imagePath}`;
    };

    useEffect(() => {
        getCar(id).then(res => setCar(res.data)).catch(console.error);
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTestDriveRequest({ ...formData, car: car.id });
            setSubmitStatus('success');
            setTimeout(() => {
                setShowModal(false);
                setSubmitStatus(null);
                setFormData({ client_name: '', phone: '', requested_date: '' });
            }, 2500);
        } catch (error) {
            console.error(error);
            setSubmitStatus('error');
        }
    };

    if (!car) {
        return (
            <div className="min-h-screen bg-dark text-light flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted">Загрузка...</p>
                </div>
            </div>
        );
    }

    const specs = [
        { icon: Calendar, label: 'Год выпуска', value: car.year },
        { icon: Gauge, label: 'Пробег', value: `${car.mileage} км` },
        { icon: Zap, label: 'Коробка', value: car.transmission === 'automatic' ? 'Автомат' : car.transmission === 'manual' ? 'Механика' : car.transmission },
        { icon: Fuel, label: 'Двигатель', value: `${car.engine_volume || 'N/A'} л` },
        { icon: Palette, label: 'Цвет', value: car.color || 'N/A' },
        { icon: Package, label: 'Кузов', value: car.body_type || 'Sedan' },
    ];

    return (
        <div className="min-h-screen bg-dark text-light pt-24 pb-16 px-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Back button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 mb-8 glass-panel rounded-lg border border-primary/20 hover:border-primary/40 text-muted hover:text-primary transition-all duration-300 group"
                >
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Назад</span>
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Gallery Section */}
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="relative aspect-[4/3] rounded-2xl overflow-hidden glass-panel border border-primary/10 group"
                        >
                            {/* Status Badge */}
                            <div className="absolute top-4 right-4 z-20">
                                <span className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider backdrop-blur-xl ${
                                    car.status === 'available'
                                        ? 'bg-primary/20 text-primary border border-primary/40'
                                        : car.status === 'sold'
                                        ? 'bg-accent/20 text-accent border border-accent/40'
                                        : 'bg-muted/20 text-muted border border-muted/40'
                                }`}>
                                    {car.status === 'available' ? 'ДОСТУПЕН' : car.status === 'sold' ? 'ПРОДАН' : 'ЗАБРОНИРОВАН'}
                                </span>
                            </div>

                            {/* Main Image */}
                            <img
                                src={getImageUrl(car.images[activeImage]?.image)}
                                alt={`${car.brand} ${car.model}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />

                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>

                        {/* Thumbnails */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="grid grid-cols-4 gap-3"
                        >
                            {car.images.map((img, idx) => (
                                <button
                                    key={img.id}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                        activeImage === idx
                                            ? 'border-primary shadow-lg shadow-primary/30 scale-105'
                                            : 'border-primary/20 hover:border-primary/40 opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img src={getImageUrl(img.image)} alt="" className="w-full h-full object-cover" />
                                    {activeImage === idx && (
                                        <div className="absolute inset-0 bg-primary/10" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </div>

                    {/* Info Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Title & Price */}
                        <div className="glass-panel p-6 lg:p-8 rounded-2xl border border-primary/10">
                            <span className="inline-block px-4 py-1.5 mb-4 glass-panel rounded-full text-primary font-bold tracking-[0.2em] text-xs uppercase border border-primary/20">
                                Premium Selection
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-bold mb-3 text-light font-display">
                                {car.brand} {car.model}
                            </h1>
                            <div className="flex items-baseline gap-3 mb-6">
                                <p className="text-5xl text-gradient-gold font-bold">
                                    ${Number(car.price).toLocaleString()}
                                </p>
                                <span className="text-sm text-muted uppercase tracking-wider">USD</span>
                            </div>

                            {/* Specs Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {specs.map((spec, index) => (
                                    <div
                                        key={index}
                                        className="bg-white/5 p-4 rounded-xl flex items-center gap-3 border border-primary/10 hover:border-primary/30 transition-all duration-300 group/spec"
                                    >
                                        <div className="p-2.5 bg-primary/10 rounded-lg border border-primary/20 group-hover/spec:bg-primary/20 transition-colors">
                                            <spec.icon className="text-primary h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">{spec.label}</p>
                                            <p className="font-semibold text-light text-sm">{spec.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            <div className="border-t border-primary/10 pt-6">
                                <h3 className="text-lg font-bold mb-3 flex items-center text-light">
                                    <span className="w-1 h-5 bg-gradient-to-b from-primary to-primary/50 rounded-full mr-3"></span>
                                    Описание
                                </h3>
                                <p className="text-muted leading-relaxed">{car.description}</p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => setShowModal(true)}
                            disabled={car.status !== 'available'}
                            className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-500 ${
                                car.status === 'available'
                                    ? 'bg-gradient-to-r from-primary to-primary/80 text-dark hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]'
                                    : 'bg-muted/20 text-muted cursor-not-allowed'
                            }`}
                        >
                            {car.status === 'available' ? 'Записаться на тест-драйв' : 'Недоступно'}
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Test Drive Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-dark/95 backdrop-blur-xl flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="glass-panel p-8 rounded-2xl max-w-lg w-full border border-primary/20 relative"
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 text-muted hover:text-light transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <h2 className="text-3xl font-bold mb-2 text-light font-display">Тест-драйв</h2>
                            <p className="text-muted mb-6">Заполните форму и мы свяжемся с вами</p>

                            {submitStatus === 'success' ? (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-primary/20">
                                        <Check className="h-10 w-10 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold text-light mb-2">Заявка отправлена!</h3>
                                    <p className="text-muted">Мы свяжемся с вами в ближайшее время</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-light">Ваше имя</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="Иван Иванов"
                                                className="w-full bg-dark-card border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                                value={formData.client_name}
                                                onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-light">Телефон</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                                            <input
                                                type="tel"
                                                required
                                                placeholder="+7 (999) 123-45-67"
                                                className="w-full bg-dark-card border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-light">Желаемая дата и время</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                                            <input
                                                type="datetime-local"
                                                required
                                                className="w-full bg-dark-card border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-light focus:border-primary/50 focus:outline-none transition-colors"
                                                value={formData.requested_date}
                                                onChange={e => setFormData({ ...formData, requested_date: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {submitStatus === 'error' && (
                                        <p className="text-accent text-sm">Ошибка отправки. Попробуйте снова.</p>
                                    )}

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 px-6 py-3 glass-panel rounded-lg font-semibold border border-muted/20 text-muted hover:text-light hover:bg-white/5 transition-all duration-300"
                                        >
                                            Отмена
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-dark rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
                                        >
                                            Отправить
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CarDetails;
