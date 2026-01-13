import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Car, Newspaper, Megaphone, ClipboardList, Check, X, Calendar, Phone, User, DollarSign, Gauge, AlertCircle } from 'lucide-react';
import api, { getCars, getNews, getPromotions, getTestDriveRequests, getCommissionRequests, updateTestDriveRequest, updateCommissionRequest } from '../services/api';
import AdminCarForm from '../components/AdminCarForm';
import AdminNewsForm from '../components/AdminNewsForm';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('cars');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [commissionToApprove, setCommissionToApprove] = useState(null);

    useEffect(() => {
        setItems([]); // Clear items to prevent crash on tab switch
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let response;
            if (activeTab === 'cars') {
                response = await getCars();
            } else if (activeTab === 'news') {
                response = await getNews();
            } else if (activeTab === 'promotions') {
                response = await getPromotions();
            } else if (activeTab === 'requests') {
                const [testDrives, commissions] = await Promise.all([
                    getTestDriveRequests(),
                    getCommissionRequests()
                ]);
                setItems({ testDrives: testDrives.data, commissions: commissions.data });
                setLoading(false);
                return;
            }
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот элемент?')) return;
        try {
            const endpoint = activeTab === 'cars' ? `/cars/${id}/` :
                activeTab === 'news' ? `/marketing/news/${id}/` :
                    `/marketing/promotions/${id}/`;
            await api.delete(endpoint);
            fetchData();
        } catch (error) {
            console.error("Error deleting item:", error);
            alert("Ошибка при удалении");
        }
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleAdd = () => {
        setCurrentItem(null);
        setIsEditing(false);
        setShowForm(true);
    };

    const handleFormSubmit = async () => {
        if (commissionToApprove) {
            // If we just created a car from a commission request, approve the request
            try {
                await updateCommissionRequest(commissionToApprove.id, { status: 'approved' });
                setCommissionToApprove(null);
            } catch (error) {
                console.error("Error updating commission status:", error);
            }
        }
        setShowForm(false);
        fetchData();
    };

    const handleApproveTestDrive = async (id) => {
        try {
            await updateTestDriveRequest(id, { status: 'confirmed' });
            fetchData();
        } catch (error) {
            console.error("Error approving test drive:", error);
            alert("Ошибка при подтверждении");
        }
    };

    const handleRejectTestDrive = async (id) => {
        if (!window.confirm('Отклонить заявку на тест-драйв?')) return;
        try {
            await updateTestDriveRequest(id, { status: 'cancelled' });
            fetchData();
        } catch (error) {
            console.error("Error rejecting test drive:", error);
            alert("Ошибка при отклонении");
        }
    };

    const handleApproveCommission = (request) => {
        // Prepare data for CarForm
        const carData = {
            brand: request.brand,
            model: request.model,
            year: request.year,
            price: request.expected_price,
            mileage: request.mileage,
            description: request.description,
            status: 'available',
            // Default values for required fields not in commission request
            transmission: 'automatic',
            body_type: 'sedan',
            engine_volume: 2.0,
            horsepower: 150,
            color: 'Черный'
        };

        setCommissionToApprove(request);
        setCurrentItem(carData); // Pre-fill form
        setActiveTab('cars'); // Switch to cars tab context for the form
        setIsEditing(false); // It's a new car
        setShowForm(true);
    };

    const handleRejectCommission = async (id) => {
        if (!window.confirm('Отклонить комиссионную заявку?')) return;
        try {
            await updateCommissionRequest(id, { status: 'rejected' });
            // Optimistically update UI to remove the item
            setItems(prev => ({
                ...prev,
                commissions: prev.commissions.filter(c => c.id !== id)
            }));
        } catch (error) {
            console.error("Error rejecting commission:", error);
            alert("Ошибка при отклонении");
        }
    };

    const tabs = [
        { id: 'cars', label: 'Автомобили', icon: Car },
        { id: 'news', label: 'Новости', icon: Newspaper },
        { id: 'promotions', label: 'Акции', icon: Megaphone },
        { id: 'requests', label: 'Заявки', icon: ClipboardList },
    ];

    return (
        <div className="min-h-screen bg-dark text-light pt-24 pb-16 px-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
                        <span className="text-light">Панель </span>
                        <span className="text-gradient-gold">Управления</span>
                    </h1>
                    <p className="text-muted text-lg">Управление контентом Dubai Elite</p>
                </motion.div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-primary to-primary/80 text-dark shadow-lg shadow-primary/30'
                                        : 'glass-panel border border-primary/20 text-muted hover:text-light hover:border-primary/40'
                                }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {showForm ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-panel p-8 rounded-2xl border border-primary/20"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-light font-display">
                                    {isEditing ? 'Редактировать' : 'Добавить'}{' '}
                                    {activeTab === 'cars' ? 'автомобиль' : activeTab === 'news' ? 'новость' : 'акцию'}
                                </h2>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 glass-panel rounded-lg border border-primary/20 text-muted hover:text-light hover:border-accent/40 transition-all font-semibold"
                                >
                                    Отмена
                                </button>
                            </div>
                            {activeTab === 'cars' ? (
                                <AdminCarForm item={currentItem} onSuccess={handleFormSubmit} />
                            ) : (
                                <AdminNewsForm item={currentItem} type={activeTab} onSuccess={handleFormSubmit} />
                            )}
                        </motion.div>
                    ) : activeTab === 'requests' ? (
                        <motion.div
                            key="requests"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-muted">Загрузка...</p>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    {/* Test Drive Requests */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                                                <Calendar className="h-6 w-6 text-primary" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-light font-display">Заявки на тест-драйв</h2>
                                            <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-bold rounded-full">
                                                {items.testDrives?.length || 0}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {items.testDrives?.map(request => (
                                                <motion.div
                                                    key={request.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="glass-panel glass-panel-hover p-6 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-500"
                                                >
                                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-xl mb-3 text-light">
                                                                {request.car ? `${request.car.brand} ${request.car.model} (${request.car.year})` : (
                                                                    <span className="text-muted flex items-center gap-2">
                                                                        <AlertCircle className="h-5 w-5" />
                                                                        Автомобиль удален
                                                                    </span>
                                                                )}
                                                            </h3>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                                <div className="flex items-center gap-2 text-muted">
                                                                    <User className="h-4 w-4 text-primary" />
                                                                    <span className="font-semibold">Клиент:</span>
                                                                    <span className="text-light">{request.client_name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-muted">
                                                                    <Phone className="h-4 w-4 text-primary" />
                                                                    <span className="font-semibold">Телефон:</span>
                                                                    <span className="text-light">{request.phone}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-muted md:col-span-2">
                                                                    <Calendar className="h-4 w-4 text-primary" />
                                                                    <span className="font-semibold">Дата:</span>
                                                                    <span className="text-light">{new Date(request.requested_date).toLocaleString('ru-RU')}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-muted font-semibold">Статус:</span>
                                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                                                                        request.status === 'confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                                                                        request.status === 'cancelled' ? 'bg-accent/10 text-accent border border-accent/30' :
                                                                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                                                                    }`}>
                                                                        {request.status === 'new' ? 'Новая' :
                                                                         request.status === 'confirmed' ? 'Подтверждена' :
                                                                         request.status === 'cancelled' ? 'Отменена' :
                                                                         request.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {request.status === 'new' && (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleApproveTestDrive(request.id)}
                                                                    className="p-3 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all border border-green-500/30 group"
                                                                    title="Подтвердить"
                                                                >
                                                                    <Check className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRejectTestDrive(request.id)}
                                                                    className="p-3 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-all border border-accent/30 group"
                                                                    title="Отклонить"
                                                                >
                                                                    <X className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {items.testDrives?.length === 0 && (
                                                <div className="glass-panel p-12 rounded-2xl text-center border-2 border-dashed border-primary/10">
                                                    <Calendar className="h-16 w-16 mx-auto mb-4 text-primary opacity-20" />
                                                    <p className="text-muted text-lg">Нет заявок на тест-драйв</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Commission Requests */}
                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                                                <Car className="h-6 w-6 text-primary" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-light font-display">Заявки на продажу</h2>
                                            <span className="px-3 py-1 bg-primary/20 text-primary text-sm font-bold rounded-full">
                                                {items.commissions?.filter(r => r.status === 'pending').length || 0}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            {items.commissions?.filter(r => r.status === 'pending').map(request => (
                                                <motion.div
                                                    key={request.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="glass-panel glass-panel-hover p-6 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-500"
                                                >
                                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                                        <div className="flex-1">
                                                            <h3 className="font-bold text-xl mb-1 text-light">
                                                                {request.brand} {request.model} <span className="text-muted text-lg">'{request.year.toString().slice(-2)}</span>
                                                            </h3>
                                                            <p className="text-2xl font-bold text-gradient-gold mb-4">
                                                                ${Number(request.expected_price).toLocaleString()}
                                                            </p>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                                <div className="flex items-center gap-2 text-muted">
                                                                    <User className="h-4 w-4 text-primary" />
                                                                    <span className="font-semibold">Клиент:</span>
                                                                    <span className="text-light">{request.client_name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-muted">
                                                                    <Phone className="h-4 w-4 text-primary" />
                                                                    <span className="font-semibold">Телефон:</span>
                                                                    <span className="text-light">{request.phone}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-muted">
                                                                    <Gauge className="h-4 w-4 text-primary" />
                                                                    <span className="font-semibold">Пробег:</span>
                                                                    <span className="text-light">{request.mileage} км</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-muted">
                                                                    <Calendar className="h-4 w-4 text-primary" />
                                                                    <span className="font-semibold">Дата заявки:</span>
                                                                    <span className="text-light">{new Date(request.created_at).toLocaleDateString('ru-RU')}</span>
                                                                </div>
                                                                {request.description && (
                                                                    <div className="md:col-span-2 text-muted">
                                                                        <span className="font-semibold">Описание:</span>
                                                                        <p className="text-light mt-1">{request.description}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleApproveCommission(request)}
                                                                className="flex items-center gap-2 px-4 py-3 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all border border-green-500/30 font-semibold group"
                                                                title="Принять и добавить в каталог"
                                                            >
                                                                <Check className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                                <span className="hidden sm:inline">Одобрить</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectCommission(request.id)}
                                                                className="p-3 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-all border border-accent/30 group"
                                                                title="Отклонить"
                                                            >
                                                                <X className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {items.commissions?.filter(r => r.status === 'pending').length === 0 && (
                                                <div className="glass-panel p-12 rounded-2xl text-center border-2 border-dashed border-primary/10">
                                                    <Car className="h-16 w-16 mx-auto mb-4 text-primary opacity-20" />
                                                    <p className="text-muted text-lg">Нет новых заявок на продажу</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="flex justify-end mb-6">
                                <button
                                    onClick={handleAdd}
                                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-dark px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:scale-105"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>Добавить</span>
                                </button>
                            </div>

                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-muted">Загрузка...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {items.map(item => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="glass-panel glass-panel-hover p-6 rounded-2xl border border-primary/10 hover:border-primary/30 transition-all duration-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-bold text-xl text-light mb-2">
                                                    {activeTab === 'cars' ? `${item.brand} ${item.model} (${item.year})` : item.title}
                                                </h3>
                                                <p className="text-muted">
                                                    {activeTab === 'cars'
                                                        ? <span className="text-primary font-bold text-lg">${Number(item.price).toLocaleString()}</span>
                                                        : new Date(item.created_at || item.start_date).toLocaleDateString('ru-RU')}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-3 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all border border-blue-500/30 group"
                                                    title="Редактировать"
                                                >
                                                    <Edit className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-3 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-all border border-accent/30 group"
                                                    title="Удалить"
                                                >
                                                    <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {items.length === 0 && (
                                        <div className="glass-panel p-12 rounded-2xl text-center border-2 border-dashed border-primary/10">
                                            <p className="text-muted text-lg">Список пуст</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
