import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClient from "../lib/apiClient";
import { login as authLogin } from "../store/authSlice";
import chatService from "../services/chatService";
import { useToast } from "../Components/Toast/ToastContainer";

const STATE_KEY = "google_oauth_state";
const VERIFIER_KEY = "pkce_code_verifier";

function generateState() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)), (b) => b.toString(16).padStart(2, "0")).join("");
}

function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    return crypto.subtle.digest("SHA-256", encoder.encode(codeVerifier)).then((hash) =>
        btoa(String.fromCharCode(...new Uint8Array(hash)))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "")
    );
}

/**
 * @param {{ onSuccess?: Function, redirectPath?: string }} options
 */
function useGoogleOAuth({ onSuccess, redirectPath = "/" }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    // Handle Google OAuth redirect callback
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const returnedState = params.get("state");
        const storedCodeVerifier = sessionStorage.getItem(VERIFIER_KEY);
        const storedState = sessionStorage.getItem(STATE_KEY);

        // Success path: Google returned with both code and stored verifier
        if (code && storedCodeVerifier) {
            // CSRF check: validate state parameter
            if (returnedState && storedState && returnedState !== storedState) {
                showToast("Google login failed: state mismatch. Please try again.", "error", 4000);
                sessionStorage.removeItem(VERIFIER_KEY);
                sessionStorage.removeItem(STATE_KEY);
                window.history.replaceState({}, "", window.location.pathname);
                return;
            }

            const handleOAuthCallback = async () => {
                try {
                    const redirectUri = `${window.location.origin}${window.location.pathname}`;

                    const response = await apiClient.post("/auth/oauth", {
                        code,
                        codeVerifier: storedCodeVerifier,
                        redirectUri,
                        provider: "google",
                    });

                    if (response.data?.data) {
                        const userData = response.data.data;
                        dispatch(
                            authLogin({
                                userData,
                                profilePhoto: userData.avatar || null,
                                accessToken: response.data.data.accessToken || null,
                            })
                        );
                        setTimeout(() => chatService.reconnect(), 100);
                        showToast(
                            `Welcome, ${userData.name || userData.username || "User"}!`,
                            "success",
                            3000
                        );
                        sessionStorage.removeItem(VERIFIER_KEY);
                        sessionStorage.removeItem(STATE_KEY);

                        if (onSuccess) {
                            onSuccess(userData);
                        } else {
                            navigate(redirectPath, { replace: true });
                        }
                    }
                } catch (err) {
                    showToast(
                        `Google login failed. ${err.response?.data?.message || "Please try again."}`,
                        "error",
                        4000
                    );
                    sessionStorage.removeItem(VERIFIER_KEY);
                    sessionStorage.removeItem(STATE_KEY);
                    window.history.replaceState({}, "", window.location.pathname);
                }
            };

            handleOAuthCallback();
        }

        // Cancelled/failed path
        if (params.get("google_error")) {
            showToast("Google login was cancelled or failed. Please try again.", "error", 4000);
            window.history.replaceState({}, "", window.location.pathname);
        }
    }, [dispatch, showToast, navigate, redirectPath, onSuccess]);

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        const codeVerifier = Array.from(crypto.getRandomValues(new Uint8Array(64)), (b) =>
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"[b % 64]
        ).join("");
        sessionStorage.setItem(VERIFIER_KEY, codeVerifier);

        const state = generateState();
        sessionStorage.setItem(STATE_KEY, state);

        generateCodeChallenge(codeVerifier).then((codeChallenge) => {
            const params = new URLSearchParams({
                response_type: "code",
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                redirect_uri: `${window.location.origin}${window.location.pathname}`,
                scope: "openid email profile",
                code_challenge: codeChallenge,
                code_challenge_method: "S256",
                state,
                prompt: "select_account",
            });

            window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
        }).catch(() => {
            setIsGoogleLoading(false);
            showToast("Google login initialization failed. Please try again.", "error", 4000);
        });
    };

    return { handleGoogleLogin, isGoogleLoading };
}

export { generateState, generateCodeChallenge };
export default useGoogleOAuth;
