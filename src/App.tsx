import { useEffect, useState } from 'react';
import { Builder } from './components/Builder';
import { Cart, type CartItem } from './components/Cart';
import { Checkout, type OrderData } from './components/Checkout';
import { OrderTracking, OrderLookup } from './components/OrderTracking';
import { About } from './components/About';
import { Menu } from './components/Menu';
import { MyOrders } from './components/MyOrders';
import { ThemeToggle } from './components/ThemeToggle';
import { useKhebabBuilder } from './hooks/useKhebabBuilder';
import type { Ingredient, BuilderStep, KhebabOrder } from './types';
import type { MenuItemData } from './lib/supabase';
import {
  fetchIngredients,
  createOrder,
  fetchOrderByPhone,
  fetchAllOrders,
  subscribeToOrderStatus,
} from './lib/supabase';
import './styles/App.css';

type View = 'builder' | 'checkout' | 'tracking' | 'lookup' | 'about' | 'menu' | 'orders';
type Theme = 'light' | 'dark';

export default function App() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [completedSteps, setCompletedSteps] = useState<BuilderStep[]>([]);
  const [view, setView] = useState<View>('builder');
  const [cartOpen, setCartOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<KhebabOrder | null>(null);
  const [lastOrderId, setLastOrderId] = useState<string>('');
  const [orderStatus, setOrderStatus] = useState<KhebabOrder['status']>('pending');
  const [userOrders, setUserOrders] = useState<KhebabOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('khebab-theme') as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  // Apply theme class to root + persist
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('khebab-theme', theme);
  }, [theme]);

  const handleThemeToggle = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  useEffect(() => {
    fetchIngredients()
      .then(data => {
        setIngredients(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load ingredients:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!lastOrderId) return;
    const unsubscribe = subscribeToOrderStatus(lastOrderId, (newStatus) => {
      setOrderStatus(newStatus);
      setLastOrder(prev => prev ? { ...prev, status: newStatus } : prev);
    });
    return unsubscribe;
  }, [lastOrderId]);

  const loadOrders = (phone?: string) => {
    setOrdersLoading(true);
    if (phone) {
      fetchOrderByPhone(phone)
        .then(order => {
          setUserOrders(order ? [order] : []);
          setOrdersLoading(false);
        })
        .catch(() => setOrdersLoading(false));
    } else {
      fetchAllOrders()
        .then(orders => {
          setUserOrders(orders);
          setOrdersLoading(false);
        })
        .catch(() => setOrdersLoading(false));
    }
  };

  const builder = useKhebabBuilder(ingredients);

  useEffect(() => {
    if (builder.selections.some(s => s.category === 'meat') && !completedSteps.includes('meat')) {
      setCompletedSteps(prev => [...prev, 'meat']);
    }
    if (builder.selections.some(s => s.category === 'veggie') && !completedSteps.includes('veggie')) {
      setCompletedSteps(prev => [...prev, 'veggie']);
    }
    if (builder.selections.some(s => s.category === 'seasoning' || s.category === 'sauce') && !completedSteps.includes('sauce')) {
      setCompletedSteps(prev => [...prev, 'sauce']);
    }
  }, [builder.selections, completedSteps]);

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `khebab-${Date.now()}`,
      label: `Custom Khebab (${builder.selections.length} items)`,
      items: [...builder.selections],
      quantity: builder.quantity,
      unitPrice: builder.totalPrice / builder.quantity,
      totalPrice: builder.totalPrice,
      specialInstructions: builder.specialInstructions || undefined,
    };
    setCart(prev => [...prev, cartItem]);
    builder.clearAll();
    setCompletedSteps([]);
    setCartOpen(true);
  };

  const handleMenuAddToCart = (item: MenuItemData) => {
    const cartItem: CartItem = {
      id: `menu-${item.id}-${Date.now()}`,
      label: item.name,
      items: item.ingredients.map((name, idx) => ({
        ingredient_id: `preset-${idx}`,
        name,
        category: 'preset' as const,
        quantity: 1,
        price: 0,
        icon: '🍢',
      })),
      quantity: 1,
      unitPrice: item.price,
      totalPrice: item.price,
    };
    setCart(prev => [...prev, cartItem]);
    setCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty, totalPrice: item.unitPrice * newQty };
      })
    );
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setView('checkout');
  };

  const handlePlaceOrder = async (orderData: OrderData) => {
    const order: KhebabOrder = {
      items: cart.flatMap(item => item.items),
      quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
      special_instructions: cart.map(item => item.specialInstructions).filter(Boolean).join('; ') || '',
      total_price: orderData.total_price,
      status: 'pending',
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      delivery_address: orderData.delivery_address,
    };

    try {
      const orderId = await createOrder(order);
      setLastOrderId(orderId);
      setOrderStatus('pending');
      setLastOrder(order);
      setCart([]);
      setView('tracking');
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleOrderLookup = async (phone: string) => {
    const order = await fetchOrderByPhone(phone);
    if (order) {
      setLastOrder(order);
      setOrderStatus(order.status);
      setView('tracking');
    } else {
      alert('No order found for that phone number.');
    }
  };

  const handleTrackFromOrders = (phone: string) => {
    handleOrderLookup(phone);
  };

  const renderNav = () => (
    <nav className="simple-nav">
      <div className="nav-brand">🍢 Khebab</div>
      <div className="nav-links">
        <button className={`nav-link ${view === 'builder' ? 'active' : ''}`} onClick={() => setView('builder')}>Build</button>
        <button className={`nav-link ${view === 'menu' ? 'active' : ''}`} onClick={() => setView('menu')}>Menu</button>
        <button className={`nav-link ${view === 'orders' ? 'active' : ''}`} onClick={() => { setView('orders'); loadOrders(); }}>Orders</button>
        <button className={`nav-link ${view === 'about' ? 'active' : ''}`} onClick={() => setView('about')}>About</button>
        <div className="nav-divider" />
        <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
        <button className="nav-link cart-btn" onClick={() => setCartOpen(true)}>
          🛒 {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </button>
      </div>
    </nav>
  );

  const renderCart = () => (
    <Cart
      cartItems={cart}
      onRemove={handleRemoveFromCart}
      onUpdateQty={handleUpdateCartQty}
      onCheckout={handleCheckout}
      onClose={() => setCartOpen(false)}
      isOpen={cartOpen}
    />
  );

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">🍢</div>
        <p>Preparing your builder...</p>
      </div>
    );
  }

  if (view === 'checkout') {
    return <Checkout cartItems={cart} onPlaceOrder={handlePlaceOrder} onBack={() => { setView('builder'); setCartOpen(true); }} />;
  }

  if (view === 'lookup') {
    return (
      <div className="app">
        {renderNav()}
        <OrderLookup onLookup={handleOrderLookup} />
        {renderCart()}
      </div>
    );
  }

  if (view === 'tracking' && lastOrder) {
    return (
      <OrderTracking
        orderId={lastOrderId || 'unknown'}
        status={orderStatus}
        customerName={lastOrder.customer_name}
        totalPrice={lastOrder.total_price}
        items={lastOrder.items.map(item => ({ name: item.name, quantity: item.quantity, icon: item.icon || '🍢' }))}
        createdAt={new Date().toISOString()}
        deliveryAddress={lastOrder.delivery_address}
      />
    );
  }

  if (view === 'about') {
    return (
      <div className="app">
        {renderNav()}
        <About />
        {renderCart()}
      </div>
    );
  }

  if (view === 'menu') {
    return (
      <div className="app">
        {renderNav()}
        <Menu onAddToCart={handleMenuAddToCart} />
        {renderCart()}
      </div>
    );
  }

  if (view === 'orders') {
    return (
      <div className="app">
        {renderNav()}
        <MyOrders
          orders={userOrders}
          loading={ordersLoading}
          onTrackOrder={handleTrackFromOrders}
        />
        {renderCart()}
      </div>
    );
  }

  return (
    <div className="app">
      {renderNav()}
      <Builder
        currentStep={builder.currentStep}
        groupedIngredients={builder.groupedIngredients}
        selections={builder.selections}
        totalPrice={builder.totalPrice}
        progress={builder.progress}
        quantity={builder.quantity}
        specialInstructions={builder.specialInstructions}
        completedSteps={completedSteps}
        onToggleIngredient={builder.toggleIngredient}
        onUpdateQuantity={builder.updateQuantity}
        onStepClick={builder.goToStep}
        onNextStep={builder.nextStep}
        onPrevStep={builder.prevStep}
        onQuantityChange={builder.setQuantity}
        onSpecialInstructionsChange={builder.setSpecialInstructions}
        onClearAll={() => { builder.clearAll(); setCompletedSteps([]); }}
        onAddToCart={handleAddToCart}
        getSelection={builder.getSelection}
      />
      {renderCart()}
    </div>
  );
}
