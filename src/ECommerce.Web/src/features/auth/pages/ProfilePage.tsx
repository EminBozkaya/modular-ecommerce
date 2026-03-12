import { useAuthStore } from '@/store/authStore';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuthStore();
    
    // Split full name for the form if possible
    const nameParts = user?.fullName?.split(' ') || ['', ''];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 rounded-2xl bg-[var(--color-ebrar-green)] flex items-center justify-center text-white shadow-lg">
                        <User className="h-8 w-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 font-serif">Profil <span className="text-[var(--color-ebrar-green)]">Bilgilerim</span></h1>
                        <p className="text-sm text-muted-foreground">Hesap bilgilerinizi buradan görüntüleyebilir ve güncelleyebilirsiniz.</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Ad</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            defaultValue={firstName}
                                            className="block w-full rounded-xl border-gray-200 bg-gray-50/50 pl-11 py-3 text-sm focus:ring-2 focus:ring-[var(--color-ebrar-green)] focus:bg-white transition-all outline-none border"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Soyad</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            defaultValue={lastName}
                                            className="block w-full rounded-xl border-gray-200 bg-gray-50/50 pl-11 py-3 text-sm focus:ring-2 focus:ring-[var(--color-ebrar-green)] focus:bg-white transition-all outline-none border"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">E-posta Adresi</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        defaultValue={user?.email}
                                        disabled
                                        className="block w-full rounded-xl border-gray-100 bg-gray-50 pl-11 py-3 text-sm text-gray-500 cursor-not-allowed border"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-400 ml-1">E-posta adresi güvenliğiniz için değiştirilemez.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Telefon Numarası</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="05XX XXX XX XX"
                                        className="block w-full rounded-xl border-gray-200 bg-gray-50/50 pl-11 py-3 text-sm focus:ring-2 focus:ring-[var(--color-ebrar-green)] focus:bg-white transition-all outline-none border"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="button"
                                    className="w-full bg-[var(--color-ebrar-green)] text-white font-bold py-4 rounded-2xl shadow-lg shadow-green-900/10 hover:bg-[var(--color-ebrar-green-dark)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <ShieldCheck className="h-5 w-5" />
                                    Bilgilerimi Güncelle
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
