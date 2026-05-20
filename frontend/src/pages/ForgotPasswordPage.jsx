import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, Lock, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { useToast } from "../Components/Toast/ToastContainer";
import authService from "../services/authService";
import AtmosphericBlooms from "../Components/AtmosphericBlooms";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [resetToken, setResetToken] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({ mode: "onChange" });
  const password = watch("newPassword");

  const handleSendOTP = async (data) => {
    setError("");
    setLoading(true);
    try {
      setUserEmail(data.email);
      await authService.forgotPassword(data.email);
      setStep(2);
      showToast("OTP sent to your email!", "success", 3000);
    } catch (err) {
      const msg = err.message || "Failed to send OTP.";
      setError(msg);
      showToast(msg, "error", 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError("");
    setLoading(true);
    try {
      await authService.forgotPassword(userEmail);
      showToast("OTP resent!", "success", 3000);
    } catch (err) {
      const msg = err.message || "Failed to resend.";
      setError(msg);
      showToast(msg, "error", 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (data) => {
    setError("");
    setLoading(true);
    try {
      const result = await authService.verifyOtp(userEmail, data.otp);
      if (result?.data?.resetToken) {
        setResetToken(result.data.resetToken);
        setStep(3);
      }
    } catch (err) {
      const msg = err.message || "Invalid OTP.";
      setError(msg);
      showToast(msg, "error", 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (data) => {
    setError("");
    setLoading(true);
    try {
      if (!resetToken) throw new Error("Session expired. Please request a new OTP.");
      await authService.resetPassword(resetToken, data.newPassword, data.confirmPassword);
      showToast("Password reset successfully! Please login.", "success", 4000);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err.message || "Password reset failed.";
      setError(msg);
      showToast(msg, "error", 4000);
    } finally {
      setLoading(false);
    }
  };

  const steps = ["Email", "OTP", "New Password"];

  return (
    <div className="w-full flex flex-col min-h-screen relative">
      <AtmosphericBlooms intensity="vibrant" />

      <main className="flex-grow flex items-center justify-center px-6 py-12 lg:py-24 relative z-10">
        <div className="w-full max-w-xl mx-auto">
          <div className="relative w-full max-w-2xl mx-auto">
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary to-tertiary rounded-3xl rotate-12 opacity-20 blur-lg"></div>

            <div className="glass-panel p-8 lg:p-10 rounded-2xl shadow-lg relative z-10">

              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-2 mb-8">
                {steps.map((label, i) => {
                  const stepNum = i + 1;
                  const isActive = stepNum === step;
                  const isCompleted = stepNum < step;
                  return (
                    <div key={label} className="flex items-center gap-2">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all ${isCompleted ? "bg-green-500 text-white" : isActive ? "bg-primary text-white" : "bg-surface-container-highest text-outline"}`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                      </div>
                      <span className={`text-xs font-medium hidden sm:block ${isActive ? "text-on-surface" : "text-outline"}`}>{label}</span>
                      {i < steps.length - 1 && <div className={`w-6 h-px ${isCompleted ? "bg-green-500" : "bg-outline-variant/30"}`}></div>}
                    </div>
                  );
                })}
              </div>

              {/* Step 1: Send OTP */}
              {step === 1 && (
                <form onSubmit={handleSubmit(handleSendOTP)} className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-headline text-2xl font-extrabold mb-1">
                      Forgot <span className="text-gradient-primary">Password</span>
                    </h2>
                    <p className="text-sm text-on-surface-variant">Enter your email to receive a reset code</p>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex gap-3">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  )}

                  <div className="space-y-1.5 group">
                    <label className="block text-sm font-label font-semibold text-on-surface-variant group-focus-within:text-primary transition-colors">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input
                        type="email"
                        placeholder="your.email@example.com"
                        {...register("email", {
                          required: "Email is required",
                          pattern: { value: /^\S+@\S+$/i, message: "Please enter a valid email" },
                        })}
                        className="w-full bg-surface-container-highest border-0 rounded-xl py-3 pl-10 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center gap-2 animate-slideInFromBottom">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <p className="text-sm text-red-400">{errors.email.message}</p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="w-full btn-gradient-primary hover:brightness-110 active:scale-[0.98] text-white font-headline font-bold text-base py-3.5 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-on-tertiary-container border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </div>
                    ) : "Send Reset Code"}
                  </button>

                  <div className="text-center">
                    <button type="button" onClick={() => navigate("/login")} className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-medium">
                      <ArrowLeft className="w-4 h-4" /> Back to login
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: Verify OTP */}
              {step === 2 && (
                <form onSubmit={handleSubmit(handleVerifyOTP)} className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-headline text-2xl font-extrabold mb-1">
                      Enter <span className="text-gradient-primary">OTP</span>
                    </h2>
                    <p className="text-sm text-on-surface-variant">We sent a 6-digit code to your email</p>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex gap-3">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  )}

                  <div className="space-y-1.5 group">
                    <label className="block text-sm font-label font-semibold text-on-surface-variant group-focus-within:text-primary transition-colors">6-Digit Code</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input
                        type="text"
                        placeholder="123456"
                        maxLength={6}
                        {...register("otp", {
                          required: "OTP is required",
                          minLength: { value: 6, message: "OTP must be 6 digits" },
                          maxLength: { value: 6, message: "OTP must be 6 digits" },
                          pattern: { value: /^\d{6}$/, message: "OTP must be 6 digits" },
                        })}
                        className="w-full bg-surface-container-highest border-0 rounded-xl py-3 pl-10 pr-4 text-on-surface text-center tracking-[0.5em] text-xl placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    {errors.otp && (
                      <div className="flex items-center gap-2 animate-slideInFromBottom">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <p className="text-sm text-red-400">{errors.otp.message}</p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="w-full btn-gradient-primary hover:brightness-110 active:scale-[0.98] text-white font-headline font-bold text-base py-3.5 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-on-tertiary-container border-t-transparent rounded-full animate-spin"></div>
                        Verifying...
                      </div>
                    ) : "Verify OTP"}
                  </button>

                  <div className="text-center space-y-2">
                    <p className="text-xs text-on-surface-variant">Did not receive the code?</p>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-sm text-secondary hover:text-primary transition-colors font-medium disabled:opacity-50"
                    >
                      {loading ? "Sending..." : "Resend OTP"}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Set New Password */}
              {step === 3 && (
                <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
                  <div className="text-center">
                    <h2 className="font-headline text-2xl font-extrabold mb-1">
                      <span className="text-gradient-primary">Set New Password</span>
                    </h2>
                    <p className="text-sm text-on-surface-variant">Create a strong password for your account</p>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex gap-3">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  )}

                  <div className="space-y-1.5 group">
                    <label className="block text-sm font-label font-semibold text-on-surface-variant group-focus-within:text-primary transition-colors">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input
                        type="password"
                        placeholder="Enter new password"
                        {...register("newPassword", {
                          required: "Password is required",
                          minLength: { value: 8, message: "At least 8 characters" },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
                            message: "Must contain uppercase, lowercase, and number",
                          },
                        })}
                        className="w-full bg-surface-container-highest border-0 rounded-xl py-3 pl-10 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    {errors.newPassword && (
                      <div className="flex items-center gap-2 animate-slideInFromBottom">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <p className="text-sm text-red-400">{errors.newPassword.message}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 group">
                    <label className="block text-sm font-label font-semibold text-on-surface-variant group-focus-within:text-primary transition-colors">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) => value === password || "Passwords do not match",
                        })}
                        className="w-full bg-surface-container-highest border-0 rounded-xl py-3 pl-10 pr-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <div className="flex items-center gap-2 animate-slideInFromBottom">
                        <AlertCircle className="w-4 h-4 text-red-400" />
                        <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="w-full btn-gradient-primary hover:brightness-110 active:scale-[0.98] text-white font-headline font-bold text-base py-3.5 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-on-tertiary-container border-t-transparent rounded-full animate-spin"></div>
                        Resetting...
                      </div>
                    ) : "Reset Password"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-tertiary opacity-30 fixed bottom-0"></div>
    </div>
  );
};

export default ForgotPasswordPage;
