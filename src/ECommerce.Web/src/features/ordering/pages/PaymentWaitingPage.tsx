import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPaymentReturnStatus } from '../api/paymentApi';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const POLL_INTERVAL_MS = 3000;
const MAX_ATTEMPTS = 5;

export default function PaymentWaitingPage() {
    const { t } = useTranslation('checkout');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get('orderId');
    const [timedOut, setTimedOut] = useState(false);
    const [pollError, setPollError] = useState(false);
    const attemptsRef = useRef(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!orderId) {
            navigate('/checkout?error=missing_order_id');
            return;
        }

        // Mock mode: orderId comes with ?mock=true — simulate quick success
        const isMockSuccess = searchParams.get('mock') === 'true';
        if (isMockSuccess) {
            timerRef.current = setTimeout(() => {
                navigate(`/orders/${orderId}/confirmation`);
            }, 1500);
            return () => {
                if (timerRef.current) clearTimeout(timerRef.current);
            };
        }

        const poll = async () => {
            attemptsRef.current += 1;
            try {
                const status = await getPaymentReturnStatus(orderId);

                if (status.isTerminal) {
                    if (status.status === 'Completed') {
                        navigate(`/orders/${orderId}/confirmation`);
                    } else {
                        navigate(`/checkout?error=payment_failed&orderId=${orderId}`);
                    }
                    return;
                }

                if (attemptsRef.current >= MAX_ATTEMPTS) {
                    setTimedOut(true);
                    return;
                }

                timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
            } catch {
                setPollError(true);
            }
        };

        timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [orderId, navigate, searchParams]);

    if (timedOut) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <div className="max-w-md space-y-4">
                    <p className="text-lg font-semibold text-gray-800">
                        {t('waiting.titleTimeout')}
                    </p>
                    <p className="text-sm text-gray-500">
                        {t('waiting.descTimeout')}
                    </p>
                    <Link
                        to="/orders"
                        className="inline-block rounded-md bg-[var(--color-ebrar-green)] px-6 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ebrar-green-dark)] transition-colors"
                    >
                        {t('waiting.goToOrders')}
                    </Link>
                </div>
            </div>
        );
    }

    if (pollError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                <div className="max-w-md space-y-4">
                    <p className="text-lg font-semibold text-gray-800">
                        {t('waiting.titleError')}
                    </p>
                    <p className="text-sm text-gray-500">
                        {t('waiting.descError')}
                    </p>
                    <Link
                        to="/orders"
                        className="inline-block rounded-md bg-[var(--color-ebrar-green)] px-6 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ebrar-green-dark)] transition-colors"
                    >
                        {t('waiting.goToOrders')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-lg font-semibold text-gray-800">{t('waiting.titleProcessing')}</p>
                <p className="text-sm text-gray-500">{t('waiting.descProcessing')}</p>
            </div>
        </div>
    );
}
