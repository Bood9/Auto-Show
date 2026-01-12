import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminCarForm = ({ item, onSuccess }) => {
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        mileage: '',
        transmission: 'automatic',
        body_type: 'sedan',
        color: '',
        engine_volume: '',
        horsepower: '',
        description: '',
        status: 'available',
        is_featured: false,
        image: null // We'll handle image upload separately or just use URL for now if backend supports it. 
        // Assuming backend expects multipart/form-data for image
    });

    useEffect(() => {
        if (item) {
            setFormData({
                ...item,
                image: null // Don't preload image file
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, image: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        try {
            if (item && item.id) {
                await api.patch(`/cars/${item.id}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/cars/', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            onSuccess();
        } catch (error) {
            console.error("Error saving car:", error);
            alert("Ошибка при сохранении");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Марка</label>
                    <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="w-full bg-dark border border-gray-700 rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Модель</label>
                    <input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full bg-dark border border-gray-700 rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Год</label>
                    <input type="number" name="year" value={formData.year} onChange={handleChange} required className="w-full bg-dark border border-gray-700 rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Цена ($)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-dark border border-gray-700 rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Пробег (км)</label>
                    <input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required className="w-full bg-dark border border-gray-700 rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Коробка</label>
                    <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full bg-dark border border-gray-700 rounded px-3 py-2">
                        <option value="automatic">Автомат</option>
                        <option value="manual">Механика</option>
                        <option value="robot">Робот</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Кузов</label>
                    <select name="body_type" value={formData.body_type} onChange={handleChange} className="w-full bg-dark border border-gray-700 rounded px-3 py-2">
                        <option value="sedan">Седан</option>
                        <option value="suv">Внедорожник</option>
                        <option value="coupe">Купе</option>
                        <option value="hatchback">Хэтчбек</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Цвет</label>
                    <input type="text" name="color" value={formData.color} onChange={handleChange} className="w-full bg-dark border border-gray-700 rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Объем двигателя (л)</label>
                    <input type="number" step="0.1" name="engine_volume" value={formData.engine_volume} onChange={handleChange} className="w-full bg-dark border border-gray-700 rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Мощность (л.с.)</label>
                    <input type="number" name="horsepower" value={formData.horsepower} onChange={handleChange} className="w-full bg-dark border border-gray-700 rounded px-3 py-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Статус</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-dark border border-gray-700 rounded px-3 py-2">
                        <option value="available">В наличии</option>
                        <option value="sold">Продано</option>
                        <option value="reserved">Забронировано</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Изображение</label>
                    <input type="file" name="image" onChange={handleChange} className="w-full bg-dark border border-gray-700 rounded px-3 py-2" />
                </div>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                        className="w-4 h-4"
                    />
                    <label className="text-sm font-medium">Избранное (показать на главной)</label>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Описание</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full bg-dark border border-gray-700 rounded px-3 py-2"></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-red-700 transition-colors">
                Сохранить
            </button>
        </form>
    );
};

export default AdminCarForm;
