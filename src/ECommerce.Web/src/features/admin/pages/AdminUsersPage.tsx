import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
    type ColDef,
    type GridReadyEvent,
    type GridApi,
    ModuleRegistry,
    ClientSideRowModelModule,
    TextFilterModule,
    NumberFilterModule,
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
    type ICellRendererParams,
    type ValueFormatterParams,
} from 'ag-grid-community';
import { Users, Download, FileDown, Plus, Edit2, Trash2, RotateCcw } from 'lucide-react';
import { getUsers, createUser, updateUser, deleteUser, restoreUser } from '../api/adminApi';
import type { AdminUser } from '../types/adminUser';
import type { UserFormData } from '../components/UserFormModal';
import UserFormModal from '../components/UserFormModal';
import ConfirmModal from '../components/ConfirmModal';
import AgGridDatePicker from '../components/AgGridDatePicker';
import StatusToggleFilter from '../components/StatusToggleFilter';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Register AG Grid modules
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TextFilterModule,
    NumberFilterModule,
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
]);

const localeTextTr = {
    filterOoo: 'Filtrele...',
    applyFilter: 'Uygula',
    resetFilter: 'Sıfırla',
    clearFilter: 'Temizle',
    dateFormatOoo: 'dd.mm.yyyy',
    dateFilterPlaceholder: 'gg.aa.yyyy',
    before: 'Önce',
    after: 'Sonra',
    equals: 'Eşittir',
    notEqual: 'Eşit Değil',
    blank: 'Boş',
    notBlank: 'Dolu',
    contains: 'İçerir',
    notContains: 'İçermez',
    startsWith: 'İle Başlar',
    endsWith: 'İle Biter',
    greaterThan: 'Büyüktür',
    greaterThanOrEqual: 'Büyüktür veya Eşittir',
    lessThan: 'Küçüktür',
    lessThanOrEqual: 'Küçüktür veya Eşittir',
    inRange: 'Arasında',
    inRangeStart: 'Başlangıç',
    inRangeEnd: 'Bitiş',
    andCondition: 'VE',
    orCondition: 'VEYA',
    sortAscending: 'Artan Sıralama',
    sortDescending: 'Azalan Sıralama',
    columnAutoSize: 'Otomatik Genişlik',
    page: 'Sayfa',
    more: 'Daha Fazla',
    to: '-',
    of: '/',
    next: 'Sonraki',
    last: 'Son',
    first: 'İlk',
    previous: 'Önceki',
    pageSizeSelectorLabel: 'Sayfa Boyutu:',
    loadingOoo: 'Yükleniyor...',
    noRowsToShow: 'Henüz kayıt bulunamadı.',
};

const dateComparator = (filterLocalDate: Date, cellValue: string) => {
    if (cellValue == null) return -1;
    const cellDate = new Date(cellValue);

    const filterHasTime = filterLocalDate.getHours() !== 0 || filterLocalDate.getMinutes() !== 0;

    if (filterHasTime) {
        const filterTime = new Date(
            filterLocalDate.getFullYear(), filterLocalDate.getMonth(), filterLocalDate.getDate(),
            filterLocalDate.getHours(), filterLocalDate.getMinutes()
        ).getTime();
        const cellTime = new Date(
            cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate(),
            cellDate.getHours(), cellDate.getMinutes()
        ).getTime();

        if (filterTime === cellTime) return 0;
        return cellTime < filterTime ? -1 : 1;
    } else {
        const filterDateOnly = new Date(
            filterLocalDate.getFullYear(), filterLocalDate.getMonth(), filterLocalDate.getDate()
        ).getTime();
        const cellDateOnly = new Date(
            cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate()
        ).getTime();

        if (filterDateOnly === cellDateOnly) return 0;
        return cellDateOnly < filterDateOnly ? -1 : 1;
    }
};

export default function AdminUsersPage() {
    const gridRef = useRef<AgGridReact>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [saving, setSaving] = useState(false);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [deleting, setDeleting] = useState(false);

    const gridComponents = useMemo(() => ({
        agDateInput: AgGridDatePicker,
        statusFilter: StatusToggleFilter,
        statusFilterSummary: StatusToggleFilter,
    }), []);

    const [modalSettings, setModalSettings] = useState<{
        open: boolean;
        title: string;
        message: string;
        confirmText: string;
        variant: 'danger' | 'warning' | 'info';
        showConfirm: boolean;
        userId: string | null;
        actionType: 'delete' | 'restore';
    }>({
        open: false,
        title: '',
        message: '',
        confirmText: '',
        variant: 'danger',
        showConfirm: true,
        userId: null,
        actionType: 'delete',
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            console.error('Müşteriler yüklenirken hata:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onGridReady = (params: GridReadyEvent) => {
        setGridApi(params.api);
    };

    // ── CRUD Handlers ──
    const handleEdit = useCallback((user: AdminUser) => {
        setEditingUser(user);
        setModalOpen(true);
    }, []);

    const handleRestore = useCallback((id: string) => {
        const user = users.find(u => u.id === id);
        if (!user) return;

        setModalSettings({
            open: true,
            title: 'Müşteriyi Geri Yükle',
            message: `"${user.fullName}" müşterisini geri yüklemek istediğinizden emin misiniz?`,
            confirmText: 'Geri Yükle',
            variant: 'info',
            showConfirm: true,
            userId: id,
            actionType: 'restore',
        });
    }, [users]);

    const handleConfirmAction = async () => {
        const { userId, actionType } = modalSettings;
        if (!userId) return;

        setDeleting(true);
        try {
            if (actionType === 'restore') {
                await restoreUser(userId);
            } else {
                await deleteUser(userId);
            }
            setModalSettings(prev => ({ ...prev, open: false, userId: null }));
            await fetchData();
        } catch (err) {
            console.error('İşlem sırasında hata:', err);
            alert('İşlem sırasında bir hata oluştu.');
        } finally {
            setDeleting(false);
        }
    };

    const handleFormSubmit = async (data: UserFormData) => {
        setSaving(true);
        try {
            if (editingUser) {
                if (editingUser.isDeleted) {
                    await restoreUser(editingUser.id);
                }
                await updateUser({
                    id: editingUser.id,
                    fullName: data.fullName,
                    email: data.email,
                    role: data.role,
                    isActive: data.isActive,
                });
            } else {
                await createUser({
                    fullName: data.fullName,
                    email: data.email,
                    role: data.role,
                    isActive: data.isActive,
                });
            }
            setModalOpen(false);
            setEditingUser(null);
            await fetchData();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } }; message?: string };
            const errorMsg = error.response?.data?.message || error.message || '';
            console.error('Müşteri kaydedilirken hata:', err);
            alert('Müşteri kaydedilirken bir hata oluştu: ' + errorMsg);
        } finally {
            setSaving(false);
        }
    };

    // ── Column Definitions ──
    const columnDefs = useMemo<ColDef<AdminUser>[]>(() => [
        {
            headerName: 'Durum',
            field: 'isActive',
            filter: 'statusFilter',
            floatingFilter: true,
            floatingFilterComponent: 'statusFilterSummary',
            suppressHeaderMenuButton: true,
            suppressFloatingFilterButton: true,
            suppressMenu: true,
            menuTabs: [],
            sortable: true,
            width: 155,
            minWidth: 155,
            cellRenderer: (params: ICellRendererParams<AdminUser, boolean>) => {
                if (params.data?.isDeleted) {
                    return <span style={{ color: '#dc2626', fontWeight: '600' }}>Silinmiş</span>;
                }
                return params.value ? (
                    <span style={{ color: '#16a34a', fontWeight: '600' }}>Aktif</span>
                ) : (
                    <span style={{ color: '#ca8a04', fontWeight: '600' }}>Pasif</span>
                );
            },
        },
        {
            headerName: 'Ad Soyad',
            field: 'fullName',
            filter: 'agTextColumnFilter',
            sortable: true,
            width: 200,
        },
        {
            headerName: 'E-posta',
            field: 'email',
            filter: 'agTextColumnFilter',
            sortable: true,
            width: 250,
        },
        {
            headerName: 'Rol',
            field: 'role',
            filter: 'agTextColumnFilter',
            sortable: true,
            width: 120,
            cellRenderer: (params: ICellRendererParams<AdminUser, string>) => {
                if (!params.value) return '';
                const isAdmin = params.value === 'Admin';
                return (
                    <span
                        style={{
                            color: isAdmin ? '#7c3aed' : '#374151',
                            backgroundColor: isAdmin ? '#f5f3ff' : '#f3f4f6',
                            padding: '2px 10px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: 600,
                        }}
                    >
                        {isAdmin ? 'Yönetici' : 'Müşteri'}
                    </span>
                );
            },
        },
        {
            headerName: 'E-posta Onayı',
            field: 'isEmailConfirmed',
            filter: 'agTextColumnFilter',
            sortable: true,
            width: 140,
            cellRenderer: (params: ICellRendererParams<AdminUser, boolean>) => {
                const confirmed = params.value;
                return (
                    <span
                        style={{
                            color: confirmed ? '#16a34a' : '#6b7280',
                            backgroundColor: confirmed ? '#f0fdf4' : '#f3f4f6',
                            padding: '2px 10px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: 600,
                        }}
                    >
                        {confirmed ? 'Onaylı' : 'Onaysız'}
                    </span>
                );
            },
            filterParams: {
                valueFormatter: (params: ValueFormatterParams<AdminUser, boolean>) => {
                    return params.value ? 'Onaylı' : 'Onaysız';
                },
            },
        },
        {
            headerName: 'Kayıt Tarihi',
            field: 'createdAt',
            sortable: true,
            filter: 'agDateColumnFilter',
            filterParams: {
                comparator: dateComparator,
            },
            width: 180,
            valueFormatter: (params: ValueFormatterParams<AdminUser, string>) => {
                if (!params.value) return '';
                return new Intl.DateTimeFormat('tr-TR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit'
                }).format(new Date(params.value));
            },
        },
        {
            headerName: 'İşlemler',
            field: 'id',
            sortable: false,
            filter: false,
            width: 120,
            cellRenderer: (params: ICellRendererParams<AdminUser, string>) => {
                if (!params.data) return null;
                const isDeleted = params.data.isDeleted;
                return (
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', height: '100%' }}>
                        {!isDeleted ? (
                            <>
                                <button
                                    title="Düzenle"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit(params.data!);
                                    }}
                                    className="p-1 rounded-md transition-colors hover:bg-green-50"
                                    style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                                >
                                    <Edit2 size={16} color="#1B5E3F" />
                                </button>
                                <button
                                    title="Sil"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const userId = params.data!.id;
                                        setModalSettings({
                                            open: true,
                                            title: 'Müşteriyi Sil',
                                            message: `"${params.data!.fullName}" müşterisini silmek istediğinizden emin misiniz? Bu işlem geri alınabilir.`,
                                            confirmText: 'Sil',
                                            variant: 'danger',
                                            showConfirm: true,
                                            userId,
                                            actionType: 'delete',
                                        });
                                    }}
                                    className="p-1 rounded-md transition-colors hover:bg-red-50"
                                    style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                                >
                                    <Trash2 size={16} color="#dc2626" />
                                </button>
                            </>
                        ) : (
                            <button
                                title="Geri Yükle"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRestore(params.data!.id);
                                }}
                                className="p-1 rounded-md transition-colors hover:bg-blue-50"
                                style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                            >
                                <RotateCcw size={16} color="#2563eb" />
                            </button>
                        )}
                    </div>
                );
            },
        },
    ], [handleEdit, handleRestore]);

    // ── Export Handlers ──
    const exportToExcel = () => {
        const totalCount = users.length;
        const activeCount = users.filter(u => u.isActive && !u.isDeleted).length;
        const passiveCount = users.filter(u => !u.isActive && !u.isDeleted).length;
        const deletedCount = users.filter(u => u.isDeleted).length;
        const confirmedCount = users.filter(u => u.isEmailConfirmed && !u.isDeleted).length;

        const wsData: (string | number)[][] = [
            ['Yönetim Paneli - Müşteri Listesi'],
            [`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`],
            [`Toplam Kullanıcı Sayısı: ${totalCount}`],
            [`Aktif: ${activeCount} | Pasif: ${passiveCount} | Silinmiş: ${deletedCount}`],
            [`E-posta Onaylı: ${confirmedCount}`],
            [],
            ['Durum', 'Ad Soyad', 'E-posta', 'Rol', 'E-posta Onayı', 'Kayıt Tarihi'],
        ];

        const formatDate = (dateStr: string) => {
            return new Date(dateStr).toLocaleString('tr-TR');
        };

        users.forEach((u) => {
            wsData.push([
                u.isDeleted ? 'Silinmiş' : (u.isActive ? 'Aktif' : 'Pasif'),
                u.fullName,
                u.email,
                u.role === 'Admin' ? 'Yönetici' : 'Müşteri',
                u.isEmailConfirmed ? 'Onaylı' : 'Onaysız',
                formatDate(u.createdAt),
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        ws['!cols'] = [
            { width: 12 },  // Durum
            { width: 25 },  // Ad Soyad
            { width: 30 },  // E-posta
            { width: 12 },  // Rol
            { width: 15 },  // E-posta Onayı
            { width: 20 },  // Kayıt Tarihi
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Müşteriler');
        XLSX.writeFile(wb, 'musteriler.xlsx');
    };

    const exportToPDF = async () => {
        try {
            const totalCount = users.length;
            const activeCount = users.filter(u => u.isActive && !u.isDeleted).length;
            const passiveCount = users.filter(u => !u.isActive && !u.isDeleted).length;
            const deletedCount = users.filter(u => u.isDeleted).length;

            const doc = new jsPDF('l', 'mm', 'a4');

            // Load Turkish font
            const fontUrl = '/fonts/Roboto-Regular.ttf';
            const fontResponse = await fetch(fontUrl);
            const fontBuffer = await fontResponse.arrayBuffer();

            const bufferToBase64 = (buffer: ArrayBuffer) => {
                let binary = '';
                const bytes = new Uint8Array(buffer);
                const len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return window.btoa(binary);
            };

            const fontBase64 = bufferToBase64(fontBuffer);
            doc.addFileToVFS('Roboto-Regular.ttf', fontBase64);
            doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
            doc.setFont('Roboto');

            doc.setFontSize(16);
            doc.text('Müşteri Listesi Özeti', 14, 20);

            doc.setFontSize(10);
            doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`, 14, 28);
            doc.text(`Toplam Kullanıcı: ${totalCount}`, 14, 34);
            doc.text(`Aktif: ${activeCount} | Pasif: ${passiveCount} | Silinmiş: ${deletedCount}`, 14, 40);

            const formatDate = (dateStr: string) => {
                return new Intl.DateTimeFormat('tr-TR', {
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit'
                }).format(new Date(dateStr));
            };

            const tableData = users.map((u) => [
                u.isDeleted ? 'Silinmiş' : (u.isActive ? 'Aktif' : 'Pasif'),
                u.fullName,
                u.email,
                u.role === 'Admin' ? 'Yönetici' : 'Müşteri',
                u.isEmailConfirmed ? 'Onaylı' : 'Onaysız',
                formatDate(u.createdAt),
            ]);

            autoTable(doc, {
                startY: 46,
                head: [['Durum', 'Ad Soyad', 'E-posta', 'Rol', 'E-posta Onayı', 'Kayıt Tarihi']],
                body: tableData,
                styles: { font: 'Roboto', fontSize: 9 },
                headStyles: { font: 'Roboto', fontStyle: 'normal', fillColor: [27, 94, 63] },
                columnStyles: {
                    0: { cellWidth: 20 },
                    1: { cellWidth: 45 },
                    2: { cellWidth: 55 },
                    3: { cellWidth: 25 },
                    4: { cellWidth: 25 },
                    5: { cellWidth: 35 },
                },
                margin: { left: 14, right: 14 },
            });

            doc.save('musteriler.pdf');
        } catch (error) {
            console.error('PDF oluşturulurken hata:', error);
            alert('PDF oluşturulurken bir hata oluştu. Font dosyası yüklenememiş olabilir.');
        }
    };

    return (
        <div>
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: '#ecfdf5' }}
                    >
                        <Users className="h-5 w-5" style={{ color: '#1B5E3F' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#1B5E3F' }}>Müşteriler</h1>
                        <p className="text-sm text-gray-500">
                            Toplam {users.length} müşteri kayıtlı
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Download className="h-4 w-4" />
                            Excel
                        </button>
                        <button
                            onClick={exportToPDF}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <FileDown className="h-4 w-4" />
                            PDF
                        </button>
                        <button
                            onClick={() => {
                                setEditingUser(null);
                                setModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                            style={{ background: '#1B5E3F' }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#164A32')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#1B5E3F')}
                        >
                            <Plus className="h-4 w-4" />
                            Yeni Müşteri Ekle
                        </button>
                    </div>
                </div>
            </div>

            {/* AG Grid Table */}
            <div
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                style={{ border: '1px solid #e5e7eb' }}
            >
                <div style={{ height: 'calc(100vh - 260px)', width: '100%' }}>
                    <AgGridReact<AdminUser>
                        ref={gridRef}
                        components={gridComponents}
                        rowData={users}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        loading={loading}
                        animateRows={true}
                        localeText={localeTextTr}
                        getRowStyle={(params) => {
                            if (params.data?.isDeleted) {
                                return { backgroundColor: '#fef2f2' };
                            }
                            if (params.data?.isActive === false) {
                                return { backgroundColor: '#f1f5f9' };
                            }
                            if (params.data?.isActive === true) {
                                return { backgroundColor: '#f0fdf4' };
                            }
                            return undefined;
                        }}
                        defaultColDef={{
                            resizable: true,
                            floatingFilter: true,
                            suppressHeaderMenuButton: true,
                            menuTabs: [],
                        }}
                        overlayNoRowsTemplate="<span style='padding:10px;color:#6b7280'>Henüz müşteri bulunamadı.</span>"
                        overlayLoadingTemplate="<span style='padding:10px;color:#1B5E3F'>Müşteriler yükleniyor...</span>"
                    />
                </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between mt-3 px-1 text-xs text-gray-500">
                <span>Toplam kayıt: {users.length}</span>
                <span>
                    Gösterilen: {gridApi?.getDisplayedRowCount() ?? users.length} kayıt
                </span>
            </div>

            {/* User Form Modal */}
            <UserFormModal
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setEditingUser(null);
                }}
                onSubmit={handleFormSubmit}
                user={editingUser}
                loading={saving}
            />

            {/* Confirm Modal */}
            <ConfirmModal
                open={modalSettings.open}
                title={modalSettings.title}
                message={modalSettings.message}
                variant={modalSettings.variant}
                confirmText={modalSettings.confirmText}
                showConfirm={modalSettings.showConfirm}
                onConfirm={handleConfirmAction}
                onClose={() => {
                    setModalSettings(prev => ({ ...prev, open: false }));
                }}
                loading={deleting}
            />
        </div>
    );
}
