import { useState } from 'react';
import type { CartItem } from './Cart';
import { formatPrice } from '../lib/utils';
import '../styles/Checkout.css';

interface Props {
  cartItems: CartItem[];
  onPlaceOrder: (orderData: OrderData) => void;
  onBack: () => void;
}

export interface OrderData {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  payment_method: 'momo' | 'cash';
  momo_provider?: string;
  momo_number?: string;
  total_price: number;
}

export function Checkout({ cartItems, onPlaceOrder, onBack }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'cash'>('momo');
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'telecel' | 'airteltigo'>('mtn');
  const [momoNumber, setMomoNumber] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = 10;
  const total = subtotal + deliveryFee;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!phone.trim()) errs.phone = 'Phone number is required';
    if (phone.trim() && phone.trim().length < 10) errs.phone = 'Enter a valid phone number';
    if (!address.trim()) errs.address = 'Delivery address is required';
    if (paymentMethod === 'momo' && !momoNumber.trim()) errs.momoNumber = 'MoMo number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onPlaceOrder({
      customer_name: name,
      customer_phone: phone,
      delivery_address: address,
      payment_method: paymentMethod,
      momo_provider: paymentMethod === 'momo' ? momoProvider : undefined,
      momo_number: paymentMethod === 'momo' ? momoNumber : undefined,
      total_price: total,
    });
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <button className="back-btn" onClick={onBack}>← Back to Cart</button>
        <h1 className="checkout-title">Checkout</h1>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form-section">
          {/* Delivery details */}
          <div className="form-group">
            <h2 className="form-section-title">Delivery Details</h2>

            <div className="input-field">
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Kofi Mensah"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className="input-field">
              <label>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 024 123 4567"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-msg">{errors.phone}</span>}
            </div>

            <div className="input-field">
              <label>Delivery Address</label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="House number, street name, area, landmark..."
                rows={3}
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-msg">{errors.address}</span>}
            </div>
          </div>

          {/* Payment method */}
          <div className="form-group">
            <h2 className="form-section-title">Payment Method</h2>

            <div className="payment-options">
              <div
                className={`payment-option ${paymentMethod === 'momo' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('momo')}
              >
                <span className="payment-icon">📱</span>
                <div className="payment-info">
                  <span className="payment-name">Mobile Money</span>
                  <span className="payment-desc">MTN, Telecel, AirtelTigo</span>
                </div>
                <span className="payment-radio">{paymentMethod === 'momo' && '●'}</span>
              </div>

              <div
                className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <span className="payment-icon">💵</span>
                <div className="payment-info">
                  <span className="payment-name">Cash on Delivery</span>
                  <span className="payment-desc">Pay when your order arrives</span>
                </div>
                <span className="payment-radio">{paymentMethod === 'cash' && '●'}</span>
              </div>
            </div>

            {/* MoMo details */}
            {paymentMethod === 'momo' && (
              <div className="momo-details">
                <div className="input-field">
                  <label>MoMo Provider</label>
                  <div className="provider-options">
                    <button
                      className={`provider-chip ${momoProvider === 'mtn' ? 'selected' : ''}`}
                      onClick={() => setMomoProvider('mtn')}
                    >
                      MTN MoMo
                    </button>
                    <button
                      className={`provider-chip ${momoProvider === 'telecel' ? 'selected' : ''}`}
                      onClick={() => setMomoProvider('telecel')}
                    >
                      Telecel Cash
                    </button>
                    <button
                      className={`provider-chip ${momoProvider === 'airteltigo' ? 'selected' : ''}`}
                      onClick={() => setMomoProvider('airteltigo')}
                    >
                      AirtelTigo
                    </button>
                  </div>
                </div>

                <div className="input-field">
                  <label>MoMo Number</label>
                  <input
                    type="tel"
                    value={momoNumber}
                    onChange={e => setMomoNumber(e.target.value)}
                    placeholder="e.g. 024 123 4567"
                    className={errors.momoNumber ? 'error' : ''}
                  />
                  {errors.momoNumber && <span className="error-msg">{errors.momoNumber}</span>}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order summary */}
        <div className="checkout-summary">
          <h2 className="form-section-title">Order Summary</h2>

          <div className="checkout-items">
            {cartItems.map(item => (
              <div key={item.id} className="checkout-item">
                <div className="checkout-item-info">
                  <span className="checkout-item-label">{item.label}</span>
                  <span className="checkout-item-qty">×{item.quantity}</span>
                </div>
                <span className="checkout-item-price">{formatPrice(item.totalPrice)}</span>
              </div>
            ))}
          </div>

          <div className="checkout-totals">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button className="place-order-btn" onClick={handleSubmit}>
            {paymentMethod === 'momo' ? 'Pay & Place Order' : 'Place Order'}
          </button>

          <p className="checkout-note">
            {paymentMethod === 'momo'
              ? 'You will receive a prompt on your phone to confirm payment.'
              : 'Have exact change ready for delivery.'}
          </p>
        </div>
      </div>
    </div>
  );
}
