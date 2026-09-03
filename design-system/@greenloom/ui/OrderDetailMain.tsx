import React from 'react';

export interface OrderDetailMainProps {
  orderId?: string;
  customer?: string;
  status?: string;
  items?: Array<{ name: string; qty: number }>;
}

export function OrderDetailMain({ orderId = 'ORD-8821', customer = 'J. Rivera', status = 'New', items = [{ name: 'Pre-roll 1g', qty: 2 }, { name: 'Gummies 10mg', qty: 1 }] }: OrderDetailMainProps) {
  return (
    <div
      className="order-detail-main"
      style={{
        background: 'var(--gl-muted, #f4f4f2)',
        padding: '1.5rem',
        borderRadius: 6,
        color: '#1f1f1c',
        fontSize: 14,
        lineHeight: 1.45,
        height: '100%',
        overflow: 'auto',
      }}
    >
      <div style={{ marginBottom: '0.75rem', fontWeight: 600, letterSpacing: '-0.2px' }}>
        {orderId} · {customer}
      </div>
      <div style={{ marginBottom: '1rem', color: '#555' }}>Status: {status}</div>

      <div style={{ fontWeight: 600, margin: '0.5rem 0' }}>Items</div>
      <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
        {items.map((it, idx) => (
          <li key={idx}>
            {it.name} × {it.qty}
          </li>
        ))}
      </ul>

      <div style={{ marginTop: '1rem', fontSize: 12, color: '#666' }}>
        Fulfillment · Shelf pick · Pack · Label
      </div>
    </div>
  );
}
