/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import ItemCard from '../Components/home/featuredproduct/ItemCard';
import MessageBubble from '../Components/chat/MessageBubble';
import { Link } from 'react-router-dom';

// ── Mock Data ────────────────────────────────────────────────────────────────

export const mockProduct = {
  $id: 'mock-1',
  imageId: 'https://via.placeholder.com/400x400/6366F1/ffffff?text=Product',
  title: 'Mock Product Title for Skeleton Loading State',
  price: '2499',
  category: 'electronics',
  condition: 'Like New',
  views: 42,
  favoriteCount: 12,
  sellerName: 'Mock Seller',
  sellerAvatar: '',
  rating: 4.5,
  status: 'approved',
  listing_status: 'active',
  userId: 'mock-user-1',
  $createdAt: new Date().toISOString(),
  location: 'North Campus Library',
};

export const mockProductDetail = {
  $id: 'mock-detail',
  imageId: 'https://via.placeholder.com/800x600/6366F1/ffffff?text=Product+Detail',
  title: 'Mock Product Detail Title for Skeleton Loading State',
  price: '4999',
  category: 'electronics',
  condition: 'Excellent',
  description: 'This is a detailed description of the mock product. It has all the features you need and is in excellent condition.',
  views: 120,
  favoriteCount: 28,
  sellerName: 'Mock Seller Name',
  sellerAvatar: '',
  userId: 'mock-seller-1',
  $createdAt: new Date().toISOString(),
  location: 'Engineering Block A',
  status: 'approved',
  listing_status: 'active',
};

export const mockConversation = {
  $id: 'mock-conv-1',
  otherUserName: 'Mock Seller',
  otherUserRole: 'Seller',
  productName: 'Mock Product',
  productImage: 'https://via.placeholder.com/100x100/6366F1/ffffff?text=P',
  productId: 'mock-product-1',
  lastMessage: 'Hey, is this still available?',
  unreadCount: 2,
  $updatedAt: new Date().toISOString(),
  otherUserAvatar: '',
  sellerId: 'mock-seller-1',
  buyerId: 'mock-buyer-1',
  myUserRole: 'Buyer',
};

export const mockMessage = {
  $id: 'mock-msg-1',
  text: 'Hey, is this product still available for purchase?',
  senderId: 'mock-user-1',
  $createdAt: new Date().toISOString(),
};

export const mockProfile = {
  $id: 'mock-user-1',
  name: 'Mock User Name',
  email: 'mock@example.com',
  education: 'Computer Science Student',
  role: 'Campus Member',
  isPro: true,
  joinedDate: '2024',
  avatar: '',
};

// ── Fixture Components ────────────────────────────────────────────────────────

export const ProductGridFixture = () => (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <ItemCard
        key={i}
        id={`mock-${i}`}
        imgUrl={mockProduct.imageId}
        name={mockProduct.title}
        price={mockProduct.price}
        category={mockProduct.category}
        showFavorite={false}
      />
    ))}
  </div>
);

export const ConversationListFixture = () => (
  <div className="space-y-2 p-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="rounded-2xl p-4 flex gap-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-xs font-semibold">
          MN
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-on-surface text-sm truncate">Mock Seller Name</h3>
            <span className="text-[10px] text-on-surface-variant">2h ago</span>
          </div>
          <p className="text-xs truncate text-on-surface-variant">Hey, is this still available?</p>
        </div>
      </div>
    ))}
  </div>
);

export const ChatMessagesFixture = () => (
  <div className="space-y-2 p-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
        <div className={`px-3 py-2 rounded-xl max-w-[70%] ${i % 2 === 0
            ? 'bg-surface-container-highest/80'
            : 'bg-gradient-to-br from-primary/20 to-primary/10'
          }`}>
          <p className="text-xs md:text-sm">Mock message text for skeleton loading</p>
        </div>
      </div>
    ))}
  </div>
);

export const ProductDetailFixture = () => (
  <div className="w-full min-h-screen">
    <div className="w-[92%] sm:w-[90%] lg:w-[82%] relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        <div className="md:col-span-7">
          <div className="relative group aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-surface-container-high shadow-2xl flex items-center justify-center p-4 md:p-8">
            <img src={mockProductDetail.imageId} alt="Mock" className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="md:col-span-5 flex flex-col">
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">Mock Product Title</h1>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-on-surface">₹4,999</div>
              <div className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold">
                NEGOTIABLE
              </div>
            </div>
            <p className="text-on-surface-variant leading-relaxed text-lg">
              This is a detailed description of the mock product.
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-3 sm:p-4 md:p-5 rounded-2xl sm:rounded-3xl bg-surface-container-high">
                  <div className="text-on-surface-variant text-[10px] sm:text-xs md:text-sm uppercase font-bold">
                    Detail {i}
                  </div>
                  <div className="text-on-surface font-bold text-sm sm:text-base md:text-lg">
                    Value {i}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2.5rem] bg-surface-container-high border border-white/5 shadow-2xl mt-6 md:mt-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-highest" />
              <div>
                <div className="font-bold text-on-surface">Mock Seller</div>
                <div className="flex items-center gap-2 text-tertiary text-sm">
                  Campus Seller • Verified
                </div>
              </div>
            </div>
            <div className="w-full py-4 rounded-2xl bg-gradient-to-br from-primary to-tertiary text-on-primary text-center font-extrabold">
              Contact Seller
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ProfileFixture = () => (
  <div className="min-h-screen w-full">
    <div className="w-[95%] max-w-7xl mx-auto px-2 md:px-0 py-8">
      <div className="mb-12">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-[1.5rem] bg-surface-container-highest" />
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl md:text-5xl font-extrabold">Mock User</h1>
            <p className="text-on-surface-variant text-sm md:text-lg">Computer Science Student</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 mb-8 text-center">
          <div>
            <span className="text-on-surface-variant text-xs font-bold uppercase">Sold</span>
            <span className="font-black text-secondary text-lg block mt-1">5</span>
          </div>
          <div>
            <span className="text-on-surface-variant text-xs font-bold uppercase">Active</span>
            <span className="font-black text-tertiary text-lg block mt-1">12</span>
          </div>
          <div>
            <span className="text-on-surface-variant text-xs font-bold uppercase">Member Since</span>
            <span className="font-bold text-on-surface text-lg block mt-1">2024</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl p-4 bg-white/5 backdrop-blur border border-white/10">
            <div className="aspect-square bg-white/5 rounded-xl mb-3" />
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
            <div className="h-4 bg-white/10 rounded w-1/4" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
