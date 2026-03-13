import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AdminAddress } from '../api/adminApi';

const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(dateStr));

const getStatusLabel = (a: AdminAddress) =>
    a.isDeleted ? 'Silinmiş' : (a.isActive ? 'Aktif' : 'Pasif');

export function exportAddressesToExcel(addresses: AdminAddress[]) {
    const activeCount = addresses.filter(a => a.isActive && !a.isDeleted).length;
    const passiveCount = addresses.filter(a => !a.isActive && !a.isDeleted).length;
    const deletedCount = addresses.filter(a => a.isDeleted).length;

    const wsData: (string | number)[][] = [
        ['Yönetim Paneli - Adres Listesi'],
        [`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`],
        [`Toplam Adres Sayısı: ${addresses.length}`],
        [`Aktif: ${activeCount} | Pasif: ${passiveCount} | Silinmiş: ${deletedCount}`],
        [],
        ['Durum', 'Kullanıcı', 'Başlık', 'Alıcı Ad Soyad', 'Adres', 'Şehir', 'Ülke', 'Kayıt Tarihi'],
    ];

    addresses.forEach((a) => {
        wsData.push([
            getStatusLabel(a),
            a.userFullName || '-',
            a.title,
            a.fullName,
            `${a.addressLine1} ${a.addressLine2 || ''}`,
            a.city,
            a.country,
            formatDate(a.createdAt),
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [
        { width: 12 }, { width: 20 }, { width: 15 }, { width: 25 },
        { width: 40 }, { width: 15 }, { width: 15 }, { width: 20 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Adresler');
    XLSX.writeFile(wb, 'adresler.xlsx');
}

export async function exportAddressesToPDF(addresses: AdminAddress[]) {
    const activeCount = addresses.filter(a => a.isActive && !a.isDeleted).length;
    const passiveCount = addresses.filter(a => !a.isActive && !a.isDeleted).length;
    const deletedCount = addresses.filter(a => a.isDeleted).length;

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
    doc.text('Adres Listesi Özeti', 14, 20);
    doc.setFontSize(10);
    doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`, 14, 28);
    doc.text(`Toplam Adres: ${addresses.length}`, 14, 34);
    doc.text(`Aktif: ${activeCount} | Pasif: ${passiveCount} | Silinmiş: ${deletedCount}`, 14, 40);

    const tableData = addresses.map((a) => [
        getStatusLabel(a),
        a.userFullName || '-',
        a.title,
        a.fullName,
        `${a.addressLine1} ${a.addressLine2 || ''}`,
        a.city,
        a.country,
        formatDate(a.createdAt),
    ]);

    autoTable(doc, {
        startY: 46,
        head: [['Durum', 'Kullanıcı', 'Başlık', 'Alıcı Ad Soyad', 'Adres', 'Şehir', 'Ülke', 'Kayıt Tarihi']],
        body: tableData,
        styles: { font: 'Roboto', fontSize: 9 },
        headStyles: { font: 'Roboto', fontStyle: 'normal', fillColor: [27, 94, 63] },
        columnStyles: {
            0: { cellWidth: 15 }, 1: { cellWidth: 30 }, 2: { cellWidth: 25 }, 3: { cellWidth: 35 },
            4: { cellWidth: 60 }, 5: { cellWidth: 20 }, 6: { cellWidth: 20 }, 7: { cellWidth: 35 },
        },
        margin: { left: 14, right: 14 },
    });

    doc.save('adresler.pdf');
}
