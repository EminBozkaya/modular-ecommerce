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
const AdminDashboardPage = lazy(() => import('../../features/admin/pages/AdminDashboardPage'));
const AdminProductsPage = lazy(() => import('../../features/admin/products/pages/AdminProductsPage'));
const AdminOrdersPage = lazy(() => import('../../features/admin/orders/pages/AdminOrdersPage'));

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
                        path: 'orders',
                        element: (
                            <SuspenseWrapper>
                                <AdminOrdersPage />
                            </SuspenseWrapper>
                        ),
                    },
                ],
            },
        ],
    },
]);

