import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingBag,
    ArrowLeft,
    Leaf,
} from 'lucide-react';

const navLinks = [
    { to: '/admin', label: 'Kontrol Paneli', icon: LayoutDashboard, exact: true },
    { to: '/admin/products', label: 'Ürünler', icon: Package, exact: false },
    { to: '/admin/categories', label: 'Kategoriler', icon: FolderTree, exact: false },
    { to: '/admin/orders', label: 'Siparişler', icon: ShoppingBag, exact: false },
];

export function AdminLayout() {
    const location = useLocation();

    const isActive = (to: string, exact: boolean) =>
        exact ? location.pathname === to : location.pathname.startsWith(to);

    return (
        <div className="min-h-screen flex" style={{ background: '#f4f6f8' }}>
            {/* ── Sidebar ── */}
            <aside
                className="w-64 flex flex-col shadow-xl"
                style={{ background: 'linear-gradient(180deg, #1B5E3F 0%, #164A32 100%)' }}
            >
                {/* Brand */}
                <div
                    className="px-5 py-5 flex items-center gap-3"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}
                >
                    <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.15)' }}
                    >
                        <Leaf className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <div className="text-white font-bold text-base leading-tight">Ebrar Kuruyemiş</div>
                        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Yönetim Paneli</div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
                    {navLinks.map((link) => {
                        const active = isActive(link.to, link.exact);
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                                style={{
                                    background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                                    color: active ? '#ffffff' : 'rgba(255,255,255,0.7)',
                                    boxShadow: active ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                                }}
                                onMouseEnter={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.color = '#ffffff';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                    }
                                }}
                            >
                                <Icon className="h-[18px] w-[18px]" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Back to Store */}
                <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-2.5 mt-3 rounded-lg text-sm font-medium transition-colors duration-200"
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <ArrowLeft className="h-[18px] w-[18px]" />
                        Mağazaya Dön
                    </Link>
                </div>
            </aside>

            {/* ── Main Content ── */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header
                    className="h-16 bg-white px-6 flex items-center justify-between flex-shrink-0"
                    style={{ borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                >
                    <div className="text-lg font-semibold" style={{ color: '#1B5E3F' }}>
                        Yönetim
                    </div>
                </header>
                <div className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
