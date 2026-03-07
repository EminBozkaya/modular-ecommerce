import { Outlet, Link } from 'react-router-dom';

export function AdminLayout() {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-4 font-bold text-lg border-b border-slate-700">Admin Panel</div>
                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <Link to="/admin" className="p-2 hover:bg-slate-800 rounded">Dashboard</Link>
                    <Link to="/admin/products" className="p-2 hover:bg-slate-800 rounded">Products</Link>
                    <Link to="/admin/orders" className="p-2 hover:bg-slate-800 rounded">Orders</Link>
                    <hr className="border-slate-700 my-2" />
                    <Link to="/" className="p-2 hover:bg-slate-800 rounded">Back to Store</Link>
                </nav>
            </aside>
            <main className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
                    <div className="text-lg font-medium">Administration</div>
                </header>
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
