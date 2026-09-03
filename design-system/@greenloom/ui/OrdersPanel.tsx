import React from 'react';

export interface OrderRow {
  id: string;
  customer: string;
  time: string;
  status: string;
  items: number;
}

export interface OrdersPanelProps {
  orders?: OrderRow[];
  onSelect?: (id: string) => void;
  selectedId?: string;
  /** When true, render only the list table with no internal title bar (unskinned list). */
  bare?: boolean;
}

const defaultOrders: OrderRow[] = [
  { id: 'ORD-8821', customer: 'J. Rivera', time: '9:41', status: 'New', items: 3 },
  { id: 'ORD-8820', customer: 'A. Kim', time: '9:28', status: 'Preparing', items: 1 },
  { id: 'ORD-8819', customer: 'S. Patel', time: '9:12', status: 'Ready', items: 4 },
];

export function OrdersPanel({ orders = defaultOrders, onSelect, selectedId, bare }: OrdersPanelProps) {
  return (
    <div
      className="orders-panel"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#0f0f0d',
        color: '#e6e6e3',
        borderRight: '1px solid #222',
      }}
    >
      {!bare && (
        <div
          style={{
            height: 40,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '-0.2px',
            borderBottom: '1px solid #222',
            background: '#111',
          }}
        >
          Orders
        </div>
      )}
      <div style={{ overflow: 'auto', flex: 1 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ color: '#9a9a95', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px', fontWeight: 500 }}>Time</th>
              <th style={{ padding: '8px 12px', fontWeight: 500 }}>Customer</th>
              <th style={{ padding: '8px 12px', fontWeight: 500 }}>Items</th>
              <th style={{ padding: '8px 12px', fontWeight: 500 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const active = selectedId === o.id;
              return (
                <tr
                  key={o.id}
                  onClick={() => onSelect?.(o.id)}
                  style={{
                    cursor: 'pointer',
                    background: active ? '#1a1a17' : 'transparent',
                    borderBottom: '1px solid #1f1f1c',
                  }}
                >
                  <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{o.time}</td>
                  <td style={{ padding: '10px 12px' }}>{o.customer}</td>
                  <td style={{ padding: '10px 12px' }}>{o.items}</td>
                  <td style={{ padding: '10px 12px' }}>{o.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
