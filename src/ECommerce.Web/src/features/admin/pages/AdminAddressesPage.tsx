import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { type GridReadyEvent, type GridApi, ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import { MapPin, ChevronRight, ChevronDown } from 'lucide-react';
import { getAddresses, type AdminAddress } from '../api/adminApi';
import type { AddressFormData } from '@/lib/validations/admin.schema';
import AddressFormModal from '../components/AddressFormModal';
import ConfirmModal from '../components/ConfirmModal';
import AgGridDatePicker from '../components/AgGridDatePicker';
import { EntityStatusFilter, EntityStatusFloatingFilter } from '../components/EntityStatusFilter';
import { useAddressGridColumns } from '../products/hooks/useAddressGridColumns';
import { useAddressActions, defaultAddressModalSettings, type AddressModalSettings } from '../products/hooks/useAddressActions';
import { exportAddressesToExcel, exportAddressesToPDF } from '../utils/addressExport';
import excelIcon from '../../../assets/excel_download_icon.png';
import pdfIcon from '../../../assets/pdf_download_icon.png';
import { useAgGridTheme, useRowStyleColors } from '../utils/agGridTheme';
import { useTranslation } from 'react-i18next';
import { useAgGridLocale } from '@/hooks/useAgGridLocale';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function AdminAddressesPage() {
    const { t } = useTranslation('admin');
    const { localeText } = useAgGridLocale();
    const agGridTheme = useAgGridTheme();
    const rowColors = useRowStyleColors();
    const gridRef = useRef<AgGridReact>(null);
    const [addresses, setAddresses] = useState<AdminAddress[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<AdminAddress | null>(null);
    const [saving, setSaving] = useState(false);
    const [gridApi, setGridApi] = useState<GridApi | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [modalSettings, setModalSettings] = useState<AddressModalSettings>(defaultAddressModalSettings);
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [isMobile, setIsMobile] = useState(false);
    const isDragging = useRef(false);
    const rowHeights = useRef<Map<string, number>>(new Map());

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleMouseUp = () => { isDragging.current = false; };
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    const gridComponents = useMemo(() => ({ 
        agDateInput: AgGridDatePicker, 
        entityStatusFilter: EntityStatusFilter, 
        entityStatusFloatingFilter: EntityStatusFloatingFilter 
    }), []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAddresses();
            setAddresses(data);
        } catch (err) {
            console.error('Adresler yüklenirken hata:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const { handleEdit, handleDelete, handleRestore, handleConfirmAction, handleFormSubmit } = useAddressActions({ 
        addresses, 
        setModalSettings, 
        setModalOpen, 
        setEditingAddress, 
        setDeleting, 
        setSaving, 
        fetchData 
    });
    
    const baseColumnDefs = useAddressGridColumns({ onEdit: handleEdit, onDelete: handleDelete, onRestore: handleRestore });
    
    const columnDefs = useMemo(() => {
        if (!isMobile) return baseColumnDefs;
        const expandCol: any = {
            headerName: '',
            width: 50,
            minWidth: 50,
            maxWidth: 50,
            pinned: 'left',
            cellRenderer: (params: any) => {
                const isExpanded = expandedRows.has(params.node.id);
                return (
                    <div className="flex items-center justify-center h-full cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        const newExpanded = new Set(expandedRows);
                        if (isExpanded) newExpanded.delete(params.node.id);
                        else newExpanded.add(params.node.id);
                        setExpandedRows(newExpanded);
                        setTimeout(() => {
                            params.api.resetRowHeights();
                            params.api.redrawRows({ rowNodes: [params.node] });
                        }, 0);
                    }}>
                        {isExpanded ? <ChevronDown size={20} className="text-[var(--brand-primary)]" /> : <ChevronRight size={20} className="text-muted-foreground" />}
                    </div>
                );
            }
        };
        return [expandCol, ...baseColumnDefs];
    }, [baseColumnDefs, isMobile, expandedRows]);

    const fullWidthCellRenderer = useMemo(() => (params: any) => {
        const a = params.data as AdminAddress;
        const status = a.isDeleted ? t('filter.deleted') : (a.isActive ? t('filter.active') : t('filter.passive'));
        const statusColor = a.isDeleted ? '#dc2626' : (a.isActive ? '#16a34a' : '#ca8a04');
        const nodeId = params.node.id as string;

        const measuredRef = (el: HTMLDivElement | null) => {
            if (!el) return;
            // Ölçümü tek seferlik yap, döngü yok
            requestAnimationFrame(() => {
                const h = el.scrollHeight + 24; // 24px bottom padding
                if (rowHeights.current.get(nodeId) !== h) {
                    rowHeights.current.set(nodeId, h);
                    params.api.resetRowHeights();
                }
            });
        };

        return (
            <div ref={measuredRef} className="mobile-detail-card" onClick={() => {
                const newExpanded = new Set(expandedRows);
                newExpanded.delete(params.node.id);
                setExpandedRows(newExpanded);
                rowHeights.current.delete(nodeId);
                setTimeout(() => {
                    params.api.resetRowHeights();
                    params.api.redrawRows({ rowNodes: [params.node] });
                }, 0);
            }}>
                <div className="flex justify-between items-start border-b border-border pb-2 mb-2">
                   <div className="font-bold text-[var(--brand-primary)] text-lg">{a.title}</div>
                   <div style={{ color: statusColor, fontWeight: '700', fontSize: '12px' }}>{status}</div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                    <div className="mobile-detail-item">
                        <span className="mobile-detail-label">{t('addresses.mobile.fullName')}</span>
                        <span className="mobile-detail-value font-medium">{a.fullName}</span>
                    </div>
                    <div className="mobile-detail-item">
                        <span className="mobile-detail-label">{t('addresses.mobile.address')}</span>
                        <span className="mobile-detail-value">{a.addressLine1} {a.addressLine2}</span>
                    </div>
                    <div className="mobile-detail-item">
                        <span className="mobile-detail-label">{t('addresses.mobile.cityCountry')}</span>
                        <span className="mobile-detail-value">{a.city} / {a.country}</span>
                    </div>
                    <div className="mobile-detail-item">
                        <span className="mobile-detail-label">{t('addresses.mobile.default')}</span>
                        <span className="mobile-detail-value">{a.isDefault ? t('addresses.mobile.yes') : t('addresses.mobile.no')}</span>
                    </div>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    {!a.isDeleted ? (
                        <>
                            <button onClick={(e) => { e.stopPropagation(); handleEdit(a); }} className="flex-1 bg-green-50 text-[var(--brand-primary)] py-2 rounded-lg font-bold text-sm border border-green-100">{t('addresses.mobile.edit')}</button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(a.id); }} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold text-sm border border-red-100">{t('addresses.mobile.delete')}</button>
                        </>
                    ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleRestore(a.id); }} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg font-bold text-sm border border-blue-100">{t('addresses.mobile.restore')}</button>
                    )}
                </div>
            </div>
        );
    }, [expandedRows, handleEdit, handleDelete, handleRestore]);

    const onGridReady = (params: GridReadyEvent) => { 
        setGridApi(params.api); 
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--brand-primary-light)' }}>
                        <MapPin className="h-5 w-5" style={{ color: 'var(--brand-primary)' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>{t('addresses.title')}</h1>
                        <p className="text-muted-foreground text-sm">{t('addresses.subtitle')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 self-end sm:self-auto">
                    <button
                        onClick={() => exportAddressesToExcel(addresses)}
                        className="flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 active:scale-95 group cursor-pointer"
                        title="Excel'e Aktar"
                    >
                        <div className="w-14 h-14 flex items-center justify-center">
                            <img src={excelIcon} alt="Excel" className="h-full w-full object-contain" />
                        </div>
                        <span className="hidden xs:inline text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Excel</span>
                    </button>
                    <button
                        onClick={() => exportAddressesToPDF(addresses).catch(() => alert(t('errors.pdfExport')))}
                        className="flex flex-col items-center gap-1 transition-all duration-200 hover:scale-110 active:scale-95 group cursor-pointer"
                        title="PDF'e Aktar"
                    >
                        <div className="w-14 h-14 flex items-center justify-center">
                            <img src={pdfIcon} alt="PDF" className="h-10 w-10 object-contain" />
                        </div>
                        <span className="hidden xs:inline text-[10px] font-bold text-muted-foreground uppercase tracking-wider">PDF</span>
                    </button>
                    <button
                        onClick={() => {
                            setEditingAddress(null);
                            setModalOpen(true);
                        }}
                        className="bg-[var(--brand-primary)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--brand-primary-dark)] transition-colors shadow-sm flex items-center gap-2"
                    >
                        {t('addresses.addButton')}
                    </button>
                </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm overflow-x-auto border border-border">
                <div style={{ minWidth: 'fit-content' }}>
                    <AgGridReact<AdminAddress>
                        theme={agGridTheme}
                        suppressHorizontalScroll={false}
                        suppressColumnVirtualisation={true}
                        tooltipShowDelay={300}
                        rowSelection={isMobile ? { mode: 'multiRow', enableClickSelection: false } : { mode: 'multiRow', enableSelectionWithoutKeys: false }}
                        enableCellTextSelection={false}
                        ensureDomOrder={true}
                        isFullWidthRow={(params) => isMobile && expandedRows.has(params.rowNode.id || '')}
                        fullWidthCellRenderer={fullWidthCellRenderer}
                        getRowHeight={(params) => {
                            const id = params.node.id || '';
                            if (isMobile && expandedRows.has(id)) {
                                return rowHeights.current.get(id) ?? 320;
                            }
                            return 48;
                        }}
                        suppressCellFocus={isMobile}
                        onCellMouseDown={(params) => {
                            const mouseEvent = params.event as MouseEvent;
                            if (mouseEvent?.button !== 0 || (params.event as any).pointerType === 'touch' || isMobile) return;
                            const target = mouseEvent?.target as HTMLElement;
                            if (target.closest('button')) return;
                            
                            isDragging.current = true;
                            if (!mouseEvent.ctrlKey && !mouseEvent.shiftKey) {
                                params.api.deselectAll();
                            }
                            params.node.setSelected(true);
                        }}
                        onCellMouseOver={(params) => {
                            if (isDragging.current && (params.event as any).pointerType !== 'touch') {
                                params.node.setSelected(true);
                            }
                        }}
                        ref={gridRef}
                        components={gridComponents}
                        rowData={addresses}
                        columnDefs={columnDefs}
                        onGridReady={onGridReady}
                        pagination={true}
                        paginationPageSize={20}
                        paginationPageSizeSelector={[10, 20, 50, 100]}
                        loading={loading}
                        domLayout="autoHeight"
                        animateRows={true}
                        localeText={localeText}
                        getRowStyle={(params) => {
                            if (params.data?.isDeleted) return { backgroundColor: rowColors.deleted };
                            if (params.data?.isActive === false) return { backgroundColor: rowColors.inactive };
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
                        autoSizeStrategy={{
                            type: 'fitCellContents'
                        }}
                        overlayNoRowsTemplate="<span style='padding:10px;color:#6b7280'>Henüz adres bulunamadı.</span>"
                        overlayLoadingTemplate="<span style='padding:10px;color:var(--brand-primary)'>Adresler yükleniyor...</span>"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 px-1 text-xs text-muted-foreground">
                <span>{t('common:totalRecords', { count: addresses.length })}</span>
                <span>{t('common:showing', { count: gridApi?.getDisplayedRowCount() ?? addresses.length })}</span>
            </div>

            <AddressFormModal 
                open={modalOpen} 
                onClose={() => { setModalOpen(false); setEditingAddress(null); }} 
                onSubmit={(data: AddressFormData) => handleFormSubmit(data, editingAddress)} 
                address={editingAddress} 
                loading={saving} 
            />

            <ConfirmModal 
                open={modalSettings.open} 
                title={modalSettings.title} 
                message={modalSettings.message} 
                variant={modalSettings.variant} 
                confirmText={modalSettings.confirmText} 
                showConfirm={modalSettings.showConfirm} 
                onConfirm={() => handleConfirmAction(modalSettings)} 
                onClose={() => setModalSettings(prev => ({ ...prev, open: false }))} 
                loading={deleting} 
            />
        </div>
    );
}
