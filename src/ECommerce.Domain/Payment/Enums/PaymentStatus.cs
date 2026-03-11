namespace ECommerce.Domain.Payment.Enums;

public enum PaymentStatus
{
    Pending,        // PaymentRecord oluşturuldu, henüz provider'a gönderilmedi
    Processing,     // 3D Secure başlatıldı, kullanıcı provider sayfasında
    Completed,      // Ödeme başarılı — webhook ile onaylandı
    Failed,         // Ödeme başarısız
    Expired,        // Timeout — kullanıcı 3D Secure'dan dönmedi (background job)
    Cancelled,      // Aynı order için yeni ödeme başlatıldığında eski kayıt
    Refunded        // İade edildi
}
