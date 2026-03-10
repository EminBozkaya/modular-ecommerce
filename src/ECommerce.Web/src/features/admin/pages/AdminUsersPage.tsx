import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { type GridReadyEvent, type GridApi, ModuleRegistry, ClientSideRowModelModule, TextFilterModule, NumberFilterModule, PaginationModule, ValidationModule, ColumnAutoSizeModule, RowApiModule, CellStyleModule, RowSelectionModule, RowStyleModule, DateFilterModule, LocaleModule, CustomFilterModule, TooltipModule } from 'ag-grid-community';
import { Users, Download, FileDown, UserPlus } from 'lucide-react';
import { getUsers } from '../api/adminApi';
import type { AdminUser } from '../types/adminUser';
import type { UserFormData } from '../components/UserFormModal';
import UserFormModal from '../components/UserFormModal';
import ConfirmModal from '../components/ConfirmModal';
import AgGridDatePicker from '../components/AgGridDatePicker';
import { EntityStatusFilter, EntityStatusFloatingFilter } from '../components/EntityStatusFilter';
import { useUserGridColumns, localeTextTr } from '../hooks/useUserGridColumns';
import { useUserActions, defaultUserModalSettings, type UserModalSettings } from '../hooks/useUserActions';
import { exportUsersToExcel, exportUsersToPDF } from '../utils/userExport';
ModuleRegistry.registerModules([ClientSideRowModelModule, TextFilterModule, NumberFilterModule, PaginationModule, ValidationModule, ColumnAutoSizeModule, RowApiModule, CellStyleModule, RowSelectionModule, RowStyleModule, DateFilterModule, LocaleModule, CustomFilterModule, TooltipModule]);
export default function AdminUsersPage() {
    const gridRef = useRef<AgGridReact>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [saving, setSaving] = useState(false);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [modalSettings, setModalSettings] = useState<UserModalSettings>(defaultUserModalSettings);
    const gridComponents = useMemo(() => ({ agDateInput: AgGridDatePicker, entityStatusFilter: EntityStatusFilter, entityStatusFloatingFilter: EntityStatusFloatingFilter }), []);
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            console.error('Musteriler yuklenirken hata:', err);
        } finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => { fetchData(); }, [fetchData]);
    const { handleEdit, handleDelete, handleRestore, handleConfirmAction, handleFormSubmit } = useUserActions({ users, setModalSettings, setModalOpen, setEditingUser, setDeleting, setSaving, fetchData });
    const columnDefs = useUserGridColumns({ onEdit: handleEdit, onDelete: handleDelete, onRestore: handleRestore });
    const onGridReady = (params: GridReadyEvent) => { setGridApi(params.api); params.api.sizeColumnsToFit(); };
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#ecfdf5' }}>
                        <Users className="h-5 w-5" style={{ color: '#1B5E3F' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>Musteriler</h1>
                        <p className="text-sm text-gray-500">Toplam {users.length} musteri kayitli</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => exportUsersToExcel(users)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"><Download className="h-4 w-4" /> Excel</button>
                    <button onClick={() => exportUsersToPDF(users).catch(() => alert('PDF hatasi.'))} className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"><FileDown className="h-4 w-4" /> PDF</button>
                    <button
                        onClick={() => { setEditingUser(null); setModalOpen(true); }}
                        className="flex items-center justify-center w-10 h-10 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        style={{ background: '#1B5E3F' }}
                        title="Yeni Müşteri Ekle"
                        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = '#164A32')}
                        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => (e.currentTarget.style.background = '#1B5E3F')}
                    >
                        <UserPlus className="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto" style={{ border: '1px solid #e5e7eb' }}>
                <div style={{ minWidth: 'fit-content' }}>
                    <AgGridReact<AdminUser>
                        suppressHorizontalScroll={true}
                        suppressColumnVirtualisation={true}
                        tooltipShowDelay={300}
                        ref={gridRef}
                        components={gridComponents}
                        rowData={users}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        loading={loading}
                        domLayout="autoHeight"
                        animateRows={true}
                        localeText={localeTextTr}
                        getRowStyle={(params) => {
                            if (params.data?.isDeleted) return { backgroundColor: '#fef2f2' };
                            if (params.data?.isActive === false) return { backgroundColor: '#f1f5f9' };
                            if (params.data?.isActive === true) return { backgroundColor: '#f0fdf4' };
                            return undefined;
                        }}
                        defaultColDef={{
                            resizable: true,
                            floatingFilter: true,
                            suppressHeaderMenuButton: true,
                            menuTabs: [],
                            suppressMovable: false,
                            cellStyle: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
                        }}
                        overlayNoRowsTemplate="<span style='padding:10px;color:#6b7280'>Henuz musteri bulunamadi.</span>"
                        overlayLoadingTemplate="<span style='padding:10px;color:#1B5E3F'>Musteriler yukleniyor...</span>"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 px-1 text-xs text-gray-500">
                <span>Toplam kayit: {users.length}</span>
                <span>Gosterilen: {gridApi?.getDisplayedRowCount() ?? users.length} kayit</span>
            </div>
            <UserFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingUser(null); }} onSubmit={(data: UserFormData) => handleFormSubmit(data, editingUser)} user={editingUser} loading={saving} />
            <ConfirmModal open={modalSettings.open} title={modalSettings.title} message={modalSettings.message} variant={modalSettings.variant} confirmText={modalSettings.confirmText} showConfirm={modalSettings.showConfirm} onConfirm={() => handleConfirmAction(modalSettings)} onClose={() => setModalSettings(prev => ({ ...prev, open: false }))} loading={deleting} />
        </div>
    );
}
