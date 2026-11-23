import { useEffect, useRef, useState } from 'react';
import { HalftoneDots } from '@paper-design/shaders-react';

export type NavSectionKey = 'inicio' | 'trabajo' | 'bio' | 'override' | 'contacto';

type Theme = 'black' | 'white';

interface NavCardDotsProps {
  section: NavSectionKey;
  imageSrc?: string;
}

function makeSvgDataUrl(svgBody: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">${svgBody}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const SECTION_ARTWORK: Record<NavSectionKey, string> = {
  inicio: makeSvgDataUrl(`
    <defs>
      <radialGradient id="g-ini" cx="50%" cy="44%" r="55%">
        <stop offset="0%" stop-color="#000000"/>
        <stop offset="55%" stop-color="#666666"/>
        <stop offset="100%" stop-color="#f2f2f2"/>
      </radialGradient>
      <linearGradient id="g-ini-bar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="#111111" stop-opacity="0.9"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="#efefef"/>
    <circle cx="200" cy="180" r="145" fill="url(#g-ini)"/>
    <rect x="40" y="255" width="320" height="115" fill="url(#g-ini-bar)"/>
    <rect x="165" y="120" width="70" height="240" fill="#111111" opacity="0.85"/>
  `),
  trabajo: makeSvgDataUrl(`
    <defs>
      <linearGradient id="g-trab-1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0d0d0d"/>
        <stop offset="100%" stop-color="#9a9a9a"/>
      </linearGradient>
      <linearGradient id="g-trab-2" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#222222"/>
        <stop offset="100%" stop-color="#dddddd"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="#eeeeee"/>
    <rect x="46" y="54" width="190" height="190" fill="url(#g-trab-1)"/>
    <rect x="164" y="148" width="190" height="190" fill="url(#g-trab-2)"/>
    <rect x="108" y="102" width="184" height="184" fill="#141414" opacity="0.72"/>
    <circle cx="200" cy="194" r="46" fill="#f5f5f5"/>
  `),
  bio: makeSvgDataUrl(`
    <defs>
      <radialGradient id="g-bio" cx="50%" cy="38%" r="52%">
        <stop offset="0%" stop-color="#111111"/>
        <stop offset="70%" stop-color="#777777"/>
        <stop offset="100%" stop-color="#eeeeee"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="#f0f0f0"/>
    <circle cx="200" cy="145" r="76" fill="url(#g-bio)"/>
    <path d="M75 385 C75 270 325 270 325 385 Z" fill="url(#g-bio)"/>
  `),
  override: makeSvgDataUrl(`
    <defs>
      <linearGradient id="g-ov-l" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#111111"/>
        <stop offset="100%" stop-color="#555555"/>
      </linearGradient>
      <linearGradient id="g-ov-r" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#888888"/>
        <stop offset="100%" stop-color="#e5e5e5"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="#f0f0f0"/>
    <polygon points="200,52 336,130 200,208 64,130" fill="#d4d4d4"/>
    <polygon points="64,130 200,208 200,356 64,278" fill="url(#g-ov-l)"/>
    <polygon points="336,130 200,208 200,356 336,278" fill="url(#g-ov-r)"/>
  `),
  contacto: makeSvgDataUrl(`
    <defs>
      <radialGradient id="g-con" cx="50%" cy="50%" r="55%">
        <stop offset="0%" stop-color="#050505"/>
        <stop offset="45%" stop-color="#555555"/>
        <stop offset="100%" stop-color="#f2f2f2"/>
      </radialGradient>
    </defs>
    <rect width="400" height="400" fill="#efefef"/>
    <circle cx="200" cy="200" r="165" fill="url(#g-con)"/>
    <circle cx="200" cy="200" r="118" fill="#efefef"/>
    <circle cx="200" cy="200" r="82" fill="url(#g-con)"/>
    <circle cx="200" cy="200" r="36" fill="#0d0d0d"/>
  `),
};

function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'black' ? 'black' : 'white';
}

export default function NavCardDots({ section, imageSrc }: NavCardDotsProps) {
  const [theme, setTheme] = useState<Theme>('white');
  const [isDesktop, setIsDesktop] = useState(false);
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTheme(getTheme());
    const themeObserver = new MutationObserver(() => {
      setSnapshotUrl(null);
      setTheme(getTheme());
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const updateDesktop = () => setIsDesktop(mediaQuery.matches);
    updateDesktop();
    mediaQuery.addEventListener('change', updateDesktop);

    return () => {
      themeObserver.disconnect();
      mediaQuery.removeEventListener('change', updateDesktop);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop || snapshotUrl) return undefined;

    let cancelled = false;
    let attempts = 0;

    const tryCapture = () => {
      if (cancelled) return;
      const canvas = hostRef.current?.querySelector('canvas');
      if (canvas && canvas.width > 0 && canvas.height > 0) {
        try {
          const dataUrl = canvas.toDataURL('image/png');
          if (dataUrl.length > 1500) {
            setSnapshotUrl(dataUrl);
            return;
          }
        } catch {
          return;
        }
      }
      if (++attempts < 8) {
        window.setTimeout(tryCapture, 160);
      }
    };

    const timer = window.setTimeout(tryCapture, 220);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [isDesktop, theme, imageSrc, snapshotUrl]);

  if (!isDesktop) return null;

  if (snapshotUrl) {
    return <img src={snapshotUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />;
  }

  const isBlack = theme === 'black';
  const resolvedImage = imageSrc && imageSrc.trim().length > 0 ? imageSrc : SECTION_ARTWORK[section];

  return (
    <div ref={hostRef} style={{ width: '100%', height: '100%' }}>
      <HalftoneDots
        image={resolvedImage}
        colorBack={isBlack ? '#0d0d0d' : '#f7f7f5'}
        colorFront={isBlack ? '#f4f4ef' : '#111111'}
        size={0.38}
        radius={1.35}
        contrast={0.62}
        grid="hex"
        type="classic"
        originalColors={false}
        inverted={false}
        grainMixer={0.1}
        grainOverlay={0.08}
        grainSize={0.5}
        fit="cover"
        speed={0}
        minPixelRatio={1}
        maxPixelCount={250000}
        webGlContextAttributes={{ preserveDrawingBuffer: true }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
