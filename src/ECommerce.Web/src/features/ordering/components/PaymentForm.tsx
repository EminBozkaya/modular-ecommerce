import { useState, useEffect } from 'react';

interface PaymentData {
    cardHolderName: string;
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
}

interface PaymentFormProps {
    disabled?: boolean;
    onChange: (data: PaymentData) => void;
    clearTrigger?: number;
}

function maskCardNumber(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    if (digits.length <= 4) return digits;

    const masked = digits.slice(0, -4).replace(/./g, '*') + digits.slice(-4);
    return masked.replace(/(.{4})/g, '$1 ').trim();
}

function formatCardInput(value: string): string {
    return value.replace(/\D/g, '').slice(0, 16);
}

export function PaymentForm({ disabled, onChange, clearTrigger }: PaymentFormProps) {
    const [cardHolderName, setCardHolderName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvv, setCvv] = useState('');

    useEffect(() => {
        if (clearTrigger !== undefined && clearTrigger > 0) {
            setCardHolderName('');
            setCardNumber('');
            setExpiryMonth('');
            setExpiryYear('');
            setCvv('');
        }
    }, [clearTrigger]);

    useEffect(() => {
        onChange({
            cardHolderName,
            cardNumber,
            expiryMonth,
            expiryYear,
            cvv,
        });
    }, [cardHolderName, cardNumber, expiryMonth, expiryYear, cvv, onChange]);

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Odeme Bilgileri</h3>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                    Kart Uzerindeki Isim <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    disabled={disabled}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted"
                    placeholder="ALI YILMAZ"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                    Kart Numarasi <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={maskCardNumber(cardNumber)}
                    onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
                    disabled={disabled}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted"
                    placeholder="**** **** **** 1234"
                    maxLength={19}
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Ay <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={expiryMonth}
                        onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                        disabled={disabled}
                        className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted"
                        placeholder="MM"
                        maxLength={2}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Yil <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={expiryYear}
                        onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        disabled={disabled}
                        className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted"
                        placeholder="YYYY"
                        maxLength={4}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        CVV <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        disabled={disabled}
                        className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:bg-muted"
                        placeholder="***"
                        maxLength={4}
                    />
                </div>
            </div>
        </div>
    );
}
