import React, { useState } from 'react';
import { Product } from '../types';
import { 
  Search, 
  ShoppingCart, 
  Star, 
  ChevronRight, 
  Heart, 
  Leaf, 
  ShieldCheck, 
  Truck, 
  Package, 
  CheckCircle,
  Plus,
  Minus,
  X,
  MessageCircle,
  MapPin,
  Filter,
  ChevronDown,
  ChevronLeft,
  User
} from 'lucide-react';

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'layout-grid':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case 'fertilizer':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
          <path d="M12 10v8M9 14h6" />
        </svg>
      );
    case 'sprout':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M7 20h10M12 20V10M12 10a4 4 0 0 1 4-4h2M12 10a4 4 0 0 0-4-4H6" />
        </svg>
      );
    case 'gardening':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M10 10l4 4m2-6l-8 8M14 6l4 4-2 2-4-4 2-2zM4 16l-2 6 6-2-4-4z" />
        </svg>
      );
    case 'foods':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 22c4.97 0 9-3.582 9-8 0-4.08-3.033-7.4-7-7.93a3 3 0 0 0-3-2.07H9a3 3 0 0 0-3 3.07C2.033 7.6 2 10.92 2 14c0 4.418 4.03 8 9 8h1z" />
          <path d="M12 6c1.5-2 3-2 3-2" />
        </svg>
      );
    default:
      return null;
  }
};

interface ShopModuleProps {
  liveProducts: Product[];
  productFilter: string;
  setProductFilter: (f: string) => void;
  allProductsSearch: string;
  setAllProductsSearch: (s: string) => void;
  cart: { product: Product; qty: number }[];
  addToCart: (p: Product, qty?: number) => void;
  updateCartQty: (id: string, qty: number) => void;
  currentUser: any;
  handleLogout: () => void;
  isCartDrawerOpen?: boolean;
  setIsCartDrawerOpen?: (open: boolean) => void;
}

export const ShopModule: React.FC<ShopModuleProps> = ({
  liveProducts,
  productFilter,
  setProductFilter,
  allProductsSearch,
  setAllProductsSearch,
  cart,
  addToCart,
  updateCartQty,
  currentUser,
  handleLogout,
  isCartDrawerOpen,
  setIsCartDrawerOpen
}) => {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [productFilter, allProductsSearch, priceRange, selectedConcern]);

  const heroSlides = [
    {
      img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1400&q=85',
      badge: 'Mega Monsoon Sale',
      title: 'Grow Naturally.\nLive Better.',
      sub: 'Up to 30% off on premium organic fertilizers and desi seeds. Free delivery today.',
      cta: 'Shop Now',
      ctaHref: '#shop',
      accent: '#D4A373',
      overlay: 'from-[#1a3a28]/90 via-[#1a3a28]/60 to-transparent',
    },
    {
      img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1400&q=85',
      badge: '100% Organic',
      title: 'Seeds That\nNourish Life.',
      sub: 'Hand-picked desi seeds — tested, certified, and ready for your soil.',
      cta: 'Browse Seeds',
      ctaHref: '#shop',
      accent: '#6DBE8C',
      overlay: 'from-[#0d2b1a]/90 via-[#0d2b1a]/55 to-transparent',
    },
    {
      img: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=1400&q=85',
      badge: 'Lab Certified',
      title: 'Science-Led\nNutrition.',
      sub: 'Every product is lab-tested for purity, potency and soil compatibility.',
      cta: 'Explore Products',
      ctaHref: '#shop',
      accent: '#D4A373',
      overlay: 'from-[#1c3a2a]/90 via-[#1c3a2a]/55 to-transparent',
    },
    {
      img: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=1400&q=85',
      badge: 'Free Delivery',
      title: 'From Farm\nTo Doorstep.',
      sub: 'Fast 2-day pan-India shipping on all organic fertilizers and soil amendments.',
      cta: 'Order Today',
      ctaHref: '#shop',
      accent: '#6DBE8C',
      overlay: 'from-[#0f2a1c]/90 via-[#0f2a1c]/55 to-transparent',
    },
    {
      img: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&w=1400&q=85',
      badge: 'Soil Health First',
      title: 'Healthy Soil,\nHealthy Harvest.',
      sub: 'Restore your soil microbiome with our certified bio-stimulant range.',
      cta: 'Take Soil Test',
      ctaHref: '#soiltest',
      accent: '#D4A373',
      overlay: 'from-[#1a3820]/90 via-[#1a3820]/55 to-transparent',
    },
  ];

  React.useEffect(() => {
    if (heroSlides.length <= 1 || heroSlide === undefined) return;
    if (heroSlide < 0 || heroSlide >= heroSlides.length) return;
    if (heroSlide !== undefined) { /* valid */ }
  }, []);

  React.useEffect(() => {
    if (heroPaused) return;
    const t = setInterval(() => {
      setHeroSlide(p => (p + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(t);
  }, [heroPaused, heroSlides.length]);
  
  const getProductCartQty = (id: string) => {
    const item = cart.find(c => c.product.id === id);
    return item ? item.qty : 0;
  };
  const getCartCount = () => cart.reduce((sum, item) => sum + item.qty, 0);
  const getSubtotal = () => cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const handleStepper = (product: Product, delta: number) => {
    const currentQty = getProductCartQty(product.id);
    const newQty = currentQty + delta;
    if (newQty > 0) {
      if (currentQty === 0) {
        addToCart(product, 1);
      } else {
        updateCartQty(product.id, newQty);
      }
    } else if (newQty === 0 && currentQty > 0) {
      updateCartQty(product.id, 0); 
    }
  };

  const blinkitCategories = [
    { id: 'fertilizer', label: 'Fertilizers', icon: '🌱', color: 'bg-[#2D5A3F1F]' },
    { id: 'seeds', label: 'Seeds', icon: '🌰', color: 'bg-[#2D5A3F1F]' },
    { id: 'tools', label: 'Tools', icon: '✂️', color: 'bg-[#2D5A3F1F]' },
    { id: 'grains-millet', label: 'Organic Food', icon: '🌾', color: 'bg-[#2D5A3F1F]' },
    { id: 'combos', label: 'Combos', icon: '🎁', color: 'bg-[#2D5A3F1F]' },
    { id: 'bestsellers', label: 'Best Sellers', icon: '⭐', color: 'bg-[#2D5A3F1F]' }
  ];

  // ── Parallax scroll refs ──────────────────────────────────────────────
  const parallaxWrappers = React.useRef<(HTMLDivElement | null)[]>([]);
  const leafWrappers     = React.useRef<(HTMLDivElement | null)[]>([]);
  const bestSellerScrollRef = React.useRef<HTMLDivElement>(null);
  const scrollBestSellers = (dir: number) => bestSellerScrollRef.current?.scrollBy({ left: dir * 250, behavior: 'smooth' });

  React.useEffect(() => {
    // ── Parallax depth factors ─────────────────────────────────────
    const pFactors = [0.18, 0.25, 0.20, 0.30, 0.15, 0.22, 0.28, 0.12];
    const lFactors = [0.40, 0.35, 0.45, 0.38, 0.50, 0.32, 0.42, 0.36];
    // Alternating spin direction per item (1 = clockwise, -1 = counter)
    const spinDir  = [1, -1, 1, -1, 1, -1, 1, -1];

    // Spring state — all mutable, never causes re-render
    let lastY     = window.scrollY;
    let velocity  = 0;           // current scroll velocity (px/frame)
    const rot     = [0,0,0,0,0,0,0,0];  // live rotation per item (deg)
    const rotTgt  = [0,0,0,0,0,0,0,0];  // target rotation
    const scl     = [1,1,1,1,1,1,1,1];  // live scale per item
    let rafId     = 0;

    // ── rAF loop runs every frame ──────────────────────────────────
    const tick = () => {
      const sy = window.scrollY;
      velocity  = sy - lastY;   // px scrolled since last frame
      lastY     = sy;

      // Compute target rotation from velocity (capped at ±12deg — subtle & professional)
      const vtgt = Math.max(-12, Math.min(12, velocity * 0.6));

      parallaxWrappers.current.forEach((el, i) => {
        if (!el) return;

        // Spring target toward velocity-driven angle
        rotTgt[i] = vtgt * spinDir[i];
        // Spring actual toward target (stiffness 0.10), then decay target
        rot[i]    += (rotTgt[i] - rot[i]) * 0.10;
        rotTgt[i] *= 0.82;  // damping — target decays to zero

        // Scale pulses with rotation magnitude (very subtle)
        const abrot   = Math.abs(rot[i]);
        const sclTgt  = 1 + abrot * 0.002;
        scl[i]       += (sclTgt - scl[i]) * 0.12;

        // Combine parallax Y + spring rotation + scale
        const ty = -sy * (pFactors[i] ?? 0.2);
        el.style.transform = `translateY(${ty}px) rotate(${rot[i].toFixed(2)}deg) scale(${scl[i].toFixed(4)})`;
      });

      // Leaves: lean slightly with velocity (no scale)
      leafWrappers.current.forEach((el, i) => {
        if (!el) return;
        const lean = Math.max(-12, Math.min(12, velocity * 0.5));
        const ty   = -sy * (lFactors[i] ?? 0.4);
        el.style.transform = `translateY(${ty}px) rotate(${(lean * (i % 2 === 0 ? 1 : -1)).toFixed(1)}deg)`;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const filteredProducts = liveProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(allProductsSearch.toLowerCase());
    let matchesCategory = false;
    if (productFilter === 'all') {
      matchesCategory = true;
    } else if (productFilter === 'fertilizer') {
      matchesCategory = p.category === 'fertilizer' || p.category === 'nutrition' || p.category === 'soil-health';
    } else if (productFilter === 'seeds') {
      matchesCategory = p.category === 'seeds';
    } else if (productFilter === 'gardening') {
      matchesCategory = p.category === 'tools' || p.category === 'pest-control' || p.category === 'gardening';
    } else if (productFilter === 'foods') {
      matchesCategory = p.category === 'grains-millet' || p.category === 'rice-poha' || p.category === 'dals-pulses' || p.category === 'salt-spices' || p.category === 'flours-sooji' || p.category === 'foods';
    } else {
      matchesCategory = p.category === productFilter || 
                       (productFilter === 'bestsellers' && p.rating && p.rating > 4.7) ||
                       (productFilter === 'new' && p.price < 500);
    }
    const matchesPrice = p.price <= priceRange;
    
    let matchesConcern = true;
    if (selectedConcern) {
      const nameDesc = (p.name + ' ' + p.desc).toLowerCase();
      if (selectedConcern === 'pest') {
        matchesConcern = p.category === 'pest-control' || nameDesc.includes('pest') || nameDesc.includes('protect') || nameDesc.includes('neem') || nameDesc.includes('insect') || nameDesc.includes('spray');
      } else if (selectedConcern === 'soil') {
        matchesConcern = p.category === 'soil-health' || nameDesc.includes('soil') || nameDesc.includes('ph') || nameDesc.includes('compost') || nameDesc.includes('conditioner');
      } else if (selectedConcern === 'growth') {
        matchesConcern = p.category === 'nutrition' || nameDesc.includes('growth') || nameDesc.includes('booster') || nameDesc.includes('npk') || nameDesc.includes('fertilizer') || nameDesc.includes('nutrient');
      } else if (selectedConcern === 'leaves') {
        matchesConcern = p.category === 'nutrition' || nameDesc.includes('yellow') || nameDesc.includes('deficiency') || nameDesc.includes('iron') || nameDesc.includes('magnesium') || nameDesc.includes('color');
      } else if (selectedConcern === 'roots') {
        matchesConcern = nameDesc.includes('root') || nameDesc.includes('myco') || nameDesc.includes('rot') || nameDesc.includes('fungi') || nameDesc.includes('decay');
      }
    }

    return matchesSearch && matchesCategory && matchesPrice && matchesConcern;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const mobileCategories = [
    { id: 'all', label: 'All Products', icon: 'layout-grid' },
    { id: 'fertilizer', label: 'Fertilizer', icon: 'fertilizer' },
    { id: 'seeds', label: 'Seeds', icon: 'sprout' },
    { id: 'gardening', label: 'Gardening', icon: 'gardening' },
    { id: 'foods', label: 'Foods', icon: 'foods' }
  ];

  return (
    <>
      {/* MOBILE SCREEN LAYOUT */}
      <div className="block md:hidden h-screen overflow-hidden bg-[#F4F7F5] flex flex-col relative font-sans">
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-150 px-4 py-3 flex items-center justify-between">
          <button className="text-gray-700 hover:text-[#2D5A3F] focus:outline-none">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-6 h-6"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <a href="#home" className="flex items-center">
            <img src="/logo2.jpeg" alt="Cowberry Organics Logo" className="h-8 w-auto object-contain" />
          </a>
          <div className="flex items-center gap-4 text-gray-700">
            <button className="hover:text-[#2D5A3F]">
              <MapPin className="w-5 h-5" />
            </button>
            <button className="hover:text-[#2D5A3F]">
              <User className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Search & Category Dropdown Container */}
        <div className="px-4 py-2.5 bg-white border-b border-gray-100">
          <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-1.5 shadow-sm">
            <div className="flex items-center flex-1 gap-2">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search Spi"
                value={allProductsSearch}
                onChange={(e) => setAllProductsSearch(e.target.value)}
                className="w-full bg-transparent border-none text-xs focus:outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
            <div className="h-4 w-px bg-gray-300 mx-2"></div>
            <button className="flex items-center gap-1 text-[11px] font-bold text-slate-800 shrink-0">
              All Categories
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Two-Column Sidebar + Product Grid Layout */}
        <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 108px)' }}>
          {/* Sidebar Tabs */}
          <aside className="w-24 bg-[#F4F7F5] flex flex-col border-r border-gray-150 overflow-y-auto no-scrollbar shrink-0">
            {mobileCategories.map((cat) => {
              const isActive = productFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setProductFilter(cat.id);
                    setCurrentPage(1);
                  }}
                  className={`relative py-4 px-1.5 flex flex-col items-center justify-center gap-1.5 text-center transition-all ${
                    isActive ? 'bg-white text-[#2D5A3F]' : 'bg-[#F4F7F5] text-slate-550 hover:bg-slate-100/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'text-[#2D5A3F]' : 'text-slate-400'}`}>
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <span className={`text-[10px] font-bold leading-tight select-none px-1`}>
                    {cat.label}
                  </span>
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-[#2D5A3F]" />
                  )}
                </button>
              );
            })}
          </aside>

          {/* Product Grid */}
          <main className="flex-1 bg-white overflow-y-auto p-3 no-scrollbar relative flex flex-col pb-24">
            <div className="flex justify-between items-center mb-3">
              <div className="text-[11px] text-slate-400 font-bold">
                {filteredProducts.length} Items
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <button className="p-1 hover:text-[#2D5A3F]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4.5 h-4.5"><path d="M11 5L8 2 5 5M8 2v14M13 19l3 3 3-3M16 22V8"/></svg>
                </button>
                <button className="p-1 hover:text-[#2D5A3F]" onClick={() => setIsFilterDrawerOpen(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-4.5 h-4.5"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
                </button>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <p className="text-xs text-slate-450 font-semibold">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3.5 pb-20">
                {filteredProducts.map((p) => {
                  const qty = getProductCartQty(p.id);
                  const selectedSize = selectedSizes[p.id] || (p.sizes && p.sizes[0]) || '1 kg';
                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-3xl border border-gray-150 p-3.5 flex flex-col relative overflow-hidden transition-all duration-300 hover:shadow-lg"
                      style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}
                    >
                      {/* Image Area */}
                      <div
                        className="relative h-28 bg-[#fbfbfa] rounded-2xl flex items-center justify-center p-2 mb-3 cursor-pointer overflow-hidden"
                        onClick={() => window.location.hash = `#product?id=${p.id}`}
                      >
                        <img
                          src={p.img}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain"
                        />
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 select-none">
                          <Star className="w-2.5 h-2.5 text-yellow-450 fill-current" />
                          {p.rating || '4.5'}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-col flex-1">
                        <span className="text-[8px] font-black text-[#2D5A3F] uppercase tracking-wider block mb-0.5">
                          {p.category.replace(/-/g, ' ')}
                        </span>
                        
                        <h3
                          className="text-[11px] font-black text-[#1F3325] leading-snug mb-1 line-clamp-2 cursor-pointer hover:text-[#2D5A3F]"
                          onClick={() => window.location.hash = `#product?id=${p.id}`}
                        >
                          {p.name}
                        </h3>

                        <p className="text-[9px] text-slate-500 leading-normal line-clamp-2 mb-2">
                          {p.desc}
                        </p>

                        {/* Size selector dropdown (if sizes exist) */}
                        {p.sizes && p.sizes.length > 0 && (
                          <div className="relative mb-2 w-full mt-auto">
                            <select
                              value={selectedSize}
                              onChange={e => setSelectedSizes({...selectedSizes, [p.id]: e.target.value})}
                              className="w-full bg-[#F4F7F5] border border-gray-250 text-slate-700 text-[9px] font-bold rounded-lg pl-2 pr-5 py-1 appearance-none focus:outline-none focus:border-[#2D5A3F]"
                            >
                              {p.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <ChevronDown className="w-3 h-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        )}

                        {/* Faint Divider line */}
                        <div className="border-t border-gray-100 my-2" />

                        {/* Price Section */}
                        {(() => {
                          const displayOriginalPrice = p.originalPrice || Math.round(p.price / 0.9);
                          const discountPercent = Math.round(((displayOriginalPrice - p.price) / displayOriginalPrice) * 100);
                          return (
                            <div className="flex flex-col gap-0.5 mb-2.5 mt-auto">
                              <span className="text-[9px] text-slate-450 line-through font-bold">₹{displayOriginalPrice}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black text-slate-900">₹{p.price}</span>
                                <span className="bg-[#fee2e2] text-[#dc2626] text-[7px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase">
                                  {discountPercent}% OFF
                                </span>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Add / Stepper */}
                        <div className="mt-auto pt-0.5">
                          {qty === 0 ? (
                            <button
                              onClick={() => handleStepper(p, 1)}
                              className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-[10px] py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                            >
                              <ShoppingCart className="w-3 h-3 text-slate-650" />
                              <span>ADD TO CART</span>
                            </button>
                          ) : (
                            <div className="flex items-center bg-[#2D5A3F] text-white rounded-xl overflow-hidden h-[28px] shadow-xs">
                              <button onClick={() => handleStepper(p, -1)} className="w-7 h-full flex items-center justify-center hover:bg-[#22442F] transition-colors cursor-pointer text-white"><Minus className="w-2.5 h-2.5" /></button>
                              <span className="flex-1 text-center font-black text-[10px]">{qty}</span>
                              <button onClick={() => handleStepper(p, 1)} className="w-7 h-full flex items-center justify-center hover:bg-[#22442F] transition-colors cursor-pointer text-white"><Plus className="w-2.5 h-2.5" /></button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>


      </div>

      {/* DESKTOP SCREEN LAYOUT */}
      <div
        className="hidden md:block min-h-screen pb-24 md:pb-12 relative"
        style={{ backgroundColor: '#F4F7F5' }}
      >
      {/* ============================================================
          PARALLAX PRODUCE BACKGROUND
      ============================================================ */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <style>{`
          /* Gentle up-down float for produce */
          @keyframes produceFloat {
            0%,100% { transform: translateY(0px) rotate(0deg) scale(1); }
            33%     { transform: translateY(-18px) rotate(4deg) scale(1.03); }
            66%     { transform: translateY(-8px) rotate(-3deg) scale(0.98); }
          }
          @keyframes produceFloatR {
            0%,100% { transform: translateY(0px) rotate(0deg) scale(1); }
            33%     { transform: translateY(-14px) rotate(-5deg) scale(1.04); }
            66%     { transform: translateY(-6px) rotate(3deg) scale(0.97); }
          }
          /* Leaf fall: sway left-right while descending */
          @keyframes leafFall1 {
            0%   { transform: translateY(-80px) translateX(0px)   rotate(0deg);   opacity:0; }
            5%   { opacity:0.9; }
            25%  { transform: translateY(20vh)  translateX(35px)  rotate(55deg); }
            50%  { transform: translateY(45vh)  translateX(-25px) rotate(110deg); }
            75%  { transform: translateY(70vh)  translateX(40px)  rotate(165deg); }
            95%  { opacity:0.6; }
            100% { transform: translateY(100vh) translateX(-10px) rotate(200deg); opacity:0; }
          }
          @keyframes leafFall2 {
            0%   { transform: translateY(-80px) translateX(0px)   rotate(30deg);  opacity:0; }
            5%   { opacity:0.85; }
            30%  { transform: translateY(22vh)  translateX(-30px) rotate(80deg); }
            55%  { transform: translateY(50vh)  translateX(20px)  rotate(130deg); }
            80%  { transform: translateY(78vh)  translateX(-35px) rotate(185deg); }
            95%  { opacity:0.5; }
            100% { transform: translateY(105vh) translateX(15px)  rotate(220deg); opacity:0; }
          }
          @keyframes leafFall3 {
            0%   { transform: translateY(-80px) translateX(0px)   rotate(-20deg); opacity:0; }
            5%   { opacity:0.8; }
            20%  { transform: translateY(18vh)  translateX(25px)  rotate(40deg); }
            45%  { transform: translateY(42vh)  translateX(-40px) rotate(100deg); }
            70%  { transform: translateY(68vh)  translateX(30px)  rotate(155deg); }
            95%  { opacity:0.55; }
            100% { transform: translateY(102vh) translateX(-20px) rotate(195deg); opacity:0; }
          }
          /* Soft base gradient wash */
          @keyframes bgWash {
            0%,100% { opacity:0.7; }
            50%     { opacity:1.0; }
          }
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          @keyframes revealUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes revealRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes dotPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.45; transform: scale(1.4); }
          }
          .animate-revealUp {
            animation: revealUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-revealRight {
            animation: revealRight 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          .animate-dotPulse {
            animation: dotPulse 1.6s infinite ease-in-out;
          }
          .role-link {
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .role-link:hover {
            transform: translateX(4px);
          }
          .btn-fill-up {
            position: relative;
            overflow: hidden;
            z-index: 10;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .btn-fill-up::before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 100%;
            background-color: var(--accent-color, #F598F2);
            transform: translateY(101%);
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            z-index: -1;
          }
          .btn-fill-up:hover::before {
            transform: translateY(0);
          }
          .btn-fill-up:hover {
            color: #000 !important;
            border-color: var(--accent-color, #F598F2);
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 28s linear infinite;
          }
        `}</style>

        {/* ── Soft base gradient ───────────────────────────── */}
        <div style={{
          position:'absolute', inset:0,
          background:[
            'radial-gradient(ellipse 75% 55% at 10% 20%, rgba(55,115,85,0.10) 0%, transparent 65%)',
            'radial-gradient(ellipse 65% 50% at 90% 80%, rgba(109,190,140,0.08) 0%, transparent 60%)',
            'radial-gradient(ellipse 55% 70% at 50% 105%, rgba(210,175,110,0.06) 0%, transparent 50%)',
          ].join(','),
          animation: 'bgWash 12s ease-in-out infinite',
        }} />

        {/* ── PRODUCE ITEMS — emoji floaters with parallax ─────────── */}
        {([
          /* [emoji, left, top, size(px), dur, delay, anim, glow]
             Pushed off-screen: only ~25px of the emoji peeks in at each edge */
          ['🍎', '-30px', '15%', 58, '5.0s','0.0s','produceFloat', 'rgba(220,50,50,0.30)'],
          ['🍋', 'calc(100% - 28px)', '8%',  52, '6.0s','0.8s','produceFloatR','rgba(240,210,30,0.28)'],
          ['🍅', '-32px', '38%', 60, '7.0s','1.5s','produceFloat', 'rgba(210,60,60,0.28)'],
          ['🥕', 'calc(100% - 26px)','34%', 55, '5.5s','2.0s','produceFloatR','rgba(235,140,30,0.28)'],
          ['🥦', '-30px', '58%', 62, '6.5s','0.5s','produceFloat', 'rgba(40,140,60,0.28)'],
          ['🥭', 'calc(100% - 28px)','60%', 56, '5.8s','1.2s','produceFloatR','rgba(250,150,30,0.28)'],
          ['🌽', '-32px', '78%', 58, '7.2s','2.5s','produceFloat', 'rgba(240,200,30,0.28)'],
          ['🥑', 'calc(100% - 26px)','80%', 54, '6.2s','0.3s','produceFloatR','rgba(40,120,50,0.28)'],
        ] as [string,string,string,number,string,string,string,string][]).map(([emoji,left,top,size,dur,delay,anim,glow],i) => (
          <div
            key={i}
            ref={el => { parallaxWrappers.current[i] = el; }}
            style={{ position:'absolute', left, top, width:size, height:size, willChange:'transform' }}
          >
            <span
              style={{
                display:'flex', alignItems:'center', justifyContent:'center',
                width:'100%', height:'100%',
                fontSize: size * 0.78,
                lineHeight:1,
                filter:`drop-shadow(0 4px 12px ${glow})`,
                animation:`${anim} ${dur} ${delay} ease-in-out infinite`,
                userSelect:'none',
                opacity: 0.45,
              }}
            >
              {emoji}
            </span>
          </div>
        ))}

        {/* ── FALLING LEAVES — SVG shapes with gradient fill ────────── */}
        {([
          /* [hue, left, size, dur, delay, anim] */
          ['#4CAF50','#2E7D32', '8%',  '-5%', 52, '8.0s','0.0s','leafFall1'],
          ['#66BB6A','#1B5E20', '22%', '-8%', 42, '10.0s','2.0s','leafFall2'],
          ['#81C784','#388E3C', '38%', '-6%', 58, '7.0s','4.5s','leafFall3'],
          ['#A5D6A7','#2E7D32', '55%', '-4%', 46, '9.0s','1.5s','leafFall1'],
          ['#4CAF50','#1B5E20', '70%', '-7%', 50, '11.0s','3.0s','leafFall2'],
          ['#66BB6A','#388E3C', '83%', '-5%', 44, '8.5s','5.5s','leafFall3'],
          ['#81C784','#2E7D32', '15%', '-9%', 40, '9.5s','7.0s','leafFall1'],
          ['#A5D6A7','#1B5E20', '92%', '-6%', 54, '7.5s','1.0s','leafFall2'],
        ] as [string,string,string,string,number,string,string,string][]).map(([c1,c2,left,top,size,dur,delay,anim],i) => (
          <div
            key={i}
            ref={el => { leafWrappers.current[i] = el; }}
            style={{ position:'absolute', left, top, width:size, height:size, willChange:'transform' }}
          >
            <svg
              viewBox="0 0 100 120"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                width:'100%', height:'100%',
                filter:`drop-shadow(0 4px 10px rgba(46,125,50,0.45))`,
                animation:`${anim} ${dur} ${delay} ease-in-out infinite`,
              }}
            >
              <defs>
                <linearGradient id={`lg${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={c1}/>
                  <stop offset="100%" stopColor={c2}/>
                </linearGradient>
              </defs>
              {/* Leaf blade */}
              <path
                d="M50 5 C80 10, 98 40, 90 70 C82 95, 58 112, 50 115 C42 112, 18 95, 10 70 C2 40, 20 10, 50 5Z"
                fill={`url(#lg${i})`}
                opacity="0.90"
              />
              {/* Centre vein */}
              <path d="M50 10 Q52 60 50 112" stroke="rgba(255,255,255,0.35)" strokeWidth="2" fill="none"/>
              {/* Side veins */}
              <path d="M50 35 Q68 42 80 38" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" fill="none"/>
              <path d="M50 35 Q32 42 20 38" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" fill="none"/>
              <path d="M50 58 Q70 62 85 56" stroke="rgba(255,255,255,0.20)" strokeWidth="1.0" fill="none"/>
              <path d="M50 58 Q30 62 15 56" stroke="rgba(255,255,255,0.20)" strokeWidth="1.0" fill="none"/>
              {/* Stem */}
              <path d="M50 115 Q50 118 50 122" stroke={c2} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        ))}
      </div>

      {/* ── TOP ANNOUNCEMENT TICKER ── */}
      <div className="w-full bg-[#122e1f] text-[#5ecb8e] py-2.5 overflow-hidden relative z-50 text-[10px] font-black tracking-widest uppercase border-b border-[#2D5A3F]/20 select-none">
        <div className="flex animate-marquee whitespace-nowrap gap-12">
          <span>🌿 Free shipping on all organic orders above ₹499</span>
          <span className="text-[#D4A373]">⚡ Monsoon Sale: Use code GROW20 to get extra 20% off</span>
          <span>🔬 Science-Led Nutrition for 100% plant absorption</span>
          <span className="text-[#D4A373]">📦 Zero plastic biodegradable zip-lock packaging</span>
          {/* Duplicate for infinite loop */}
          <span>🌿 Free shipping on all organic orders above ₹499</span>
          <span className="text-[#D4A373]">⚡ Monsoon Sale: Use code GROW20 to get extra 20% off</span>
          <span>🔬 Science-Led Nutrition for 100% plant absorption</span>
          <span className="text-[#D4A373]">📦 Zero plastic biodegradable zip-lock packaging</span>
        </div>
      </div>

      {/* PROFESSIONAL FULL-WIDTH NAVBAR */}
      <div className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm mb-0">
        {/* Top Bar */}
        <div className="w-full px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between gap-4 md:gap-6 max-w-[1600px] mx-auto">

          {/* Logo */}
          <a href="#home" className="flex items-center shrink-0">
            <img src="/logo2.jpeg" alt="Agriic Logo" className="h-9 md:h-11 w-auto object-contain hover:opacity-85 transition-opacity" />
          </a>

          {/* Location */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0 cursor-pointer group px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <MapPin className="w-4 h-4 text-[#2D5A3F] shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Deliver to</span>
              <span className="text-[13px] font-bold text-gray-800 group-hover:text-[#2D5A3F] transition-colors">Delhi, India</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:flex">
            <div className="flex items-center w-full border border-gray-300 rounded-lg bg-gray-50 pl-4 pr-1 py-2 focus-within:border-[#2D5A3F] focus-within:ring-2 focus-within:ring-[#2D5A3F]/15 focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                className="flex-1 bg-transparent border-none focus:outline-none px-3 text-sm text-gray-800 placeholder-gray-400"
                placeholder="Search products, seeds, fertilizers..."
                value={allProductsSearch}
                onChange={(e) => setAllProductsSearch(e.target.value)}
              />
              <div className="h-5 w-px bg-gray-300 mx-1 shrink-0"></div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-[#2D5A3F] whitespace-nowrap shrink-0 transition-colors">
                All Categories <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Login / Profile */}
            {currentUser ? (
              <div className="flex items-center gap-2 cursor-pointer group px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#2D5A3F] flex items-center justify-center text-white">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden md:block text-sm font-semibold text-gray-700 group-hover:text-[#2D5A3F] transition-colors">{currentUser.name || 'Account'}</span>
              </div>
            ) : (
              <a href="#auth" className="flex items-center gap-2 cursor-pointer group px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-500 group-hover:border-[#2D5A3F] group-hover:text-[#2D5A3F] transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden md:block text-sm font-semibold text-gray-700 group-hover:text-[#2D5A3F] transition-colors">Sign In</span>
              </a>
            )}

            {/* Cart */}
            <a
              href="#cart"
              onClick={(e) => {
                if (setIsCartDrawerOpen) {
                  e.preventDefault();
                  setIsCartDrawerOpen(true);
                }
              }}
              className="flex items-center gap-2 cursor-pointer group relative px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-[#2D5A3F] transition-colors" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#2D5A3F] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </div>
              <span className="hidden md:block text-sm font-semibold text-gray-700 group-hover:text-[#2D5A3F] transition-colors">Cart</span>
              {getSubtotal() > 0 && (
                <span className="hidden lg:block text-xs font-bold text-[#2D5A3F]">₹{getSubtotal().toLocaleString()}</span>
              )}
            </a>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center w-full border border-gray-300 rounded-lg bg-gray-50 pl-4 pr-3 py-2 focus-within:border-[#2D5A3F] focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              className="flex-1 bg-transparent border-none focus:outline-none px-3 text-sm text-gray-800 placeholder-gray-400"
              placeholder="Search products..."
              value={allProductsSearch}
              onChange={(e) => setAllProductsSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Secondary Nav — Category Links */}
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12">
            <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
              {[
                { label: 'All Products', key: 'all', hasArrow: true },
                { label: 'Offers', key: 'offers', hasArrow: true },
                { label: 'Membership', key: 'membership' },
                { label: 'Blogs', key: 'blogs' },
                { label: 'Recipes', key: 'recipes' },
                { label: 'About Us', key: 'about' }
              ].map(nav => (
                <button
                  key={nav.key}
                  onClick={() => setProductFilter(nav.key === 'all' ? 'all' : nav.key)}
                  className={`flex items-center gap-1 px-4 py-3 whitespace-nowrap text-sm font-semibold border-b-2 transition-all ${
                    productFilter === nav.key || (nav.key === 'all' && productFilter === 'all')
                      ? 'border-[#2D5A3F] text-[#2D5A3F]'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {nav.label}
                  {nav.hasArrow && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SIMPLE IMAGE CAROUSEL WITH BOTANICAL BACKGROUND */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#f8faf9] to-white pt-8 pb-12 mt-2">
        
        {/* ═══ MONEY PLANT VINE — LEFT EDGE (Outer Background) ═══ */}
        <div className="absolute left-[-2%] bottom-[-10%] z-[5] pointer-events-none w-[150px] md:w-[220px] h-[120%]" style={{ animation: 'vineGrow 3s ease-out 0.5s forwards', opacity: 0 }}>
          <svg viewBox="0 0 180 500" fill="none" className="w-full h-full" preserveAspectRatio="none" style={{ animation: 'vineCurl 6s ease-in-out infinite' }}>
            <path d="M40 500 Q35 440 45 380 Q55 320 38 260 Q25 200 42 140 Q55 80 35 20" stroke="rgba(34,120,60,0.35)" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M42 500 Q38 445 48 385 Q58 325 40 265 Q28 205 44 145 Q58 85 38 25" stroke="rgba(34,120,60,0.2)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <g style={{ animation: 'leafSway 4s ease-in-out infinite' }}>
              <ellipse cx="55" cy="360" rx="18" ry="10" fill="rgba(76,153,60,0.3)" transform="rotate(-30 55 360)" />
              <line x1="45" y1="365" x2="65" y2="355" stroke="rgba(34,100,40,0.25)" strokeWidth="0.8" />
            </g>
            <g style={{ animation: 'leafSway 5s ease-in-out 0.5s infinite' }}>
              <ellipse cx="25" cy="290" rx="20" ry="11" fill="rgba(76,153,60,0.28)" transform="rotate(25 25 290)" />
              <line x1="15" y1="285" x2="35" y2="295" stroke="rgba(34,100,40,0.22)" strokeWidth="0.8" />
            </g>
            <g style={{ animation: 'leafSway 4.5s ease-in-out 1s infinite' }}>
              <ellipse cx="58" cy="220" rx="16" ry="9" fill="rgba(76,153,60,0.25)" transform="rotate(-40 58 220)" />
              <line x1="50" y1="225" x2="66" y2="215" stroke="rgba(34,100,40,0.2)" strokeWidth="0.8" />
            </g>
            <g style={{ animation: 'leafSway 5.5s ease-in-out 1.5s infinite' }}>
              <ellipse cx="30" cy="150" rx="22" ry="12" fill="rgba(76,153,60,0.22)" transform="rotate(20 30 150)" />
              <line x1="18" y1="145" x2="42" y2="155" stroke="rgba(34,100,40,0.18)" strokeWidth="0.8" />
            </g>
            <g style={{ animation: 'leafSway 4s ease-in-out 2s infinite' }}>
              <ellipse cx="50" cy="80" rx="15" ry="8" fill="rgba(76,153,60,0.2)" transform="rotate(-35 50 80)" />
              <line x1="43" y1="84" x2="57" y2="76" stroke="rgba(34,100,40,0.16)" strokeWidth="0.8" />
            </g>
            <path d="M45 380 Q70 370 60 350" stroke="rgba(34,120,60,0.18)" strokeWidth="1" fill="none" />
            <path d="M38 260 Q12 250 20 230" stroke="rgba(34,120,60,0.15)" strokeWidth="1" fill="none" />
            <path d="M42 140 Q68 130 55 110" stroke="rgba(34,120,60,0.15)" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* ═══ MONEY PLANT VINE — LEFT EDGE (Outer Background / Mobile Foreground) ═══ */}
        <div className="absolute left-[-15px] md:left-[-2%] bottom-[-10%] z-[15] md:z-[5] pointer-events-none w-[90px] md:w-[220px] h-[120%] opacity-80 md:opacity-100" style={{ animation: 'vineGrow 3s ease-out 0.5s forwards' }}>
          <svg viewBox="0 0 180 500" fill="none" className="w-full h-full" preserveAspectRatio="none" style={{ animation: 'vineCurl 6s ease-in-out infinite' }}>
            <path d="M40 500 Q35 440 45 380 Q55 320 38 260 Q25 200 42 140 Q55 80 35 20" stroke="rgba(34,120,60,0.35)" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M42 500 Q38 445 48 385 Q58 325 40 265 Q28 205 44 145 Q58 85 38 25" stroke="rgba(34,120,60,0.2)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <g style={{ animation: 'leafSway 4s ease-in-out infinite' }}>
              <ellipse cx="55" cy="360" rx="18" ry="10" fill="rgba(76,153,60,0.3)" transform="rotate(-30 55 360)" />
              <line x1="45" y1="365" x2="65" y2="355" stroke="rgba(34,100,40,0.25)" strokeWidth="0.8" />
            </g>
            <g style={{ animation: 'leafSway 5s ease-in-out 0.5s infinite' }}>
              <ellipse cx="25" cy="290" rx="20" ry="11" fill="rgba(76,153,60,0.28)" transform="rotate(25 25 290)" />
              <line x1="15" y1="285" x2="35" y2="295" stroke="rgba(34,100,40,0.22)" strokeWidth="0.8" />
            </g>
            <g style={{ animation: 'leafSway 4.5s ease-in-out 1s infinite' }}>
              <ellipse cx="58" cy="220" rx="16" ry="9" fill="rgba(76,153,60,0.25)" transform="rotate(-40 58 220)" />
              <line x1="50" y1="225" x2="66" y2="215" stroke="rgba(34,100,40,0.2)" strokeWidth="0.8" />
            </g>
            <g style={{ animation: 'leafSway 5.5s ease-in-out 1.5s infinite' }}>
              <ellipse cx="30" cy="150" rx="22" ry="12" fill="rgba(76,153,60,0.22)" transform="rotate(20 30 150)" />
              <line x1="18" y1="145" x2="42" y2="155" stroke="rgba(34,100,40,0.18)" strokeWidth="0.8" />
            </g>
            <g style={{ animation: 'leafSway 4s ease-in-out 2s infinite' }}>
              <ellipse cx="50" cy="80" rx="15" ry="8" fill="rgba(76,153,60,0.2)" transform="rotate(-35 50 80)" />
              <line x1="43" y1="84" x2="57" y2="76" stroke="rgba(34,100,40,0.16)" strokeWidth="0.8" />
            </g>
            <path d="M45 380 Q70 370 60 350" stroke="rgba(34,120,60,0.18)" strokeWidth="1" fill="none" />
            <path d="M38 260 Q12 250 20 230" stroke="rgba(34,120,60,0.15)" strokeWidth="1" fill="none" />
            <path d="M42 140 Q68 130 55 110" stroke="rgba(34,120,60,0.15)" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* ═══ MONEY PLANT VINE — RIGHT EDGE (Outer Background / Mobile Foreground) ═══ */}
        <div className="absolute right-[-10px] md:right-[-2%] top-[-5%] z-[15] md:z-[5] pointer-events-none w-[75px] md:w-[190px] h-[120%] opacity-80 md:opacity-100" style={{ animation: 'vineGrow 3.5s ease-out 1s forwards' }}>
          <svg viewBox="0 0 150 500" fill="none" className="w-full h-full" preserveAspectRatio="none" style={{ animation: 'vineCurl 7s ease-in-out 0.5s infinite', transformOrigin: 'top right' }}>
            <path d="M110 0 Q120 60 105 120 Q90 180 112 240 Q125 300 108 360 Q95 420 115 480" stroke="rgba(34,120,60,0.3)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <g style={{ animation: 'leafSway 5s ease-in-out 0.3s infinite' }}>
              <ellipse cx="90" cy="100" rx="17" ry="10" fill="rgba(76,153,60,0.25)" transform="rotate(35 90 100)" />
              <line x1="82" y1="95" x2="98" y2="105" stroke="rgba(34,100,40,0.2)" strokeWidth="0.7" />
            </g>
            <g style={{ animation: 'leafSway 4.5s ease-in-out 1.2s infinite' }}>
              <ellipse cx="125" cy="200" rx="19" ry="11" fill="rgba(76,153,60,0.22)" transform="rotate(-25 125 200)" />
              <line x1="116" y1="205" x2="134" y2="195" stroke="rgba(34,100,40,0.18)" strokeWidth="0.7" />
            </g>
            <g style={{ animation: 'leafSway 5.5s ease-in-out 0.8s infinite' }}>
              <ellipse cx="95" cy="310" rx="20" ry="11" fill="rgba(76,153,60,0.2)" transform="rotate(30 95 310)" />
              <line x1="85" y1="305" x2="105" y2="315" stroke="rgba(34,100,40,0.16)" strokeWidth="0.7" />
            </g>
            <g style={{ animation: 'leafSway 4s ease-in-out 1.8s infinite' }}>
              <ellipse cx="120" cy="420" rx="16" ry="9" fill="rgba(76,153,60,0.22)" transform="rotate(-20 120 420)" />
              <line x1="112" y1="425" x2="128" y2="415" stroke="rgba(34,100,40,0.18)" strokeWidth="0.7" />
            </g>
            <path d="M105 120 Q80 110 88 90" stroke="rgba(34,120,60,0.15)" strokeWidth="1" fill="none" />
            <path d="M112 240 Q138 235 130 215" stroke="rgba(34,120,60,0.12)" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* ═══ FLOATING LEAF PARTICLES (Outer Background / Mobile Foreground) ═══ */}
        <div className="absolute inset-0 z-[15] md:z-[4] pointer-events-none overflow-hidden">
          <div className="absolute opacity-50 md:opacity-100" style={{ left: '8%', top: '-5%', animation: 'leafFall 8s ease-in-out 0s infinite' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="scale-75 md:scale-100"><path d="M12 2C7 4 4 9 4 14c0 3 2 6 5 7l1-4c-2-1-3-3-3-5 0-3 2-7 5-9z" fill="rgba(76,153,60,0.35)"/><path d="M12 2c5 2 8 7 8 12 0 3-2 6-5 7l-1-4c2-1 3-3 3-5 0-3-2-7-5-9z" fill="rgba(60,130,48,0.3)"/><line x1="12" y1="2" x2="12" y2="22" stroke="rgba(34,100,40,0.25)" strokeWidth="0.8"/></svg>
          </div>
          <div className="absolute opacity-60 md:opacity-100" style={{ left: '90%', top: '-8%', animation: 'leafFall 10s ease-in-out 2s infinite' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="scale-75 md:scale-100"><path d="M12 2C7 4 4 9 4 14c0 3 2 6 5 7l1-4c-2-1-3-3-3-5 0-3 2-7 5-9z" fill="rgba(107,142,35,0.3)"/><path d="M12 2c5 2 8 7 8 12 0 3-2 6-5 7l-1-4c2-1 3-3 3-5 0-3-2-7-5-9z" fill="rgba(85,120,30,0.25)"/></svg>
          </div>
          <div className="absolute opacity-40 md:opacity-100" style={{ left: '15%', top: '-3%', animation: 'leafFall 12s ease-in-out 4s infinite' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="8" ry="5" fill="rgba(76,153,60,0.25)" transform="rotate(-45 12 12)"/><line x1="6" y1="16" x2="18" y2="8" stroke="rgba(34,100,40,0.2)" strokeWidth="0.6"/></svg>
          </div>
          <div className="absolute opacity-50 md:opacity-100" style={{ left: '85%', top: '-6%', animation: 'leafFall 9s ease-in-out 1s infinite' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2C7 4 4 9 4 14c0 3 2 6 5 7l1-4c-2-1-3-3-3-5 0-3 2-7 5-9z" fill="rgba(76,153,60,0.3)"/><path d="M12 2c5 2 8 7 8 12 0 3-2 6-5 7l-1-4c2-1 3-3 3-5 0-3-2-7-5-9z" fill="rgba(60,130,48,0.25)"/></svg>
          </div>
          <div className="absolute opacity-50 md:opacity-100" style={{ left: '5%', top: '-10%', animation: 'leafFall 14s ease-in-out 7s infinite' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="scale-75 md:scale-100"><path d="M12 2C7 4 4 9 4 14c0 3 2 6 5 7l1-4c-2-1-3-3-3-5 0-3 2-7 5-9z" fill="rgba(60,130,48,0.25)"/></svg>
          </div>
          <div className="absolute opacity-40 md:opacity-100" style={{ left: '96%', top: '-12%', animation: 'leafFall 11s ease-in-out 4.5s infinite' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="scale-50 md:scale-100"><ellipse cx="12" cy="12" rx="8" ry="6" fill="rgba(107,142,35,0.3)" transform="rotate(45 12 12)"/><line x1="6" y1="18" x2="18" y2="6" stroke="rgba(34,100,40,0.15)" strokeWidth="0.8"/></svg>
          </div>
          <div className="absolute opacity-60 md:opacity-100" style={{ left: '2%', top: '-15%', animation: 'leafFall 16s ease-in-out 2.5s infinite' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C7 4 4 9 4 14c0 3 2 6 5 7l1-4c-2-1-3-3-3-5 0-3 2-7 5-9z" fill="rgba(76,153,60,0.25)"/><path d="M12 2c5 2 8 7 8 12 0 3-2 6-5 7l-1-4c2-1 3-3 3-5 0-3-2-7-5-9z" fill="rgba(60,130,48,0.22)"/></svg>
          </div>
          <div className="absolute opacity-50 md:opacity-100" style={{ left: '93%', top: '-4%', animation: 'leafFall 18s ease-in-out 11s infinite' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="scale-75 md:scale-100"><ellipse cx="12" cy="12" rx="10" ry="6" fill="rgba(107,142,35,0.2)" transform="rotate(-20 12 12)"/><line x1="4" y1="16" x2="20" y2="8" stroke="rgba(34,100,40,0.15)" strokeWidth="0.6"/></svg>
          </div>
          <div className="absolute opacity-40 md:opacity-100" style={{ left: '12%', top: '-14%', animation: 'leafFall 9.5s ease-in-out 3.5s infinite' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="12" rx="5" ry="3" fill="rgba(76,153,60,0.3)" transform="rotate(75 12 12)"/></svg>
          </div>
        </div>

        {/* HERO CARD CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
          <div 
            className="relative w-full h-[400px] md:h-[500px] rounded-[24px] md:rounded-[32px] overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] border-[0.5px] border-black/5"
            onMouseEnter={() => setHeroPaused(true)}
            onMouseLeave={() => setHeroPaused(false)}
          >
            {heroSlides.map((slide, idx) => (
              <div 
                key={idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === heroSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <img src={slide.img} alt={slide.title} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay}`} />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                    <div className="max-w-xl">
                      <span 
                        className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-4 rounded-full"
                        style={{ backgroundColor: slide.accent }}
                      >
                        {slide.badge}
                      </span>
                      <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 whitespace-pre-line">
                        {slide.title}
                      </h2>
                      <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                        {slide.sub}
                      </p>
                      <a 
                        href={slide.ctaHref}
                        className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:scale-105 rounded-full"
                        style={{ backgroundColor: slide.accent }}
                      >
                        {slide.cta}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}



          {/* Dots Navigation */}
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === heroSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CATEGORIES — circular icons with section heading
      ═══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Section heading */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#2d5a3d] tracking-tight">Categories</h2>
          <div className="mx-auto mt-2 w-10 h-[3px] rounded-full bg-[#D4A373]" />
        </div>
        {/* Scrollable category row */}
        <div className="flex gap-5 md:gap-8 overflow-x-auto no-scrollbar pb-2 justify-start md:justify-center">
          {[...blinkitCategories, { id: 'all-cat', label: 'All\nCategories', icon: '→', color: 'bg-[#e6f0ea]' }].map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setProductFilter(cat.id === 'all-cat' ? 'all' : cat.id)}
              className="flex flex-col items-center group min-w-[68px] md:min-w-[80px]"
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${cat.color} flex items-center justify-center text-2xl md:text-3xl border-2 transition-all group-hover:-translate-y-1 group-hover:shadow-lg ${
                (productFilter === cat.id) || (cat.id === 'all-cat' && productFilter === 'all')
                  ? 'border-[#2D5A3F] shadow-[0_0_0_3px_rgba(55,115,85,0.18)]'
                  : 'border-transparent'
              }`}>
                {cat.icon}
              </div>
              <span className={`text-[10px] md:text-[11px] font-bold mt-2 text-center leading-tight transition-colors whitespace-pre-line ${
                (productFilter === cat.id) || (cat.id === 'all-cat' && productFilter === 'all')
                  ? 'text-[#2D5A3F]' : 'text-slate-600'
              }`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          BEST SELLING PRODUCTS — premium rounded card section
      ═══════════════════════════════════════════════════════ */}
      <div className="px-4 md:px-8 lg:px-12 py-6">
        <div
          className="relative overflow-hidden rounded-3xl py-12 px-6 md:px-10"
          style={{
            background: 'linear-gradient(135deg, #f0f7f3 0%, #e8f5ee 30%, #faf6ed 65%, #f5efe0 100%)',
            boxShadow: '0 8px 40px rgba(55,115,85,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            border: '1.5px solid rgba(55,115,85,0.12)',
          }}
        >
          {/* Rich dot-pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(55,115,85,0.08) 1px, transparent 1px)`,
              backgroundSize: '28px 28px',
              opacity: 0.6,
            }}
          />
          {/* Warm gold shimmer top-right */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(210,175,110,0.18) 0%, transparent 70%)' }} />
          {/* Deep green bloom bottom-left */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(55,115,85,0.14) 0%, transparent 70%)' }} />

          {/* Decorative SVG leaves */}
          <svg className="absolute left-0 bottom-0 opacity-[0.10] pointer-events-none" width="260" height="260" viewBox="0 0 200 200" fill="none">
            <path d="M10 190 C40 80, 160 20, 190 10 C160 120, 40 180, 10 190Z" fill="#2D5A3F"/>
            <path d="M100 190 Q100 100 190 10" stroke="#2D5A3F" strokeWidth="2" fill="none"/>
            <path d="M40 190 Q80 110 160 30" stroke="#2D5A3F" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.4"/>
          </svg>
          <svg className="absolute right-0 top-0 opacity-[0.10] pointer-events-none" width="240" height="240" viewBox="0 0 200 200" fill="none">
            <path d="M190 10 C160 120, 40 180, 10 190 C40 80, 160 20, 190 10Z" fill="#D4A373"/>
            <path d="M160 10 Q120 90 20 160" stroke="#D4A373" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.5"/>
          </svg>

          <div className="relative z-10">
            {/* Section heading row */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-[11px] font-black text-[#D4A373] uppercase tracking-[0.25em] mb-1">⭐ Top Picks</p>
                <h2 className="text-2xl md:text-3xl font-black text-[#1e3d2b] leading-tight">Best Selling Products</h2>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-10 h-[3px] rounded-full bg-[#D4A373]" />
                  <div className="w-4 h-[3px] rounded-full bg-[#D4A373]/40" />
                  <div className="w-2 h-[3px] rounded-full bg-[#D4A373]/20" />
                </div>
              </div>
              <a
                href="#products"
                onClick={() => setProductFilter('bestsellers')}
                className="hidden md:flex items-center gap-2 text-[#2D5A3F] font-black text-sm border-2 border-[#2D5A3F]/30 bg-white/60 backdrop-blur-sm px-5 py-2.5 rounded-full hover:bg-[#2D5A3F] hover:text-white hover:border-[#2D5A3F] transition-all duration-300 shadow-sm"
              >
                View All <ChevronRight className="w-4 h-4" />
              </a>
            </div>

          {/* Scroll strip */}
          {(() => {
            const bestSellers = liveProducts.filter(p => p.rating && p.rating >= 4.7).slice(0, 8);
            return (
              <div className="relative group/strip">
                {/* Left arrow */}
                <button
                  onClick={() => scrollBestSellers(-1)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-[#2D5A3F] hover:bg-[#2D5A3F] hover:text-white transition-all opacity-0 group-hover/strip:opacity-100 duration-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {/* Right arrow */}
                <button
                  onClick={() => scrollBestSellers(1)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-[#2D5A3F] hover:bg-[#2D5A3F] hover:text-white transition-all opacity-0 group-hover/strip:opacity-100 duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div ref={bestSellerScrollRef} className="flex gap-5 overflow-x-auto no-scrollbar pb-3">
                  {bestSellers.map(p => {
                    const qty = getProductCartQty(p.id);
                    const selectedSize = selectedSizes[p.id] || (p.sizes && p.sizes[0]) || 'Standard';
                    return (
                      <div
                        key={p.id}
                        className="group bg-white rounded-3xl overflow-hidden flex-shrink-0 w-[210px] md:w-[230px] flex flex-col border border-gray-150 hover:-translate-y-2 transition-all duration-350 hover:shadow-xl"
                        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
                      >
                        {/* ── Image area ── */}
                        <div
                          className="relative h-[170px] md:h-[190px] flex items-center justify-center overflow-hidden cursor-pointer"
                          style={{ background: '#fbfbfa' }}
                          onClick={() => window.location.hash = `#product?id=${p.id}`}
                        >
                          <img
                            src={p.img}
                            alt={p.name}
                            className="h-[85%] w-full object-contain group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Wishlist */}
                          <button className="absolute top-3 right-3 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-350 hover:text-red-500 hover:bg-white transition-all shadow-sm border border-gray-100">
                            <Heart className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* ── Info area ── */}
                        <div className="p-4 flex flex-col flex-1 gap-2">
                          <span className="text-[9px] font-black text-[#2D5A3F] uppercase tracking-wider block">
                            {p.category.replace(/-/g, ' ')}
                          </span>
                          
                          <h3
                            className="font-extrabold text-[#1F3325] text-xs leading-snug line-clamp-2 cursor-pointer hover:text-[#2D5A3F] transition-colors"
                            onClick={() => window.location.hash = `#product?id=${p.id}`}
                          >
                            {p.name}
                          </h3>

                          <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                            {p.desc}
                          </p>

                          {/* Size selector dropdown (if sizes exist) */}
                          {p.sizes && p.sizes.length > 0 && (
                            <div className="relative mb-1 mt-auto">
                              <div className="relative flex items-center">
                                <select
                                  value={selectedSize}
                                  onChange={e => setSelectedSizes({...selectedSizes, [p.id]: e.target.value})}
                                  className="bg-[#F4F7F5] border border-gray-250 text-slate-700 text-[10px] font-bold rounded-lg pl-2.5 pr-6 py-1.5 w-full focus:outline-none focus:border-[#2D5A3F]"
                                >
                                  {p.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
                              </div>
                            </div>
                          )}

                          {/* Faint Divider line */}
                          <div className="border-t border-gray-100 my-1" />

                          {/* Price Section */}
                          {(() => {
                            const displayOriginalPrice = p.originalPrice || Math.round(p.price / 0.9);
                            const discountPercent = Math.round(((displayOriginalPrice - p.price) / displayOriginalPrice) * 100);
                            return (
                              <div className="flex flex-col gap-0.5 mb-2 mt-auto">
                                <span className="text-[10px] text-slate-400 line-through font-bold">₹{displayOriginalPrice}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-base font-black text-slate-900">₹{p.price}</span>
                                  <span className="bg-[#fee2e2] text-[#dc2626] text-[8px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase">
                                    {discountPercent}% OFF
                                  </span>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Add / Stepper */}
                          <div className="mt-auto pt-1">
                            {qty === 0 ? (
                              <button
                                onClick={() => handleStepper(p, 1)}
                                className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-[11px] py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
                              >
                                <ShoppingCart className="w-3.5 h-3.5 text-slate-650" />
                                <span>ADD TO CART</span>
                              </button>
                            ) : (
                              <div className="flex items-center bg-[#2D5A3F] text-white rounded-xl overflow-hidden h-[34px] shadow-sm">
                                <button onClick={() => handleStepper(p, -1)} className="w-8 h-full flex items-center justify-center hover:bg-[#22442F] transition-colors cursor-pointer text-white"><Minus className="w-3 h-3" /></button>
                                <span className="flex-1 text-center font-black text-xs text-white">{qty}</span>
                                <button onClick={() => handleStepper(p, 1)} className="w-8 h-full flex items-center justify-center hover:bg-[#22442F] transition-colors cursor-pointer text-white"><Plus className="w-3 h-3" /></button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Mobile View All */}
          <div className="flex md:hidden justify-center mt-6">
            <a href="#products" onClick={() => setProductFilter('bestsellers')} className="flex items-center gap-2 text-[#2D5A3F] font-black text-sm border-2 border-[#2D5A3F]/25 px-6 py-2.5 rounded-full hover:bg-[#2D5A3F] hover:text-white transition-all">
              View All <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          </div>{/* /relative z-10 */}
        </div>{/* /rounded-3xl card */}
      </div>{/* /outer px wrapper */}

      {/* ═══════════════════════════════════════════════════════
          CURATED BIO-NUTRITION COMBOS
      ═══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-10 pb-4">
        <div className="mb-8">
          <p className="text-[10px] font-black text-[#D4A373] uppercase tracking-[0.25em] mb-1">🎁 Expert Pairings</p>
          <h3 className="text-xl md:text-2xl font-black text-slate-800">Curated Bio-Nutrition Combos</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1">Pre-packed complete symptom recovery bundles mixed for maximum botanical growth.</p>
        </div>

        <div className="flex flex-row overflow-x-auto md:grid md:grid-cols-3 gap-4 md:gap-6 pb-6 pt-2 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory no-scrollbar">
          {[
            {
              title: "Plant Growth Bio-Mix",
              badge: "🔥 Best Value",
              desc: "Combines our baseline NPK nutrient compound, seaweed kelp growth extract, and soil structuring healer for a complete vegetable garden booster.",
              price: 1297,
              originalPrice: 1297,
              pIds: ['core-npk', 'root-stimulator', 'soil-healer'],
              items: ["Agriic Core NPK (349)", "Root Stimulator Kelp (449)", "Active Soil Healer (499)"],
              color: "border-[#D4A373] shadow-[0_8px_30px_rgb(210,175,110,0.06)]"
            },
            {
              title: "Root Defense Shield Pack",
              badge: "🛡️ Pro Protection",
              desc: "Engineered to keep root loops fully secure. Cold-pressed neem oil barrier + root extension bio-booster to shield tender root grids.",
              price: 748,
              originalPrice: 748,
              pIds: ['neem-shield', 'root-stimulator'],
              items: ["Agriic Neem Pest Shield (299)", "Root Stimulator Kelp (449)"],
              color: "border-emerald-100 shadow-sm"
            },
            {
              title: "Vegetable Grower Set",
              badge: "🌱 Seed to Bloom",
              desc: "All-in-one organic setup. Includes high-germination hybrid tomato seeds, core NPK fertilizer, organic soil structuring powder, and bloom booster.",
              price: 1436,
              originalPrice: 1436,
              pIds: ['seed-tomato', 'core-npk', 'bloom-booster', 'soil-healer'],
              items: ["Tomato F1 Hybrid Seeds (189)", "Core NPK Formula (349)", "Bloom Booster (399)", "Active Soil Healer (499)"],
              color: "border-emerald-100 shadow-sm"
            }
          ].map((combo, idx) => {
            const addComboToCart = () => {
              combo.pIds.forEach(id => {
                const prod = liveProducts.find(p => p.id === id);
                if (prod) {
                  addToCart(prod, 1);
                }
              });
            };

            return (
              <div key={idx} className={`bg-white rounded-[24px] p-6 border-2 flex flex-col justify-between hover:scale-[1.01] transition-transform min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-center md:snap-align-none ${combo.color}`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#e8f5ee] text-[#2D5A3F] text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">{combo.badge}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Bundle Save</span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-base mb-2">{combo.title}</h4>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-6">{combo.desc}</p>
                  
                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-3">INCLUDED PRODUCTS:</span>
                    <ul className="space-y-2">
                      {combo.items.map((item, i) => (
                        <li key={i} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A3F] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5 mt-auto flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xl font-black text-slate-900">₹{combo.price}</span>
                  </div>
                  <button
                    onClick={addComboToCart}
                    className="bg-[#2D5A3F] hover:bg-[#2d5a3d] text-white font-black text-[11px] px-5 py-2.5 rounded-xl uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Add Bundle ⚡
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SHOP BY PLANT CONCERN — circular filter row
      ═══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-4">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-[0px_4px_20px_rgba(55,115,85,0.04)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] font-black text-[#D4A373] uppercase tracking-[0.2em] mb-0.5">🩺 Plant Diagnosis</p>
              <h3 className="text-lg font-black text-slate-800">Shop by Plant Concern</h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Select a common plant symptom to find tailored organic solutions immediately.</p>
            </div>
            {selectedConcern && (
              <button
                onClick={() => setSelectedConcern(null)}
                className="text-xs font-bold text-red-500 hover:text-red-650 transition-colors bg-red-50 px-3.5 py-1.5 rounded-full w-max shrink-0 border border-red-100"
              >
                Clear Symptom Filter ✕
              </button>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 lg:grid lg:grid-cols-5 lg:gap-4">
            {[
              { id: 'pest', label: 'Pest Control', icon: '🐛', desc: 'Bugs, insects, beetles' },
              { id: 'soil', label: 'Soil Health', icon: '🪨', desc: 'Hard soil, low nutrients' },
              { id: 'growth', label: 'Slow Growth', icon: '🌱', desc: 'Stunted plant development' },
              { id: 'leaves', label: 'Leaf Yellowing', icon: '🍂', desc: 'Nutrient deficiency signs' },
              { id: 'roots', label: 'Root Care', icon: '🪱', desc: 'Root decay & rot shields' }
            ].map((concern) => {
              const isSelected = selectedConcern === concern.id;
              return (
                <button
                  key={concern.id}
                  onClick={() => setSelectedConcern(isSelected ? null : concern.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all flex-shrink-0 min-w-[155px] lg:min-w-0 ${
                    isSelected
                      ? 'bg-[#e8f5ee] border-[#2D5A3F] shadow-sm shadow-[#2D5A3F]/10'
                      : 'bg-[#fbfbfa] border-gray-100 hover:border-[#2D5A3F]/40 hover:bg-white'
                  }`}
                >
                  <span className="text-2xl shrink-0">{concern.icon}</span>
                  <div>
                    <h4 className={`text-xs font-black leading-tight whitespace-nowrap ${isSelected ? 'text-[#2D5A3F]' : 'text-slate-800'}`}>
                      {concern.label}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5 leading-none">
                      {concern.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          ALL PRODUCTS — full-width grid (no sidebar)
      ═══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Section header + sort bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#2d5a3d]">
              {productFilter === 'all' ? 'All Products' : blinkitCategories.find(c => c.id === productFilter)?.label || 'Products'}
            </h2>
            <div className="mt-1 w-10 h-[3px] rounded-full bg-[#D4A373]" />
          </div>
          <div className="flex items-center gap-3">
            {/* Filter drawer trigger */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-1.5 text-[#2D5A3F] text-xs font-black uppercase tracking-wider bg-white border border-[#2D5A3F]/30 px-3 py-2 rounded-lg shadow-sm hover:bg-[#2D5A3F] hover:text-white transition-all"
            >
              <Filter className="w-3.5 h-3.5" /> Filters
            </button>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <span className="text-xs text-gray-400 font-bold">{filteredProducts.length} Products</span>
              <span className="text-gray-300">|</span>
              Sort:
              <select className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#2D5A3F] shadow-sm">
                <option>Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product grid — full width, 4 columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {paginatedProducts.map(p => {
            const qty = getProductCartQty(p.id);
            const selectedSize = selectedSizes[p.id] || (p.sizes && p.sizes[0]) || 'Standard';
            return (
              <div key={p.id} className="bg-white rounded-3xl border border-gray-150 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col relative overflow-hidden">
                {/* Image */}
                <div className="relative h-36 md:h-44 bg-[#f7f7f5] flex items-center justify-center p-3 cursor-pointer rounded-t-2xl overflow-hidden" onClick={() => window.location.hash = `#product?id=${p.id}`}>
                  <img src={p.img} alt={p.name} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                  {/* Badges overlay */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="bg-yellow-400/90 text-yellow-900 text-[8px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 w-max"><Star className="w-2.5 h-2.5 fill-current" />{p.rating || '4.8'}</span>
                    </div>
                    <button className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-slate-350 hover:text-red-500 transition-colors shadow-sm">
                      <Heart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4 flex flex-col flex-1 gap-2">
                  <span className="text-[9px] font-black text-[#2D5A3F] uppercase tracking-wider block">
                    {p.category.replace(/-/g, ' ')}
                  </span>
                  
                  <h3 className="font-extrabold text-[#1F3325] text-xs leading-snug line-clamp-2 cursor-pointer hover:text-[#2D5A3F] transition-colors" onClick={() => window.location.hash = `#product?id=${p.id}`}>
                    {p.name}
                  </h3>

                  <p className="text-[10px] text-slate-500 leading-normal line-clamp-2">
                    {p.desc}
                  </p>

                  {/* Size selector dropdown (if sizes exist) */}
                  {p.sizes && p.sizes.length > 0 && (
                    <div className="relative mb-1 mt-auto">
                      <div className="relative flex items-center">
                        <select
                          value={selectedSize}
                          onChange={e => setSelectedSizes({...selectedSizes, [p.id]: e.target.value})}
                          className="w-full bg-[#F4F7F5] border border-gray-200 text-slate-750 text-[10px] font-bold rounded-lg pl-2.5 pr-6 py-1.5 appearance-none focus:outline-none focus:border-[#2D5A3F]"
                        >
                          {p.sizes.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {/* Faint Divider line */}
                  <div className="border-t border-gray-100 my-1" />

                  {/* Price Section */}
                  {(() => {
                    const displayOriginalPrice = p.originalPrice || Math.round(p.price / 0.9);
                    const discountPercent = Math.round(((displayOriginalPrice - p.price) / displayOriginalPrice) * 100);
                    return (
                      <div className="flex flex-col gap-0.5 mb-2 mt-auto">
                        <span className="text-[10px] text-slate-400 line-through font-bold">₹{displayOriginalPrice}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black text-slate-900">₹{p.price}</span>
                          <span className="bg-[#fee2e2] text-[#dc2626] text-[8px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase">
                            {discountPercent}% OFF
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Add / Stepper */}
                  <div className="mt-auto pt-1">
                    {qty === 0 ? (
                      <button
                        onClick={() => handleStepper(p, 1)}
                        className="w-full bg-[#2D5A3F] hover:bg-[#22442F] text-white font-bold text-[11px] py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 text-white" />
                        <span>Add to Cart</span>
                      </button>
                    ) : (
                      <div className="flex items-center bg-[#2D5A3F] text-white rounded-lg overflow-hidden h-[30px] border border-[#2D5A3F] shadow-sm">
                        <button onClick={() => handleStepper(p, -1)} className="w-8 h-full flex items-center justify-center hover:bg-[#22442F] transition-colors cursor-pointer text-white"><Minus className="w-3 h-3" /></button>
                        <span className="flex-1 text-center font-black text-xs">{qty}</span>
                        <button onClick={() => handleStepper(p, 1)} className="w-8 h-full flex items-center justify-center hover:bg-[#22442F] transition-colors cursor-pointer text-white"><Plus className="w-3 h-3" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 mb-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2D5A3F] hover:text-white hover:border-[#2D5A3F] transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                // Show first, last, current, and adjacent pages
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl font-extrabold text-sm transition-all duration-300 ${
                        currentPage === pageNum 
                          ? 'bg-[#2D5A3F] text-white shadow-md' 
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-[#2D5A3F] hover:text-[#2D5A3F]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 || 
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum} className="text-gray-400 font-bold px-1">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2D5A3F] hover:text-white hover:border-[#2D5A3F] transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* FILTER DRAWER (mobile + desktop trigger) */}
      <aside className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity ${isFilterDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 h-[70vh] overflow-y-auto transition-transform ${isFilterDrawerOpen ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-lg">Filters</h3>
            <button onClick={() => setIsFilterDrawerOpen(false)} className="p-2 bg-slate-100 rounded-full"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-extrabold text-sm text-slate-800 mb-3 uppercase tracking-wider">Price Range</h4>
              <input type="range" min="0" max="5000" step="100" value={priceRange} onChange={e => setPriceRange(Number(e.target.value))} className="w-full accent-[#2D5A3F]" />
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mt-1"><span>₹0</span><span>Up to ₹{priceRange}</span></div>
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-800 mb-3 uppercase tracking-wider">Category</h4>
              <div className="flex flex-wrap gap-2">
                {blinkitCategories.map(c => (
                  <button key={c.id} onClick={() => setProductFilter(c.id)} className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${productFilter === c.id ? 'bg-[#2D5A3F] text-white border-[#2D5A3F]' : 'bg-white text-slate-600 border-gray-200 hover:border-[#2D5A3F]'}`}>{c.label}</button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => setIsFilterDrawerOpen(false)} className="w-full bg-[#2D5A3F] text-white font-black py-3.5 rounded-2xl shadow-lg mt-6">Apply Filters</button>
        </div>
      </aside>

      {/* ── MINIMALIST PRESS BAR ("AS SEEN IN") ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 border-t border-gray-200/60 mt-12 select-none">
        <p className="text-center text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase mb-6">Featured & Trusted By</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-40 grayscale">
          <span className="text-sm font-black tracking-widest text-slate-705">AGRICULTURE TODAY</span>
          <span className="text-sm font-bold tracking-widest text-slate-705 italic">The Botanical Times</span>
          <span className="text-sm font-black tracking-widest text-slate-705">GREEN·METRICS</span>
          <span className="text-sm font-semibold tracking-widest text-slate-705 uppercase">Organic Council</span>
          <span className="text-sm font-black tracking-widest text-slate-705">AGRI-NUTRITION</span>
        </div>
      </div>


    </div>

      {/* QUICK VIEW MODAL */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-[20px] overflow-hidden flex flex-col md:flex-row relative max-h-[90vh]">
            <button onClick={() => setQuickViewProduct(null)} className="absolute top-4 right-4 z-10 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"><X className="w-5 h-5 text-slate-600" /></button>
            <div className="w-full md:w-1/2 bg-[#F4F7F5] p-8 flex items-center justify-center min-h-[300px]">
              <img src={quickViewProduct.img} alt={quickViewProduct.name} className="w-full h-full object-contain mix-blend-multiply" />
            </div>
            <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col overflow-y-auto">
              {quickViewProduct.badge && <span className="bg-[#e8f5e9] text-[#2D5A3F] text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest w-max mb-4">{quickViewProduct.badge}</span>}
              <h2 className="text-2xl font-black text-slate-900 mb-2">{quickViewProduct.name}</h2>
              <div className="flex items-center gap-2 text-sm mb-6">
                <span className="flex items-center text-yellow-500"><Star className="w-4 h-4 fill-current mr-1" /> {quickViewProduct.rating || '4.8'}</span>
                <span className="text-gray-300">|</span>
                <span className="text-slate-500 font-semibold">{quickViewProduct.reviews || 124} Reviews</span>
              </div>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-3xl font-black text-[#2D5A3F]">₹{quickViewProduct.price}</span>
                {quickViewProduct.originalPrice && <span className="text-lg text-slate-400 line-through font-semibold mb-1">₹{quickViewProduct.originalPrice}</span>}
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-[20px] p-4 mb-6 flex gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-800 text-sm">Subscribe & Save 10%</h4>
                  <p className="text-xs text-emerald-600 mt-1">Get this delivered automatically every month.</p>
                </div>
              </div>
              <div className="mt-auto pt-4">
                {getProductCartQty(quickViewProduct.id) === 0 ? (
                  <button 
                    onClick={() => handleStepper(quickViewProduct, 1)}
                    className="w-full bg-[#2D5A3F] hover:bg-[#2D5A3F] text-white font-black py-4 rounded-[20px] shadow-lg transition-colors flex justify-center items-center gap-2 uppercase tracking-wide"
                  >
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-slate-100 p-2 rounded-[20px]">
                    <button onClick={() => handleStepper(quickViewProduct, -1)} className="w-12 h-12 bg-white rounded-lg flex items-center justify-center hover:bg-slate-50 shadow-[0px_4px_12px_0px_#0000001F]"><Minus className="w-5 h-5" /></button>
                    <span className="font-black text-lg">{getProductCartQty(quickViewProduct.id)} in cart</span>
                    <button onClick={() => handleStepper(quickViewProduct, 1)} className="w-12 h-12 bg-[#2D5A3F] text-white rounded-lg flex items-center justify-center shadow-[0px_4px_12px_0px_#0000001F] hover:bg-[#2D5A3F]"><Plus className="w-5 h-5" /></button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING WHATSAPP BUTTON */}
      <a href="https://wa.me/918047863601" target="_blank" rel="noopener noreferrer" className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-50 bg-[#25D366] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer">
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-3 z-40 pb-5 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
         <a href="#home" className="flex flex-col items-center text-slate-400 hover:text-[#2D5A3F]">
           <Leaf className="w-5 h-5 mb-1" />
           <span className="text-[9px] font-bold uppercase tracking-wider">Home</span>
         </a>
         <button onClick={() => setIsFilterDrawerOpen(true)} className="flex flex-col items-center text-slate-400 hover:text-[#2D5A3F]">
           <Filter className="w-5 h-5 mb-1" />
           <span className="text-[9px] font-bold uppercase tracking-wider">Categories</span>
         </button>
         <a
           href="#cart"
           onClick={(e) => {
             if (setIsCartDrawerOpen) {
               e.preventDefault();
               setIsCartDrawerOpen(true);
             }
           }}
           className="flex flex-col items-center text-slate-400 hover:text-[#2D5A3F] relative"
         >
           <ShoppingCart className="w-5 h-5 mb-1" />
           {getCartCount() > 0 && <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">{getCartCount()}</span>}
           <span className="text-[9px] font-bold uppercase tracking-wider">Cart</span>
         </a>
         <a href="#profile" className="flex flex-col items-center text-slate-400 hover:text-[#2D5A3F]">
           <User className="w-5 h-5 mb-1" />
           <span className="text-[9px] font-bold uppercase tracking-wider">Account</span>
         </a>
      </div>

    </>
  );
};
