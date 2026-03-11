import { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/features/auth/hooks/useLogout';
import {
    LogOut, Settings, LayoutDashboard, UserCircle,
    MapPin as MapPinIcon, ShoppingBag,
} from 'lucide-react';

export function UserMenu() {
    const { isAuthenticated, user, isAuthLoading } = useAuthStore();
    const { mutate: logout } = useLogout();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const userInitials = user?.fullName
        ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2)
        : '??';

    if (isAuthLoading) return null;

    if (!isAuthenticated) {
        return (
            <div className="flex items-center gap-4">
                <Link
                    to="/login"
                    className="text-sm font-semibold text-foreground hover:text-[var(--color-ebrar-green)] transition-all"
                >
                    Giris
                </Link>
                <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-bold text-white bg-[var(--color-ebrar-green)] rounded-full hover:bg-[var(--color-ebrar-green-dark)] shadow-md transition-all active:scale-95"
                >
                    Kayit Ol
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center group relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-[var(--color-ebrar-green)] text-white font-bold text-sm border-2 border-white shadow-md hover:bg-[var(--color-ebrar-green-dark)] transition-all duration-200"
                title={user?.fullName}
            >
                {userInitials}
            </button>
            <span className="text-[11px] font-bold text-muted-foreground group-hover:text-[var(--color-ebrar-green)] mt-1 transition-colors">
                Hesabım
            </span>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-border py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-border mb-1">
                        <p className="text-sm font-bold text-foreground truncate">{user?.fullName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                        {user?.role === 'Admin' && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                                Yonetici
                            </span>
                        )}
                    </div>
                    <div className="py-1">
                        {user?.role === 'Admin' && (
                            <Link
                                to="/admin"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors"
                            >
                                <LayoutDashboard className="h-4 w-4 text-blue-600" />
                                Admin Paneli
                            </Link>
                        )}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors text-left"
                        >
                            <UserCircle className="h-4 w-4 text-muted-foreground" />
                            Profil Bilgileri
                        </button>
                        <button
                            onClick={() => { setIsOpen(false); navigate('/orders'); }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors text-left"
                        >
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            Siparislerim
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors text-left"
                        >
                            <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                            Adreslerim
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-gray-50 transition-colors text-left"
                        >
                            <Settings className="h-4 w-4 text-muted-foreground" />
                            Ayarlar
                        </button>
                    </div>
                    <div className="mt-1 pt-1 border-t border-border">
                        <button
                            onClick={() => { setIsOpen(false); logout(); }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left disabled:opacity-50"
                        >
                            <LogOut className="h-4 w-4" />
                            Guvenli Cikis
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
