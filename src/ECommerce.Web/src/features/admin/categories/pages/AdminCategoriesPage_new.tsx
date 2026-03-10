import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    type GridReadyEvent,
    type GridApi,
    ModuleRegistry,
    ClientSideRowModelModule,
    TextFilterModule,
    PaginationModule,
    ValidationModule,
    ColumnAutoSizeModule,
    RowApiModule,
    CellStyleModule,
    RowSelectionModule,
    RowStyleModule,
    DateFilterModule,
    LocaleModule,
    CustomFilterModule,
} from 'ag-grid-community';
import { Plus, Download, FileDown, FolderTree } from 'lucide-react';
import { getCategories, getProducts } from '../../../catalog/api/catalogApi';
import type { Category, Product } from '../../../catalog/types/product';
import type { CategoryFormData } from '../components/CategoryFormModal';
import CategoryFormModal from '../components/CategoryFormModal';
import ConfirmModal from '../../components/ConfirmModal';
import AgGridDatePicker from '../../components/AgGridDatePicker';
import StatusToggleFilter from '../../components/StatusToggleFilter';
import { useCategoryGridColumns, localeTextTr } from '../hooks/useCategoryGridColumns';
import { useCategoryActions, defaultModalSettings, type ModalSettings } from '../hooks/useCategoryActions';
import { exportCategoriesToExcel, exportCategoriesToPDF } from '../utils/categoryExport';

ModuleRegistry.registerModules([
    ClientSideRowModelModule, TextFilterModule, PaginationModule, ValidationModule,
    ColumnAutoSizeModule, RowApiModule, CellStyleModule, RowSelectionModule,
    RowStyleModule, DateFilterModule, LocaleModule, CustomFilterModule,
]);

export default function AdminCategoriesPage() {
    const gridRef = useRef<AgGridReact>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [saving, setSaving] = useState(false);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [modalSettings, setModalSettings] = useState<ModalSettings>(defaultModalSettings);

    const gridComponents = useMemo(() => ({
        agDateInput: AgGridDatePicker,
        statusFilter: StatusToggleFilter,
        statusFilterSummary: StatusToggleFilter,
    }), []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [cats, prods] = await Promise.all([
                getCategories({ includeDeleted: true }),
                getProducts({ page: 1, pageSize: 1000, includeInactive: true, includeDeleted: true }),
            ]);
            setCategories(cats);
            setProducts(prods.items);
        } catch (err) {
            console.error('Kategoriler yuklenirken hata:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const { handleEdit, handleDelete, handleRestore, handleConfirmDelete, handleFormSubmit } =
        useCategoryActions({
            categories,
            products,
            setModalSettings,
            setModalOpen,
            setEditingCategory,
            setDeleting,
            setSaving,
            fetchData,
        });

    const columnDefs = useCategoryGridColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onRestore: handleRestore,
    });

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params.api);
        params.api.sizeColumnsToFit();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#ecfdf5' }}>
                        <FolderTree className="h-5 w-5" style={{ color: '#1B5E3F' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>Kategoriler</h1>
                        <p className="text-sm text-gray-500">{categories.length} kategori kayitli</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
