import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Category } from '../../../catalog/types/product';

const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    return new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateStr));
};

const getStatusLabel = (cat: Category) =>
    cat.isDeleted ? 'Silinmiş' : (cat.isActive !== false ? 'Aktif' : 'Pasif');

const getParentLabel = (cat: Category, short = false) =>
    cat.parentCategoryName || (cat.parentCategoryId ? (short ? '...' : 'Ana Kategori') : 'Ana Kategori');

export function exportCategoriesToExcel(categories: Category[]) {
    const activeCount = categories.filter(c => c.isActive !== false && !c.isDeleted).length;
    const passiveCount = categories.filter(c => c.isActive === false && !c.isDeleted).length;
    const deletedCount = categories.filter(c => c.isDeleted).length;

    const wsData: (string | number)[][] = [
        ['Yönetim Paneli - Kategori Listesi'],
        [`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`],
        [`Toplam Kategori Sayısı: ${categories.length}`],
        [`Aktif Kategori Sayısı: ${activeCount}`],
        [`Pasif Kategori Sayısı: ${passiveCount}`],
        [`Silinmiş Kategori Sayısı: ${deletedCount}`],
        [],
        ['Kategori Adı', 'Üst Kategori', 'Durum', 'Oluşturulma Tarihi', 'Oluşturan', 'Güncellenme Tarihi', 'Güncelleyen'],
    ];

    categories.forEach((c) => {
        wsData.push([
            c.name,
            getParentLabel(c),
            getStatusLabel(c),
            formatDate(c.createdAt),
            c.createdBy || '',
            formatDate(c.updatedAt),
            c.updatedBy || '',
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [
        { width: 30 }, { width: 25 }, { width: 12 },
        { width: 20 }, { width: 15 }, { width: 20 }, { width: 15 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kategoriler');
    XLSX.writeFile(wb, 'kategoriler.xlsx');
}

export async function exportCategoriesToPDF(categories: Category[]) {
    const activeCount = categories.filter(c => c.isActive !== false && !c.isDeleted).length;
    const passiveCount = categories.filter(c => c.isActive === false && !c.isDeleted).length;
    const deletedCount = categories.filter(c => c.isDeleted).length;

    const doc = new jsPDF('l', 'mm', 'a4');

    const fontResponse = await fetch('/fonts/Roboto-Regular.ttf');
    const fontBuffer = await fontResponse.arrayBuffer();
    const bytes = new Uint8Array(fontBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    const fontBase64 = window.btoa(binary);

    doc.addFileToVFS('Roboto-Regular.ttf', fontBase64);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto');

    doc.setFontSize(16);
    doc.text('Kategori Listesi Özeti', 14, 20);
    doc.setFontSize(10);
    doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`, 14, 28);
    doc.text(`Toplam Kategori Sayısı: ${categories.length}`, 14, 34);
    doc.text(`Aktif Kategori Sayısı: ${activeCount}`, 14, 40);
    doc.text(`Pasif Kategori Sayısı: ${passiveCount}`, 70, 34);
    doc.text(`Silinmiş Kategori Sayısı: ${deletedCount}`, 70, 40);

    const tableData = categories.map((c) => [
        c.name,
        getParentLabel(c, true),
        getStatusLabel(c),
        formatDate(c.createdAt),
        c.createdBy || '',
        formatDate(c.updatedAt),
        c.updatedBy || '',
    ]);

    autoTable(doc, {
        startY: 46,
        head: [['Kategori Adı', 'Üst Kategori', 'Durum', 'Oluşturulma', 'Oluşturan', 'Güncellenme', 'Güncelleyen']],
        body: tableData,
        styles: { font: 'Roboto', fontSize: 8 },
        headStyles: { font: 'Roboto', fontStyle: 'normal', fillColor: [27, 94, 63] },
        columnStyles: {
            0: { cellWidth: 45 }, 1: { cellWidth: 40 }, 2: { cellWidth: 20 },
            3: { cellWidth: 35 }, 4: { cellWidth: 25 }, 5: { cellWidth: 35 }, 6: { cellWidth: 25 },
        },
        margin: { left: 14, right: 14 },
    });

    doc.save('kategoriler.pdf');
}
