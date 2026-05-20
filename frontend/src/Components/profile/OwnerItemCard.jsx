import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { Package } from "lucide-react";

const OwnerItemCard = ({ imgUrl, name, category, price, id }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-product/${id}`);
  };

  return (
    <Link to={`/profile/product/${id}`} className="block group">
      <div className="relative bg-surface-container-low md:rounded-[2rem] rounded-2xl overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 border border-subtle flex flex-col">

        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden relative bg-surface-container-highest">
          {imageError || !imgUrl ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="md:w-16 md:h-16 w-8 h-8 text-text-onSurfaceVariant opacity-50" />

            </div>
          ) : (
            <img
              src={imgUrl}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          )}

          {/* Status Badge - top right */}
          <div className="absolute top-2 right-2 md:top-4 md:right-4 md:px-3 md:py-1 md:text-xs px-2 py-0.5 rounded-full glass-card border border-subtle text-[10px] md:tracking-wide tracking-wide font-bold text-white uppercase">
            Active
          </div>

          {/* Price Button - bottom left - Gradient for visibility */}
          <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4">
            <span className="md:px-5 md:py-2 md:text-xl px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm md:font-black font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow">
              ₹{parseFloat(price).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-2 pb-3 md:p-6 md:space-y-4 space-y-1 flex flex-col md:flex-grow">
          <div>
            <h3 className="text-xs md:text-xl font-headline font-bold text-text-onSurface dark:text-white mb-0.5 md:mb-2 md:line-clamp-2 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-cyan-400 transition-all duration-300">
              {name}
            </h3>
            <p className="text-text-onSurfaceVariant text-[10px] md:text-sm md:line-clamp-2 line-clamp-1">
              {category}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 md:pt-4 mt-auto border-t border-subtle">
            <div className="flex items-center gap-2 text-text-onSurfaceVariant text-[10px] md:text-xs font-bold uppercase">
              <FiEye className="text-xs md:text-sm" />
              <span>Views</span>
            </div>

            <div className="flex gap-1 md:gap-2">
              <button
                onClick={handleEditClick}
                className="p-1.5 md:p-2 rounded-lg glass hover:bg-primary/20 hover:text-primary transition-all duration-300"
                title="Edit"
              >
                <FiEdit2 className="text-sm md:text-base" />
              </button>
            </div>
          </div>
</div>

      </div>
    </Link>
  );
};

export default OwnerItemCard;
