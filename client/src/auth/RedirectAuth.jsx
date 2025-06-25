import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const CustomPageLoader = React.lazy(() => import('../components/styled/CustomPageLoader'));

const base64Decode = (str) => {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return str;
  }
};

const RedirectAuth = () => {
  const location = useLocation();
  const [fadeOut, setFadeOut] = useState(false);
  const [message, setMessage] = useState("Verifying authentication...");

  useEffect(() => {
    async function setAuthToken() {
      const params = new URLSearchParams(location.search);
      const finalRedirectUrl = base64Decode(params.get("redirect_url") || "/");

      const allParams = {};
      for (const [key, value] of params.entries()) {
        if (key !== "redirect_url" && key !== "redirect_type") {
          allParams[key] = base64Decode(value);
        }
      }

      const laravelLogoutUrl = `${import.meta.env.VITE_APP_API_AUTH_BASE_URL}logout`;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_MENU_BASE_URL}api/proxy/auth/set-auth`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(allParams),
          }
        );

        if (response.ok) {
          setMessage("Authorization completed. Redirecting now...");
          // Show message for 1 second
          setTimeout(() => {
            setFadeOut(true); // Start fade out animation

            // Wait fade duration then redirect
            setTimeout(() => {
              window.location.href = finalRedirectUrl;
            }, 800); // match with CSS fade transition duration

          }, 1000);
        } else {
          setMessage("Authorization failed. Redirecting to login...");
          setFadeOut(true);
          setTimeout(() => {
            window.location.href = laravelLogoutUrl;
          }, 1800);
        }
      } catch (err) {
        setMessage("Authorization failed. Redirecting to login...");
        setFadeOut(true);
        setTimeout(() => {
          window.location.href = laravelLogoutUrl;
        }, 1800);
      }
    }

    setAuthToken();
  }, [location]);

  return (
    <div className={fadeOut ? "loader-fade-out" : ""}>
      <CustomPageLoader message={message} />
    </div>
  );
};

export default RedirectAuth;
