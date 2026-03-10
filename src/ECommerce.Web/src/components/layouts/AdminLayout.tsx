import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingBag,
    Users,
    ArrowLeft,
    Leaf,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import React, { useState } from 'react';

const navLinks = [
    { to: '/admin', label: 'Kontrol Paneli', icon: LayoutDashboard, exact: true },
    { to: '/admin/products', label: 'Ürünler', icon: Package, exact: false },
    { to: '/admin/categories', label: 'Kategoriler', icon: FolderTree, exact: false },
    { to: '/admin/orders', label: 'Siparişler', icon: ShoppingBag, exact: false },
    { to: '/admin/users', label: 'Müşteriler', icon: Users, exact: false },
];

export function AdminLayout() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isActive = (to: string, exact: boolean) =>
        exact ? location.pathname === to : location.pathname.startsWith(to);

    return (
        <div className="h-screen flex overflow-hidden" style={{ background: '#f4f6f8' }}>
            {/* ── Sidebar ── */}
            <aside
                className={`${isCollapsed ? 'w-20' : 'w-64'} flex-shrink-0 flex flex-col shadow-xl transition-all duration-300 ease-in-out relative`}
                style={{ background: 'linear-gradient(180deg, #1B5E3F 0%, #164A32 100%)' }}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors z-50 text-[#1B5E3F]"
                    style={{ border: '1px solid #e5e7eb' }}
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
                <div
                    className="px-5 py-5 flex items-center gap-3 overflow-hidden whitespace-nowrap"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}
                >
                    <div
                        className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.15)' }}
                    >
                        <Leaf className="h-5 w-5 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div className="transition-opacity duration-300">
                            <div className="text-white font-bold text-base leading-tight">Ebrar Kuruyemiş</div>
                            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Yönetim Paneli</div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                    {navLinks.map((link) => {
                        const active = isActive(link.to, link.exact);
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap`}
                                title={isCollapsed ? link.label : ""}
                                style={{
                                    background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                                    color: active ? '#ffffff' : 'rgba(255,255,255,0.7)',
                                    boxShadow: active ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
                                }}
                                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                    if (!active) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.color = '#ffffff';
                                    }
                                }}
                                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                    if (!active) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                                    }
                                }}
                            >
                                <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                                {!isCollapsed && <span>{link.label}</span>}
                            </Link>
                        );
                    })}

                    {/* Separator and Return to Store Button */}
                    <div className="my-2 px-1">
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.12)' }} />
                    </div>

                    <Link
                        to="/"
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap`}
                        title={isCollapsed ? "Mağazaya Dön" : ""}
                        style={{ color: 'rgba(255,255,255,0.6)' }}
                        onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                        }}
                        onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                            e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <ArrowLeft className="h-[18px] w-[18px] flex-shrink-0" />
                        {!isCollapsed && <span>Mağazaya Dön</span>}
                    </Link>
                </nav>


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
