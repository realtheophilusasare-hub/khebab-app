import '../styles/About.css';

export function About() {
  return (
    <div className="about-container">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-hero-badge">Our Story</span>
          <h1 className="about-hero-title">
            Born from Fire,<br />Built for You
          </h1>
          <p className="about-hero-subtitle">
            Khebab isn't just food — it's a craft. We bring the grill to life
            with every skewer made fresh, exactly the way you want it.
          </p>
        </div>
        <div className="about-hero-visual">
          <div className="flame-icon">🔥</div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="about-section">
        <div className="section-label">How It Started</div>
        <div className="story-grid">
          <div className="story-text">
            <h2 className="story-heading">
              From a street corner grill to your screen
            </h2>
            <p className="story-paragraph">
              Khebab started with a simple idea: everyone deserves a skewer
              made exactly how they like it. No compromises, no preset combos
              you didn't choose. Just fresh ingredients, an open grill, and
              your imagination.
            </p>
            <p className="story-paragraph">
              We source our meats daily from local butchers who know quality.
              Our vegetables come straight from Accra's markets every morning.
              Every seasoning blend is mixed in-house. And every skewer is
              grilled to order — never sitting under a heat lamp.
            </p>
            <p className="story-paragraph">
              The builder you see on our site? That's not a gimmick. It's how
              we actually make your food. You pick the meat, the veggies, the
              seasoning, the sauce. We grill it. You eat it. Simple.
            </p>
          </div>
          <div className="story-stats">
            <div className="stat-card">
              <span className="stat-number">100%</span>
              <span className="stat-label">Fresh Daily</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">23</span>
              <span className="stat-label">Ingredients</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">6</span>
              <span className="stat-label">Meats to Choose</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">∞</span>
              <span className="stat-label">Combinations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="about-section">
        <div className="section-label">What We Stand For</div>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🌿</div>
            <h3 className="value-title">100% Fresh Ingredients</h3>
            <p className="value-description">
              Meats sourced daily from trusted local butchers. Vegetables
              picked fresh every morning from the market. No frozen, no
              shortcuts, no exceptions.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">🔥</div>
            <h3 className="value-title">Grilled to Perfection</h3>
            <p className="value-description">
              Every skewer hits the grill only after you order. Open flame,
              real char, the way khebab was meant to be cooked. Never
              pre-made, never reheated.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">🍢</div>
            <h3 className="value-title">Made Your Way</h3>
            <p className="value-description">
              You're the chef. Pick your meats, stack your veggies, choose your
              seasoning and sauce. Build it exactly how you want it — every
              single time.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">🛵</div>
            <h3 className="value-title">Fast & Hot Delivery</h3>
            <p className="value-description">
              Hot off the grill, straight to your door. We deliver within
              Accra in insulated bags that keep the heat in and the flavor
              locked. Your khebab arrives ready to eat.
            </p>
          </div>
        </div>
      </section>

      {/* Sourcing */}
      <section className="about-section">
        <div className="section-label">Where Our Food Comes From</div>
        <div className="sourcing-grid">
          <div className="sourcing-row">
            <div className="sourcing-icon">🥩</div>
            <div className="sourcing-info">
              <h4 className="sourcing-title">Meats</h4>
              <p className="sourcing-text">
                Sourced fresh every morning from local butchers in Accra.
                Beef, chicken, goat, lamb, pork, and turkey — all halal-certified
                and inspected daily.
              </p>
            </div>
          </div>

          <div className="sourcing-row">
            <div className="sourcing-icon">🥬</div>
            <div className="sourcing-info">
              <h4 className="sourcing-title">Vegetables</h4>
              <p className="sourcing-text">
                Picked fresh from Makola and Kanda markets each morning.
                Bell peppers, onions, tomatoes, mushrooms, zucchini —
                locally grown, never imported.
              </p>
            </div>
          </div>

          <div className="sourcing-row">
            <div className="sourcing-icon">🌶️</div>
            <div className="sourcing-info">
              <h4 className="sourcing-title">Seasonings</h4>
              <p className="sourcing-text">
                Every blend is mixed in-house using locally sourced spices.
                From our fiery spicy rub to our herb blend, each one is
                crafted to complement the grill.
              </p>
            </div>
          </div>

          <div className="sourcing-row">
            <div className="sourcing-icon">🍯</div>
            <div className="sourcing-info">
              <h4 className="sourcing-title">Sauces</h4>
              <p className="sourcing-text">
                Made fresh daily in our kitchen. Yogurt sauce, chili sauce,
                BBQ sauce, garlic sauce — all from scratch, no bottled
                shortcuts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Build Your Khebab?</h2>
          <p className="cta-subtitle">
            Pick your ingredients. We'll handle the grill.
          </p>
          <button className="cta-button">Start Building →</button>
        </div>
      </section>
    </div>
  );
}
