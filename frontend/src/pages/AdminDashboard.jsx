import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Car, Newspaper, Megaphone, ClipboardList, Check, X } from 'lucide-react';
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

    return (
        <div className="min-h-screen bg-dark text-white pt-20 pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-center">Админ-панель</h1>

                <div className="flex justify-center space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab('cars')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-colors ${activeTab === 'cars' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <Car className="h-5 w-5" />
                        <span>Автомобили</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('news')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-colors ${activeTab === 'news' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <Newspaper className="h-5 w-5" />
                        <span>Новости</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('promotions')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-colors ${activeTab === 'promotions' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <Megaphone className="h-5 w-5" />
                        <span>Акции</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition-colors ${activeTab === 'requests' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        <ClipboardList className="h-5 w-5" />
                        <span>Заявки</span>
                    </button>
                </div>

                {showForm ? (
                    <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                {isEditing ? 'Редактировать' : 'Добавить'} {activeTab === 'cars' ? 'автомобиль' : activeTab === 'news' ? 'новость' : 'акцию'}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white">
                                Отмена
                            </button>
                        </div>
                        {activeTab === 'cars' ? (
                            <AdminCarForm item={currentItem} onSuccess={handleFormSubmit} />
                        ) : (
                            <AdminNewsForm item={currentItem} type={activeTab} onSuccess={handleFormSubmit} />
                        )}
                    </div>
                ) : activeTab === 'requests' ? (
                    <>
                        {loading ? (
                            <div className="text-center py-12">Загрузка...</div>
                        ) : (
                            <div className="space-y-8">
                                {/* Test Drive Requests */}
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Заявки на тест-драйв</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        {items.testDrives?.map(request => (
                                            <motion.div
                                                key={request.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-gray-900 p-4 rounded-lg border border-gray-800"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg mb-2">
                                                            {request.car ? `${request.car.brand} ${request.car.model} (${request.car.year})` : 'Машина удалена'}
                                                        </h3>
                                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                                                            <p><span className="font-semibold">Клиент:</span> {request.client_name}</p>
                                                            <p><span className="font-semibold">Телефон:</span> {request.phone}</p>
                                                            <p><span className="font-semibold">Дата:</span> {new Date(request.requested_date).toLocaleString()}</p>
                                                            <p><span className="font-semibold">Статус:</span> <span className={`px-2 py-1 rounded text-xs ${request.status === 'confirmed' ? 'bg-green-600/20 text-green-500' :
                                                                request.status === 'cancelled' ? 'bg-red-600/20 text-red-500' :
                                                                    'bg-yellow-600/20 text-yellow-500'
                                                                }`}>{request.status}</span></p>
                                                        </div>
                                                    </div>
                                                    {request.status === 'new' && (
                                                        <div className="flex space-x-2 ml-4">
                                                            <button
                                                                onClick={() => handleApproveTestDrive(request.id)}
                                                                className="p-2 bg-green-600/20 text-green-500 rounded hover:bg-green-600/40 transition-colors"
                                                                title="Принять"
                                                            >
                                                                <Check className="h-5 w-5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectTestDrive(request.id)}
                                                                className="p-2 bg-red-600/20 text-red-500 rounded hover:bg-red-600/40 transition-colors"
                                                                title="Отклонить"
                                                            >
                                                                <X className="h-5 w-5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                        {items.testDrives?.length === 0 && (
                                            <p className="text-center text-gray-500 py-8">Нет заявок</p>
                                        )}
                                    </div>
                                </div>

                                {/* Commission Requests */}
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Комиссионные заявки</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        {items.commissions?.filter(r => r.status === 'pending').map(request => (
                                            <motion.div
                                                key={request.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-gray-900 p-4 rounded-lg border border-gray-800"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg mb-2">
                                                            {request.brand} {request.model} ({request.year})
                                                        </h3>
                                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                                                            <p><span className="font-semibold">Клиент:</span> {request.client_name}</p>
                                                            <p><span className="font-semibold">Телефон:</span> {request.phone}</p>
                                                            <p><span className="font-semibold">Пробег:</span> {request.mileage} км</p>
                                                            <p><span className="font-semibold">Ожидаемая цена:</span> ${Number(request.expected_price).toLocaleString()}</p>
                                                            <p className="col-span-2"><span className="font-semibold">Описание:</span> {request.description}</p>
                                                            <p><span className="font-semibold">Статус:</span> <span className="px-2 py-1 rounded text-xs bg-yellow-600/20 text-yellow-500">{request.status}</span></p>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-2 ml-4">
                                                        <button
                                                            onClick={() => handleApproveCommission(request)}
                                                            className="p-2 bg-green-600/20 text-green-500 rounded hover:bg-green-600/40 transition-colors"
                                                            title="Принять и добавить в каталог"
                                                        >
                                                            <Check className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectCommission(request.id)}
                                                            className="p-2 bg-red-600/20 text-red-500 rounded hover:bg-red-600/40 transition-colors"
                                                            title="Отклонить"
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                        {items.commissions?.filter(r => r.status === 'pending').length === 0 && (
                                            <p className="text-center text-gray-500 py-8">Нет новых заявок</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={handleAdd}
                                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Добавить</span>
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">Загрузка...</div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {items.map(item => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gray-900 p-4 rounded-lg border border-gray-800 flex justify-between items-center"
                                    >
                                        <div>
                                            <h3 className="font-bold text-lg">
                                                {activeTab === 'cars' ? `${item.brand} ${item.model} (${item.year})` : item.title}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {activeTab === 'cars' ? `${item.price} $` : new Date(item.created_at || item.start_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2 bg-blue-600/20 text-blue-500 rounded hover:bg-blue-600/40 transition-colors"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 bg-red-600/20 text-red-500 rounded hover:bg-red-600/40 transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                                {items.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">Список пуст</p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
