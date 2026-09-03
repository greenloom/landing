import React, { useState } from 'react';
import { OperatorShell, OrdersPanel, OrderDetailMain } from '@greenloom/ui';

const demoOrders = [
  { id: 'ORD-8821', customer: 'J. Rivera', time: '9:41', status: 'New', items: 3 },
  { id: 'ORD-8820', customer: 'A. Kim', time: '9:28', status: 'Preparing', items: 1 },
  { id: 'ORD-8819', customer: 'S. Patel', time: '9:12', status: 'Ready', items: 4 },
];

export default function OperatorWindow() {
  const [selectedId, setSelectedId] = useState('ORD-8821');

  return (
    <div
      className="op-window"
      style={{
        width: '44rem',
        height: '44rem',
        borderRadius: 10,
        overflow: 'hidden',
        background: '#0a0b09',
        boxShadow: '0 10px 40px rgba(0,0,0,0.45)',
        position: 'relative',
      }}
    >
      <OperatorShell storeName="Midtown">
        <div
          style={{
            display: 'flex',
            height: '100%',
            minHeight: 0,
          }}
        >
          <div style={{ width: '38%', minWidth: 260, maxWidth: 320, height: '100%' }}>
            <OrdersPanel
              bare
              orders={demoOrders}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
          {/* OperatorMain well: bg-muted p-6 (1.5rem) */}
          <div
            className="operator-main"
            style={{
              flex: 1,
              background: 'var(--gl-muted, #f4f4f2)',
              padding: '1.5rem',
              height: '100%',
              overflow: 'auto',
            }}
          >
            <OrderDetailMain
              orderId={selectedId}
              customer={demoOrders.find((o) => o.id === selectedId)?.customer || '—'}
              status={demoOrders.find((o) => o.id === selectedId)?.status || '—'}
            />
          </div>
        </div>
      </OperatorShell>
    </div>
  );
}
