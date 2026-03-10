import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Product } from '../../../catalog/types/product';

const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    return new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(dateStr));
};

const getStatusLabel = (p: Product) =>
    p.isDeleted ? 'Silinmiş' : (p.isActive ? 'Aktif' : 'Pasif');

export function exportProductsToExcel(products: Product[]) {
    const activeCount = products.filter(p => p.isActive && !p.isDeleted).length;
    const passiveCount = products.filter(p => !p.isActive && !p.isDeleted).length;
    const deletedCount = products.filter(p => p.isDeleted).length;

    const wsData: (string | number)[][] = [
        ['Yönetim Paneli - Ürün Listesi'],
        [`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`],
        [`Toplam Ürün Sayısı: ${products.length}`],
        [`Aktif Ürün Sayısı: ${activeCount}`],
        [`Pasif Ürün Sayısı: ${passiveCount}`],
        [`Silinmiş Ürün Sayısı: ${deletedCount}`],
        [],
        ['Durum', 'Ürün Adı', 'Birim', 'Fiyat (₺)', 'Stok', 'Kategori', 'Açıklama', 'Oluşturulma Tarihi', 'Oluşturan', 'Güncellenme Tarihi', 'Güncelleyen'],
    ];

    products.forEach((p) => {
        wsData.push([
            getStatusLabel(p),
            p.name,
            p.unitName,
            p.priceAmount ?? p.price,
            p.stockQuantity,
            p.categoryName,
            p.description || '',
            formatDate(p.createdAt),
            p.createdBy || '',
            formatDate(p.updatedAt),
            p.updatedBy || '',
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [
        { width: 10 }, { width: 30 }, { width: 12 }, { width: 12 }, { width: 10 },
        { width: 25 }, { width: 40 }, { width: 20 }, { width: 15 }, { width: 20 }, { width: 15 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ürünler');
    XLSX.writeFile(wb, 'urunler.xlsx');
}

export async function exportProductsToPDF(products: Product[]) {
    const activeCount = products.filter(p => p.isActive && !p.isDeleted).length;
    const passiveCount = products.filter(p => !p.isActive && !p.isDeleted).length;
    const deletedCount = products.filter(p => p.isDeleted).length;

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
    doc.text('Ürün Listesi Özeti', 14, 20);
    doc.setFontSize(10);
    doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`, 14, 28);
    doc.text(`Toplam Ürün Sayısı: ${products.length}`, 14, 34);
    doc.text(`Aktif Ürün Sayısı: ${activeCount}`, 14, 40);
    doc.text(`Pasif Ürün Sayısı: ${passiveCount}`, 70, 34);
    doc.text(`Silinmiş Ürün Sayısı: ${deletedCount}`, 70, 40);

    const tableData = products.map((p) => [
        getStatusLabel(p),
        p.name,
        p.unitName,
        `${(p.priceAmount ?? p.price).toFixed(2)} TL`,
        String(p.stockQuantity),
        p.categoryName,
        formatDate(p.createdAt),
        p.createdBy || '',
        formatDate(p.updatedAt),
        p.updatedBy || '',
    ]);

    autoTable(doc, {
        startY: 46,
        head: [['Durum', 'Ürün Adı', 'Birim', 'Fiyat', 'Stok', 'Kategori', 'Oluşturulma', 'Oluşturan', 'Güncellenme', 'Güncelleyen']],
        body: tableData,
        styles: { font: 'Roboto', fontSize: 7 },
        headStyles: { font: 'Roboto', fontStyle: 'normal', fillColor: [27, 94, 63] },
        columnStyles: {
            0: { cellWidth: 15 }, 1: { cellWidth: 35 }, 2: { cellWidth: 20 },
            3: { cellWidth: 15 }, 4: { cellWidth: 15 }, 5: { cellWidth: 35 },
            6: { cellWidth: 30 }, 7: { cellWidth: 25 }, 8: { cellWidth: 30 }, 9: { cellWidth: 25 },
        },
        margin: { left: 10, right: 10 },
    });

    doc.save('urunler.pdf');
}
