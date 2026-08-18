import { useState } from 'react';
import type { OrderStatus } from '../types';
import { STATUS_LABELS, STATUS_PERCENTAGES } from '../types';
import '../styles/OrderTracking.css';

interface Props {
  orderId: string;
  status: OrderStatus;
  customerName: string;
  totalPrice: number;
  items: { name: string; quantity: number; icon: string }[];
  createdAt: string;
  deliveryAddress: string;
}

export function OrderTracking(props: Props) {
  const { status, customerName, totalPrice, items, createdAt, deliveryAddress } = props;
  const progress = STATUS_PERCENTAGES[status];

  const statusSteps: OrderStatus[] = ['pending', 'preparing', 'skewering', 'grilling', 'finishing', 'ready'];

  return (
    <div className="tracking-container">
      <div className="tracking-card">
        <div className="tracking-header">
          <div>
            <h1 className="tracking-title">Order Tracking</h1>
            <p className="tracking-order-id">Order #{props.orderId.slice(-6).toUpperCase()}</p>
          </div>
          <div className="tracking-status-badge" data-status={status}>
            {STATUS_LABELS[status]}
          </div>
        </div>

        {/* Progress timeline */}
        <div className="tracking-timeline">
          {statusSteps.map((step, idx) => {
            const stepProgress = STATUS_PERCENTAGES[step];
            const isComplete = stepProgress <= progress && progress > 0;
            const isCurrent = step === status;
            return (
              <div key={step} className={`timeline-step ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''}`}>
                <div className="timeline-dot">
                  {isComplete && !isCurrent ? '✓' : idx + 1}
                </div>
                <span className="timeline-label">{STATUS_LABELS[step]}</span>
                {idx < statusSteps.length - 1 && (
                  <div className={`timeline-line ${stepProgress < progress ? 'active' : ''}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="tracking-progress-bar">
          <div className="tracking-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Order details */}
        <div className="tracking-details">
          <div className="detail-row">
            <span className="detail-label">Customer</span>
            <span className="detail-value">{customerName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Delivery to</span>
            <span className="detail-value">{deliveryAddress}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Ordered</span>
            <span className="detail-value">{new Date(createdAt).toLocaleString()}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total</span>
            <span className="detail-value detail-price">GHC {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Items */}
        <div className="tracking-items">
          <h3 className="tracking-items-title">Your Order</h3>
          {items.map((item, idx) => (
            <div key={idx} className="tracking-item">
              <span className="tracking-item-icon">{item.icon}</span>
              <span className="tracking-item-name">{item.name}</span>
              <span className="tracking-item-qty">×{item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Lookup component for customers to track by phone
export function OrderLookup({ onLookup }: { onLookup: (phone: string) => void }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!phone.trim()) {
      setError('Enter your phone number');
      return;
    }
    onLookup(phone);
  };

  return (
    <div className="lookup-container">
      <div className="lookup-card">
        <h2 className="lookup-title">Track Your Order</h2>
        <p className="lookup-subtitle">Enter the phone number you ordered with</p>
        <input
          type="tel"
          value={phone}
          onChange={e => {
            setPhone(e.target.value);
            setError('');
          }}
          placeholder="e.g. 024 123 4567"
          className={`lookup-input ${error ? 'error' : ''}`}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        {error && <span className="error-msg">{error}</span>}
        <button className="lookup-btn" onClick={handleSubmit}>
          Find My Order
        </button>
      </div>
    </div>
  );
}
