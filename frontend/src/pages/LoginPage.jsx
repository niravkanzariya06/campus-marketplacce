import { useForm } from "react-hook-form";
import usePageTitle from '../hooks/usePageTitle';
import { useLocation, useNavigate } from "react-router-dom";
import authService from '../services/authService'
import chatService from '../services/chatService'
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login as authLogin } from '../store/authSlice';
import { Lock, Mail, AlertCircle, CheckCircle2, ArrowRight, BadgeCheck, ShoppingBag, Sparkles } from "lucide-react";
import { useToast } from '../Components/Toast/ToastContainer';
import AtmosphericBlooms from '../Components/AtmosphericBlooms';
import useGoogleOAuth from '../hooks/useGoogleOAuth';

const LoginForm = () => {
  usePageTitle('Sign In');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { handleGoogleLogin, isGoogleLoading } = useGoogleOAuth({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm({ mode: 'onChange' });

  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const emailValue = watch("email");
  const passwordValue = watch("password");

  let from = location.state?.from?.pathname || "/";
  if (from === "/login") from = "/";

  const handleLogin = async (data) => {
    setError("");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          dispatch(authLogin({
            userData,
            profilePhoto: userData.prefs?.profilePhoto || null,
            accessToken: session?.data?.accessToken || null
          }));
          setTimeout(() => chatService.reconnect(), 100);
          showToast(`Welcome back, ${userData.name || "User"}!`, 'success', 3000);
        }
        navigate(from, { replace: true });
      }
    } catch (error) {
      const errorMsg = error.message || "Login failed. Please try again.";
      setError(errorMsg);
      showToast(errorMsg, 'error', 4000);
    }
  };

  const handleResendVerification = async () => {
    if (!emailValue) return;
    setIsResending(true);
    try {
      await authService.resendVerificationEmail(emailValue);
      showToast("Verification email resent! Please check your inbox.", 'success', 3000);
    } catch (error) {
      const msg = error.message || "Failed to resend. Please try again.";
      setError(msg);
      showToast(msg, 'error', 4000);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen relative">
      {/* Vibrant Background with multiple blooms */}
      <AtmosphericBlooms intensity="vibrant" />

      {/* Navigation Suppressed for Transactional Page */}

      <main className="flex-grow flex items-center justify-center px-6 py-12 lg:py-24 relative z-10">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">

          {/* Hero Content - Left Side */}
          <div className="hidden lg:block space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-bright/50 border border-outline-variant/30">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-label uppercase tracking-widest text-primary-fixed">The Future of Campus Life</span>
            </div>

            <h1 className="font-headline text-6xl font-extrabold tracking-tight leading-[1.1]">
              Elevate your <br />
              <span className="text-gradient-primary">University Experience.</span>
            </h1>

            <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
              Join the exclusive student hub for trading, connecting, and thriving at Lumina Campus. Secure, verified, and built for you.
            </p>

            {/* Floating Feature Cards */}
            <div className="grid grid-cols-2 gap-4 pt-8">
              <div className="glass-panel p-4 rounded-2xl transform hover:scale-105 transition-transform duration-500">
                <BadgeCheck className="w-6 h-6 text-secondary mb-3" />
                <h3 className="font-headline font-bold text-on-surface">Verified Only</h3>
                <p className="text-xs text-on-surface-variant">Secure campus-only access</p>
              </div>
              <div className="glass-panel p-4 rounded-2xl transform translate-y-6 hover:scale-105 transition-transform duration-500">
                <ShoppingBag className="w-6 h-6 text-tertiary mb-3" />
                <h3 className="font-headline font-bold text-on-surface">Marketplace</h3>
                <p className="text-xs text-on-surface-variant">Buy &amp; sell with peers</p>
              </div>
            </div>
          </div>

          {/* Login Form Container - Right Side */}
          <div className="relative w-full max-w-2xl mx-auto lg:mx-0">
            {/* 3D Decorative Element */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-primary to-tertiary rounded-3xl rotate-12 opacity-20 blur-xl"></div>

            <div className="glass-panel p-5 sm:p-8 lg:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl relative z-10">
              <div className="mb-8">
                <h2 className="font-headline text-3xl font-bold text-on-surface mb-2">Welcome Back</h2>
                <p className="text-on-surface-variant">Sign in to continue to your account</p>
              </div>

              <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">

                {/* Error Alert */}
                {error && (
                  <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex flex-col gap-2 animate-slideInFromBottom border-subtle">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                    {error.includes("verify your email") && emailValue && (
                      <button
                        type="button"
                        disabled={isResending}
                        onClick={handleResendVerification}
                        className="ml-8 text-xs text-secondary hover:text-primary transition-colors font-medium disabled:opacity-50"
                      >
                        {isResending ? "Resending..." : "Resend verification email"}
                      </button>
                    )}
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2 group">
                  <label className="block text-sm font-label font-semibold text-on-surface-variant group-focus-within:text-primary transition-colors">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                    <input
                      type="email"
                      placeholder="alex.rivers@lumina.edu"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                      className={`w-full bg-surface-container-highest border-0 rounded-2xl py-4 pl-12 pr-12 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all
                          ${errors.email
                            ? 'focus:ring-red-500/50 bg-red-900/20'
                            : ''
                          }`}
                    />
                    {emailValue && !errors.email && (
                      <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400 animate-scaleIn" />
                    )}
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-2 animate-slideInFromBottom">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p className="text-sm text-red-400">{errors.email.message}</p>
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2 group">
                  <label className="block text-sm font-label font-semibold text-on-surface-variant group-focus-within:text-primary transition-colors">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className={`w-full bg-surface-container-highest border-0 rounded-2xl py-4 pl-12 pr-12 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all
                          ${errors.password
                            ? 'focus:ring-red-500/50 bg-red-900/20'
                            : ''
                          }`}
                    />
                    {passwordValue && !errors.password && (
                      <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400 animate-scaleIn" />
                    )}
                  </div>
                  {errors.password && (
                    <div className="flex items-center gap-2 animate-slideInFromBottom">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p className="text-sm text-red-400">{errors.password.message}</p>
                    </div>
                  )}
                </div>

                <div className="text-right pt-1">
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs text-secondary hover:text-primary transition-colors font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full btn-gradient-primary hover:brightness-110 active:scale-[0.98] text-white font-headline font-extrabold text-lg py-5 rounded-2xl shadow-[0_10px_30px_rgba(186,158,255,0.3)] transition-all duration-300
                      ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-on-tertiary-container border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Helper Text */}
                <div className="pt-6 text-center">
                  <p className="text-on-surface-variant font-medium">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate("/register")}
                      className="text-secondary font-bold hover:text-primary transition-colors hover:underline"
                    >
                      Create Account
                    </button>
                  </p>
                </div>

                {/* Social Login */}
                <div className="space-y-6">
                  <div className="relative flex items-center gap-4">
                    <div className="flex-grow h-px bg-outline-variant/30"></div>
                    <span className="text-xs font-label uppercase tracking-widest text-outline">or continue with email</span>
                    <div className="flex-grow h-px bg-outline-variant/30"></div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all py-4 rounded-2xl font-headline font-semibold text-on-surface disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </form>
            </div>

            {/* Footer-style Links */}
            <div className="mt-8 flex justify-center gap-6 text-xs font-label text-outline uppercase tracking-widest">
              <a className="hover:text-on-surface transition-colors" href="#">Help Center</a>
              <span className="w-1 h-1 rounded-full bg-outline-variant mt-1"></span>
              <a className="hover:text-on-surface transition-colors" href="#">Privacy</a>
              <span className="w-1 h-1 rounded-full bg-outline-variant mt-1"></span>
              <a className="hover:text-on-surface transition-colors" href="#">Terms</a>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Bottom Gradient */}
      <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-tertiary opacity-30 fixed bottom-0"></div>
    </div>
  );
};

export default LoginForm;
