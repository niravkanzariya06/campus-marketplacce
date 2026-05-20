import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import usePageTitle from '../hooks/usePageTitle';
import {
  MessageSquare,
  MapPin,
  Calendar,
  Package,
  ChevronLeft,
  AlertCircle,
  Star
} from "lucide-react";
import productService from '../services/productService';
import Cart from '../Components/home/featuredproduct/ItemCard';
import chatService from '../services/chatService';
import profileService from '../services/profileService';
import { useToast } from '../Components/Toast/ToastContainer';
import AtmosphericBlooms from '../Components/AtmosphericBlooms';
import { Skeleton } from "boneyard-js/react";
import { ProductDetailFixture } from '../bones/fixtures';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Reset scroll to top on mount and when id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const products = useSelector((state) => state.products.products);
  const user = useSelector((state) => state.auth.userData);

  const [product, setProduct] = useState(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  usePageTitle(product?.title || 'Product Details');

  // Fetch product from API if not in Redux
  useEffect(() => {
    let cancelled = false;
    const loadProduct = async () => {
      setIsLoading(true);
      const fromRedux = products.find((p) => p.$id === id);
      if (fromRedux) {
        if (!cancelled) {
          setProduct(fromRedux);
          setIsLoading(false);
        }
        return;
      }
      try {
        const data = await productService.getProduct(id);
        if (!cancelled && data) {
          setProduct(data);
        }
      } catch {
        // swallow, product stays null
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    loadProduct();
    return () => { cancelled = true; };
  }, [id, products]);

  // Loading state — show boneyard skeleton
  if (isLoading) {
    return (
      <Skeleton name="product-detail" loading={true} fixture={<ProductDetailFixture />}>
        <div />
      </Skeleton>
    );
  }

  // Show error state if product not found (early return is fine for 404)
  if (!product) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-background py-6 px-4 relative">
        <AtmosphericBlooms intensity="medium" />
        <div className="flex flex-col items-center text-center relative z-10">
          <AlertCircle className="w-12 h-12 text-error mb-4" />
          <h2 className="text-2xl font-semibold text-on-surface mb-2">Product Not Found</h2>
          <p className="text-on-surface-variant mb-6 max-w-md">This product doesn't exist or has been removed.</p>
          <button onClick={() => navigate("/browse")} className="px-6 py-3 btn-gradient-primary text-on-surface font-bold rounded-xl flex items-center gap-2 shadow-lg">
            <ChevronLeft className="w-4 h-4" /> Back to Browse
          </button>
        </div>
      </div>
    );
  }

  // Related products - show only approved AND active products
  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.$id !== product.$id && p.status === 'approved' && p.listing_status === 'active'
  ).slice(0, 4);

  const handleMessageSeller = async () => {
    try {
      if (!user) {
        showToast('Please log in to message sellers', 'info', 3000);
        navigate("/login");
        return;
      }

      if (user.$id === product.userId) {
        showToast("You can't message yourself", 'warning', 3000);
        return;
      }

      setIsLoadingChat(true);
      const buyerId = user.$id;
      const buyerName = user.name || user.email.split("@")[0];
      const sellerId = product.userId;
      const sellerName = product.sellerName;
      const productId = product.$id;
      const productName = product.title;

      const conversation = await chatService.getOrCreateConversation(
        buyerId,
        buyerName,
        sellerId,
        sellerName,
        productId,
        productName
      );

      if (conversation) {
        showToast('Chat opened successfully', 'success', 2000);
        navigate("/chat");
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      showToast(`Failed to start chat: ${error.message}`, 'error', 4000);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'Recently added';
    }
  };

  return (
    <Skeleton name="product-detail" loading={false}>
      <div className="w-full min-h-screen flex flex-col items-center bg-background py-6 pb-32 relative">
        <AtmosphericBlooms intensity="medium" />

        {/* Breadcrumb */}
        <nav className="animate-fadeIn flex items-center gap-2 text-on-surface-variant text-xs sm:text-sm mb-4 sm:mb-8 font-medium w-[92%] sm:w-[90%] lg:w-[82%] relative z-10 overflow-x-auto">
          <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate("/browse")}>Marketplace</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="hover:text-primary transition-colors cursor-pointer">{product.category}</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-primary">{product.title}</span>
        </nav>

        <div className="w-[92%] sm:w-[90%] lg:w-[82%] relative z-10 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">

            {/* LEFT COLUMN: Immersive Hero & Gallery */}
            <div className="md:col-span-7">
              {/* Main Product Card with 3D Tilt */}
              <div className="relative group aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-surface-container-high shadow-2xl flex items-center justify-center p-4 md:p-8 transition-all duration-700 border border-white/10 tilt-card mt-4 md:mt-8">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent"></div>
                <img
                  src={productService.getFileView(product.imageId)}
                  alt={product.title}
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700 drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
                  loading="lazy"
                />
                {/* Condition Badge - Glass Overlay */}
                {product.condition && (
                  <div className="absolute top-8 left-8 px-4 py-2 bg-surface-bright/30 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    {product.condition}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Details & Floating Card */}
            <div className="md:col-span-5 flex flex-col">
              <div className="space-y-6">
                {/* Product Title with gradient */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-plus-jakarta tracking-tight leading-tight">
                  {product.title}
                </h1>

                {/* Price & Category */}
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-on-surface">₹ {parseFloat(product.price).toLocaleString('en-IN')}</div>
                  <div className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold">NEGOTIABLE</div>
                </div>

                {/* Description */}
                <p className="text-on-surface-variant leading-relaxed text-lg font-body">
                  {product.description || "No description provided"}
                </p>

                {/* Specs Grid - Clean glass cards */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div className="p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl bg-surface-container-high glass-shine">
                    <div className="text-on-surface-variant text-[10px] sm:text-xs md:text-sm uppercase font-bold tracking-widest mb-1 sm:mb-1.5 opacity-60">Condition</div>
                    <div className="text-on-surface font-plus-jakarta font-bold text-sm sm:text-base md:text-lg truncate">{product.condition || "Not specified"}</div>
                  </div>
                  <div className="p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl bg-surface-container-high glass-shine">
                    <div className="text-on-surface-variant text-[10px] sm:text-xs md:text-sm uppercase font-bold tracking-widest mb-1 sm:mb-1.5 opacity-60">Location</div>
                    <div className="text-on-surface font-plus-jakarta font-bold text-sm sm:text-base md:text-lg truncate">{product.location || "Not specified"}</div>
                  </div>
                  <div className="p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl bg-surface-container-high glass-shine">
                    <div className="text-on-surface-variant text-[10px] sm:text-xs md:text-sm uppercase font-bold tracking-widest mb-1 sm:mb-1.5 opacity-60">Posted</div>
                    <div className="text-on-surface font-plus-jakarta font-bold text-sm sm:text-base md:text-lg truncate">{formatDate(product.$createdAt)}</div>
                  </div>
                  <div className="p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl bg-surface-container-high glass-shine">
                    <div className="text-on-surface-variant text-[10px] sm:text-xs md:text-sm uppercase font-bold tracking-widest mb-1 sm:mb-1.5 opacity-60">Category</div>
                    <div className="text-on-surface font-plus-jakarta font-bold text-sm sm:text-base md:text-lg truncate">{product.category}</div>
                  </div>
                </div>
              </div>

              {/* Seller Profile Card - Floating Glass */}
              <div className="p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2.5rem] glass-intense border border-white/5 shadow-2xl relative overflow-hidden group tilt-card backdrop-blur-xl mt-6 md:mt-10">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-tertiary/3 pointer-events-none"></div>

                {/* Animated Verified Badge */}
                <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:opacity-20">
                  <span className="material-symbols-outlined text-6xl text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                </div>

                <div className="relative flex items-center gap-4 mb-8">
                  {/* Seller Avatar with subtle glow */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-tertiary rounded-2xl blur opacity-25 group-hover:opacity-50 group-hover:blur-md transition-all duration-500"></div>
                    <img
                      src={profileService.getProfilePhoto(product.sellerAvatar) || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
                      alt={product.sellerName || "Seller"}
                      className="relative w-16 h-16 rounded-2xl object-cover border border-tertiary/20"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="font-plus-jakarta font-bold text-xl text-on-surface">{product.sellerName || "Unknown Seller"}</div>
                    <div className="flex items-center gap-2 text-tertiary text-sm">
                      <Star className="w-4 h-4" style={{ fill: 'currentColor' }} />
                      <span className="font-semibold">Campus Seller</span>
                      <span className="text-on-surface-variant">• Verified</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleMessageSeller}
                    disabled={isLoadingChat}
                    className={`w-full py-4 rounded-2xl btn-gradient-primary text-on-surface font-extrabold tracking-wide text-lg shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${isLoadingChat ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {isLoadingChat ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Starting chat...</>
                    ) : (
                      <> <MessageSquare className="w-5 h-5" /> Contact Seller</>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (!user) {
                        showToast('Please log in to report a listing', 'info', 3000);
                        navigate("/login");
                        return;
                      }
                      navigate(`/report/${product.$id}`, { state: { productName: product.title } });
                    }}
                    className="w-full py-3 rounded-xl border border-error/10 text-error/80 font-medium hover:bg-error/5 hover:border-error/20 transition-all flex items-center justify-center gap-2 text-sm mt-2 hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-sm">flag</span>
                    Report Listing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Items Section */}
        {relatedProducts.length > 0 && (
          <section className="w-[92%] sm:w-[90%] lg:w-[82%] mt-12 md:mt-32 relative z-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-plus-jakarta font-extrabold tracking-tight gradient-text">Similar Products</h2>
              <a className="text-primary font-bold flex items-center gap-1 hover:underline" href="#">
                View Shop <span className="material-symbols-outlined">arrow_right_alt</span>
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((item) => (
                <Cart
                  key={item.$id}
                  id={item.$id}
                  imgUrl={productService.getFileView(item.imageId)}
                  category={item.category}
                  name={item.title}
                  price={item.price}
                  rating={4.5}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </Skeleton>
  );
};

export default ProductDetailPage;
