import React, { useState } from 'react';
import { createCommissionRequest } from '../services/api';
import { motion } from 'framer-motion';
import { Check, Car, DollarSign, Calendar, FileText, User, Phone, ArrowRight, Sparkles } from 'lucide-react';

const SellCar = () => {
    const [formData, setFormData] = useState({
        client_name: '',
        phone: '',
        brand: '',
        model: '',
        year: '',
        mileage: '',
        expected_price: '',
        description: '',
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            await createCommissionRequest(formData);
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-dark text-light pt-24 flex items-center justify-center px-4 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] animate-pulse-slow" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
                </div>

                <div className="text-center max-w-lg w-full glass-panel p-12 rounded-2xl relative overflow-hidden border border-primary/20 z-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="relative mx-auto mb-8"
                    >
                        <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse-slow"></div>
                        <div className="relative w-24 h-24 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center mx-auto border-4 border-primary/40 shadow-lg shadow-primary/50">
                            <Check className="h-12 w-12 text-primary" />
                        </div>
                    </motion.div>
                    <h2 className="text-4xl font-bold mb-4 text-light font-display">Заявка принята!</h2>
                    <p className="text-muted mb-8 text-lg leading-relaxed">
                        Наши эксперты уже начали оценку вашего автомобиля. Мы свяжемся с вами в течение 15 минут.
                    </p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="px-8 py-3 glass-panel rounded-lg font-semibold border border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300"
                    >
                        Отправить еще одну заявку
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark text-light pt-24 pb-16 px-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <span className="inline-block px-6 py-2 mb-4 glass-panel rounded-full text-primary font-bold tracking-[0.2em] text-xs uppercase border border-primary/20">
                        <Sparkles className="inline h-3 w-3 mr-2" />
                        Премиум сервис
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display">
                        <span className="text-light">Продать </span>
                        <span className="text-gradient-gold">автомобиль</span>
                    </h1>
                    <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
                        Получите лучшее предложение за ваш автомобиль. Заполните форму, и мы возьмем все заботы на себя.
                    </p>
                </motion.div>

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleSubmit}
                    className="glass-panel p-8 md:p-10 rounded-2xl space-y-8 border border-primary/10"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Data Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/10">
                                <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-light">Личные данные</h3>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-light">Ваше имя</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                                        <input
                                            type="text"
                                            name="client_name"
                                            required
                                            className="w-full bg-dark-card border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                            placeholder="Иван Иванов"
                                            value={formData.client_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-light">Номер телефона</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            required
                                            className="w-full bg-dark-card border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                            placeholder="+7 (999) 000-00-00"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Car Data Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-primary/10">
                                <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                                    <Car className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-light">Данные об авто</h3>
                            </div>
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-light">Марка</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            required
                                            className="w-full bg-dark-card border border-primary/20 rounded-lg px-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                            placeholder="BMW"
                                            value={formData.brand}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-light">Модель</label>
                                        <input
                                            type="text"
                                            name="model"
                                            required
                                            className="w-full bg-dark-card border border-primary/20 rounded-lg px-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                            placeholder="X5"
                                            value={formData.model}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-light">Год</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                                            <input
                                                type="number"
                                                name="year"
                                                required
                                                className="w-full bg-dark-card border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                                placeholder="2023"
                                                value={formData.year}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 text-light">Пробег (км)</label>
                                        <input
                                            type="number"
                                            name="mileage"
                                            required
                                            className="w-full bg-dark-card border border-primary/20 rounded-lg px-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                            placeholder="15000"
                                            value={formData.mileage}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info Section */}
                    <div className="space-y-5 pt-6 border-t border-primary/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-light flex items-center">
                                    <DollarSign className="h-4 w-4 mr-2 text-primary" />
                                    Ожидаемая цена ($)
                                </label>
                                <input
                                    type="number"
                                    name="expected_price"
                                    required
                                    className="w-full bg-dark-card border border-primary/20 rounded-lg px-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors"
                                    placeholder="50000"
                                    value={formData.expected_price}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-light flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-primary" />
                                    Описание
                                </label>
                                <textarea
                                    name="description"
                                    rows="1"
                                    className="w-full bg-dark-card border border-primary/20 rounded-lg px-4 py-3 text-light placeholder:text-muted focus:border-primary/50 focus:outline-none transition-colors resize-none"
                                    placeholder="Дополнительные детали..."
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 text-dark font-bold py-4 rounded-lg transition-all duration-500 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {status === 'submitting' ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin"></div>
                                    <span>Отправка...</span>
                                </>
                            ) : (
                                <>
                                    <span>Отправить заявку</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                    </button>

                    {status === 'error' && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-accent text-center text-sm mt-4"
                        >
                            Ошибка при отправке. Попробуйте еще раз.
                        </motion.p>
                    )}
                </motion.form>
            </div>
        </div>
    );
};

export default SellCar;
