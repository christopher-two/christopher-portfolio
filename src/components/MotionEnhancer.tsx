import { useEffect } from 'react';
import { animate, type AnimationPlaybackControls } from 'motion';

const revealSelector = [
  'main > section:not(.hero):not(.page-intro)',
  'main > article',
  '.project-card',
  '.project-row',
  '.skill',
  '.published-app',
  '.recognition',
].join(', ');

const ease = [0.16, 1, 0.3, 1] as const;

export default function MotionEnhancer() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const activeAnimations: AnimationPlaybackControls[] = [];

    const playEntrance = (element: HTMLElement, delay = 0) => {
      const animation = animate(
        element,
        {
          opacity: [0, 1],
          y: [28, 0],
          clipPath: ['inset(0 0 8% 0)', 'inset(0)'],
        },
        { duration: 0.7, delay, ease },
      );
      activeAnimations.push(animation);
    };

    if (prefersReducedMotion) return undefined;

    const heroItems = document.querySelectorAll<HTMLElement>('.hero-content > .eyebrow, .hero-content > h1, .hero-content > .hero-actions');
    heroItems.forEach((element, index) => playEntrance(element, index * 0.1));

    const pageIntro = document.querySelector<HTMLElement>('.page-intro > .wrap');
    if (pageIntro) playEntrance(pageIntro, 0.08);

    if (!('IntersectionObserver' in window)) return undefined;

    const targets = [...document.querySelectorAll<HTMLElement>(revealSelector)];
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = targets.indexOf(entry.target as HTMLElement);
          playEntrance(entry.target as HTMLElement, Math.min(index % 5, 4) * 0.06);
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.01 },
    );

    targets.forEach((element) => {
      element.style.opacity = '0';
      element.style.clipPath = 'inset(0 0 8% 0)';
      revealObserver.observe(element);
    });

    return () => {
      revealObserver.disconnect();
      activeAnimations.forEach((animation) => animation.stop());
    };
  }, []);

  return null;
}
