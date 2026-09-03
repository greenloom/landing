import React from 'react';

interface BrowserFrameProps {
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
}

/**
 * Browser bezel + title bar glass only.
 * Viewport area is completely clear — no frost/sheen/overlay over the inner shell.
 * Frost/rim/sheen + optional displacement are applied to the BEZEL chrome only.
 * @supports gated so reduced environments get a clean stroke.
 */
export default function BrowserFrame({ children, width = '44rem', height = '44rem' }: BrowserFrameProps) {
  const w = typeof width === 'number' ? `${width}px` : width;
  const h = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className="browser-frame"
      style={{
        width: w,
        height: h,
        borderRadius: 12,
        overflow: 'hidden',
        background: '#0a0b09',
        boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
        position: 'relative',
        // Clean outer stroke for the frame
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Bezel title bar — blank (no title text). Glass effects gated to bezel. */}
      <div
        className="browser-bezel"
        style={{
          height: 36,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Traffic lights (subtle, no demo chrome) */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ width: 10, height: 10, borderRadius: 999, background: '#3a3a38', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: '#3a3a38', display: 'inline-block' }} />
          <span style={{ width: 10, height: 10, borderRadius: 999, background: '#3a3a38', display: 'inline-block' }} />
        </div>
        {/* Blank address / title area — no text per spec */}
        <div style={{ flex: 1 }} />
      </div>

      {/* Viewport — completely clear, no glass wash over the shell */}
      <div
        className="browser-viewport"
        style={{
          height: 'calc(100% - 36px)',
          background: 'transparent',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {children}
      </div>

      {/* Bezel-only glass layer (frost + rim + sheen). Does NOT cover viewport content. */}
      <style>{`
        @supports (backdrop-filter: blur(1px)) {
          .browser-frame .browser-bezel {
            backdrop-filter: saturate(120%) blur(6px);
            -webkit-backdrop-filter: saturate(120%) blur(6px);
          }
          /* subtle rim + sheen on the bezel bar only */
          .browser-frame .browser-bezel::after {
            content: '';
            position: absolute;
            inset: 0;
            pointer-events: none;
            background: linear-gradient(
              180deg,
              rgba(255,255,255,0.06) 0%,
              rgba(255,255,255,0.02) 35%,
              rgba(0,0,0,0.0) 65%
            );
            mix-blend-mode: screen;
          }
        }

        /* Optional soft displacement on bezel for a touch of warp, disabled on reduced motion */
        @supports (backdrop-filter: blur(1px)) {
          @media (prefers-reduced-motion: no-preference) {
            .browser-frame .browser-bezel {
              /* very light SVG feDisplacementMap gated to bezel chrome */
              filter: url(#bezel-disp);
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .browser-frame .browser-bezel {
            filter: none !important;
            transition: none !important;
          }
        }

        .browser-frame {
          /* ensure the square is exactly 44rem regardless of inner */
          box-sizing: content-box;
        }
      `}</style>

      {/* SVG filter definition for optional displacement on bezel only (very subtle) */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <filter id="bezel-disp" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale="0.6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
