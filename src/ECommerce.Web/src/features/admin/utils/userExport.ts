import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { AdminUser } from '../types/adminUser';

const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat('tr-TR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit',
    }).format(new Date(dateStr));

const getStatusLabel = (u: AdminUser) =>
    u.isDeleted ? 'Silinmis' : (u.isActive ? 'Aktif' : 'Pasif');

const getRoleLabel = (u: AdminUser) =>
    u.role === 'Admin' ? 'Yonetici' : 'Musteri';

export function exportUsersToExcel(users: AdminUser[]) {
    const activeCount = users.filter(u => u.isActive && !u.isDeleted).length;
    const passiveCount = users.filter(u => !u.isActive && !u.isDeleted).length;
    const deletedCount = users.filter(u => u.isDeleted).length;
    const confirmedCount = users.filter(u => u.isEmailConfirmed && !u.isDeleted).length;

    const wsData: (string | number)[][] = [
        ['Yonetim Paneli - Musteri Listesi'],
        [`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`],
        [`Toplam Kullanici Sayisi: ${users.length}`],
        [`Aktif: ${activeCount} | Pasif: ${passiveCount} | Silinmis: ${deletedCount}`],
        [`E-posta Onaylı: ${confirmedCount}`],
        [],
        ['Durum', 'Ad Soyad', 'E-posta', 'Rol', 'E-posta Onayı', 'Kayit Tarihi'],
    ];

    users.forEach((u) => {
        wsData.push([
            getStatusLabel(u),
            u.fullName,
            u.email,
            getRoleLabel(u),
            u.isEmailConfirmed ? 'Onaylı' : 'Onaysız',
            formatDate(u.createdAt),
        ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws['!cols'] = [
        { width: 12 }, { width: 25 }, { width: 30 },
        { width: 12 }, { width: 15 }, { width: 20 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Musteriler');
    XLSX.writeFile(wb, 'musteriler.xlsx');
}

export async function exportUsersToPDF(users: AdminUser[]) {
    const activeCount = users.filter(u => u.isActive && !u.isDeleted).length;
    const passiveCount = users.filter(u => !u.isActive && !u.isDeleted).length;
    const deletedCount = users.filter(u => u.isDeleted).length;

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
    doc.text('Musteri Listesi Ozeti', 14, 20);
    doc.setFontSize(10);
    doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`, 14, 28);
    doc.text(`Toplam Kullanici: ${users.length}`, 14, 34);
    doc.text(`Aktif: ${activeCount} | Pasif: ${passiveCount} | Silinmis: ${deletedCount}`, 14, 40);

    const tableData = users.map((u) => [
        getStatusLabel(u),
        u.fullName,
        u.email,
        getRoleLabel(u),
        u.isEmailConfirmed ? 'Onaylı' : 'Onaysız',
        formatDate(u.createdAt),
    ]);

    autoTable(doc, {
        startY: 46,
        head: [['Durum', 'Ad Soyad', 'E-posta', 'Rol', 'E-posta Onayı', 'Kayit Tarihi']],
        body: tableData,
        styles: { font: 'Roboto', fontSize: 9 },
        headStyles: { font: 'Roboto', fontStyle: 'normal', fillColor: [27, 94, 63] },
        columnStyles: {
            0: { cellWidth: 20 }, 1: { cellWidth: 45 }, 2: { cellWidth: 55 },
            3: { cellWidth: 25 }, 4: { cellWidth: 25 }, 5: { cellWidth: 35 },
        },
        margin: { left: 14, right: 14 },
    });

    doc.save('musteriler.pdf');
}
