import { useEffect, useMemo, useRef } from 'react';
import { usePrefersReducedMotion } from '../../shared/hooks/usePrefersReducedMotion';
import { TECH_LOGOS, type TechLogo } from './techLogos';

/**
 * FloatingCubes — satu kubus per teknologi, melayang di belakang hero.
 *
 * Teknik: CSS 3D transforms murni (`transform-style: preserve-3d`), bukan Three.js. Untuk beberapa
 * kotak yang hanya berputar dan bergeser, WebGL berarti satu library ~600 KB, satu canvas, dan satu
 * scene graph yang harus dibuang saat unmount — semuanya demi hasil yang sama. Rotasi CSS 3D
 * dijalankan compositor, jadi tidak memicu layout atau paint ulang.
 *
 * Satu kubus = satu teknologi. Keenam sisinya memakai logo yang sama, jadi berapa pun kubusnya
 * berputar, yang terbaca tetap satu merek — bukan campuran beberapa logo yang saling menimpa.
 *
 * Tiga lapis gerak, dipisah ke tiga elemen supaya transform-nya tidak saling menimpa:
 *   1. `.cube`       — posisi + parallax mouse + dorongan scroll (CSS variable dari JS)
 *   2. `.cube-float` — naik-turun berulang
 *   3. `.cube-spin`  — rotasi X/Y terus-menerus
 *
 * Ringan di HP: kubus yang lebih kecil dari ambang ukuran disembunyikan lewat CSS, dan tidak ada
 * yang dirender sama sekali saat `prefers-reduced-motion: reduce`.
 *
 * Tidak menutupi apa pun: root memakai `pointer-events: none` + `aria-hidden`, z-index 0.
 */

interface CubeSpec {
  /** logo yang dipakai di keenam sisi */
  logo: number;
  /** ukuran sisi dalam px */
  size: number;
  /** posisi tengah dalam persen panggung */
  x: number;
  y: number;
  /** durasi satu putaran penuh, detik. Di bawah ~10s terasa gugup; di atas ~20s nyaris diam. */
  spin: number;
  /** durasi satu siklus naik-turun, detik */
  float: number;
  /** geseran awal supaya fase antar kubus tidak seragam */
  floatDelay: number;
  /** kedalaman parallax mouse dan scroll: makin besar makin jauh bergeser */
  depth: number;
  /** kemiringan awal supaya bidang-bidangnya tidak seragam */
  tilt: number;
}

/**
 * Susunan tetap (bukan acak saat render) supaya hasilnya sama setiap kali halaman dimuat: kubus
 * yang posisinya berubah tiap reload terlihat seperti bug, bukan desain. Nilai x/y diukur terhadap
 * kotak teks hero yang sebenarnya (nama, label, baris ikon, marquee, potret) dengan margin 1,4x
 * ukuran kubus, karena kubus yang berputar bisa melebar melewati kotak aslinya.
 */
const LAYOUT: CubeSpec[] = [
  { logo: 0, size: 104, x: 9.5, y: 12, spin: 16, float: 6.5, floatDelay: 0, depth: 26, tilt: -8 },
  { logo: 1, size: 124, x: 68.5, y: 13, spin: 20, float: 7.5, floatDelay: -5, depth: 34, tilt: -5 },
  { logo: 2, size: 82, x: 18, y: 25, spin: 13, float: 5.5, floatDelay: -1.2, depth: 22, tilt: 7 },
  { logo: 3, size: 90, x: 78, y: 30, spin: 17, float: 7, floatDelay: -6.2, depth: 30, tilt: 4 },
  { logo: 4, size: 58, x: 7, y: 39, spin: 11, float: 4.5, floatDelay: -3.6, depth: 14, tilt: -14 },
  { logo: 5, size: 66, x: 71, y: 43, spin: 14, float: 5, floatDelay: -2.4, depth: 18, tilt: 12 },
  { logo: 6, size: 70, x: 88, y: 47, spin: 18, float: 6, floatDelay: -7.4, depth: 24, tilt: -6 },
  { logo: 7, size: 62, x: 30, y: 40, spin: 15, float: 5.2, floatDelay: -4.8, depth: 20, tilt: 9 },
];

/** Sisi kubus, urut sesuai urutan render. */
const FACES = ['front', 'back', 'right', 'left', 'top', 'bottom'] as const;

export function FloatingCubes({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const cubes = useMemo(() => LAYOUT.map((cube) => ({ ...cube, data: TECH_LOGOS[cube.logo] })), []);

  /**
   * Mouse parallax + scroll drift. Satu listener per jenis, satu rAF bersama, dan tiap kubus hanya
   * menulis CSS variable — tidak ada state React, jadi gerak mouse dan scroll tidak pernah memicu
   * render ulang komponen.
   *
   * Scroll: kubus ikut turun lebih lambat daripada halaman (faktor `depth`), jadi saat hero
   * digulir mereka tertinggal di belakang dan terlihat melayang, bukan menempel di teks.
   */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fine = window.matchMedia('(pointer: fine)').matches;
    let frame = 0;
    let mx = 0;
    let my = 0;
    let sy = 0;

    const write = () => {
      frame = 0;
      const items = root.children;
      for (let i = 0; i < items.length; i += 1) {
        const element = items[i] as HTMLElement;
        const depth = Number(element.dataset.depth ?? 20);
        element.style.setProperty('--px', `${(mx * depth).toFixed(2)}px`);
        element.style.setProperty('--py', `${(my * depth + sy * depth * 1.9).toFixed(2)}px`);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(write);
    };

    const onMove = (event: PointerEvent) => {
      // -1..1 dari tengah layar, dibalik supaya kubus bergerak berlawanan arah dengan kursor
      mx = -(event.clientX / window.innerWidth - 0.5);
      my = -(event.clientY / window.innerHeight - 0.5);
      schedule();
    };

    const onScroll = () => {
      // jarak gulir dibatasi 600px: lewat dari itu kubus sudah keluar panggung hero
      sy = Math.min(window.scrollY, 600) / 600;
      schedule();
    };

    if (fine) window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Reduced motion: kubus hanyalah hiasan, jadi tidak ada yang dirender. Tidak ada informasi yang
  // hilang bagi pengunjung yang meminta gerak dimatikan.
  if (reduced) return null;

  return (
    <div ref={rootRef} aria-hidden="true" className={className ? `cubes ${className}` : 'cubes'}>
      {cubes.map((cube, index) => (
        <div
          key={index}
          className="cube"
          data-depth={cube.depth}
          style={
            {
              '--size': `${cube.size}px`,
              '--x': `${cube.x}%`,
              '--y': `${cube.y}%`,
              '--spin': `${cube.spin}s`,
              '--float': `${cube.float}s`,
              '--float-delay': `${cube.floatDelay}s`,
              '--tilt': `${cube.tilt}deg`,
              // tiap kubus mulai dari sudut berbeda supaya tidak seragam
              '--seed': `${index * 47}deg`,
            } as React.CSSProperties
          }
        >
          <div className="cube-float">
            <div className="cube-spin">
              {FACES.map((face) => (
                <div key={face} className={`cube-face cube-face--${face}`}>
                  <Logo data={cube.data} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Satu <path> per sisi; tidak ada komponen per logo supaya loop animasi tetap ringan. */
function Logo({ data }: { data: TechLogo }) {
  return (
    <svg viewBox="0 0 24 24" role="presentation" focusable="false">
      <path d={data.path} />
    </svg>
  );
}