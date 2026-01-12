import React, { useState } from 'react';
import { createCommissionRequest } from '../services/api';
import { motion } from 'framer-motion';
import { Check, Car, DollarSign, Calendar, FileText, User, Phone } from 'lucide-react';

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
            <div className="min-h-screen bg-dark text-white pt-20 flex items-center justify-center px-4">
                <div className="text-center max-w-lg w-full glass-panel p-12 rounded-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent pointer-events-none" />
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(74,222,128,0.4)]"
                    >
                        <Check className="h-12 w-12 text-white" />
                    </motion.div>
                    <h2 className="text-4xl font-bold mb-4 text-white">Заявка принята!</h2>
                    <p className="text-gray-300 mb-8 text-lg">
                        Наши эксперты уже начали оценку вашего автомобиля. Мы свяжемся с вами в течение 15 минут.
                    </p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 border border-white/10 hover:border-white/30"
                    >
                        Отправить еще одну заявку
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark text-white pt-24 pb-12 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-30" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] opacity-30" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Продать автомобиль
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Получите лучшее предложение за ваш автомобиль. Заполните форму, и мы возьмем все заботы на себя.
                    </p>
                </motion.div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="glass-panel p-8 md:p-10 rounded-2xl space-y-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-primary flex items-center space-x-2 border-b border-white/10 pb-2">
                                <User className="h-5 w-5" /> <span>Личные данные</span>
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1 ml-1">Ваше имя</label>
                                    <input
                                        type="text"
                                        name="client_name"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                        placeholder="Иван Иванов"
                                        value={formData.client_name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1 ml-1">Номер телефона</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                        placeholder="+7 (999) 000-00-00"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-primary flex items-center space-x-2 border-b border-white/10 pb-2">
                                <Car className="h-5 w-5" /> <span>Данные об авто</span>
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1 ml-1">Марка</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                        placeholder="BMW"
                                        value={formData.brand}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1 ml-1">Модель</label>
                                    <input
                                        type="text"
                                        name="model"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                        placeholder="X5"
                                        value={formData.model}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1 ml-1">Год</label>
                                    <input
                                        type="number"
                                        name="year"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                        placeholder="2023"
                                        value={formData.year}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1 ml-1">Пробег (км)</label>
                                    <input
                                        type="number"
                                        name="mileage"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                        placeholder="0"
                                        value={formData.mileage}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 border-t border-white/10 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1 ml-1 flex items-center"><DollarSign className="h-4 w-4 mr-1" /> Ожидаемая цена ($)</label>
                                <input
                                    type="number"
                                    name="expected_price"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                    placeholder="50000"
                                    value={formData.expected_price}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1 ml-1 flex items-center"><FileText className="h-4 w-4 mr-1" /> Описание</label>
                                <textarea
                                    name="description"
                                    rows="1"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none"
                                    placeholder="Дополнительные детали..."
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full group relative overflow-hidden bg-primary text-white font-bold py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(211,47,47,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10 flex items-center justify-center">
                            {status === 'submitting' ? 'Отправка...' : 'Отправить заявку'}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                    </button>
                </motion.form>
            </div>
        </div>
    );
};

export default SellCar;
