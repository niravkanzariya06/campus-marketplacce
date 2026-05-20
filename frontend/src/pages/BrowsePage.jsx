import { useEffect, useRef, useState, useMemo } from "react";
import usePageTitle from '../hooks/usePageTitle';
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, fetchMoreProducts } from "../store/productSlice";
import SearchBar from "../Components/browse/SearchBar";
import ItemCard from "../Components/home/featuredproduct/ItemCard";
import { Skeleton } from "boneyard-js/react";
import { ProductGridFixture } from "../bones/fixtures";
import { useToast } from "../Components/Toast/ToastContainer";
import { Package, SearchX } from "lucide-react";

const Browse = () => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  usePageTitle('Browse');

  const products = useSelector((state) => state.products?.products || []);
  const loading = useSelector((state) => state.products?.loading || false);
  const pagination = useSelector((state) => state.products?.pagination || { page: 1, hasMore: true, totalPages: 1, total: 0 });
  const isLoadingMore = useSelector((state) => state.products?.isLoadingMore || false);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [campusHub, setCampusHub] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);



  const fullCategoriesList = [
    { value: "electronics", label: "Electronics / Tech" },
    { value: "textbooks", label: "Textbooks" },
    { value: "furniture", label: "Furniture" },
    { value: "appliances", label: "Appliances" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "services", label: "Campus Services" },
  ];

  const lastProductRef = useRef();
  const sliderRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  useEffect(() => {
    if (isLoadingMore || !pagination.hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) dispatch(fetchMoreProducts()); },
      { threshold: 0.1 }
    );
    if (lastProductRef.current) observer.observe(lastProductRef.current);
    return () => observer.disconnect();
  }, [dispatch, isLoadingMore, pagination.hasMore]);

  const filteredProducts = useMemo(() => {
    try {
      if (!Array.isArray(products)) return [];
      let result = [...products];
      if (search) { const s = search.toLowerCase(); result = result.filter((p) => p.title?.toLowerCase().includes(s)); }
      if (selectedCategory && selectedCategory !== "all") result = result.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());
      const min = minPrice && !isNaN(parseInt(minPrice)) ? parseInt(minPrice) : undefined;
      const max = maxPrice && !isNaN(parseInt(maxPrice)) ? parseInt(maxPrice) : undefined;
      if (min !== undefined) result = result.filter((p) => { const pp = parseFloat(p.price); return !isNaN(pp) && pp >= min; });
      if (max !== undefined) result = result.filter((p) => { const pp = parseFloat(p.price); return !isNaN(pp) && pp <= max; });
      if (campusHub) result = result.filter((p) => p.location?.toLowerCase().includes(campusHub.toLowerCase()));
      switch (sort) {
        case "newest": result.sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)); break;
        case "low-high": result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); break;
        case "high-low": result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); break;
        case "popular": result.sort((a, b) => (b.views || 0) - (a.views || 0)); break;
        case "favorites": result.sort((a, b) => (b.favoriteCount || 0) - (a.favoriteCount || 0)); break;
      }
      return result;
    } catch { return []; }
  }, [products, search, selectedCategory, minPrice, maxPrice, campusHub, sort]);

  const PRICE_MIN = 500, PRICE_MAX = 25000;
  const minVal = minPrice && !isNaN(parseInt(minPrice)) ? parseInt(minPrice) : PRICE_MIN;
  const maxVal = maxPrice && !isNaN(parseInt(maxPrice)) ? parseInt(maxPrice) : PRICE_MAX;
  const minPercent = Math.max(0, Math.min(100, ((minVal - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((maxVal - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100));

  const handleResetFilters = () => { setSearch(""); setSelectedCategory("all"); setSort("newest"); setMinPrice(""); setMaxPrice(""); setCampusHub(""); showToast("Filters cleared", "info", 2000); };

  const handleSliderMouseDown = (type) => (e) => { e.preventDefault(); setDragging(type); };

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => {
      if (!sliderRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const rect = sliderRef.current.getBoundingClientRect();
      const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const price = Math.round(PRICE_MIN + (pct / 100) * (PRICE_MAX - PRICE_MIN));
      if (dragging === 'min') { const mx = maxPrice ? parseInt(maxPrice) : PRICE_MAX; if (price <= mx) setMinPrice(price.toString()); }
      else { const mn = minPrice ? parseInt(minPrice) : PRICE_MIN; if (price >= mn) setMaxPrice(price.toString()); }
    };
    const up = () => setDragging(null);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('touchend', up);
    return () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); document.removeEventListener('touchmove', move); document.removeEventListener('touchend', up); };
  }, [dragging, minPrice, maxPrice]);

  const renderFilters = (onAction) => (
    <>
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3">Category</h4>
        <div className="relative">
          <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); onAction?.(); }}
            className="w-full bg-surface-container-highest border-none rounded-lg py-2.5 px-3 text-sm font-medium text-on-surface appearance-none focus-glow-indigo">
            <option value="all">All Categories</option>
            {fullCategoriesList.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">arrow_drop_down</span>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3">Sort By</h4>
        <select value={sort} onChange={(e) => { setSort(e.target.value); onAction?.(); }}
          className="w-full bg-surface-container-highest border-none rounded-lg py-2.5 px-3 text-sm font-medium text-on-surface appearance-none focus-glow-indigo">
          <option value="newest">Newest First</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
          <option value="popular">Most Popular</option>
          <option value="favorites">Most Favorited</option>
        </select>
      </div>
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3">Price Range (₹)</h4>
        <div className="relative pt-2 pb-4" ref={sliderRef}>
          <div className="h-1.5 bg-surface-container-highest rounded-full">
            <div className="absolute h-full bg-primary rounded-full" style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}></div>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-2 border-surface-container-highest shadow-[0_0_15px_rgba(99,102,241,0.5)] cursor-pointer touch-none"
            style={{ left: `${minPercent}%` }} onMouseDown={handleSliderMouseDown('min')} onTouchStart={handleSliderMouseDown('min')}></div>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-2 border-surface-container-highest shadow-[0_0_15px_rgba(99,102,241,0.5)] cursor-pointer touch-none"
            style={{ left: `${maxPercent}%` }} onMouseDown={handleSliderMouseDown('max')} onTouchStart={handleSliderMouseDown('max')}></div>
        </div>
        <div className="flex justify-between gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant">₹</span>
            <input type="text" inputMode="numeric" value={minPrice} onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ''))}
              className="w-full pl-6 pr-2 py-2 rounded-lg bg-surface-container-highest text-on-surface text-sm border border-subtle focus-glow-indigo" placeholder="Min" />
          </div>
          <span className="self-center text-on-surface-variant">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant">₹</span>
            <input type="text" inputMode="numeric" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ''))}
              className="w-full pl-6 pr-2 py-2 rounded-lg bg-surface-container-highest text-on-surface text-sm border border-subtle focus-glow-indigo" placeholder="Max" />
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-3">Campus Hub</h4>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary text-sm">location_on</span>
          <select value={campusHub} onChange={(e) => { setCampusHub(e.target.value); onAction?.(); }}
            className="w-full bg-surface-container-highest border-none rounded-lg py-2.5 pl-10 pr-4 text-sm font-medium text-on-surface appearance-none focus-glow-indigo">
            <option value="">All Locations</option>
            <option value="North Campus Library">North Campus Library</option>
            <option value="Engineering Block A">Engineering Block A</option>
            <option value="Student Activity Center">Student Activity Center</option>
            <option value="Hostel Block C">Hostel Block C</option>
          </select>
        </div>
      </div>
      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary/10 to-tertiary/10 border border-primary/20 text-primary font-bold text-sm hover:bg-primary hover:text-on-primary transition-all"
        onClick={() => { handleResetFilters(); onAction?.(); }}>Reset Filters</button>
    </>
  );

  return (
    <main className="min-h-screen bg-surface">
      <div className="sticky top-16 z-40 bg-surface/95 backdrop-blur-sm border-b border-white/5 pb-4">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 pt-4">
          <SearchBar search={search} setSearch={setSearch} onSearch={() => { }} compact />
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Text Category Row */}
          <div className="flex-1 flex items-center gap-6 overflow-x-auto scrollbar-hide snap-x">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`shrink-0 snap-start whitespace-nowrap text-sm font-bold pb-2 border-b-2 transition-all ${selectedCategory === "all" ? "text-primary border-primary" : "text-on-surface-variant border-transparent hover:text-on-surface"}`}
            >
              All
            </button>
            {fullCategoriesList.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`shrink-0 snap-start whitespace-nowrap text-sm font-bold pb-2 border-b-2 transition-all ${selectedCategory === cat.value ? "text-primary border-primary" : "text-on-surface-variant border-transparent hover:text-on-surface"}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Mobile Filters Toggle (Only visible on small screens) */}
          <button className="lg:hidden shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg glass-card border border-white/10 text-on-surface-variant hover:border-primary/40 transition-all"
            onClick={() => setShowMobileFilters(!showMobileFilters)}>
            <span className="material-symbols-outlined text-sm">tune</span>
            <span className="text-sm font-bold">Filters</span>
            {(selectedCategory !== "all" || sort !== "newest" || minPrice || maxPrice || campusHub) && <span className="w-2 h-2 rounded-full bg-primary"></span>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4 relative pb-12">
          <aside className="hidden lg:block lg:col-span-1" aria-label="Filters">
            <div className="sticky top-[200px] glass-card rounded-2xl p-6 space-y-6 border border-white/5 max-h-[calc(100vh-240px)] overflow-y-auto scrollbar-thin">
              <h3 className="text-lg font-extrabold font-plus-jakarta mb-4 text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">filter_list</span> Filters
              </h3>
              {renderFilters()}
            </div>
          </aside>

          <section className="lg:col-span-3" aria-label="Product listings">
            <Skeleton name="product-grid" loading={loading} fixture={<ProductGridFixture />}>
              {loading ? null : (filteredProducts || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 animate-fadeIn">
                  <div className="p-4 glass-card rounded-full mb-6">
                    {search || selectedCategory !== "all" || minPrice || maxPrice || campusHub
                      ? <SearchX className="w-12 h-12 text-primary" />
                      : <Package className="w-12 h-12 text-on-surface-variant" />}
                  </div>
                  <h3 className="text-2xl font-bold font-plus-jakarta text-on-surface mb-2">No products found</h3>
                  <p className="text-on-surface-variant text-center max-w-md mb-6">
                    {search || selectedCategory !== "all" || minPrice || maxPrice || campusHub
                      ? "Try adjusting your filters or search terms"
                      : "No products available at the moment. Be the first to list one!"}
                  </p>
                  {(search || selectedCategory !== "all" || minPrice || maxPrice || campusHub) && (
                    <button onClick={handleResetFilters} className="px-6 py-2 bg-primary/10 border border-primary/30 text-primary font-bold rounded-xl hover:bg-primary hover:text-on-primary transition-all">Clear Filters</button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                    {filteredProducts.map((doc, index) => (
                      <div key={doc.$id} ref={index === filteredProducts.length - 1 ? lastProductRef : null} className="animate-fadeIn">
                        <ItemCard id={doc.$id} imgUrl={doc.imageId} category={doc.category} name={doc.title} price={doc.price}
                          views={doc.views} favoriteCount={doc.favoriteCount} condition={doc.condition}
                          sellerName={doc.sellerName} sellerAvatar={doc.sellerAvatar} rating={doc.rating} />
                      </div>
                    ))}
                  </div>
                  {isLoadingMore && (
                    <div className="w-full py-8">
                      <Skeleton name="product-grid" loading={true} fixture={<ProductGridFixture />}>
                        <div />
                      </Skeleton>
                    </div>
                  )}
                  <div className="text-center text-on-surface-variant text-sm py-4">
                    Showing {filteredProducts.length} of {products.length} loaded{pagination?.hasMore && " • Scroll for more"}
                  </div>
                </>
              )}
            </Skeleton>
          </section>
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-surface-container-highest shadow-2xl overflow-y-auto animate-slideIn">
            <div className="sticky top-0 bg-surface-container-highest border-b border-white/10 p-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-extrabold font-plus-jakarta text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">filter_list</span> Filters
              </h3>
              <button className="p-2 text-on-surface-variant hover:text-primary transition-colors" onClick={() => setShowMobileFilters(false)}>
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="p-6 space-y-6">{renderFilters(() => setShowMobileFilters(false))}</div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Browse;
