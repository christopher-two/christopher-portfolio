import { useEffect, useRef, useState } from 'react';
import { Dithering } from '@paper-design/shaders-react';

type Theme = 'black' | 'white';

type ShaderMotion = {
  offsetX: number;
  offsetY: number;
  scale: number;
  rotation: number;
  opacity: number;
};

const initialMotion: ShaderMotion = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
  rotation: 0,
  opacity: 0.14,
};

function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'black' ? 'black' : 'white';
}

export default function HeroShader() {
  const [theme, setTheme] = useState<Theme>('white');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [shaderMotion, setShaderMotion] = useState<ShaderMotion>(initialMotion);
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

  useEffect(() => {
    let frame = 0;

    const updateOffset = () => {
      if (frame) return;

      frame = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const viewportHeight = Math.max(window.innerHeight, 1);
        const focus = Math.min(scrollY / viewportHeight, 1);
        const travel = Math.min(scrollY / 1600, 1);
        const nextMotion: ShaderMotion = reducedMotion
          ? initialMotion
          : {
              offsetX: Math.sin(scrollY / 360) * 0.22 + travel * 0.12,
              offsetY: Math.cos(scrollY / 500) * 0.18 - travel * 0.1,
              scale: 1 + travel * 0.18,
              rotation: Math.sin(scrollY / 900) * 5,
              opacity: 0.14 - focus * 0.07,
            };

        setShaderMotion(nextMotion);
        document.documentElement.style.setProperty('--site-shader-x', `${(nextMotion.offsetX * 180).toFixed(2)}px`);
        document.documentElement.style.setProperty('--site-shader-y', `${(nextMotion.offsetY * 150).toFixed(2)}px`);
        document.documentElement.style.setProperty('--site-shader-scale', `${(1.08 + travel * 0.08).toFixed(3)}`);
        document.documentElement.style.setProperty('--site-shader-opacity', nextMotion.opacity.toFixed(3));
        frame = 0;
      });
    };

    updateOffset();
    window.addEventListener('scroll', updateOffset, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateOffset);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  const isBlack = theme === 'black';

  return (
    <div ref={containerRef} aria-hidden="true" style={{ width: '100%', height: '100%' }}>
      <Dithering
        colorBack={isBlack ? '#0d0d0d' : '#f7f7f5'}
        colorFront={isBlack ? '#f4f4ef' : '#111111'}
        shape="wave"
        type="4x4"
        size={3.5}
        speed={reducedMotion || !isVisible ? 0 : 0.08}
        offsetX={shaderMotion.offsetX}
        offsetY={shaderMotion.offsetY}
        scale={shaderMotion.scale}
        rotation={shaderMotion.rotation}
        minPixelRatio={1}
        maxPixelCount={2500000}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
