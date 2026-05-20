import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  MapPin,
  Calendar,
  Package,
  ChevronLeft,
  Eye,
} from "lucide-react";
import productService from '../services/productService';
import { fetchProducts, fetchProductById, fetchMyProducts } from '../store/productSlice';
import { useEffect, useState } from "react";
import AtmosphericBlooms from '../Components/AtmosphericBlooms';
import { Skeleton } from "boneyard-js/react";
import { ProductDetailFixture } from '../bones/fixtures';

const OwnerProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const products = useSelector((state) => state.auth.userData ? state.products.products : []);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const result = await dispatch(fetchProductById(id));
        if (result.payload) {
          setProduct(result.payload);
        } else {
          const found = products.find(p => p.$id === id);
          if (found) setProduct(found);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id, dispatch, products]);

  if (loading) {
    return (
      <Skeleton name="product-detail" loading={true} fixture={<ProductDetailFixture />}>
        <div />
      </Skeleton>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-surface">
        <div className="text-center space-y-4">
          <div className="text-6xl opacity-50">🔍</div>
          <p className="text-xl font-semibold text-on-surface">Product not found!</p>
          <button
            onClick={() => navigate("/profile")}
            className="px-6 py-2 btn-gradient-primary rounded-lg shadow-lg"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const handleMoveStatus = async () => {
    const newListingStatus = product.listing_status === "active" ? "sold" : "active";

    await productService.updateProduct(product.$id, { listing_status: newListingStatus });

    dispatch(fetchProducts());
    dispatch(fetchMyProducts());

    navigate("/profile");
  };

  return (
    <div className="min-h-screen w-full relative">
      <AtmosphericBlooms intensity="subtle" />

      <div className="w-[95%] max-w-7xl mx-auto section-spacing">

        {/* Back Button */}
        <div className="mb-4 md:mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-3 md:px-5 py-2 md:py-2.5 text-sm md:text-base glass rounded-lg hover:bg-white/10 transition-all duration-300 border border-subtle group"
          >
            <ChevronLeft className="w-5 h-5 text-indigo-400 group-hover:-translate-x-1 transition-transform" />
            <span className="text-on-surface font-semibold">Back to Profile</span>
          </button>
        </div>

        {/* Main Container - Glass Card */}
        <div className="tilt-card glass glass-intense rounded-2xl md:rounded-3xl p-3 md:p-10 border border-subtle shadow-2xl transition-all duration-500">

          <div className="flex flex-col lg:flex-row gap-4 md:gap-10">

            {/* LEFT: PRODUCT IMAGE */}
            <div className="w-full lg:w-1/2 flex justify-center items-center">
              <div className="relative w-full aspect-[4/3] md:aspect-square max-h-[600px] rounded-xl md:rounded-2xl overflow-hidden bg-surface-container-highest border border-subtle">
                {product.imageId ? (
                  <img
                    src={productService.getFileView(product.imageId)}
                    alt={product.title}
                    className="w-full h-full object-contain bg-surface-container-highest"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-24 h-24 dark:text-gray-400 text-gray-500 opacity-50" />
                  </div>
                )}

                {/* Status Badge */}
                <div className={`absolute top-2 right-2 md:top-4 md:right-4 md:px-4 md:py-2 px-2 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${product.listing_status === 'active'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : product.listing_status === 'sold'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-gray-500/20 dark:text-gray-400 text-gray-500 border border-gray-500/30'
                  }`}>
                  {product.listing_status}
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between">

              {/* Product Info */}
              <div className="space-y-4 md:space-y-6">

                {/* Title & Price */}
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2 md:mb-4">
                    <span className="px-3 py-1.5 md:px-4 md:py-2 rounded-full glass border border-subtle text-xs md:text-sm font-semibold text-on-surface uppercase tracking-wide">
                      {product.category || "Uncategorized"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2 md:mb-4">
                    <h1 className="font-headline font-extrabold text-xl sm:text-2xl md:text-4xl text-on-surface leading-tight flex-1 min-w-0 truncate">
                      {product.title}
                    </h1>
                    <span className="px-3 py-1.5 sm:px-4 sm:py-2 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-on-surface text-lg sm:text-xl md:text-3xl font-bold md:font-black shadow-lg shadow-indigo-500/30 whitespace-nowrap flex-shrink-0">
                      ₹{parseFloat(product.price).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 md:grid-cols-3 gap-2 md:gap-4 p-2 md:p-4 glass rounded-xl border border-subtle">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="md:p-2 p-1 rounded-lg bg-indigo-500/20">
                      <Package className="w-3 h-3 md:w-5 md:h-5 text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] md:text-xs dark:text-gray-400 text-gray-500 uppercase tracking-wider">Condition</p>
                      <p className="text-xs md:text-sm font-semibold text-on-surface truncate">{product.condition || "Not provided"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="md:p-2 p-1 rounded-lg bg-cyan-500/20">
                      <MapPin className="w-3 h-3 md:w-5 md:h-5 text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] md:text-xs dark:text-gray-400 text-gray-500 uppercase tracking-wider">Location</p>
                      <p className="text-xs md:text-sm font-semibold text-on-surface truncate">{product.location || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="md:p-2 p-1 rounded-lg bg-pink-500/20">
                      <Calendar className="w-3 h-3 md:w-5 md:h-5 text-pink-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] md:text-xs dark:text-gray-400 text-gray-500 uppercase tracking-wider">Posted</p>
                      <p className="text-xs md:text-sm font-semibold text-on-surface truncate">
                        {new Date(product.$createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <h3 className="font-headline font-bold text-xl text-on-surface">Description</h3>
                  <div className="p-6 glass rounded-xl border border-subtle">
                    <p className="dark:text-gray-400 text-gray-500 leading-relaxed whitespace-pre-wrap">
                      {product.description || "No description provided."}
                    </p>
                  </div>
                </div>

              </div>

              {/* BUTTONS */}
              <div className="flex flex-col gap-4 mt-8 pt-6 border-t border-subtle">

                <button
                  onClick={() => navigate(`/edit-product/${product.$id}`)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 btn-gradient-primary rounded-xl font-bold shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform-gpu hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Product
                </button>

                <button
                  onClick={handleMoveStatus}
                  className={`w-full py-4 rounded-xl font-bold transition-all duration-300 transform-gpu hover:-translate-y-0.5 ${product.listing_status === 'active'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-on-surface shadow-lg hover:shadow-green-500/40'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-on-surface shadow-lg hover:shadow-blue-500/40'
                    }`}
                >
                  {product.listing_status === "active"
                    ? "✓ Mark as Sold"
                    : "✓ Mark as Active"}
                </button>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OwnerProductDetail;
