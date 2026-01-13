import React, { useEffect, useState, useContext } from 'react';
import { getDashboardData, updateTestDriveRequest } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Calendar, Clock, CheckCircle, XCircle, AlertCircle, Edit, X as XIcon, LogOut, User, Shield, Gauge } from 'lucide-react';

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
        <div className="min-h-screen bg-dark text-light flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted">Загрузка...</p>
            </div>
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
                return <XCircle className="h-5 w-5 text-accent" />;
            default:
                return <AlertCircle className="h-5 w-5 text-yellow-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
            case 'confirmed':
            case 'completed':
                return 'bg-green-500/10 text-green-400 border-green-500/30';
            case 'rejected':
            case 'cancelled':
                return 'bg-accent/10 text-accent border-accent/30';
            default:
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
        }
    };

    const getStatusLabel = (status) => {
        const labels = {
            'new': 'Новая',
            'approved': 'Одобрена',
            'confirmed': 'Подтверждена',
            'completed': 'Завершена',
            'rejected': 'Отклонена',
            'cancelled': 'Отменена'
        };
        return labels[status] || status;
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
        <div className="min-h-screen bg-dark text-light pt-24 pb-16 px-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 rounded-2xl mb-12 border border-primary/10"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center shadow-lg">
                                    <User className="h-10 w-10 text-primary" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2 text-light font-display">Личный кабинет</h1>
                                <div className="flex items-center gap-2">
                                    <p className="text-muted">{user.username}</p>
                                    {user.is_superuser && (
                                        <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-lg border border-accent/30 flex items-center gap-1 font-semibold">
                                            <Shield className="h-3 w-3" />
                                            Admin
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {user.is_superuser && (
                                <button
                                    onClick={() => navigate('/admin')}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accent/80 text-dark rounded-lg font-semibold hover:shadow-lg hover:shadow-accent/30 transition-all duration-300"
                                >
                                    <Shield className="h-5 w-5" />
                                    <span>Админ-панель</span>
                                </button>
                            )}
                            <button
                                onClick={() => { logout(); navigate('/'); }}
                                className="flex items-center gap-2 px-6 py-3 glass-panel rounded-lg font-semibold border border-primary/20 text-muted hover:text-accent hover:border-accent/30 transition-all duration-300 group"
                            >
                                <LogOut className="h-5 w-5 group-hover:text-accent transition-colors" />
                                <span className="group-hover:text-accent transition-colors">Выйти</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Test Drives Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                                <Clock className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-light font-display">Заявки на тест-драйв</h2>
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
                                        className="glass-panel glass-panel-hover p-6 rounded-2xl group relative overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-500"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                            <Car className="h-32 w-32 transform rotate-12 text-primary" />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-xl mb-2 text-light group-hover:text-primary transition-colors">
                                                        {req.car_details.brand} {req.car_details.model}
                                                    </h3>
                                                    <div className="flex items-center text-sm text-muted">
                                                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                                                        {new Date(req.requested_date).toLocaleString('ru-RU', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase border ${getStatusColor(req.status)}`}>
                                                    {getStatusIcon(req.status)}
                                                    <span>{getStatusLabel(req.status)}</span>
                                                </div>
                                            </div>

                                            {req.status !== 'cancelled' && req.status !== 'completed' && (
                                                <div className="flex gap-3 mt-6 pt-4 border-t border-primary/10">
                                                    {req.status === 'new' && (
                                                        <button
                                                            onClick={() => handleEditRequest(req)}
                                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm border border-primary/20 font-semibold"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            <span>Изменить</span>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleCancelRequest(req.id)}
                                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors text-sm border border-accent/20 font-semibold"
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
                                <div className="glass-panel p-12 rounded-2xl text-center border-2 border-dashed border-primary/10">
                                    <Clock className="h-16 w-16 mx-auto mb-4 text-primary opacity-20" />
                                    <p className="text-muted text-lg">У вас пока нет активных заявок на тест-драйв</p>
                                </div>
                            )}
                        </motion.div>
                    </section>

                    {/* Commission Requests Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                                <Car className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-light font-display">Автомобили на продажу</h2>
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
                                        className="glass-panel glass-panel-hover p-6 rounded-2xl group relative overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-500"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                            <Car className="h-32 w-32 transform -rotate-12 text-primary" />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-xl mb-2 text-light group-hover:text-primary transition-colors">
                                                        {req.brand} {req.model}{' '}
                                                        <span className="text-muted text-lg font-normal">'{req.year.toString().slice(-2)}</span>
                                                    </h3>
                                                    <p className="text-2xl font-bold text-gradient-gold">
                                                        ${Number(req.expected_price).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase border ${getStatusColor(req.status)}`}>
                                                    {getStatusIcon(req.status)}
                                                    <span>{getStatusLabel(req.status)}</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-primary/10">
                                                <div>
                                                    <p className="text-xs text-muted mb-1 uppercase tracking-wider">Пробег</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <Gauge className="h-4 w-4 text-primary" />
                                                        <p className="font-semibold text-light">{req.mileage} км</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted mb-1 uppercase tracking-wider">Дата заявки</p>
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="h-4 w-4 text-primary" />
                                                        <p className="font-semibold text-light">
                                                            {new Date(req.created_at).toLocaleDateString('ru-RU')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {req.description && (
                                                <div className="mt-4 pt-4 border-t border-primary/10">
                                                    <p className="text-sm text-muted line-clamp-2">{req.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="glass-panel p-12 rounded-2xl text-center border-2 border-dashed border-primary/10">
                                    <Car className="h-16 w-16 mx-auto mb-4 text-primary opacity-20" />
                                    <p className="text-muted text-lg">Вы еще не выставляли автомобили на продажу</p>
                                </div>
                            )}
                        </motion.div>
                    </section>
                </div>

                {/* Edit Modal */}
                <AnimatePresence>
                    {editingRequest && (
                        <div className="fixed inset-0 bg-dark/95 backdrop-blur-xl flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="glass-panel p-8 rounded-2xl max-w-md w-full border border-primary/20 shadow-2xl relative"
                            >
                                <button
                                    onClick={() => setEditingRequest(null)}
                                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 text-muted hover:text-light transition-colors"
                                >
                                    <XIcon className="h-5 w-5" />
                                </button>

                                <h2 className="text-2xl font-bold mb-2 text-light font-display">Изменить время</h2>
                                <p className="text-muted mb-6">Выберите новую дату и время для тест-драйва</p>

                                <div className="mb-8">
                                    <label className="block text-sm font-semibold mb-2 text-light">Дата и время</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
                                        <input
                                            type="datetime-local"
                                            value={newDate ? new Date(newDate).toISOString().slice(0, 16) : ''}
                                            onChange={(e) => setNewDate(e.target.value)}
                                            className="w-full bg-dark-card border border-primary/20 rounded-lg pl-11 pr-4 py-3 text-light focus:border-primary/50 focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setEditingRequest(null)}
                                        className="flex-1 px-4 py-3 glass-panel rounded-lg font-semibold border border-primary/20 text-muted hover:text-light hover:bg-white/5 transition-all"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        onClick={handleSaveEdit}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-dark rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
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
