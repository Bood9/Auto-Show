import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminNewsForm = ({ item, type, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        description: '',
        image: null,
        is_active: true,
        start_date: '',
        end_date: ''
    });

    useEffect(() => {
        if (item) {
            setFormData({
                ...item,
                image: null,
                start_date: item.start_date ? item.start_date.split('T')[0] : '',
                end_date: item.end_date ? item.end_date.split('T')[0] : ''
            });
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value, files, type: inputType, checked } = e.target;
        if (inputType === 'file') {
            setFormData({ ...formData, image: files[0] });
        } else if (inputType === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
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
            const endpoint = type === 'news' ? '/marketing/news/' : '/marketing/promotions/';
            if (item) {
                await api.patch(`${endpoint}${item.id}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post(endpoint, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            onSuccess();
        } catch (error) {
            console.error("Error saving item:", error);
            alert("Ошибка при сохранении");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Заголовок</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full bg-dark border border-gray-700 rounded px-3 py-2" />
            </div>

            {type === 'promotions' && (
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Дата начала</label>
                        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required className="w-full bg-dark border border-gray-700 rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Дата окончания</label>
                        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required className="w-full bg-dark border border-gray-700 rounded px-3 py-2" />
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="mr-2" />
                        <label className="text-sm font-medium">Активна</label>
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1">Изображение</label>
                <input type="file" name="image" onChange={handleChange} className="w-full bg-dark border border-gray-700 rounded px-3 py-2" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Текст</label>
                <textarea
                    name={type === 'news' ? 'content' : 'description'}
                    value={type === 'news' ? formData.content || '' : formData.description}
                    onChange={handleChange}
                    rows="6"
                    className="w-full bg-dark border border-gray-700 rounded px-3 py-2"
                ></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-red-700 transition-colors">
                Сохранить
            </button>
        </form>
    );
};

export default AdminNewsForm;
