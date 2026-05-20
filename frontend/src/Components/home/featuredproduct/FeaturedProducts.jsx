import React from "react";
import Cart from "./ItemCard";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import productService from "../../services/productService";
import { ArrowRight } from "lucide-react";

const FeaturedProducts = () => {
  const products = useSelector((state) => state.products.products);

  const activeProducts = products.filter(p => p.status === "approved" || p.status === "active")

  // Filter products that have an image to avoid empty cards
  const productsWithImages = activeProducts.filter(p => p.imageId)

  // Format products for Cart component
  const items = productsWithImages.slice(0, 4).map((doc) => ({
    id: doc.$id,
    imgUrl: productService.getFileView(doc.imageId),
    category: doc.category,
    name: doc.title,
    price: doc.price,
    condition: doc.condition,
    sellerName: doc.sellerName,
    sellerAvatar: doc.sellerAvatar,
    rating: doc.rating,
  }));

  // Animation delays for stagger effect
  const staggerClasses = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4', 'stagger-5', 'stagger-6'];

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 px-4 sm:px-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Featured Products
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Handpicked items from our community
          </p>
        </div>

        <Link
          to="/browse"
          className="group inline-flex items-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black hover:border-black dark:hover:border-white btn-press"
        >
          View All
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`opacity-0 animate-slideInFromBottom ${staggerClasses[index % 6]}`}
            style={{ animationFillMode: 'forwards' }}
          >
            <Cart
              id={item.id}
              imgUrl={item.imgUrl}
              category={item.category}
              name={item.name}
              price={item.price}
              condition={item.condition}
              sellerName={item.sellerName}
              sellerAvatar={item.sellerAvatar}
              rating={item.rating}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;