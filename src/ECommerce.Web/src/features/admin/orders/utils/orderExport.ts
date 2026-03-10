import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Order, OrderStatus } from '../../../ordering/types/order';
import { statusLabels } from '../hooks/useOrderGridColumns';

const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(dateStr));

const getStatusLabel = (o: Order) =>
    o.isDeleted ? 'Silinmis' : statusLabels[o.status];

export function exportOrdersToExcel(orders: Order[]) {
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const statusCounts = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const wsData: (string | number)[][] = [
        ['Yonetim Paneli - Siparis Listesi'],
        ['Rapor Tarihi: ' + new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR')],
        ['Toplam Siparis Sayisi: ' + orders.length],
        ['Toplam Ciro: TL' + totalRevenue.toFixed(2)],
        ...Object.entries(statusCounts).map(([status, count]) =>
            [(statusLabels[status as OrderStatus] || status) + ': ' + count]
        ),
        [],
        ['Durum', 'Siparis No', 'Musteri', 'Urun Sayisi', 'Tutar (TL)', 'Sehir', 'Urunler', 'Siparis Tarihi'],
    ];

    orders.forEach((o) => {
        wsData.push([
            getStatusLabel(o),
            o.id,
            o.shippingAddress.fullName,
            o.items.reduce((sum, item) => sum + item.quantity, 0),
            o.totalAmount,
            o.shippingAddress.city,
            o.items.map(i => i.productName).join(', '),
            formatDate(o.createdAt),
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [
        { width: 15 }, { width: 15 }, { width: 20 },
        { width: 12 }, { width: 12 }, { width: 15 },
        { width: 40 }, { width: 20 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Siparisler');
    XLSX.writeFile(wb, 'siparisler.xlsx');
}

export async function exportOrdersToPDF(orders: Order[]) {
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const statusCounts = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

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
    doc.text('Siparis Listesi Ozeti', 14, 20);
    doc.setFontSize(10);
    doc.text('Rapor Tarihi: ' + new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR'), 14, 28);
    doc.text('Toplam Siparis: ' + orders.length, 14, 34);
    doc.text('Toplam Ciro: TL' + totalRevenue.toFixed(2), 14, 40);

    let yPos = 34;
    let xPos = 70;
    Object.entries(statusCounts).forEach(([status, count]) => {
        doc.text((statusLabels[status as OrderStatus] || status) + ': ' + count, xPos, yPos);
        yPos += 6;
        if (yPos > 40) { yPos = 34; xPos += 50; }
    });

    const tableData = orders.map((o) => [
        getStatusLabel(o),
        o.id,
        o.shippingAddress.fullName,
        String(o.items.reduce((sum, item) => sum + item.quantity, 0)),
        'TL' + o.totalAmount.toFixed(2),
        o.shippingAddress.city,
        o.items.map(i => i.productName).join(', '),
        formatDate(o.createdAt),
    ]);

    autoTable(doc, {
        startY: 46,
        head: [['Durum', 'Siparis No', 'Musteri', 'Adet', 'Tutar', 'Sehir', 'Urunler', 'Tarih']],
        body: tableData,
        styles: { font: 'Roboto', fontSize: 7 },
        headStyles: { font: 'Roboto', fontStyle: 'normal', fillColor: [27, 94, 63] },
        columnStyles: {
            0: { cellWidth: 20 }, 1: { cellWidth: 25 }, 2: { cellWidth: 30 },
            3: { cellWidth: 12 }, 4: { cellWidth: 20 }, 5: { cellWidth: 25 },
            6: { cellWidth: 60 }, 7: { cellWidth: 30 },
        },
        margin: { left: 10, right: 10 },
    });

    doc.save('siparisler.pdf');
}
