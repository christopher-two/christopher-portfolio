import { useEffect, useRef, useState } from 'react';
import { Dithering } from '@paper-design/shaders-react';

type Theme = 'black' | 'white';

function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'black' ? 'black' : 'white';
}

export default function HeroShader() {
  const [theme, setTheme] = useState<Theme>('white');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTheme(getTheme());
    const themeObserver = new MutationObserver(() => setTheme(getTheme()));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(motionQuery.matches);
    updateMotionPreference();
    motionQuery.addEventListener('change', updateMotionPreference);

    if ('IntersectionObserver' in window && containerRef.current) {
      const visibilityObserver = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
        threshold: 0,
      });
      visibilityObserver.observe(containerRef.current);

      return () => {
        themeObserver.disconnect();
        motionQuery.removeEventListener('change', updateMotionPreference);
        visibilityObserver.disconnect();
      };
    }

    return () => {
      themeObserver.disconnect();
      motionQuery.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  const isBlack = theme === 'black';

  return (
    <div ref={containerRef} aria-hidden="true" style={{ width: '100%', height: '100%' }}>
      <Dithering
        colorBack={isBlack ? '#0d0d0d' : '#f7f7f5'}
        colorFront={isBlack ? '#f4f4ef' : '#111111'}
        shape="wave"
        type="4x4"
        size={3.5}
        speed={reducedMotion || !isVisible ? 0 : 0.04}
        minPixelRatio={1}
        maxPixelCount={2500000}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
