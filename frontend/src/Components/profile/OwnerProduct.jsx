import React from "react";
import productService from "../../services/productService";
import OwnerItemCard from "./OwnerItemCard";
import NewListingCard from "./NewListingCard";

const OwnerProduct = ({ products, showNewListing = true, emptyMessage }) => {
  const defaultEmptyMessage = {
    title: "No products yet",
    message: "Start listing your items on the marketplace",
    icon: "📦"
  };

  const message = emptyMessage || defaultEmptyMessage;

  return (
    <div className="w-full">
      <div className="mt-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 md:gap-8 gap-4 perspective-1000">

        {products.length === 0 ? (
          <div className="col-span-full">
            <div className="glass rounded-2xl p-16 text-center border border-subtle">
              <div className="space-y-4">
                <div className="text-6xl opacity-50">{message.icon}</div>
                <h3 className="text-xl font-semibold text-text-onSurface dark:text-white">{message.title}</h3>
                <p className="text-[#94A3B8]">{message.message}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {products.map((doc) => (
              <OwnerItemCard
                key={doc.$id}
                id={doc.$id}
                imgUrl={productService.getFileView(doc.imageId)}
                category={doc.category}
                name={doc.title}
                price={doc.price}
              />
            ))}
            {showNewListing && <NewListingCard />}
          </>
        )}

      </div>
    </div>
  );
};

export default OwnerProduct;
