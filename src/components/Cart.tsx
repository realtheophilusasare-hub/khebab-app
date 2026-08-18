import type { SelectedItem } from '../types';
import { formatPrice } from '../lib/utils';
import '../styles/Cart.css';

export interface CartItem {
  id: string;
  label: string;
  items: SelectedItem[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specialInstructions?: string;
}

interface Props {
  cartItems: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export function Cart({ cartItems, onRemove, onUpdateQty, onCheckout, onClose, isOpen }: Props) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = subtotal > 0 ? 10 : 0;
  const total = subtotal + deliveryFee;

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2 className="cart-title">Your Cart</h2>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty-icon">🍢</span>
            <p>Your cart is empty</p>
            <span className="cart-empty-sub">Build a khebab to get started</span>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-header">
                    <span className="cart-item-label">{item.label}</span>
                    <button className="cart-remove" onClick={() => onRemove(item.id)}>Remove</button>
                  </div>
                  <div className="cart-item-ingredients">
                    {item.items.map((ing, idx) => (
                      <span key={idx} className="cart-ingredient-tag">
                        {ing.icon} {ing.name} ×{ing.quantity}
                      </span>
                    ))}
                  </div>
                  {item.specialInstructions && (
                    <p className="cart-instructions">📝 {item.specialInstructions}</p>
                  )}
                  <div className="cart-item-footer">
                    <div className="cart-qty">
                      <button onClick={() => onUpdateQty(item.id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)}>+</button>
                    </div>
                    <span className="cart-item-price">{formatPrice(item.totalPrice)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
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
              <button className="checkout-btn" onClick={onCheckout}>
                Checkout · {formatPrice(total)}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
