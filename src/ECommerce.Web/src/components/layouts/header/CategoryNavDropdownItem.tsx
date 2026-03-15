import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category } from '@/features/catalog/types/product';

export interface CategoryTreeNode {
    category: Category;
    subCategories: CategoryTreeNode[];
}

interface Props {
    node: CategoryTreeNode;
    isStuck: boolean;
}

// ── Alt Kategoriler için (Sağa açılan / Uçan Flyout Menü) ──────────────
function FlyoutSubMenu({ node, level, closeAll }: { node: CategoryTreeNode; level: number; closeAll: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [openDirection, setOpenDirection] = useState<'right' | 'left'>('right');
    const liRef = useRef<HTMLLIElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasChildren = node.subCategories.length > 0;

    useEffect(() => {
        if (isOpen && liRef.current) {
            const rect = liRef.current.getBoundingClientRect();
            const menuWidth = 220; // min-w-[220px]
            // Eğer sağda yer yoksa sola açıl
            if (rect.right + menuWidth > window.innerWidth) {
                setOpenDirection('left');
            } else {
                setOpenDirection('right');
            }
        }
    }, [isOpen]);

    const handleMouseEnter = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) return; // Yalnızca masaüstünde hover
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        // Çapraz (diagonal) geçişlerde yanlışlıkla alt kategorilerin açılmasını (açılıp ana menüyü ezmesini) engellemek için açılma gecikmesi eklendi
        timeoutRef.current = setTimeout(() => setIsOpen(true), 200);
    };

    const handleMouseLeave = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) return; // Yalnızca masaüstünde hover
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        // Fare menüden çıkarken/çapraz geçerken hemen kapanmasını engellemek için kapanma toleransı. (Açılma gecikmesi ile senkronize edildi)
        timeoutRef.current = setTimeout(() => setIsOpen(false), 500);
    };

    if (!hasChildren) {
        return (
            <li>
                <Link
                    to={`/products?categoryId=${node.category.id}`}
                    onClick={closeAll}
                    className="block px-4 py-2 text-[13px] text-foreground hover:bg-gray-100 hover:text-[var(--color-ebrar-green)] transition-colors"
                >
                    {node.category.name}
                </Link>
            </li>
        );
    }

    return (
        <li
            ref={liRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsOpen((prev) => !prev);
                }}
                className={cn(
                    "w-full flex items-center justify-between px-4 py-2 cursor-pointer group transition-colors text-left",
                    isOpen ? "bg-gray-50" : "hover:bg-gray-100"
                )}
            >
                <span className={cn(
                    "flex-1 text-[13px] transition-colors",
                    isOpen ? "text-[var(--color-ebrar-green)] font-semibold" : "text-foreground group-hover:text-[var(--color-ebrar-green)]"
                )}>
                    {node.category.name}
                </span>
                <ChevronRight className={cn(
                    "h-3.5 w-3.5 text-muted-foreground group-hover:text-[var(--color-ebrar-green)] ml-2 transition-transform",
                    isOpen && "rotate-90"
                )} />
            </button>

            {isOpen && (
                <ul className={cn(
                    "absolute top-[34px] min-w-[220px] bg-white border border-border/60 shadow-lg py-1 rounded-md z-50 animate-in fade-in duration-200",
                    openDirection === 'right' ? "left-full ml-1 slide-in-from-left-2" : "right-full mr-1 slide-in-from-right-2"
                )}>
                    {node.subCategories.map((childNode) => (
                        <FlyoutSubMenu key={childNode.category.id} node={childNode} level={level + 1} closeAll={closeAll} />
                    ))}
                </ul>
            )}
        </li>
    );
}


// ── Kök (Root) Menü Öğesi (Aşağıya açılan Portal Menü) ────────────
export function CategoryNavDropdownItem({ node, isStuck }: Props) {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const hasChildren = node.subCategories.length > 0;

    const updateRect = () => {
        if (buttonRef.current) {
            setRect(buttonRef.current.getBoundingClientRect());
        }
    };

    const handleMouseEnter = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) return; // Yalnızca masaüstünde hover
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        timeoutRef.current = setTimeout(() => {
            if (!open) updateRect();
            setOpen(true);
        }, 150); // Ana/kök menüde açılma gecikmesi (hızlı geçişlerde kazara açılmaları önler)
    };

    const handleMouseLeave = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) return; // Yalnızca masaüstünde hover
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        timeoutRef.current = setTimeout(() => {
            setOpen(false);
        }, 500);
    };

    const toggleOpen = (e?: React.MouseEvent) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        if (!open) {
            updateRect();
        }
        setOpen((prev) => !prev);
    };

    const closeAll = () => {
        setOpen(false);
    };

    // Dışarı tıklanınca kapanması için dinleyici (Click Outside)
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (open) {
                // Portal body'de render edildiği için event hedefinin kategori kapsayıcısı olup olmadığını kontrol etmek yerine
                // Doğrudan kendi düğmemize basılmadığından emin oluyoruz (Tıklanan element portalın içi de olabilir o yüzden e.stopPropagation() içeriğinde bırakıldı).
                // Yani boşluğa basılınca burası tetiklenir ve kapanır.
                const target = event.target as Node;
                if (buttonRef.current && !buttonRef.current.contains(target)) {
                     // Portal içindeki menüye mi tıkladı? -> FlyoutSubMenu içindeki tıklamalar event bubble ile durdurulur veya closeAll tetikler.
                     // Aksi takdirde boş alandır.
                     setOpen(false);
                }
            }
        };

        if (open) {
            // timeout koyularak button'un onClick'i ile event çakışması önlenir
            setTimeout(() => {
                window.addEventListener('scroll', updateRect, true);
                window.addEventListener('resize', updateRect);
                document.addEventListener('click', handleClickOutside);
            }, 0);
        }

        return () => {
            window.removeEventListener('scroll', updateRect, true);
            window.removeEventListener('resize', updateRect);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [open]);

    const navLinkCls = cn(
        'group inline-flex h-[50px] w-max items-center justify-center rounded-sm bg-transparent px-4 py-2 text-[14px] font-medium transition-colors hover:bg-transparent focus:bg-transparent focus:outline-none disabled:pointer-events-none select-none cursor-pointer',
        isStuck
            ? 'text-white hover:text-white/80 focus:text-white/80'
            : 'text-foreground hover:text-[var(--color-ebrar-green)] focus:text-[var(--color-ebrar-green)]',
        open && 'bg-white/10'
    );

    if (!hasChildren) {
        return (
            <li className="flex-shrink-0 flex items-center">
                <Link to={`/products?categoryId=${node.category.id}`} className={navLinkCls}>
                    {node.category.name}
                </Link>
            </li>
        );
    }

    return (
        <li
            className="flex-shrink-0 flex items-center relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <button
                ref={buttonRef}
                type="button"
                aria-haspopup="true"
                aria-expanded={open}
                className={navLinkCls}
                onClick={toggleOpen}
            >
                {node.category.name}
                <ChevronDown className={cn(
                    "ml-1.5 h-3.5 w-3.5 transition-transform duration-200",
                    // Masaüstü (lg) ekranlarda fare üzerine gelince 'rotate-180' döner.
                    // Diğer ekranlarda (tablet vb) veya tıklanıp menü açık olduğunda 'rotate-180' döner.
                    open ? "rotate-180" : "lg:group-hover:rotate-180"
                )} />
            </button>

            {/* İlk basamak (Dropdown) portal ile basılır */}
            {open && typeof document !== 'undefined' && createPortal(
                <div
                    onClick={(e) => e.stopPropagation()} // Portal menüsünün içine tıklanınca dışarıyı tetikleyip kapatmasını engeller
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        position: 'fixed',
                        top: rect ? rect.bottom : 0,
                        // Ekranın sağına taşmayı önlemek için akıllı hizalama
                        left: rect ? Math.min(rect.left, window.innerWidth - 230) : 0, 
                    }}
                    className="z-[200] pt-1" // Düğmenin 1px altına
                >
                    <ul className="min-w-[220px] rounded-md border border-border/60 bg-white shadow-xl py-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {node.subCategories.map((childNode) => (
                            <FlyoutSubMenu key={childNode.category.id} node={childNode} level={1} closeAll={closeAll} />
                        ))}
                    </ul>
                </div>,
                document.body
            )}
        </li>
    );
}
