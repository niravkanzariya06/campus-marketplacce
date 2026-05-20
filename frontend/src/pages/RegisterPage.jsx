import { useForm } from "react-hook-form";
import usePageTitle from '../hooks/usePageTitle';
import { useNavigate } from "react-router-dom";
import authService from '../services/authService'
import { useState } from "react";
import { User, Mail, Lock, AlertCircle, CheckCircle2, BadgeCheck, ShoppingBag, Sparkles } from "lucide-react";
import { useToast } from '../Components/Toast/ToastContainer';
import AtmosphericBlooms from '../Components/AtmosphericBlooms';
import { Link } from "react-router-dom";
import useGoogleOAuth from '../hooks/useGoogleOAuth';

const RegisterForm = () => {
  usePageTitle('Create Account');
  const navigate = useNavigate()
  const { showToast } = useToast();
  const [error, setError] = useState("")

  const { handleGoogleLogin, isGoogleLoading } = useGoogleOAuth({});
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({ mode: 'onChange' })

  /* eslint-disable react-hooks/incompatible-library */
  const password = watch("password");
  const nameValue = watch("name");
  const emailValue = watch("email");
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");
  /* eslint-enable react-hooks/incompatible-library */

  const create = async (data) => {
    setError("")
    try {
      await authService.createAccount(data)
      showToast("Account created! Please check your email to verify your account.", 'success', 5000);
      navigate("/verify-email")
    } catch (error) {
      const errorMsg = error.message || "Registration failed. Please try again.";
      setError(errorMsg)
      showToast(errorMsg, 'error', 4000);
    }
  }

  return (
    <div className="w-full flex flex-col min-h-screen relative">
      {/* Vibrant Background with multiple blooms */}
      <AtmosphericBlooms intensity="vibrant" />

      <main className="flex-grow flex items-center justify-center px-6 py-12 lg:py-24 relative z-10">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">

          {/* Hero Content - Left Side */}
          <div className="hidden lg:block space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-bright/50 border border-outline-variant/30">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-label uppercase tracking-wider text-primary-fixed">The Future of Campus Life</span>
            </div>

            <h1 className="font-headline text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1]">
              Elevate your <br />
              <span className="text-gradient-primary">University Experience.</span>
            </h1>

            <p className="text-on-surface-variant text-base max-w-md leading-relaxed">
              Join the exclusive student hub for trading, connecting, and thriving at Lumina Campus. Secure, verified, and built for you.
            </p>

            {/* Floating Feature Cards */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="glass-panel p-3 rounded-xl transform hover:scale-105 transition-transform duration-500">
                <BadgeCheck className="w-4 h-4 text-secondary mb-2" />
                <h3 className="font-headline font-bold text-on-surface text-sm">Verified Only</h3>
                <p className="text-xs text-on-surface-variant">Secure campus-only access</p>
              </div>
              <div className="glass-panel p-3 rounded-xl transform hover:scale-105 transition-transform duration-500">
                <ShoppingBag className="w-4 h-4 text-tertiary mb-2" />
                <h3 className="font-headline font-bold text-on-surface text-sm">Marketplace</h3>
                <p className="text-xs text-on-surface-variant">Buy & sell with peers</p>
              </div>
            </div>
          </div>

          {/* Register Form Container - Right Side */}
          <div className="relative w-full max-w-2xl mx-auto lg:mx-0">
            {/* 3D Decorative Element */}
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary to-tertiary rounded-3xl rotate-12 opacity-20 blur-lg"></div>

            <div className="glass-panel p-5 sm:p-8 lg:p-10 rounded-2xl shadow-lg relative z-10 w-full overflow-hidden">
              <div className="mb-6 sm:mb-8">
                <p className="text-on-surface-variant text-sm">Create your account to start exploring.</p>
              </div>

              <form onSubmit={handleSubmit(create)} className="space-y-4">

                {/* Error Alert */}
                {error && (
                  <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex gap-3 border-subtle">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                {/* Full Name Field */}
                <div className="space-y-1.5 group">
                  <label className="block text-sm font-label font-semibold text-on-surface-variant group-focus-within:text-primary transition-colors">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                    <input
                      placeholder="Alex Rivers"
                      {...register("name", {
                        required: "Full name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters"
                        }
                      })}
                      className={`w-full bg-surface-container-highest border-0 rounded-xl py-3 pl-10 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all
                          ${errors.name || errors.email || errors.password || errors.confirmPassword
                          ? 'focus:ring-red-500/50 bg-red-900/20'
                          : ''
                        }`}
                    />
                    {nameValue && !errors.name && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400 animate-scaleIn" />
                    )}
                  </div>
                  {errors.name && (
                    <div className="flex items-center gap-2 animate-slideInFromBottom">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p className="text-sm text-red-400">{errors.name.message}</p>
                    </div>
                  )}
                </div>

                {/* Campus Email Field */}
                <div className="space-y-1.5 group">
                  <label className="block text-sm font-label font-semibold text-on-surface-variant group-focus-within:text-primary transition-colors">Campus Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
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
                      className={`w-full bg-surface-container-highest border-0 rounded-xl py-3 pl-10 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all
                          ${errors.email
                          ? 'focus:ring-red-500/50 bg-red-900/20'
                          : ''
                        }`}
                    />
                    {emailValue && !errors.email && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400 animate-scaleIn" />
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
                <div className="space-y-1.5 group">
                  <label className="block text-sm font-label font-semibold text-on-surface-variant group-focus-within:text-primary transition-colors">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                          message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
                        }
                      })}
                      className={`w-full bg-surface-container-highest border-0 rounded-xl py-3 pl-10 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all
                          ${errors.password
                          ? 'focus:ring-red-500/50 bg-red-900/20'
                          : ''
                        }`}
                    />
                    {passwordValue && !errors.password && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400 animate-scaleIn" />
                    )}
                  </div>
                  {errors.password && (
                    <div className="flex items-center gap-2 animate-slideInFromBottom">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p className="text-sm text-red-400">{errors.password.message}</p>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5 group">
                  <label className="block text-sm font-label font-semibold text-on-surface-variant group-focus-within:text-primary transition-colors">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                      className={`w-full bg-surface-container-highest border-0 rounded-xl py-3 pl-10 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all
                          ${errors.confirmPassword
                          ? 'focus:ring-red-500/50 bg-red-900/20'
                          : ''
                        }`}
                    />
                    {confirmPasswordValue && !errors.confirmPassword && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400 animate-scaleIn" />
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-2 animate-slideInFromBottom">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
                    </div>
                  )}
                </div>

                {/* Terms & Conditions Checkbox */}
                <div className="space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        {...register("acceptTerms", {
                          required: "You must accept the Terms & Conditions to create an account"
                        })}
                        className={`w-4 h-4 rounded border transition-all appearance-none cursor-pointer
                          ${errors.acceptTerms
                            ? 'bg-red-900/30 border-red-500'
                            : 'bg-surface-container-highest border-outline-variant group-hover:border-primary/50'
                          }
                          ${watch('acceptTerms') ? 'bg-primary border-primary' : ''}
                        `}
                        style={{
                          backgroundImage: watch('acceptTerms') ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'3\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'20 6 9 17 4 12\'%3E%3C/polyline%3E%3C/svg%3E")' : '',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    </div>
                    <span className="text-sm text-on-surface-variable leading-relaxed">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-secondary hover:text-primary transition-colors hover:underline font-medium"
                      >
                        Terms & Conditions
                      </Link>
                      {" "}and{" "}
                      <Link
                        to="/privacy"
                        className="text-secondary hover:text-primary transition-colors hover:underline font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <div className="flex items-center gap-2 animate-slideInFromBottom">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p className="text-sm text-red-400">{errors.acceptTerms.message}</p>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full btn-gradient-primary hover:brightness-110 active:scale-[0.98] text-white font-headline font-bold text-base py-3.5 rounded-xl shadow-lg transition-all duration-300
                      ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-on-tertiary-container border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Join the Hub'
                  )}
                </button>

                {/* Helper Text */}
                <div className="pt-6 text-center">
                  <p className="text-on-surface-variant font-medium">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-secondary font-bold hover:text-primary transition-colors hover:underline"
                    >
                      Login
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
                    className="w-full flex items-center justify-center gap-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all py-3 rounded-xl font-headline font-semibold text-on-surface text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                    </svg>
                    Continue with Google
                  </button>
                </div>
              </form>

              {/* Footer-style Links */}
              <div className="mt-8 flex justify-center gap-6 text-xs font-label text-outline uppercase tracking-widest">
                <Link to="/terms" className="hover:text-on-surface transition-colors">Terms</Link>
                <span className="w-1 h-1 rounded-full bg-outline-variant mt-1"></span>
                <Link to="/privacy" className="hover:text-on-surface transition-colors">Privacy</Link>
                <span className="w-1 h-1 rounded-full bg-outline-variant mt-1"></span>
                <button type="button" className="hover:text-on-surface transition-colors" onClick={() => window.location.href = '/help'}>Help Center</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Bottom Gradient */}
      <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-tertiary opacity-30 fixed bottom-0"></div>
    </div>
  );
};

export default RegisterForm;
