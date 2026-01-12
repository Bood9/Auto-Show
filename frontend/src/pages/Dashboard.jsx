import React, { useEffect, useState, useContext } from 'react';
import { getDashboardData, updateTestDriveRequest } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Edit, X as XIcon, LogOut, User, Shield } from 'lucide-react';

const Dashboard = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [editingRequest, setEditingRequest] = useState(null);
    const [newDate, setNewDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (user) {
            fetchData();
        }
    }, [user, loading, navigate]);

    const fetchData = () => {
        getDashboardData().then(res => setData(res.data)).catch(console.error);
    };

    if (loading || !data) return (
        <div className="min-h-screen bg-dark text-white flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
            case 'confirmed':
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-400" />;
            case 'rejected':
            case 'cancelled':
                return <XCircle className="h-5 w-5 text-red-400" />;
            default:
                return <AlertCircle className="h-5 w-5 text-yellow-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
            case 'confirmed':
            case 'completed':
                return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'rejected':
            case 'cancelled':
                return 'bg-red-500/20 text-red-400 border-red-500/30';
            default:
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        }
    };

    const handleEditRequest = (request) => {
        setEditingRequest(request);
        setNewDate(request.requested_date);
    };

    const handleSaveEdit = async () => {
        try {
            await updateTestDriveRequest(editingRequest.id, { requested_date: newDate });
            setEditingRequest(null);
            fetchData();
        } catch (error) {
            console.error("Error updating request:", error);
            alert("Ошибка при обновлении заявки");
        }
    };

    const handleCancelRequest = async (id) => {
        if (!window.confirm('Отменить заявку на тест-драйв?')) return;
        try {
            await updateTestDriveRequest(id, { status: 'cancelled' });
            fetchData();
        } catch (error) {
            console.error("Error cancelling request:", error);
            alert("Ошибка при отмене заявки");
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-dark text-white pt-24 pb-12 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-20" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] opacity-20" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 glass-panel p-8 rounded-2xl">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shadow-lg">
                            <User className="h-10 w-10 text-gray-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-1">Личный кабинет</h1>
                            <p className="text-gray-400 flex items-center">
                                {user.username}
                                {user.is_superuser && (
                                    <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30 flex items-center">
                                        <Shield className="h-3 w-3 mr-1" /> Admin
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                        {user.is_superuser && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(211,47,47,0.4)] hover:shadow-[0_0_25px_rgba(211,47,47,0.6)]"
                            >
                                <Shield className="h-5 w-5" />
                                <span>Админ-панель</span>
                            </button>
                        )}
                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            className="flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all duration-300 border border-white/10 hover:border-red-500/50 group"
                        >
                            <LogOut className="h-5 w-5 group-hover:text-red-500 transition-colors" />
                            <span className="group-hover:text-red-500 transition-colors">Выйти</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Test Drives */}
                    <section>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <Clock className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold">Заявки на тест-драйв</h2>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            {data.test_drive_requests.length > 0 ? (
                                data.test_drive_requests.map(req => (
                                    <motion.div
                                        key={req.id}
                                        variants={itemVariants}
                                        className="glass-panel glass-panel-hover p-6 rounded-xl group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Car className="h-24 w-24 transform rotate-12" />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-xl mb-1">{req.car_details.brand} {req.car_details.model}</h3>
                                                    <div className="flex items-center text-sm text-gray-400">
                                                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                                                        {new Date(req.requested_date).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(req.status)}`}>
                                                    {getStatusIcon(req.status)}
                                                    <span>{req.status}</span>
                                                </div>
                                            </div>

                                            {req.status !== 'cancelled' && req.status !== 'completed' && (
                                                <div className="flex space-x-3 mt-6 pt-4 border-t border-white/5">
                                                    {req.status === 'new' && (
                                                        <button
                                                            onClick={() => handleEditRequest(req)}
                                                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors text-sm border border-blue-500/20"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            <span>Изменить</span>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleCancelRequest(req.id)}
                                                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm border border-red-500/20"
                                                    >
                                                        <XIcon className="h-4 w-4" />
                                                        <span>Отменить</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="glass-panel p-8 rounded-xl text-center text-gray-500 border-dashed border-2 border-white/10">
                                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>У вас пока нет активных заявок на тест-драйв</p>
                                </div>
                            )}
                        </motion.div>
                    </section>

                    {/* Commission Requests */}
                    <section>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-accent/20 rounded-lg">
                                <Car className="h-6 w-6 text-accent" />
                            </div>
                            <h2 className="text-2xl font-bold">Автомобили на продажу</h2>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-4"
                        >
                            {data.commission_requests.length > 0 ? (
                                data.commission_requests.map(req => (
                                    <motion.div
                                        key={req.id}
                                        variants={itemVariants}
                                        className="glass-panel glass-panel-hover p-6 rounded-xl group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Car className="h-24 w-24 transform -rotate-12" />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-xl mb-1">{req.brand} {req.model} <span className="text-gray-500 text-lg">'{req.year}</span></h3>
                                                    <p className="text-2xl font-bold text-gradient-gold">${Number(req.expected_price).toLocaleString()}</p>
                                                </div>
                                                <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(req.status)}`}>
                                                    {getStatusIcon(req.status)}
                                                    <span>{req.status}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5">
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Пробег</p>
                                                    <p className="font-medium">{req.mileage} км</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Дата заявки</p>
                                                    <p className="font-medium">{new Date(req.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="glass-panel p-8 rounded-xl text-center text-gray-500 border-dashed border-2 border-white/10">
                                    <Car className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>Вы еще не выставляли автомобили на продажу</p>
                                </div>
                            )}
                        </motion.div>
                    </section>
                </div>

                {/* Edit Modal */}
                <AnimatePresence>
                    {editingRequest && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="glass-panel p-8 rounded-2xl max-w-md w-full border border-white/10 shadow-2xl relative"
                            >
                                <button
                                    onClick={() => setEditingRequest(null)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                                >
                                    <XIcon className="h-6 w-6" />
                                </button>

                                <h2 className="text-2xl font-bold mb-6">Изменить время</h2>

                                <div className="mb-8">
                                    <label className="block text-sm font-medium mb-2 text-gray-400">Выберите новую дату и время</label>
                                    <input
                                        type="datetime-local"
                                        value={newDate ? new Date(newDate).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                                    />
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setEditingRequest(null)}
                                        className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="flex-1 px-4 py-3 bg-primary hover:bg-red-700 text-white rounded-xl transition-all shadow-[0_0_15px_rgba(211,47,47,0.4)]"
                                    >
                                        Сохранить
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Dashboard;
