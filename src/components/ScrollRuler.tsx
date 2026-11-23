import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TICK_COUNT = 72;
const SIGMA = 4.2;
const BASE_SCALE = 1;
const MAX_SCALE = 2.85;
const BASE_OPACITY = 0.28;
const MAX_OPACITY = 0.95;

export default function ScrollRuler() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tickRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const ticks = tickRefs.current.filter((el): el is HTMLSpanElement => el !== null);
    if (!container || ticks.length === 0) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let scrollProgress = 0;
    let hoverProgress: number | null = null;
    let isDragging = false;

    const scaleSetters = prefersReducedMotion
      ? ticks.map((tick) => (val: number) => gsap.set(tick, { scaleX: val }))
      : ticks.map((tick) => gsap.quickTo(tick, 'scaleX', { duration: 0.34, ease: 'power3.out' }));

    const opacitySetters = prefersReducedMotion
      ? ticks.map((tick) => (val: number) => gsap.set(tick, { opacity: val }))
      : ticks.map((tick) => gsap.quickTo(tick, 'opacity', { duration: 0.34, ease: 'power3.out' }));

    const renderWave = () => {
      const scrollCenter = scrollProgress * (ticks.length - 1);
      const hoverCenter = hoverProgress !== null ? hoverProgress * (ticks.length - 1) : null;

      for (let i = 0; i < ticks.length; i++) {
        const scrollDist = Math.abs(i - scrollCenter);
        const scrollInfluence = Math.exp(-(scrollDist * scrollDist) / (2 * SIGMA * SIGMA));

        let hoverInfluence = 0;
        if (hoverCenter !== null) {
          const hoverDist = Math.abs(i - hoverCenter);
          hoverInfluence = Math.exp(-(hoverDist * hoverDist) / (2 * (SIGMA * 0.75) * (SIGMA * 0.75))) * 0.55;
        }

        const influence = Math.min(1, Math.max(scrollInfluence, hoverInfluence));
        const scale = BASE_SCALE + (MAX_SCALE - BASE_SCALE) * influence;
        const opacity = BASE_OPACITY + (MAX_OPACITY - BASE_OPACITY) * influence;

        scaleSetters[i](scale);
        opacitySetters[i](opacity);
      }
    };

    const getPointerProgress = (clientY: number) => {
      const rect = container.getBoundingClientRect();
      if (rect.height <= 0) return 0;
      return Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    };

    const scrollToProgress = (progress: number) => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      window.scrollTo({
        top: progress * maxScroll,
        behavior: prefersReducedMotion ? 'auto' : 'instant' as ScrollBehavior,
      });
    };

    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        scrollProgress = self.progress;
        renderWave();
      },
    });

    scrollProgress = trigger.progress;
    renderWave();

    const onPointerDown = (event: PointerEvent) => {
      isDragging = true;
      container.setPointerCapture(event.pointerId);
      const next = getPointerProgress(event.clientY);
      hoverProgress = next;
      scrollToProgress(next);
      renderWave();
    };

    const onPointerMove = (event: PointerEvent) => {
      const next = getPointerProgress(event.clientY);
      hoverProgress = next;
      if (isDragging) {
        scrollToProgress(next);
      }
      renderWave();
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      if (container.hasPointerCapture(event.pointerId)) {
        container.releasePointerCapture(event.pointerId);
      }
    };

    const onPointerLeave = () => {
      if (isDragging) return;
      hoverProgress = null;
      renderWave();
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('pointerleave', onPointerLeave);

    return () => {
      trigger.kill();
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="scroll-ruler" aria-hidden="true">
      {Array.from({ length: TICK_COUNT }, (_, index) => (
        <span
          key={index}
          ref={(el) => {
            tickRefs.current[index] = el;
          }}
          className="scroll-ruler-tick"
        />
      ))}
    </div>
  );
}
