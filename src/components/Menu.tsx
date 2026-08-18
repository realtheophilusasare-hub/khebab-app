import { useState, useEffect } from 'react';
import type { MenuItemData } from '../lib/supabase';
import { fetchMenuItems } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
import '../styles/Menu.css';

interface Props {
  onAddToCart: (item: MenuItemData) => void;
}

export function Menu({ onAddToCart }: Props) {
  const [menuItems, setMenuItems] = useState<MenuItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    fetchMenuItems()
      .then(data => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load menu:', err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];
  const filteredItems = activeCategory === 'All'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="loading-spinner">🍢</div>
        <p>Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="menu-container">
      {/* Header */}
      <div className="menu-header">
        <span className="menu-badge">Pre-Made Combos</span>
        <h1 className="menu-title">Our Menu</h1>
        <p className="menu-subtitle">
          Don't want to build from scratch? Pick one of our chef's favorites —
          ready to grill, ready to go.
        </p>
      </div>

      {/* Category filter */}
      <div className="menu-categories">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu grid */}
      <div className="menu-grid">
        {filteredItems.map(item => (
          <div key={item.id} className={`menu-card ${item.is_popular ? 'popular' : ''}`}>
            {item.is_popular && (
              <span className="popular-badge">🔥 Popular</span>
            )}
            <div className="menu-card-image">
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <div className="menu-card-placeholder">🍢</div>
              )}
            </div>
            <div className="menu-card-body">
              <span className="menu-card-category">{item.category}</span>
              <h3 className="menu-card-name">{item.name}</h3>
              <p className="menu-card-desc">{item.description}</p>
              <div className="menu-card-ingredients">
                {item.ingredients.map((ing, idx) => (
                  <span key={idx} className="ingredient-tag">{ing}</span>
                ))}
              </div>
              <div className="menu-card-footer">
                <span className="menu-card-price">{formatPrice(item.price)}</span>
                <button
                  className="menu-add-btn"
                  onClick={() => onAddToCart(item)}
                >
                  Add to Cart +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="menu-cta">
        <div className="menu-cta-content">
          <h3 className="menu-cta-title">Want something custom?</h3>
          <p className="menu-cta-text">Build your own khebab from scratch — pick every ingredient.</p>
          <button className="menu-cta-btn">Build Your Own →</button>
        </div>
      </div>
    </div>
  );
}
