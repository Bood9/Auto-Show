import React from 'react';
import { Car, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-black text-gray-400 py-12 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 text-white mb-4">
                            <Car className="h-6 w-6 text-primary" />
                            <span className="text-lg font-bold">Legacy Motors</span>
                        </div>
                        <p className="text-sm">
                            Премиальные автомобили для премиальных людей. Найдите автомобиль своей мечты у нас сегодня.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Быстрые ссылки</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/catalog" className="hover:text-primary transition-colors">Каталог</a></li>
                            <li><a href="/sell" className="hover:text-primary transition-colors">Продать авто</a></li>
                            <li><a href="/news" className="hover:text-primary transition-colors">Новости и акции</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Контакты</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>+3 (999) 777 77 77</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Mail className="h-4 w-4" />
                                <span>Pablo-Escobar@legacymotors.com</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4" />
                                <span>Dalma Mall, Икад-I, Массафа, Абу-Даби</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold mb-4">Часы работы</h3>
                        <ul className="space-y-2 text-sm">
                            <li>Пн - Пт: 9:00 - 20:00</li>
                            <li>Сб: 10:00 - 18:00</li>
                            <li>Вс: Выходной</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
                    &copy; {new Date().getFullYear()} Legacy Motors. Все права защищены.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
