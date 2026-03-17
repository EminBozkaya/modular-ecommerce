import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ChevronRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CategoryTreeNode } from './CategoryNavDropdownItem';

interface AccordionProps {
    node: CategoryTreeNode;
    closeDrawer: () => void;
    level?: number;
}

function MobileCategoryAccordion({ node, closeDrawer, level = 0 }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = node.subCategories.length > 0;
    
    // Girinti derinliği: Her seviye için ekstra 1rem padding-left eklenecek
    const basePadding = 1.25; // px-5 = 1.25rem
    const paddingLeft = `${basePadding + level}rem`;

    if (!hasChildren) {
        return (
            <li className={cn(level === 0 ? "border-b border-border/50 last:border-0" : "")}>
                <Link
                    to={`/products?categoryId=${node.category.id}`}
                    onClick={closeDrawer}
                    style={{ paddingLeft, paddingRight: '1.25rem' }}
                    className="flex items-center py-3.5 text-sm font-medium text-foreground hover:bg-accent hover:text-[var(--brand-primary)] transition-colors"
                >
                    {/* Ok kadar boşluk bırakıldı, hizalama korunsun diye */}
                    <div className="w-4 mr-2 flex-shrink-0" />
                    <span className={level === 0 ? "font-semibold" : ""}>{node.category.name}</span>
                </Link>
            </li>
        );
    }

    return (
        <li className={cn(level === 0 ? "border-b border-border/50 last:border-0" : "")}>
            {/* Accordion başlık */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                style={{ paddingLeft, paddingRight: '1.25rem' }}
                className="flex items-center w-full py-3.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
                <ChevronRight 
                    className={cn(
                        "h-4 w-4 text-muted-foreground flex-shrink-0 mr-2 transition-transform duration-200",
                        isOpen && "rotate-90"
                    )} 
                />
                <span className={level === 0 ? "font-semibold" : ""}>{node.category.name}</span>
            </button>

            {/* Alt kategoriler */}
            {isOpen && (
                <ul className="bg-gray-50/70 dark:bg-white/5 border-t border-border/30">
                    {node.subCategories.map((childNode) => (
                        <MobileCategoryAccordion
                            key={childNode.category.id}
                            node={childNode}
                            closeDrawer={closeDrawer}
                            level={level + 1}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

interface Props {
    tree: CategoryTreeNode[];
}

export function MobileCategoryDrawer({ tree }: Props) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const close = () => setDrawerOpen(false);

    return (
        <>
            {/* Hamburger butonu — sadece mobil/tablet */}
            <button
                id="mobile-category-menu-btn"
                type="button"
                aria-label="Kategoriler menüsünü aç"
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full bg-card/80 shadow-sm border border-border text-foreground hover:text-[var(--brand-primary)] transition-colors"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Drawer ve Backdrop (Portal ile doğrudan <body> içine render edilir, böylece üstte kalır) */}
            {typeof document !== 'undefined' && createPortal(
                <div 
                    className={cn(
                        "fixed inset-0 z-[10000] lg:hidden",
                        drawerOpen ? "pointer-events-auto" : "pointer-events-none"
                    )}
                >
                    {/* Backdrop */}
                    <div
                        aria-hidden="true"
                        className={cn(
                            "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
                            drawerOpen ? "opacity-100" : "opacity-0"
                        )}
                        onClick={close}
                    />

                    {/* Drawer */}
                    <aside
                        aria-label="Kategoriler"
                        className={cn(
                            'absolute top-0 left-0 h-full w-72 max-w-[85vw]',
                            'bg-card shadow-2xl flex flex-col',
                            'transform transition-transform duration-300 ease-in-out',
                            drawerOpen ? 'translate-x-0' : '-translate-x-full',
                        )}
                    >
                        {/* Drawer başlık */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
                            <span className="font-semibold text-base text-foreground">Kategoriler</span>
                            <button
                                type="button"
                                aria-label="Menüyü kapat"
                                onClick={close}
                                className="p-1.5 rounded-full hover:bg-accent text-muted-foreground transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Kategori listesi (Özyinelemeli — Recursive) */}
                        <ul className="flex-1 overflow-y-auto py-2">
                            {tree.map((node) => (
                                <MobileCategoryAccordion
                                    key={node.category.id}
                                    node={node}
                                    closeDrawer={close}
                                />
                            ))}
                        </ul>
                    </aside>
                </div>,
                document.body
            )}
        </>
    );
}
