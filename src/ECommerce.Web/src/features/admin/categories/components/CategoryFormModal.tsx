import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CategoryFormModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: CategoryFormData) => void;
    loading?: boolean;
}

export interface CategoryFormData {
    name: string;
    description: string;
    imageUrl: string;
}

const initialFormData: CategoryFormData = {
    name: '',
    description: '',
    imageUrl: '',
};

export default function CategoryFormModal({
    open,
    onClose,
    onSubmit,
    loading,
}: CategoryFormModalProps) {
    const [form, setForm] = useState<CategoryFormData>(initialFormData);

    useEffect(() => {
        if (open) {
            setForm(initialFormData);
        }
    }, [open]);

    if (!open) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ animation: 'fadeInUp 0.25s ease-out' }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ background: '#1B5E3F', color: 'white' }}
                >
                    <h2 className="text-lg font-semibold">Yeni Kategori Ekle</h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Adı *</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                            style={{ '--tw-ring-color': '#1B5E3F' } as React.CSSProperties}
                            placeholder="Kategori adını girin"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm resize-none"
                            style={{ '--tw-ring-color': '#1B5E3F' } as React.CSSProperties}
                            placeholder="Kategori açıklaması"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                        <input
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-sm"
                            style={{ '--tw-ring-color': '#1B5E3F' } as React.CSSProperties}
                            placeholder="https://..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50"
                            style={{ background: '#1B5E3F' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#164A32')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#1B5E3F')}
                        >
                            {loading ? 'Kaydediliyor...' : 'Ekle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
