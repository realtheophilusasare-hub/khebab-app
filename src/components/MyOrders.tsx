import { useState, useEffect } from 'react';
import type { KhebabOrder } from '../types';
import { STATUS_LABELS, STATUS_COLORS } from '../types';
import { formatPrice } from '../lib/utils';
import '../styles/MyOrders.css';

interface Props {
  onTrackOrder: (orderId: string) => void;
  orders: KhebabOrder[];
  loading: boolean;
}

export function MyOrders({ onTrackOrder, orders, loading }: Props) {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const activeStatuses = ['pending', 'preparing', 'skewering', 'grilling', 'finishing', 'ready'];
  const activeOrders = orders.filter(o => activeStatuses.includes(o.status));
  const pastOrders = orders.filter(o => o.status === 'completed' || o.status === 'cancelled');

  const displayOrders = activeTab === 'active' ? activeOrders : pastOrders;

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner">🍢</div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      {/* Header */}
      <div className="orders-header">
        <span className="orders-badge">Your History</span>
        <h1 className="orders-title">My Orders</h1>
        <p className="orders-subtitle">
          Track current orders and review your past khebabs
        </p>
      </div>

      {/* Tabs */}
      <div className="orders-tabs">
        <button
          className={`orders-tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active {activeOrders.length > 0 && <span className="tab-count">{activeOrders.length}</span>}
        </button>
        <button
          className={`orders-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History {pastOrders.length > 0 && <span className="tab-count">{pastOrders.length}</span>}
        </button>
      </div>

      {/* Orders list */}
      {displayOrders.length === 0 ? (
        <div className="orders-empty">
          <span className="orders-empty-icon">🍢</span>
          <p className="orders-empty-title">No {activeTab === 'active' ? 'active' : 'past'} orders</p>
          <p className="orders-empty-sub">
            {activeTab === 'active'
              ? 'Place an order and track it here in real time'
              : 'Your completed orders will show up here'}
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {displayOrders.map((order, idx) => (
            <OrderCard
              key={idx}
              order={order}
              index={idx}
              onTrack={() => onTrackOrder(order.customer_phone)}
              isActive={activeTab === 'active'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({
  order,
  index,
  onTrack,
  isActive,
}: {
  order: KhebabOrder;
  index: number;
  onTrack: () => void;
  isActive: boolean;
}) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const orderDate = new Date().toLocaleDateString('en-GH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="order-card">
      <div className="order-card-top">
        <div className="order-card-info">
          <div className="order-card-number">Order #{String(index + 1).padStart(3, '0')}</div>
          <div className="order-card-date">{orderDate}</div>
        </div>
        <div
          className="order-status-pill"
          style={{
            background: `${STATUS_COLORS[order.status]}20`,
            color: STATUS_COLORS[order.status],
          }}
        >
          {STATUS_LABELS[order.status]}
        </div>
      </div>

      <div className="order-card-items">
        {order.items.slice(0, 4).map((item, idx) => (
          <span key={idx} className="order-item-chip">
            {item.icon || '🍢'} {item.name} ×{item.quantity}
          </span>
        ))}
        {order.items.length > 4 && (
          <span className="order-item-chip more">+{order.items.length - 4} more</span>
        )}
      </div>

      {order.special_instructions && (
        <p className="order-instructions">📝 {order.special_instructions}</p>
      )}

      <div className="order-card-bottom">
        <div className="order-meta">
          <span className="order-meta-item">{itemCount} items</span>
          <span className="order-meta-dot">•</span>
          <span className="order-meta-item">{order.quantity} skewer{order.quantity > 1 ? 's' : ''}</span>
        </div>
        <div className="order-card-actions">
          <span className="order-total">{formatPrice(order.total_price)}</span>
          {isActive && (
            <button className="track-btn" onClick={onTrack}>
              Track →
            </button>
          )}
        </div>
      </div>

      {/* Progress bar for active orders */}
      {isActive && order.status !== 'ready' && order.status !== 'completed' && (
        <div className="order-progress">
          <div
            className="order-progress-fill"
            style={{ width: `${getProgressPercent(order.status)}%` }}
          />
        </div>
      )}
    </div>
  );
}

function getProgressPercent(status: string): number {
  const map: Record<string, number> = {
    pending: 10,
    preparing: 25,
    skewering: 45,
    grilling: 65,
    finishing: 85,
    ready: 100,
    completed: 100,
    cancelled: 0,
  };
  return map[status] || 0;
}
