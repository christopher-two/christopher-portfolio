import { useEffect, useRef, useState } from 'react';
import { Dithering } from '@paper-design/shaders-react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react';

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

type ShaderMountHost = HTMLElement & {
  paperShaderMount?: {
    setUniforms: (uniforms: Record<string, number>) => void;
  };
};

function getShaderMotion(scrollY: number, reducedMotion: boolean, viewportHeight: number): ShaderMotion {
  if (reducedMotion) return initialMotion;

  const focus = Math.min(scrollY / Math.max(viewportHeight, 1), 1);
  const travel = Math.min(scrollY / 1600, 1);

  return {
    offsetX: Math.sin(scrollY / 360) * 0.22 + travel * 0.12,
    offsetY: Math.cos(scrollY / 500) * 0.18 - travel * 0.1,
    scale: 1 + travel * 0.18,
    rotation: Math.sin(scrollY / 900) * 5,
    opacity: 0.14 - focus * 0.07,
  };
}

function getViewportHeight() {
  return typeof window === 'undefined' ? 1 : window.innerHeight;
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'black' ? 'black' : 'white';
}

export default function HeroShader() {
  const [theme, setTheme] = useState<Theme>('white');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const shaderMotionRef = useRef<ShaderMotion>(initialMotion);
  const { scrollY } = useScroll();
  const layerX = useTransform(scrollY, (value) => getShaderMotion(value, false, getViewportHeight()).offsetX * 180);
  const layerY = useTransform(scrollY, (value) => getShaderMotion(value, false, getViewportHeight()).offsetY * 150);
  const layerScale = useTransform(scrollY, (value) => 1.08 + Math.min(value / 1600, 1) * 0.08);
  const layerOpacity = useTransform(scrollY, (value) => getShaderMotion(value, false, getViewportHeight()).opacity);

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
    const applyShaderMotion = (nextMotion: ShaderMotion) => {
      shaderMotionRef.current = nextMotion;
      const shaderMount = containerRef.current?.querySelector<HTMLElement>('div[data-paper-shader]') as ShaderMountHost | null;
      shaderMount?.paperShaderMount?.setUniforms({
        u_offsetX: nextMotion.offsetX,
        u_offsetY: nextMotion.offsetY,
        u_scale: nextMotion.scale,
        u_rotation: nextMotion.rotation,
      });
    };

    const update = () => applyShaderMotion(getShaderMotion(window.scrollY, reducedMotion, window.innerHeight));
    update();
    const frame = window.requestAnimationFrame(update);

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  useMotionValueEvent(scrollY, 'change', (value) => {
    const nextMotion = getShaderMotion(value, reducedMotion, window.innerHeight);
    shaderMotionRef.current = nextMotion;
    const shaderMount = containerRef.current?.querySelector<HTMLElement>('div[data-paper-shader]') as ShaderMountHost | null;
    shaderMount?.paperShaderMount?.setUniforms({
      u_offsetX: nextMotion.offsetX,
      u_offsetY: nextMotion.offsetY,
      u_scale: nextMotion.scale,
      u_rotation: nextMotion.rotation,
    });
  });

  const isBlack = theme === 'black';

  return (
    <motion.div
      ref={containerRef}
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        x: reducedMotion ? 0 : layerX,
        y: reducedMotion ? 0 : layerY,
        scale: reducedMotion ? 1.08 : layerScale,
        opacity: reducedMotion ? initialMotion.opacity : layerOpacity,
      }}
    >
      <Dithering
        colorBack={isBlack ? '#0d0d0d' : '#f7f7f5'}
        colorFront={isBlack ? '#f4f4ef' : '#111111'}
        shape="wave"
        type="4x4"
        size={3.5}
        speed={reducedMotion || !isVisible ? 0 : 0.08}
        offsetX={shaderMotionRef.current.offsetX}
        offsetY={shaderMotionRef.current.offsetY}
        scale={shaderMotionRef.current.scale}
        rotation={shaderMotionRef.current.rotation}
        minPixelRatio={1}
        maxPixelCount={2500000}
        style={{ width: '100%', height: '100%' }}
      />
    </motion.div>
  );
}
