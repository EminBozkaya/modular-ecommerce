import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function IyzicoPaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoadedRef = useRef(false);

    const { htmlContent, orderId } = (location.state as { htmlContent?: string; orderId?: string }) || {};

    useEffect(() => {
        if (!htmlContent || !orderId) {
            navigate('/checkout?error=invalid_payment_session');
            return;
        }

        if (scriptLoadedRef.current || !containerRef.current) return;
        scriptLoadedRef.current = true;

        // Clear container
        containerRef.current.innerHTML = '';

        // Create a range to parse the HTML string and execute scripts
        const range = document.createRange();
        range.selectNode(containerRef.current);
        const documentFragment = range.createContextualFragment(htmlContent);
        
        containerRef.current.appendChild(documentFragment);
    }, [htmlContent, orderId, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-background py-12">
            <div className="container mx-auto max-w-3xl px-4">
                <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                    <div className="mb-8 text-center">
                        <h1 className="text-xl font-bold text-foreground">Güvenli Ödeme</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Iyzico güvenli ödeme sistemine yönlendiriliyorsunuz...
                        </p>
                    </div>

                    {/* Iyzico will inject its form into this container or wherever its script specifies */}
                    <div ref={containerRef} id="iyzipay-checkout-form" className="responsive min-h-[400px]">
                        {!htmlContent && (
                            <div className="flex items-center justify-center py-20">
                                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--brand-primary)] border-t-transparent" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
