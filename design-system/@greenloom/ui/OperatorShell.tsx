import React from 'react';

export interface OperatorShellProps {
  children: React.ReactNode;
  storeName?: string;
}

export function OperatorShell({ children, storeName = 'Midtown' }: OperatorShellProps) {
  return (
    <div
      className="op-shell"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#0b0b0a',
        color: '#e6e6e3',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        fontSize: '14px',
        lineHeight: 1.4,
      }}
    >
      <div
        className="op-topbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 44,
          padding: '0 12px',
          borderBottom: '1px solid #222',
          background: '#111',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontWeight: 600, letterSpacing: '-0.2px' }}>Operator</div>
          <div
            aria-label="Store switcher"
            style={{
              fontSize: 12,
              padding: '2px 8px',
              borderRadius: 999,
              background: '#1a1a18',
              border: '1px solid #2a2a28',
              color: '#c9c9c3',
            }}
          >
            {storeName}
          </div>
        </div>
        <div style={{ opacity: 0.6, fontSize: 12 }}>Green Loom</div>
      </div>
      <div className="op-main" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}
