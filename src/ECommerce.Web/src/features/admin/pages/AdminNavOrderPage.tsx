import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Save, Info, ImageIcon } from 'lucide-react';
import { getCategories, reorderCategories } from '../../catalog/api/catalogApi';
import type { Category } from '../../catalog/types/product';
import { queryKeys } from '@/utils/queryKeys';

// ── Sortable Row ─────────────────────────────────────────────────────────────

function SortableCategoryRow({ category, index }: { category: Category; index: number }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : undefined,
        opacity: isDragging ? 0.85 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-3 px-4 py-3 bg-white rounded-xl border transition-shadow ${isDragging ? 'shadow-lg border-[var(--brand-primary)]' : 'border-gray-200 shadow-sm'
                }`}
        >
            {/* Drag handle */}
            <button
                type="button"
                {...attributes}
                {...listeners}
                className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 text-gray-400 touch-none"
                aria-label="Sırayı değiştirmek için sürükle"
            >
                <GripVertical className="h-5 w-5" />
            </button>

            {/* Order badge */}
            <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: 'var(--brand-primary)' }}>
                {index + 1}
            </span>

            {/* Image */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center bg-gray-50">
                {category.imageUrl ? (
                    <img src={category.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                    <ImageIcon className="h-4 w-4 text-gray-300" />
                )}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{category.name}</p>
                {!category.isActive && (
                    <span className="inline-block text-xs px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 font-medium border border-amber-100 mt-0.5">
                        Pasif
                    </span>
                )}
            </div>

            {/* Current saved order indicator */}
            <span className="flex-shrink-0 text-xs text-gray-300 tabular-nums">
                #{category.displayOrder}
            </span>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function AdminNavOrderPage() {
    const queryClient = useQueryClient();

    const { data: allCategories, isLoading } = useQuery({
        queryKey: queryKeys.catalog.categories.all,
        queryFn: () => getCategories({ onlyMain: true, includeDeleted: false }),
        staleTime: 60 * 1000,
    });

    // Local ordered list (draft — only persisted on save)
    const [ordered, setOrdered] = useState<Category[]>([]);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (allCategories && ordered.length === 0) {
            setOrdered([...allCategories].sort((a, b) => a.displayOrder - b.displayOrder));
        }
    }, [allCategories, ordered.length]);

    const mutation = useMutation({
        mutationFn: () =>
            reorderCategories(
                ordered.map((cat, idx) => ({ categoryId: cat.id, displayOrder: idx })),
            ),
        onSuccess: () => {
            setIsDirty(false);
            void queryClient.invalidateQueries({ queryKey: queryKeys.catalog.categories.all });
        },
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        setOrdered((prev) => {
            const oldIdx = prev.findIndex((c) => c.id === active.id);
            const newIdx = prev.findIndex((c) => c.id === over.id);
            return arrayMove(prev, oldIdx, newIdx);
        });
        setIsDirty(true);
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
                Yükleniyor…
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Navigasyon Sıralaması</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Üst menüdeki kategori butonlarını sürükleyerek sıraya dizin
                    </p>
                </div>
                <button
                    type="button"
                    disabled={mutation.isPending || !isDirty}
                    onClick={() => mutation.mutate()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                    <Save className="h-4 w-4" />
                    {mutation.isPending ? 'Kaydediliyor…' : 'Sıralamayı Kaydet'}
                </button>
            </div>

            {/* Status feedback */}
            {mutation.isSuccess && !isDirty && (
                <div className="mb-4 px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                    ✓ Sıralama başarıyla kaydedildi.
                </div>
            )}
            {mutation.isError && (
                <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    Kaydedilemedi. Lütfen tekrar deneyin.
                </div>
            )}

            {/* Info box */}
            <div className="flex items-start gap-2.5 mb-5 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                    Yalnızca <strong>üst seviye (ana) kategoriler</strong> listelenmektedir.
                    Pasif kategoriler menüde görünmez, ancak sıralamada yer kaplar.
                    Kategoriyi aktif/pasif etmek için <strong>Kategoriler</strong> sayfasını kullanın.
                </p>
            </div>

            {/* Sortable list */}
            {ordered.length === 0 ? (
                <div className="text-center py-16 text-gray-400 text-sm">
                    Henüz ana kategori oluşturulmamış.
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={ordered.map((c) => c.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {ordered.map((category, index) => (
                                <SortableCategoryRow
                                    key={category.id}
                                    category={category}
                                    index={index}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* Live preview hint */}
            {ordered.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Mevcut Sıralama Önizlemesi
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {ordered.filter(c => c.isActive).map((c) => (
                            <span
                                key={c.id}
                                className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                style={{ backgroundColor: 'var(--brand-primary)' }}
                            >
                                {c.name}
                            </span>
                        ))}
                        {ordered.every(c => !c.isActive) && (
                            <span className="text-xs text-gray-400 italic">Aktif kategori yok</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
