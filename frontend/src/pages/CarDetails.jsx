import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCar, createTestDriveRequest } from '../services/api';
import { motion } from 'framer-motion';
import { Calendar, Gauge, Zap, Check, Phone, User, Clock } from 'lucide-react';

const CarDetails = () => {
    const { id } = useParams();
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
            }, 2000);
        } catch (error) {
            console.error(error);
            setSubmitStatus('error');
        }
    };

    if (!car) return <div className="min-h-screen bg-dark text-white flex items-center justify-center">Загрузка...</div>;

    return (
        <div className="min-h-screen bg-dark text-white pt-32 pb-12 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                {/* Gallery */}
                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                        <img
                            src={getImageUrl(car.images[activeImage]?.image)}
                            alt={car.model}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-4 gap-4"
                    >
                        {car.images.map((img, idx) => (
                            <button
                                key={img.id}
                                onClick={() => setActiveImage(idx)}
                                className={`aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 ${activeImage === idx ? 'border-primary shadow-[0_0_15px_rgba(211,47,47,0.5)] scale-105' : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'}`}
                            >
                                <img src={getImageUrl(img.image)} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="glass-panel p-8 rounded-2xl mb-8 border border-white/10">
                        <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">{car.brand} {car.model}</h1>
                        <p className="text-4xl text-gradient-gold font-bold mb-8 drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">${Number(car.price).toLocaleString()}</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white/5 p-4 rounded-xl flex items-center space-x-4 border border-white/5 hover:border-primary/30 transition-colors group">
                                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <Calendar className="text-primary h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Год выпуска</p>
                                    <p className="font-bold text-lg">{car.year}</p>
                                </div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl flex items-center space-x-4 border border-white/5 hover:border-primary/30 transition-colors group">
                                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <Gauge className="text-primary h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Пробег</p>
                                    <p className="font-bold text-lg">{car.mileage} км</p>
                                </div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl flex items-center space-x-4 border border-white/5 hover:border-primary/30 transition-colors group">
                                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <Zap className="text-primary h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Коробка</p>
                                    <p className="font-bold text-lg capitalize">{car.transmission}</p>
                                </div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl flex items-center space-x-4 border border-white/5 hover:border-primary/30 transition-colors group">
                                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <Check className="text-primary h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Статус</p>
                                    <p className="font-bold text-lg capitalize text-green-400">{car.status}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                <span className="w-1 h-6 bg-primary rounded-full mr-3"></span>
                                Описание
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-lg font-light">{car.description}</p>
                        </div>

                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full bg-gradient-to-r from-primary to-red-700 text-white font-bold py-5 rounded-xl hover:shadow-[0_0_30px_rgba(211,47,47,0.6)] transition-all duration-300 text-lg uppercase tracking-wider transform hover:-translate-y-1"
                        >
                            Записаться на тест-драйв
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Test Drive Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gray-900 p-8 rounded-lg max-w-md w-full border border-gray-800"
                    >
                        <h2 className="text-2xl font-bold mb-6">Записаться на тест-драйв</h2>
                        {submitStatus === 'success' ? (
                            <div className="text-green-500 text-center py-8">
                                <Check className="h-16 w-16 mx-auto mb-4" />
                                <p>Заявка успешно отправлена!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Имя</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-dark border border-gray-700 rounded pl-10 pr-4 py-2 focus:border-primary focus:outline-none"
                                            value={formData.client_name}
                                            onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Телефон</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                        <input
                                            type="tel"
                                            required
                                            className="w-full bg-dark border border-gray-700 rounded pl-10 pr-4 py-2 focus:border-primary focus:outline-none"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Желаемая дата</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                        <input
                                            type="datetime-local"
                                            required
                                            className="w-full bg-dark border border-gray-700 rounded pl-10 pr-4 py-2 focus:border-primary focus:outline-none"
                                            value={formData.requested_date}
                                            onChange={e => setFormData({ ...formData, requested_date: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary text-white py-2 rounded hover:bg-red-700"
                                    >
                                        Отправить
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default CarDetails;
