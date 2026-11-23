import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, type AnimationPlaybackControls } from 'motion';

gsap.registerPlugin(ScrollTrigger);

const revealSelector = [
  'main > section:not(.hero):not(.page-intro)',
  'main > article',
  '.project-row',
  '.skill',
  '.published-app',
  '.recognition',
].join(', ');

const ease = [0.16, 1, 0.3, 1] as const;

function splitHeadingIntoChars(heading: HTMLElement): HTMLElement[] {
  const originalText = heading.textContent?.trim() ?? '';
  if (originalText) {
    heading.setAttribute('aria-label', originalText);
  }

  const chars: HTMLElement[] = [];

  const processNode = (node: ChildNode, targetParent: HTMLElement) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      const tokens = text.split(/(\s+)/);
      for (const token of tokens) {
        if (!token) continue;
        if (/^\s+$/.test(token)) {
          targetParent.appendChild(document.createTextNode(' '));
          continue;
        }
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';
        wordSpan.setAttribute('aria-hidden', 'true');

        for (const ch of [...token]) {
          const charSpan = document.createElement('span');
          charSpan.textContent = ch;
          charSpan.style.display = 'inline-block';
          charSpan.style.opacity = '0';

          wordSpan.appendChild(charSpan);
          chars.push(charSpan);
        }
        targetParent.appendChild(wordSpan);
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const clone = el.cloneNode(false) as HTMLElement;
      clone.setAttribute('aria-hidden', 'true');
      for (const child of [...el.childNodes]) {
        processNode(child, clone);
      }
      targetParent.appendChild(clone);
    }
  };

  const originalNodes = [...heading.childNodes];
  heading.replaceChildren();
  for (const child of originalNodes) {
    processNode(child, heading);
  }

  return chars;
}

function typewriteHeading(tl: gsap.core.Timeline, heading: HTMLElement, startAt: number | string) {
  const chars = splitHeadingIntoChars(heading);
  if (chars.length === 0) return;

  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.style.display = 'inline-block';
  cursor.style.width = '0';
  cursor.style.overflow = 'visible';
  cursor.style.fontWeight = '300';
  cursor.style.pointerEvents = 'none';
  chars[0].before(cursor);

  const step = 0.036;
  const startOffset = typeof startAt === 'number' ? startAt : tl.duration();

  chars.forEach((char, index) => {
    const at = startOffset + index * step;
    tl.set(char, { opacity: 1 }, at);
    tl.call(() => {
      char.after(cursor);
    }, undefined, at);
  });

  const endAt = startOffset + chars.length * step;
  tl.to(
    cursor,
    {
      opacity: 0,
      duration: 0.28,
      repeat: 3,
      yoyo: true,
      ease: 'steps(1)',
      onComplete: () => cursor.remove(),
    },
    endAt,
  );
}
export default function MotionEnhancer() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const activeAnimations: AnimationPlaybackControls[] = [];
    const timelines: gsap.core.Timeline[] = [];

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

    const heroSection = document.querySelector<HTMLElement>('.hero');
    if (heroSection) {
      const eyebrow = heroSection.querySelector<HTMLElement>('.eyebrow');
      const heading = heroSection.querySelector<HTMLElement>('h1');
      const actions = heroSection.querySelector<HTMLElement>('.hero-actions');

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      if (eyebrow) {
        tl.fromTo(eyebrow, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, clearProps: 'transform,opacity' });
      }
      if (heading) {
        typewriteHeading(tl, heading, eyebrow ? 0.15 : 0);
      }
      if (actions) {
        tl.fromTo(
          actions,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.5, clearProps: 'transform,opacity' },
          '-=0.8',
        );
      }
      timelines.push(tl);
    }

    const pageIntro = document.querySelector<HTMLElement>('.page-intro > .wrap');
    if (pageIntro) {
      const introHeading = pageIntro.querySelector<HTMLElement>('h1');
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' }, delay: 0.06 });
      if (introHeading) {
        typewriteHeading(tl, introHeading, 0);
      } else {
        tl.fromTo(pageIntro, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, clearProps: 'transform,opacity' });
      }
      timelines.push(tl);
    }

    const projectCards = [...document.querySelectorAll<HTMLElement>('.projects-grid .project-card')];
    const cardTweens: gsap.core.Tween[] = [];
    projectCards.forEach((card) => {
      const cardTween = gsap.fromTo(
        card,
        { scale: 1 },
        {
          scale: 0.9,
          opacity: 0.85,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top 38%',
            end: 'bottom top',
            scrub: 0.4,
          },
        },
      );
      cardTweens.push(cardTween);

      const mediaImg = card.querySelector<HTMLElement>('.project-card-media img');
      if (mediaImg) {
        const imgTween = gsap.fromTo(
          mediaImg,
          { scale: 1.18 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.4,
            },
          },
        );
        cardTweens.push(imgTween);
      }
    });

    if (!('IntersectionObserver' in window)) {
      return () => {
        timelines.forEach((tl) => tl.kill());
        cardTweens.forEach((tw) => {
          tw.scrollTrigger?.kill();
          tw.kill();
        });
      };
    }

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
      timelines.forEach((tl) => tl.kill());
      cardTweens.forEach((tw) => {
        tw.scrollTrigger?.kill();
        tw.kill();
      });
    };
  }, []);

  return null;
}
