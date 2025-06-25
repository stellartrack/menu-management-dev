import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { registerGetToken } from "../utils/tokenService";

const AuthContext = createContext(null);

const INACTIVITY_DELAY = 5 * 60 * 1000; 
const REFRESH_INTERVAL = 30 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const inactivityTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = import.meta.env.VITE_APP_API_MENU_BASE_URL;
  const AUTH_BASE = import.meta.env.VITE_APP_API_AUTH_BASE_URL;

  // Logout and redirect logic
  const handleLogoutRedirect = useCallback((reason = "Session expired") => {
    toast.dismiss();
    toast.warning(reason);
    setUser(null);
  }, [navigate]);

  // Fetch current user info
  const fetchUser = useCallback(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      setAuthLoading(true);
      try {
        const res = await fetch(`${API_BASE}api/proxy/user/profile`, {
          credentials: "include",
          signal,
        });
        const data = await res.json();
        setUser(data.success ? data.data : null);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch user:", err);
          setUser(null);
        }
      } finally {
        setAuthLoading(false);
      }
    })();

    return () => controller.abort(); // Cleanup
  }, [API_BASE]);

  useEffect(() => {
    const abortFetch = fetchUser();
    return abortFetch;
  }, [fetchUser]);

  // Listen for logout from other tabs
  useEffect(() => {
    const bc = new BroadcastChannel("auth");

    const logoutHandler = () => {
      toast.dismiss();
      handleLogoutRedirect("Logged out");
    };

    bc.onmessage = (e) => e.data === "logout" && logoutHandler();
    window.addEventListener("storage", (e) => {
      if (e.key === "logout") logoutHandler();
    });

    return () => {
      bc.close();
      window.removeEventListener("storage", logoutHandler);
    };
  }, [handleLogoutRedirect]);

  // Refresh token and check session
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}api/proxy/check-token`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data.redirect_type === "logout") {
          toast.dismiss();
          toast.error("Session expired");
          setUser(null);

          const currentUrl = btoa(window.location.href);
          const loginUrl = `${AUTH_BASE}login?redirect_url=${currentUrl}&redirect_type=${btoa("mern")}`;
          window.location.href = loginUrl;
        } else {
          await fetch(`${API_BASE}api/proxy/refresh-token`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ redirect_url: window.location.href }),
          });
        }
      } catch (err) {
        console.error("Token check failed:", err);
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [API_BASE, AUTH_BASE]);

  // Inactivity logout
  useEffect(() => {
    const resetTimeout = () => {
      if (inactivityTimeoutRef.current)
        clearTimeout(inactivityTimeoutRef.current);

      inactivityTimeoutRef.current = setTimeout(async () => {
        toast.dismiss();
        handleLogoutRedirect("You're inactive for a while. Rechecking your login authorization...");
      }, INACTIVITY_DELAY);
    };

    const activityEvents = ["mousemove", "keydown", "scroll", "touchstart"];
    activityEvents.forEach((e) =>
      window.addEventListener(e, resetTimeout)
    );

    resetTimeout();

    return () => {
      clearTimeout(inactivityTimeoutRef.current);
      activityEvents.forEach((e) =>
        window.removeEventListener(e, resetTimeout)
      );
    };
  }, [handleLogoutRedirect]);

  // Register token accessors
  useEffect(() => {
    registerGetToken("node", () => user?.nodeToken || "");
    registerGetToken("laravel", () => user?.laravelToken || "");
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
