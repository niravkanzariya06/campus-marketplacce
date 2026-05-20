import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { Key } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ myProducts }) => {
  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const profilePhoto = useSelector((state) => state.auth.profilePhoto);

  if (!user) return null;

  // Stats - myProducts already filtered for current user
  const activeCount = myProducts.filter((p) => p.listing_status === "active").length;
  const soldCount = myProducts.filter((p) => p.listing_status === "sold").length;

  return (
    <div className="relative mb-12">

      {/* Decorative radial gradient behind avatar */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[150%] h-64 blur-3xl opacity-30 -z-10" style={{
        background: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.1) 0%, transparent 70%)'
      }}></div>

      {/* Profile Header */}
      <header className="flex flex-wrap items-center gap-6 relative">

        {/* Avatar with gradient border glow */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-secondary rounded-[2rem] blur opacity-25 group-hover:opacity-50 group-hover:blur-md transition-all duration-500"></div>
          <img
            src={profilePhoto || user?.avatar || "https://img.freepik.com/free-icon/user_318-159711.jpg"}
            alt={user.name || "Profile"}
            className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-[1.5rem] md:rounded-[1.8rem] object-cover border-2 border-white/10 transition-all duration-500 flex-shrink-0"
            loading="lazy"
          />
        </div>

        {/* Info Section */}
        <div className="flex-1 space-y-1 min-w-0">

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl md:text-5xl font-headline font-extrabold tracking-tight dark:text-white text-gray-900 truncate">{user.name || "User"}</h1>
            {user.isPro && (
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-widest uppercase">PRO SELLER</span>
            )}
          </div>

          <p className="text-onSurfaceVariant font-medium text-sm md:text-lg">
            {user.education || user.role || "Campus Member"}
          </p>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg md:rounded-xl glass font-medium md:font-semibold text-sm md:text-base text-text-onSurface dark:text-white hover:bg-white/10 transition-all duration-300 border border-subtle"
            onClick={() => navigate("/profile/edit")}
          >
            <FiEdit2 className="text-sm md:text-lg" />
            <span className="md:hidden">Edit</span><span className="hidden md:inline">Edit Profile</span>
          </button>
          <button
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-6 py-1.5 md:py-2.5 rounded-lg md:rounded-xl glass font-medium md:font-semibold text-sm md:text-base text-text-onSurface dark:text-white hover:bg-white/10 transition-all duration-300 border border-subtle"
            onClick={() => navigate("/forgot-password")}
          >
            <Key className="text-sm md:text-lg" />
            <span className="md:hidden">Password</span><span className="hidden md:inline">Change Password</span>
          </button>
        </div>

      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 mb-8 text-center">
        <div>
          <span className="text-onSurfaceVariant text-xs font-bold uppercase tracking-wider block">Items Sold</span>
          <span className="font-headline font-black text-secondary text-lg block mt-1">{soldCount}</span>
        </div>
        <div className="border-l border-r border-white/10">
          <span className="text-onSurfaceVariant text-xs font-bold uppercase tracking-wider block">Active Listings</span>
          <span className="font-headline font-black text-tertiary text-lg block mt-1">{activeCount}</span>
        </div>
        <div>
          <span className="text-onSurfaceVariant text-xs font-bold uppercase tracking-wider block">Member Since</span>
          <span className="font-headline font-bold text-text-onSurface dark:text-white text-lg block mt-1">{user.joinedDate || "2024"}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;