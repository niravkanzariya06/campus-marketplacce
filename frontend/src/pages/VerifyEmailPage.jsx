import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "../Components/Toast/ToastContainer";
import authService from "../services/authService";
import AtmosphericBlooms from "../Components/AtmosphericBlooms";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ mode: 'onChange' });

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus("success");
        setMessage("Email verified successfully! Redirecting you home...");
        showToast("Welcome! Your email has been verified.", 'success', 3000);
        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        const msg = error.message || "Verification failed. The link may be expired.";
        setStatus("error");
        setMessage(msg);
        showToast(msg, 'error', 5000);
      }
    };

    verify();
  }, [token, navigate, showToast]);

  const handleResend = async (data) => {
    setResendMessage("");
    setResendError("");
    setIsResending(true);
    try {
      await authService.resendVerificationEmail(data.email);
      setResendMessage("Verification email resent! Please check your inbox.");
      showToast("Verification email resent!", 'success', 3000);
    } catch (error) {
      const msg = error.message || "Failed to resend. Please try again.";
      setResendError(msg);
      showToast(msg, 'error', 4000);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen relative">
      <AtmosphericBlooms intensity="vibrant" />

      <main className="flex-grow flex items-center justify-center px-6 py-12 lg:py-24 relative z-10">
        <div className="w-full max-w-xl mx-auto">

          <div className="relative w-full max-w-2xl mx-auto">
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary to-tertiary rounded-3xl rotate-12 opacity-20 blur-lg"></div>

            <div className="glass-panel p-8 lg:p-10 rounded-2xl shadow-lg relative z-10">

              {/* Loading State */}
              {status === "loading" && (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                  <h1 className="font-headline text-3xl font-extrabold">
                    Verifying Your <span className="text-gradient-primary">Email</span>
                  </h1>
                  <p className="text-on-surface-variant text-base">Please wait while we verify your email...</p>
                </div>
              )}

              {/* Success State */}
              {status === "success" && (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <CheckCircle2 className="w-16 h-16 text-green-400" />
                  </div>
                  <h1 className="font-headline text-3xl font-extrabold">
                    <span className="text-gradient-primary">Welcome!</span>
                  </h1>
                  <p className="text-on-surface-variant text-base">{message}</p>
                  <button
                    onClick={() => navigate("/")}
                    className="btn-gradient-primary hover:brightness-110 active:scale-[0.98] text-white font-headline font-bold text-base py-3 px-6 rounded-xl shadow-lg transition-all duration-300"
                  >
                    Go to Home
                  </button>
                </div>
              )}

              {/* Error State */}
              {status === "error" && (
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <AlertCircle className="w-16 h-16 text-red-400" />
                    </div>
                    <h1 className="font-headline text-3xl font-extrabold">
                      Verification <span className="text-gradient-primary">Failed</span>
                    </h1>
                    <p className="text-on-surface-variant text-base">{message}</p>
                  </div>

                  {/* Resend Form */}
                  <div className="pt-4 border-t border-outline-variant/30">
                    <p className="text-sm text-on-surface-variant mb-4 text-center">Enter your email to receive a new verification link:</p>

                    <form onSubmit={handleSubmit(handleResend)} className="space-y-4">

                      {resendMessage && (
                        <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-xl flex gap-3 border-subtle">
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <p className="text-sm text-green-300">{resendMessage}</p>
                        </div>
                      )}

                      {resendError && (
                        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl flex gap-3 border-subtle">
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <p className="text-sm text-red-300">{resendError}</p>
                        </div>
                      )}

                      {/* Email Field */}
                      <div className="space-y-1.5 group">
                        <label className="block text-sm font-label font-semibold text-on-surface-variant group-focus-within:text-primary transition-colors">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                          <input
                            type="email"
                            placeholder="your.email@example.com"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Please enter a valid email address",
                              },
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

                      {/* Resend Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || isResending}
                        className="w-full btn-gradient-primary hover:brightness-110 active:scale-[0.98] text-white font-headline font-bold text-base py-3.5 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting || isResending ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-on-tertiary-container border-t-transparent rounded-full animate-spin"></div>
                            Resending...
                          </div>
                        ) : 'Resend Verification Email'}
                      </button>

                      {/* Back to Login */}
                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => navigate("/login")}
                          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-medium"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          Back to login
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="h-2 w-full bg-gradient-to-r from-primary via-secondary to-tertiary opacity-30 fixed bottom-0"></div>
    </div>
  );
};

export default VerifyEmailPage;
