import { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

// ---------------------------------------------------------------------------
// Brand splash images
// Resolved at build time by Vite. Returns an empty object if the folder does
// not exist — the white-label repo ships with no files here and falls back to
// the default spinner automatically.
//
// To activate the branded splash:
//   1. Create  src/assets/brand/splash/  (gitignored)
//   2. Drop your PNG/WEBP icon images in that folder (name them 1.png … N.png)
//   3. Set  VITE_SPLASH_BG_COLOR="#your-hex"  in .env.development.local
// ---------------------------------------------------------------------------
const brandSplashModules = import.meta.glob<{ default: string }>(
    '/src/assets/brand/splash/*.{png,jpg,jpeg,webp}',
    { eager: true },
);

// Sort numerically by filename so 1.png < 2.png < … < 15.png
const BRAND_IMAGES: string[] = Object.entries(brandSplashModules)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([, m]) => m.default);

const SPLASH_BG = import.meta.env.VITE_SPLASH_BG_COLOR ?? '#ffffff';
const BOUNCE_MS = 1500;  // duration of the bounce animation on image #1
const DISPLAY_MS = 300;  // ms each cycling image stays fully visible
const FADE_MS = 100;  // fade-out / fade-in duration

// One-shot bounce keyframe — injected into the document once
const BOUNCE_KEYFRAMES = `
@keyframes splashBounce {
  0%   { transform: translateY(0)    scale(1);    }
  22%  { transform: translateY(-22px) scale(1.08); }
  45%  { transform: translateY(0)    scale(1);    }
  65%  { transform: translateY(-12px) scale(1.04); }
  82%  { transform: translateY(0)    scale(1);    }
  100% { transform: translateY(0)    scale(1);    }
}
`;

// ---------------------------------------------------------------------------

type Phase = 'bounce' | 'cycle';

export function SplashScreen() {
    const [index, setIndex] = useState(0);
    const [fading, setFading] = useState(false);
    const [phase, setPhase] = useState<Phase>('bounce');

    // ── Phase 1: show image 0 with bounce, then hand off to cycle ──────────
    useEffect(() => {
        if (BRAND_IMAGES.length === 0 || phase !== 'bounce') return;

        const bounceEnd = setTimeout(() => {
            if (BRAND_IMAGES.length <= 1) return; // only one image — stay on it
            setFading(true);
            const swap = setTimeout(() => {
                setIndex(1);
                setFading(false);
                setPhase('cycle');
            }, FADE_MS);
            return () => clearTimeout(swap);
        }, BOUNCE_MS);

        return () => clearTimeout(bounceEnd);
    }, [phase]);

    // ── Phase 2: cycle 1 → 2 → … → N-1 → 1 → … (never returns to 0) ──────
    useEffect(() => {
        if (BRAND_IMAGES.length <= 1 || phase !== 'cycle') return;

        let swapTimeout: ReturnType<typeof setTimeout>;

        const interval = setInterval(() => {
            setFading(true);
            swapTimeout = setTimeout(() => {
                setIndex(prev => {
                    const next = prev + 1;
                    return next >= BRAND_IMAGES.length ? 1 : next;
                });
                setFading(false);
            }, FADE_MS);
        }, DISPLAY_MS + FADE_MS);

        return () => {
            clearInterval(interval);
            clearTimeout(swapTimeout);
        };
    }, [phase]);

    // ── No brand images → default spinner (white-label builds) ─────────────
    if (BRAND_IMAGES.length === 0) {
        return (
            <LoadingSpinner
                size="lg"
                className="h-screen w-full flex items-center justify-center"
            />
        );
    }

    const isBouncing = phase === 'bounce';

    return (
        <>
            {/* Keyframe only rendered while splash is mounted */}
            <style>{BOUNCE_KEYFRAMES}</style>

            <div
                className="h-screen w-full flex items-center justify-center"
                style={{ backgroundColor: SPLASH_BG }}
            >
                <img
                    src={BRAND_IMAGES[index]}
                    alt=""
                    className="max-w-[200px] max-h-[200px] object-contain"
                    style={{
                        opacity: fading ? 0 : 1,
                        transition: `opacity ${FADE_MS}ms ease-in-out`,
                        animation: isBouncing
                            ? `splashBounce ${BOUNCE_MS}ms ease-in-out`
                            : 'none',
                    }}
                />
            </div>
        </>
    );
}
