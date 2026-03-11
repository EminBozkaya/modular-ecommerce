const errorMessages: Record<string, { tr: string; en: string }> = {
  insufficient_funds: {
    tr: 'Kartınızda yeterli bakiye bulunmuyor.',
    en: 'Insufficient funds.',
  },
  card_declined: {
    tr: 'Kartınız reddedildi.',
    en: 'Card declined.',
  },
  '3ds_failed': {
    tr: '3D Secure doğrulaması başarısız.',
    en: '3D Secure verification failed.',
  },
  expired_card: {
    tr: 'Kartınızın süresi dolmuş.',
    en: 'Card has expired.',
  },
  amount_mismatch: {
    tr: 'Ödeme tutarında uyuşmazlık.',
    en: 'Payment amount mismatch.',
  },
  provider_unavailable: {
    tr: 'Ödeme sağlayıcısına ulaşılamıyor.',
    en: 'Payment provider unavailable.',
  },
  payment_expired: {
    tr: 'Ödeme süresi doldu, lütfen tekrar deneyin.',
    en: 'Payment expired.',
  },
  payment_failed: {
    tr: 'Ödeme başarısız, lütfen tekrar deneyin.',
    en: 'Payment failed, please try again.',
  },
  default: {
    tr: 'Bir hata oluştu, lütfen tekrar deneyin.',
    en: 'An error occurred, please try again.',
  },
};

export function getPaymentErrorMessage(errorCode?: string): string {
  const lang = navigator.language.startsWith('tr') ? 'tr' : 'en';
  const key = errorCode ?? 'default';
  return errorMessages[key]?.[lang] ?? errorMessages['default'][lang];
}
