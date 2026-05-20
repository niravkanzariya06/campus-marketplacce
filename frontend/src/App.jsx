import Header from "./Components/Header/Header"
import Footer from "./Components/Footer/Footer"
import AtmosphericBlooms from "./Components/AtmosphericBlooms"

import { useEffect, useState, Suspense, lazy } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import { fetchProducts } from "./store/productSlice";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import authService from "./services/authService";
import profileService from './services/profileService';

import ProtectedRoute from "./Components/ProtectedRoute";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";

// Lazy loaded pages for code splitting
const Home = lazy(() => import("./pages/HomePage.jsx"));
const Browse = lazy(() => import("./pages/BrowsePage"));
const Profile = lazy(() => import("./pages/ProfilePage.jsx"));
const Chat = lazy(() => import("./pages/ChatPage"));
const AddItem = lazy(() => import("./pages/AddItemPage.jsx"));
const LoginForm = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterForm = lazy(() => import("./pages/RegisterPage.jsx"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage.jsx"));
const OwnerProductDetail = lazy(() => import("./pages/OwnerProductDetailPage.jsx"));
const EditProfile = lazy(() => import("./pages/EditProfilePage.jsx"));
const EditProduct = lazy(() => import("./pages/EditProductPage.jsx"));
const Favorites = lazy(() => import("./pages/FavoritesPage.jsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboardPage.jsx"));
const FeedbackPage = lazy(() => import("./pages/FeedbackPage.jsx"));
const Terms = lazy(() => import("./pages/TermsPage.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/DataPrivacyPolicy.jsx"));
const CheckInbox = lazy(() => import("./pages/CheckInboxPage.jsx"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmailPage.jsx"));
const ReportPage = lazy(() => import("./pages/ReportPage.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPasswordPage.jsx"));

// Base layout wrapping routes
function Layout({ children }) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-surface text-on-surface relative overflow-x-hidden text-base sm:text-lg">
      <AtmosphericBlooms intensity="medium" />
      <Header />
      <main className="grow pt-16 md:pt-16 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
      .then((user) => {
        if (user) {
          const photoUrl = profileService.getProfilePhoto(user.avatar);
          dispatch(
            login({
              userData: user,
              profilePhoto: photoUrl,
            })
          );
        } else {
          dispatch(logout());
        }
      })
      .finally(() => {
        dispatch(fetchProducts());
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-surface">
        <AtmosphericBlooms intensity="subtle" />
        <div className="w-full max-w-7xl px-4 md:px-8 relative z-10">
          {/* Hero skeleton */}
          <div className="text-center mb-12 animate-pulse">
            <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-surface-container-high/50 border border-white/10 mb-8">
              <div className="w-5 h-5 bg-surface-bright/30 rounded mr-2"></div>
              <div className="w-32 h-4 bg-surface-bright/30 rounded"></div>
            </div>
            <div className="h-14 bg-surface-bright/30 rounded-2xl w-96 max-w-full mx-auto mb-4"></div>
            <div className="h-14 bg-surface-bright/30 rounded-2xl w-80 max-w-full mx-auto mb-6"></div>
            <div className="h-6 bg-surface-bright/20 rounded w-[500px] max-w-full mx-auto mb-8"></div>
            <div className="flex items-center justify-center gap-4">
              <div className="h-12 bg-surface-bright/30 rounded-full w-40"></div>
              <div className="h-12 bg-surface-bright/20 rounded-full w-40 border border-white/10"></div>
            </div>
          </div>
          {/* Marquee skeleton */}
          <div className="h-12 bg-surface-bright/10 rounded-2xl border border-white/5 animate-pulse flex items-center px-8 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 bg-surface-bright/20 rounded w-36"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-surface">
          <div className="w-full max-w-7xl px-4 md:px-8 animate-fadeIn">
            <div className="text-center mb-12 animate-pulse">
              <div className="h-12 bg-surface-bright/30 rounded-2xl w-96 max-w-full mx-auto mb-4"></div>
              <div className="h-12 bg-surface-bright/30 rounded-2xl w-80 max-w-full mx-auto mb-6"></div>
            </div>
            <div className="flex items-center justify-center gap-4 animate-pulse">
              <div className="h-12 bg-surface-bright/30 rounded-full w-40"></div>
              <div className="h-12 bg-surface-bright/20 rounded-full w-40 border border-white/10"></div>
            </div>
          </div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/browse" element={<Layout><Browse /></Layout>} />

          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Layout><Chat /></Layout></ProtectedRoute>} />
          <Route path="/add-item" element={<ProtectedRoute><Layout><AddItem /></Layout></ProtectedRoute>} />

          <Route path="/login" element={<Layout><LoginForm /></Layout>} />
          <Route path="/register" element={<Layout><RegisterForm /></Layout>} />
          <Route path="/verify-email" element={<Layout><CheckInbox /></Layout>} />
          <Route path="/verify-email/:token" element={<Layout><VerifyEmail /></Layout>} />
          <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />

          <Route path="/product/:id" element={<Layout><ProductDetailPage /></Layout>} />
          <Route path="/report/:productId" element={<ProtectedRoute><Layout><ReportPage /></Layout></ProtectedRoute>} />
          <Route path="/profile/product/:id" element={<ProtectedRoute><Layout><OwnerProductDetail /></Layout></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><Layout><EditProfile /></Layout></ProtectedRoute>} />
          <Route path="/edit-product/:id" element={<ProtectedRoute><Layout><EditProduct /></Layout></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Layout><Favorites /></Layout></ProtectedRoute>} />

          <Route path="/admin" element={<AdminProtectedRoute><Layout><AdminDashboard /></Layout></AdminProtectedRoute>} />

          <Route path="/feedback" element={<Layout><FeedbackPage /></Layout>} />
          <Route path="/terms" element={<Layout><Terms /></Layout>} />
          <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />

          <Route path="*" element={
            <div className="min-h-[70vh] flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-outline mb-4">404</h1>
                <p className="text-xl text-on-surface-variant mb-6">Page not found</p>
                <button
                  onClick={() => window.location.href = "/"}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:brightness-110 transition-all shadow-glow-indigo"
                >
                  Go Home
                </button>
              </div>
            </div>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
