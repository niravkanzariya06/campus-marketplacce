import React from 'react'
import ItemCard from './featuredproduct/ItemCard'
import productService from '../../services/productService'

const CampusPulse = ({ trendingProducts }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8">
      {/* Section Header - Centered */}
      <div className="mb-8 md:mb-10 text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-extrabold gradient-text bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
          Trending This Week
        </h2>
        <p className="text-on-surface-variant text-sm md:text-base mt-2 max-w-2xl mx-auto">
          Hot listings from your campus community
        </p>
      </div>

      {/* Products Grid - Flexbox centered */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
        {trendingProducts && trendingProducts.length > 0 ? (
          trendingProducts.map((product) => (
            <div
              key={product.id}
              className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-0.75rem)]"
            >
              <ItemCard
                id={product.id}
                imgUrl={productService.getFileView(product.imageId)}
                name={product.title}
                price={product.price}
                condition={product.condition}
                category={product.category}
                showFavorite={false}
              />
            </div>
          ))
        ) : (
          // Empty state - 4 placeholder cards
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-0.75rem)]"
            >
              <div className="rounded-3xl overflow-hidden relative border border-indigo-500/10 shadow-[0_0_20px_-5px_rgba(99,102,241,0.3),0_8px_32px_-8px_rgba(0,0,0,0.4)] bg-surface-container-highest backdrop-blur-xl">
                <div className="aspect-[4/3] bg-surface-container-highest animate-pulse flex items-center justify-center rounded-t-3xl">
                  {/* Placeholder skeleton image */}
                  <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
                </div>
                <div className="p-4 md:p-5">
                  <div className="h-4 bg-indigo-500/10 rounded mb-2 animate-pulse"></div>
                  <div className="h-3 bg-indigo-500/5 rounded w-2/3 mb-3 animate-pulse"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-5 bg-indigo-500/10 rounded w-1/3 animate-pulse"></div>
                    <div className="h-3 bg-indigo-500/5 rounded w-1/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default CampusPulse
