import React from "react";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

const NewListingCard = () => {
  return (
    <Link to="/add-item" className="block group">

      <div className="relative flex flex-col items-center justify-center md:p-16 md:min-h-[400px] p-4 rounded-2xl md:rounded-[2rem] border-2 border-dashed dark:border-white/10 border-gray-300 hover:border-primary/50 hover:bg-primary/5 transition-all duration-500">

        <div className="w-10 h-10 md:w-20 md:h-20 rounded-full md:rounded-full bg-surface-container-highest flex items-center justify-center mb-2 md:mb-6 text-primary md:text-4xl text-xl group-hover:scale-110 transition-transform duration-300">
          <FiPlus className="md:text-4xl text-xl" />
        </div>

        <h3 className="text-sm md:text-2xl font-headline font-bold text-text-onSurface dark:text-white">New Listing</h3>

      </div>

    </Link>
  );
};

export default NewListingCard;
