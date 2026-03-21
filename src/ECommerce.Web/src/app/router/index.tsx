import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from './ProtectedRoute';
import { MainLayout } from '../../components/layouts/MainLayout';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { LoadingSpinner } from '../../components/shared/LoadingSpinner';

// Lazy loading feature pages
const StorefrontHomePage = lazy(() => import('../../features/catalog/pages/StorefrontHomePage'));
const ProductListPage = lazy(() => import('../../features/catalog/pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('../../features/catalog/pages/ProductDetailPage'));
const BasketPage = lazy(() => import('../../features/basket/pages/BasketPage'));
const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../../features/auth/pages/RegisterPage'));
const CheckoutPage = lazy(() => import('../../features/ordering/pages/CheckoutPage'));
const OrderHistoryPage = lazy(() => import('../../features/ordering/pages/OrderHistoryPage'));
const OrderDetailPage = lazy(() => import('../../features/ordering/pages/OrderDetailPage'));
const OrderConfirmationPage = lazy(() => import('../../features/ordering/pages/OrderConfirmationPage'));
const AdminDashboardPage = lazy(() => import('../../features/admin/pages/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('../../features/admin/products/pages/AdminProductsPage'));
const AdminOrdersPage = lazy(() => import('../../features/admin/orders/pages/AdminOrdersPage'));
const AdminCategoriesPage = lazy(() => import('../../features/admin/categories/pages/AdminCategoriesPage'));
const AdminOrderDetailPage = lazy(() => import('../../features/admin/orders/pages/AdminOrderDetailPage'));
const AdminUsersPage = lazy(() => import('../../features/admin/pages/AdminUsersPage'));
const AdminAddressesPage = lazy(() => import('../../features/admin/pages/AdminAddressesPage'));
const AdminSettingsPlaceholderPage = lazy(() => import('../../features/admin/pages/AdminSettingsPlaceholderPage'));
const AdminBrandDesignPage = lazy(() => import('../../features/admin/pages/AdminBrandDesignPage'));
const AdminBackgroundPage = lazy(() => import('../../features/admin/pages/AdminBackgroundPage'));
const AdminBannerPage = lazy(() => import('../../features/admin/pages/AdminBannerPage'));
const AdminColorsPage = lazy(() => import('../../features/admin/pages/AdminColorsPage'));
const AdminHeroCarouselPage = lazy(() => import('../../features/admin/pages/AdminHeroCarouselPage'));
const AdminNavOrderPage = lazy(() => import('../../features/admin/pages/AdminNavOrderPage'));
const AdminShowcasePage = lazy(() => import('../../features/admin/pages/AdminShowcasePage'));
const AdminFooterPage = lazy(() => import('../../features/admin/pages/AdminFooterPage'));
const FavoritesPage = lazy(() => import('../../features/favorites/pages/FavoritesPage'));
const PaymentWaitingPage = lazy(() => import('../../features/ordering/pages/PaymentWaitingPage'));
const ProfilePage = lazy(() => import('../../features/auth/pages/ProfilePage'));
const AddressesPage = lazy(() => import('../../features/auth/pages/AddressesPage'));
const IyzicoPaymentPage = lazy(() => import('../../features/ordering/pages/IyzicoPaymentPage'));
const SocialCallbackPage = lazy(() => import('../../features/auth/pages/SocialCallbackPage'));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
    <Suspense
        fallback={
            <div className="flex h-[50vh] items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        }
    >
        {children}
    </Suspense>
);

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: (
                    <SuspenseWrapper>
                        <StorefrontHomePage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'products',
                element: (
                    <SuspenseWrapper>
                        <ProductListPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'products/:id',
                element: (
                    <SuspenseWrapper>
                        <ProductDetailPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'basket',
                element: (
                    <SuspenseWrapper>
                        <BasketPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'payment/waiting',
                element: (
                    <SuspenseWrapper>
                        <PaymentWaitingPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'favoriler',
                element: (
                    <SuspenseWrapper>
                        <FavoritesPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'login',
                element: (
                    <SuspenseWrapper>
                        <LoginPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'register',
                element: (
                    <SuspenseWrapper>
                        <RegisterPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'auth/social/callback',
                element: (
                    <SuspenseWrapper>
                        <SocialCallbackPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'checkout',
                element: (
                    <SuspenseWrapper>
                        <CheckoutPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'orders/:id',
                element: (
                    <SuspenseWrapper>
                        <OrderDetailPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'payment/iyzico',
                element: (
                    <SuspenseWrapper>
                        <IyzicoPaymentPage />
                    </SuspenseWrapper>
                ),
            },
            {
                path: 'orders/:id/confirmation',
                element: (
                    <SuspenseWrapper>
                        <OrderConfirmationPage />
                    </SuspenseWrapper>
                ),
            },
        ],
    },
    // Protected ordering routes
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: 'orders',
                        element: (
                            <SuspenseWrapper>
                                <OrderHistoryPage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'profil',
                        element: (
                            <SuspenseWrapper>
                                <ProfilePage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'adreslerim',
                        element: (
                            <SuspenseWrapper>
                                <AddressesPage />
                            </SuspenseWrapper>
                        ),
                    },
                ],
            },
        ],
    },
    {
        path: '/admin',
        element: <ProtectedRoute allowedRoles={['Admin']} />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: (
                            <SuspenseWrapper>
                                <AdminDashboardPage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'products',
                        element: (
                            <SuspenseWrapper>
                                <AdminProductsPage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'categories',
                        element: (
                            <SuspenseWrapper>
                                <AdminCategoriesPage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'orders',
                        element: (
                            <SuspenseWrapper>
                                <AdminOrdersPage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'orders/:id',
                        element: (
                            <SuspenseWrapper>
                                <AdminOrderDetailPage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'users',
                        element: (
                            <SuspenseWrapper>
                                <AdminUsersPage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'addresses',
                        element: (
                            <SuspenseWrapper>
                                <AdminAddressesPage />
                            </SuspenseWrapper>
                        ),
                    },
                    // ── Settings Routes ──────────────────────────────
                    {
                        path: 'settings/payment',
                        element: (
                            <SuspenseWrapper>
                                <AdminSettingsPlaceholderPage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'settings/shipping',
                        element: (
                            <SuspenseWrapper>
                                <AdminSettingsPlaceholderPage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'settings/design/logo',
                        element: (
                            <SuspenseWrapper>
                                <AdminBrandDesignPage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'settings/design/background',
                        element: (
                            <SuspenseWrapper>
                                <AdminBackgroundPage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'settings/design/banner',
                        element: (
                            <SuspenseWrapper>
                                <AdminBannerPage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'settings/design/colors',
                        element: (
                            <SuspenseWrapper>
                                <AdminColorsPage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'settings/design/hero',
                        element: (
                            <SuspenseWrapper>
                                <AdminHeroCarouselPage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'settings/design/nav',
                        element: (
                            <SuspenseWrapper>
                                <AdminNavOrderPage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'settings/design/banners',
                        element: (
                            <SuspenseWrapper>
                                <AdminShowcasePage />
                            </SuspenseWrapper>
                        ),
                    },
                    {
                        path: 'settings/design/footer',
                        element: (
                            <SuspenseWrapper>
                                <AdminFooterPage />
                            </SuspenseWrapper>
                        ),
                    },
                ],
            },
        ],
    },
]);
